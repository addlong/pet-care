export const services = ['基础洗护', '全套美容', '毛发护理'];
export const pets = ['狗狗', '猫咪'];
export const defaultBookingTimeZone = 'Asia/Shanghai';

export function bookingClock(timeZone, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const { year, month, day, hour, minute } = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return { date: `${year}-${month}-${day}`, time: `${hour}:${minute}` };
}

export function isBookingTime(value) {
  return typeof value === 'string' && value.length === 5 && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}
