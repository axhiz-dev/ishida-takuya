import { test, expect } from "@playwright/test";
import { formatPreferredSlot, japanToday, validatePreferredSlots } from "../src/components/business/chat/preferredDates";
const now = new Date("2026-10-20T15:00:00Z"); // 21日00:00、日本時間
const valid = { date: "2026-10-21", start: "18:00", end: "19:00" };
test("希望日の基準は端末のタイムゾーンではなく日本時間", () => {
  expect(japanToday(now)).toBe("2026-10-21");
  expect(japanToday(new Date("2026-10-20T14:59:59Z"))).toBe("2026-10-20");
  expect(validatePreferredSlots([valid], now)).toBeNull();
  expect(validatePreferredSlots([{ ...valid, date: "2026-10-20" }], now)?.field).toBe("preferredDate1Date");
});
test("途中入力・実在しない日付・時間の逆転・過去の時刻を拒否", () => {
  for (const slot of [
    { ...valid, date: "" }, { ...valid, start: "" }, { ...valid, end: "" },
    { ...valid, date: "2026-02-30" }, { ...valid, start: "18:15" },
    { ...valid, end: "18:00" }, { ...valid, end: "17:30" },
  ]) expect(validatePreferredSlots([slot], now)).not.toBeNull();
  expect(validatePreferredSlots([{ ...valid, start: "09:00" }], new Date("2026-10-21T01:00:00Z"))?.field).toBe("preferredDate1Start");
});
test("空欄・平日日中の希望・24時終了を受け付け、表記を統一", () => {
  expect(validatePreferredSlots([{ date: "", start: "", end: "" }], now)).toBeNull();
  expect(validatePreferredSlots([{ ...valid, start: "10:00", end: "11:00" }], now)).toBeNull();
  expect(validatePreferredSlots([{ ...valid, start: "23:30", end: "24:00" }], now)).toBeNull();
  expect(formatPreferredSlot(valid)).toBe("2026年10月21日 18:00〜19:00");
});
