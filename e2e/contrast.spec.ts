import { expect, test } from "@playwright/test";

/**
 * すべての文字要素について、実際に描画される背景とのコントラスト比を測る。
 *
 * /engineer はダーク一色で、ダークはライトより落ちやすい。
 * 今回の最大の品質リスクなので目視ではなく計測で押さえる。
 *
 * 測らないのは 2 つだけ：
 *
 * · aria-hidden の中。ウォーターマークのように意図的に地へ沈めた
 *   飾り文字は読ませるためのものではなく、支援技術からも外してある
 * · background-clip: text の文字。地の色ではなくグラデーションで
 *   塗られるので、computed color（transparent）を測っても意味がない。
 *   代わりにグラデーションの各止め色を下のテストで直接見る
 */

const CASES = [
  { path: "/", name: "ゲート" },
  { path: "/engineer/", name: "職務経歴" },
  { path: "/business/", name: "ご相談" },
] as const;

for (const item of CASES) {
  test(`コントラスト: ${item.name}`, async ({ page }) => {
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
      //
      // 半透明の色は「不透明な下地の上に重ねてから」読むこと。
      // 色文字列だけを単独で読むと alpha が落ちて、bg-white/[0.02] のような
      // ほぼ透明な面が真っ白として扱われる（それで測ると全部落ちる）。
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      type Rgb = [number, number, number];

      /** `color` を不透明な `base` の上に重ねた結果の sRGB を返す。 */
      const over = (color: string, base: Rgb): Rgb => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = `rgb(${base[0]}, ${base[1]}, ${base[2]})`;
        ctx.fillRect(0, 0, 1, 1);
        // 解釈できない色を前の値のまま描いてしまわないよう、一度リセットする
        ctx.fillStyle = "#000";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        return [d[0]!, d[1]!, d[2]!];
      };

      const lum = ([r, g, b]: Rgb) => {
        const f = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };

      const ratio = (a: Rgb, b: Rgb) => {
        const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
        return (l1! + 0.05) / (l2! + 0.05);
      };

      const isClear = (c: string) =>
        !c || c === "transparent" || c.startsWith("rgba(0, 0, 0, 0)");

      /** 祖先の背景を外側から順に重ねて、その要素が実際に載っている色を出す。 */
      const bgOf = (el: Element): Rgb => {
        const stack: string[] = [];
        let node: Element | null = el;
        while (node) {
          const bg = getComputedStyle(node).backgroundColor;
          if (!isClear(bg)) stack.push(bg);
          node = node.parentElement;
        }
        let base: Rgb = [255, 255, 255];
        for (let i = stack.length - 1; i >= 0; i -= 1) base = over(stack[i]!, base);
        return base;
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
        // 飾りの文字（ウォーターマーク等）は読ませるためのものではない
        if (el.closest("[aria-hidden='true']")) continue;
        // グラデーションで塗る文字は下の専用テストで見る
        if (cs.backgroundClip === "text" || cs.webkitBackgroundClip === "text") continue;

        const size = parseFloat(cs.fontSize);
        const weight = Number(cs.fontWeight) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const need = large ? 3 : 4.5;

        const bg = bgOf(el);
        const r = ratio(over(cs.color, bg), bg);
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

/**
 * グラデーションで塗る見出しは、いちばん暗い止め色でも読めること。
 *
 * background-clip: text の要素は computed color が transparent なので
 * 上のテストでは測れない。止め色を直接見るしかない。
 * 大きい文字にしか使っていないので必要なのは 3:1。
 */
test("コントラスト: グラデーション文字の止め色", async ({ page }) => {
  await page.goto("/engineer/");
  await page.waitForLoadState("networkidle");

  const worst = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const read = (name: string) => root.getPropertyValue(name).trim();

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const rgb = (c: string): [number, number, number] => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000";
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0]!, d[1]!, d[2]!];
    };
    const lum = ([r, g, b]: [number, number, number]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    const bg = lum(rgb(read("--color-bg")));
    const stops = ["--color-brand-cyan", "--color-brand-violet", "--color-brand-fuchsia"];
    return stops
      .map((name) => {
        const l = lum(rgb(read(name)));
        const [hi, lo] = [l, bg].sort((a, b) => b - a);
        return { name, ratio: Math.round(((hi! + 0.05) / (lo! + 0.05)) * 100) / 100 };
      })
      .sort((a, b) => a.ratio - b.ratio)[0]!;
  });

  expect(worst.ratio, `いちばん暗い止め色は ${worst.name}（${worst.ratio}）`).toBeGreaterThanOrEqual(3);
});
