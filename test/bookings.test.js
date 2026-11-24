import assert from 'node:assert/strict';
import { test } from 'node:test';
import { POST } from '../app/api/bookings/route.js';

const id = '534ce004-bda8-4120-bfad-49dab63b6a0c';
const fields = { service: '基础洗护', pet: '猫咪', date: '2099-03-01', time: '14:30', phone: '+86 138 0013 8000', id };

function request(body = fields) {
  return new Request('http://localhost/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('validates bookings before sending email', async (t) => {
  const send = t.mock.method(globalThis, 'fetch');
  for (const changes of [
    { service: '其他' }, { pet: '其他' }, { date: '2000-01-01' },
    { date: '2099-02-29' }, { phone: '123' }, { phone: '13800138000\nBCC:x' }, { id: 'invalid' },
  ]) {
    assert.equal((await POST(request({ ...fields, ...changes }))).status, 400);
  }
  assert.equal(send.mock.callCount(), 0);
});

test('requires a valid appointment time and rejects elapsed times in the shop time zone', async (t) => {
  const send = t.mock.method(globalThis, 'fetch');
  const originalTimeZone = process.env.BOOKING_TIME_ZONE;
  process.env.BOOKING_TIME_ZONE = 'Asia/Shanghai';
  t.after(() => {
    if (originalTimeZone === undefined) delete process.env.BOOKING_TIME_ZONE;
    else process.env.BOOKING_TIME_ZONE = originalTimeZone;
  });
  // 00:30 on March 1 at the shop, while UTC is still February 28.
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2099-02-28T16:30:00Z') });

  for (const time of [undefined, '', '9:30', '24:00', '10:60', '08:00\n', '00:29']) {
    const response = await POST(request({ ...fields, time }));
    assert.equal(response.status, 400, JSON.stringify(time));
    assert.match((await response.json()).message, /时间/);
  }
  assert.equal(send.mock.callCount(), 0);
});

test('uses the same email idempotency key after failure and sends to the default recipient', async (t) => {
  const env = ['RESEND_API_KEY', 'BOOKING_FROM_EMAIL', 'BOOKING_OWNER_EMAIL'];
  const previous = Object.fromEntries(env.map((name) => [name, process.env[name]]));
  t.after(() => {
    for (const name of env) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  });
  process.env.RESEND_API_KEY = 'mock-only';
  process.env.BOOKING_FROM_EMAIL = 'appointments@example.com';
  delete process.env.BOOKING_OWNER_EMAIL;

  const send = t.mock.method(globalThis, 'fetch', async () => Response.json({ id: 'mock-email' }));
  send.mock.mockImplementationOnce(async () => { throw new DOMException('timed out', 'TimeoutError'); });
  assert.equal((await POST(request())).status, 502);
  const success = await POST(request());
  assert.equal(success.status, 200);
  assert.deepEqual(await success.json(), { id });

  for (const { arguments: [url, options] } of send.mock.calls) {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(new Headers(options.headers).get('Idempotency-Key'), `booking/${id}`);
    const email = JSON.parse(options.body);
    assert.deepEqual(email.to, ['bookings@pet-care.invalid']);
    assert.equal(email.from, 'appointments@example.com');
    assert.ok(email.text.includes(`期望到店时间：${fields.time}（门店当地时间）`));
    for (const value of [fields.service, fields.pet, fields.date, id, '+8613800138000']) {
      assert.ok(email.text.includes(value));
    }
  }

  send.mock.mockImplementationOnce(async () => Response.json({ message: 'unavailable' }, { status: 503 }));
  assert.equal((await POST(request())).status, 502);
  delete process.env.RESEND_API_KEY;
  assert.equal((await POST(request())).status, 503);
  assert.equal(send.mock.callCount(), 3);
});

test('limits the number of emails attempted in one minute', async (t) => {
  const originalKey = process.env.RESEND_API_KEY;
  const originalFrom = process.env.BOOKING_FROM_EMAIL;
  t.after(() => {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    if (originalFrom === undefined) delete process.env.BOOKING_FROM_EMAIL;
    else process.env.BOOKING_FROM_EMAIL = originalFrom;
  });
  process.env.RESEND_API_KEY = 'mock-only';
  process.env.BOOKING_FROM_EMAIL = 'appointments@example.com';
  const send = t.mock.method(globalThis, 'fetch', async () => Response.json({ id: 'mock-email' }));
  const responses = await Promise.all(Array.from({ length: 12 }, () =>
    POST(request({ ...fields, id: crypto.randomUUID() }))
  ));
  assert.ok(responses.some((response) => response.status === 429));
  assert.ok(responses.some((response) => response.status === 200));
  assert.ok(send.mock.callCount() <= 10);
});
