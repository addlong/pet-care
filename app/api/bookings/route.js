import { bookingClock, defaultBookingTimeZone, isBookingTime, pets, services } from '../../../lib/booking-fields.js';

export const runtime = 'nodejs';

const defaultOwnerEmail = 'bookings@pet-care.invalid';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
const phoneFormat = /^\+?[0-9 ()-]{7,30}$/;
const sendFailed = '预约邮件暂时无法发送，请稍后重试。';
const sendWindowMs = 60_000;
const maxSendAttempts = 10;
let sendAttempts = [];

function error(message, status) {
  return Response.json({ message }, { status });
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin &&
      request.headers.get('sec-fetch-site') !== 'same-origin') {
    return error('请从预约页面提交。', 403);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return error('请检查表单后重试。', 400);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return error('请检查表单后重试。', 400);
  }

  const { service, pet, date, time, phone, id } = data ?? {};
  if (!services.includes(service) || !pets.includes(pet) || typeof id !== 'string' || !uuid.test(id)) {
    return error('请选择洗护服务和宠物种类。', 400);
  }

  const phoneInput = typeof phone === 'string' ? phone.trim() : '';
  const contact = phoneInput.replace(/[ ()-]/g, '');
  if (!phoneFormat.test(phoneInput) || !/^\+?\d{7,15}$/.test(contact)) {
    return error('请输入有效的联系电话。', 400);
  }

  const parsedDate = typeof date === 'string' && dateFormat.test(date) ? new Date(date) : null;
  if (!parsedDate || !Number.isFinite(+parsedDate) || parsedDate.toISOString().slice(0, 10) !== date) {
    return error('请选择有效的意向日期。', 400);
  }
  if (!isBookingTime(time)) {
    return error('请选择有效的期望到店时间。', 400);
  }
  const timeZone = process.env.BOOKING_TIME_ZONE?.trim() || defaultBookingTimeZone;
  let shopNow;
  try {
    shopNow = bookingClock(timeZone);
  } catch {
    return error(sendFailed, 503);
  }
  if (date < shopNow.date) {
    return error('请选择门店当天或之后的日期。', 400);
  }
  if (date === shopNow.date && time < shopNow.time) {
    return error('请选择今天尚未过去的到店时间。', 400);
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.BOOKING_FROM_EMAIL?.trim();
  const to = process.env.BOOKING_OWNER_EMAIL?.trim() || defaultOwnerEmail;
  if (!apiKey || !from) {
    return error(sendFailed, 503);
  }

  const now = Date.now();
  sendAttempts = sendAttempts.filter((time) => now - time < sendWindowMs);
  if (sendAttempts.length >= maxSendAttempts) {
    return Response.json({ message: '预约请求较多，请稍后重试。' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((sendAttempts[0] + sendWindowMs - now) / 1000)) },
    });
  }
  sendAttempts.push(now);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `booking/${id}`,
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from,
        to: [to],
        subject: `奥利奥之家 · 新预约意向 · ${date} ${time}`,
        text: [
          `预约编号：${id}`,
          `洗护服务：${service}`,
          `宠物种类：${pet}`,
          `意向日期：${date}`,
          `期望到店时间：${time}（门店当地时间）`,
          `联系电话：${contact}`,
        ].join('\n'),
      }),
    });
    if (!response.ok) {
      return error(sendFailed, 502);
    }
    const result = await response.json();
    if (typeof result?.id !== 'string' || !result.id) {
      return error(sendFailed, 502);
    }
  } catch {
    return error(sendFailed, 502);
  }

  return Response.json({ id });
}
