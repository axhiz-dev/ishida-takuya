import { test, expect } from "@playwright/test";
import { monthlyReport, reportMonths, reportSample } from "../src/components/business/chat/monthlyReport";

test("サンプル2の月次集計は照合済み入金だけを含み、期限前の未入金を分ける", () => {
  const september = monthlyReport("2026-09");
  expect(september.sales).toBe(5360000);
  expect(september.paid).toBe(4300000);
  expect(september.outstanding.reduce((sum, row) => sum + row.outstanding, 0)).toBe(1060000);
  expect(september.overdue.map(row => row.customer)).toEqual(["田中工業", "さくら企画"]);
  expect(september.unmatched.map(row => row.amount)).toEqual([150000]);
  expect(september.previousSales).toBe(4720000);
  expect(september.change).toBeCloseTo(0.13559322);
  expect(monthlyReport("2026-04").change).toBeNull();
  expect(monthlyReport("2026-04").sales).toBe(3500000);
  for (const month of reportMonths) {
    const report = monthlyReport(month);
    expect(report.rows).toHaveLength(8);
    expect(report.paid + report.outstanding.reduce((sum, row) => sum + row.outstanding, 0)).toBe(report.sales);
    expect(report.rows.every(row => row.owner && row.paid >= 0 && row.outstanding >= 0)).toBe(true);
  }
  expect(new Set(reportSample.sales.map(row => row.invoice)).size).toBe(48);
});
