export const services = ['基础洗护', '全套美容', '毛发护理'];
export const pets = ['狗狗', '猫咪'];
export const defaultBookingTimeZone = 'Asia/Shanghai';

export function bookingToday(timeZone, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const { year, month, day } = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${year}-${month}-${day}`;
}
