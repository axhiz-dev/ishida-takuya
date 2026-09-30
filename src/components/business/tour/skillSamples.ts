// Fictional teaching data. Amounts and review flags are derived, never keyed to a person's name.
export const sampleProducts = [
  { name: "マグ", aliases: ["マグ", "マグカップ"] },
  { name: "皿", aliases: ["皿", "プレート"] },
];
export const rawSales = [
  {
    source: "店舗",
    id: "S-101",
    product: "マグ",
    amount: 3300,
    shipping: 0,
    taxIncluded: true,
  },
  {
    source: "店舗",
    id: "S-102",
    product: "マグ",
    amount: -1100,
    shipping: 0,
    taxIncluded: true,
  },
  {
    source: "通販",
    id: "E-102",
    product: "マグカップ",
    amount: 3850,
    shipping: 550,
    taxIncluded: true,
  },
  {
    source: "通販",
    id: "E-102",
    product: "皿",
    amount: 2200,
    shipping: 0,
    taxIncluded: true,
  },
  {
    source: "通販",
    id: "E-104",
    product: "皿",
    amount: 2200,
    shipping: 0,
    taxIncluded: true,
  },
  {
    source: "通販",
    id: "E-104",
    product: "皿",
    amount: 2200,
    shipping: 0,
    taxIncluded: true,
  },
  {
    source: "代理店",
    id: "P-101",
    product: "マグ",
    amount: 4000,
    shipping: 0,
    taxIncluded: false,
  },
  {
    source: "代理店",
    id: "P-102",
    product: "新商品",
    amount: 1000,
    shipping: 0,
    taxIncluded: false,
  },
];
const key = (r: (typeof rawSales)[number]) =>
  `${r.source}:${r.id}:${r.product}:${r.amount}`;
export const assessedSales = rawSales.map((r) => {
  const product = sampleProducts.find((p) => p.aliases.includes(r.product));
  return {
    ...r,
    normalizedProduct: product?.name,
    net: Math.round((r.amount - r.shipping) / (r.taxIncluded ? 1.1 : 1)),
    duplicate: rawSales.filter((other) => key(other) === key(r)).length > 1,
    unknown: !product,
  };
});
export const reportRows = assessedSales
  .filter((r) => !r.duplicate && !r.unknown)
  .map((r) => ({
    source: r.source,
    product: r.normalizedProduct!,
    amount: r.net,
  }));
export const total = reportRows.reduce((sum, r) => sum + r.amount, 0);
export const previous = 10000,
  lastWeek = 8800;
export const products = sampleProducts.map((p) => ({
  name: p.name,
  amount: reportRows
    .filter((r) => r.product === p.name)
    .reduce((sum, r) => sum + r.amount, 0),
}));
export const duplicateCount = new Set(
  assessedSales.filter((r) => r.duplicate).map(key),
).size;
export const unknownCount = assessedSales.filter((r) => r.unknown).length;
