import sample from "../../../../public/samples/monthly-report.json";

// This same source is exported to the downloadable sample workbook.
export const reportSample = sample;
export const reportMonths = [...new Set(sample.sales.map(row => row.month))];
export function monthlyReport(month: string) {
  const asOf = `${month}-${new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate()}`;
  const rows = sample.sales.filter(row => row.month === month).map(row => {
    const customer = sample.customers.find(item => item.names.includes(row.name))!;
    const paid = sample.payments.filter(payment => payment.invoice === row.invoice && customer.names.includes(payment.name) && payment.date <= asOf)
      .reduce((sum, payment) => sum + payment.amount, 0);
    return { ...row, customer: customer.name, owner: customer.owner, paid, outstanding: row.amount - paid };
  });
  const sales = rows.reduce((sum, row) => sum + row.amount, 0);
  const paid = rows.reduce((sum, row) => sum + row.paid, 0);
  const previousMonth = reportMonths[reportMonths.indexOf(month) - 1];
  const previousSales = sample.sales.filter(row => row.month === previousMonth).reduce((sum, row) => sum + row.amount, 0);
  const unmatched = sample.payments.filter(payment => payment.date.startsWith(month) && !sample.sales.some(row => {
    const customer = sample.customers.find(item => item.names.includes(row.name));
    return row.invoice === payment.invoice && customer?.names.includes(payment.name);
  }));
  const outstanding = rows.filter(row => row.outstanding > 0);
  return { asOf, rows, sales, paid, outstanding, unmatched, previousSales,
    change: previousSales > 0 ? (sales - previousSales) / previousSales : null,
    overdue: outstanding.filter(row => row.due <= asOf),
  };
}
