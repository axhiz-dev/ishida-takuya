export type PreferredSlot = { date: string; start: string; end: string };
export const timeOptions = Array.from({ length: 48 }, (_, index) =>
  `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`,
);
export function japanToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function formatPreferredSlot(slot: PreferredSlot) {
  if (!slot.date || !slot.start || !slot.end) return "";
  const [year, month, day] = slot.date.split("-");
  return `${year}年${Number(month)}月${Number(day)}日 ${slot.start}〜${slot.end}`;
}
export function validatePreferredSlots(slots: PreferredSlot[], now = new Date()) {
  for (const [index, slot] of slots.entries()) {
    if (!slot.date && !slot.start && !slot.end) continue;
    const label = `第${index + 1}希望`;
    const field = (suffix: string) => `preferredDate${index + 1}${suffix}`;
    const date = new Date(`${slot.date}T00:00:00Z`);
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(slot.date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== slot.date)
      return { message: `${label}の日付を選択してください。`, field: field("Date") };
    if (slot.date < japanToday(now))
      return { message: `${label}は今日以降の日付を選択してください。`, field: field("Date") };
    if (!timeOptions.includes(slot.start))
      return { message: `${label}の開始時間を選択してください。`, field: field("Start") };
    if (![...timeOptions, "24:00"].includes(slot.end))
      return { message: `${label}の終了時間を選択してください。`, field: field("End") };
    if (slot.end <= slot.start)
      return { message: `${label}の終了時間は開始時間より後を選択してください。`, field: field("End") };
    if (new Date(`${slot.date}T${slot.start}:00+09:00`).getTime() <= now.getTime())
      return { message: `${label}はこれからの時間帯を選択してください。`, field: field("Start") };
  }
  return null;
}
