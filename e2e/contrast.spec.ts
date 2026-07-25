import { expect, test } from "@playwright/test";

/**
 * すべての文字要素について、実際に描画される背景とのコントラスト比を測る。
 *
 * ダークテーマはライトより落ちやすく、今回の最大の品質リスクなので
 * 目視ではなく計測で押さえる。3 テーマすべてを回す。
 */

type Case = { path: string; name: string; theme?: "dark" | "light" };

const CASES: Case[] = [
  { path: "/", name: "ゲート" },
  { path: "/engineer/", name: "職務経歴（ダーク）", theme: "dark" },
  { path: "/engineer/", name: "職務経歴（ライト）", theme: "light" },
  { path: "/business/", name: "ご相談" },
];

for (const item of CASES) {
  test(`コントラスト: ${item.name}`, async ({ page }) => {
    if (item.theme) {
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("ishida-takuya:engineer-theme", t as string);
        } catch {}
      }, item.theme);
    }

    await page.goto(item.path);
    await page.waitForLoadState("networkidle");
    // 畳んである内容も測る
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("details")) el.open = true;
    });
    await page.waitForTimeout(600);

    const problems = await page.evaluate(() => {
      // Chrome は oklch() をそのまま computed value として返すので、
      // canvas に一度描いて sRGB に落としてから比較する。
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      const cache = new Map<string, [number, number, number]>();
      const parse = (c: string): [number, number, number] => {
        const hit = cache.get(c);
        if (hit) return hit;
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#000";
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        const rgb: [number, number, number] = [d[0]!, d[1]!, d[2]!];
        cache.set(c, rgb);
        return rgb;
      };
      const lum = ([r, g, b]: [number, number, number]) => {
        const f = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const ratio = (a: string, b: string) => {
        const [l1, l2] = [lum(parse(a)), lum(parse(b))].sort((x, y) => y - x);
        return (l1! + 0.05) / (l2! + 0.05);
      };
      const bgOf = (el: Element): string => {
        let node: Element | null = el;
        while (node) {
          const bg = getComputedStyle(node).backgroundColor;
          if (bg && !bg.startsWith("rgba(0, 0, 0, 0)")) return bg;
          node = node.parentElement;
        }
        return "rgb(255,255,255)";
      };

      const out: { text: string; ratio: number; need: number; cls: string }[] = [];
      for (const el of document.querySelectorAll("body *")) {
        const own = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent!.trim().length > 0,
        );
        if (!own) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        if (el.closest(".visually-hidden")) continue;

        const size = parseFloat(cs.fontSize);
        const weight = Number(cs.fontWeight) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const need = large ? 3 : 4.5;
        const r = ratio(cs.color, bgOf(el));
        if (r < need) {
          out.push({
            text: el.textContent!.trim().slice(0, 30),
            ratio: Math.round(r * 100) / 100,
            need,
            cls: el.className?.toString().slice(0, 40) ?? "",
          });
        }
      }
      return out;
    });

    const report = problems.map((p) => `  ${p.ratio}（要 ${p.need}） [${p.cls}] ${p.text}`);
    expect(problems, `コントラスト不足:\n${report.join("\n")}`).toHaveLength(0);
  });
}
