import { expect, test, type Page } from "@playwright/test";

/**
 * スモークテスト。
 * 「壊れていないこと」ではなく「読み手が困らないこと」を確認する。
 */

const ROUTES = [
  { path: "/", name: "ゲート", heading: "石田 拓也" },
  { path: "/engineer/", name: "職務経歴", heading: "石田 拓也" },
  { path: "/business/", name: "ご相談", heading: "つくれる人間が、" },
] as const;

/** Hallmark の非交渉ライン。この 4 幅で横スクロールが出てはいけない。 */
const MOBILE_WIDTHS = [320, 375, 414, 768];

const collectConsoleErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
};

for (const route of ROUTES) {
  test(`${route.name}: 見出しが 1 つあり、コンソールエラーが出ない`, async ({ page }) => {
    const errors = collectConsoleErrors(page);

    await page.goto(route.path);
    await page.waitForLoadState("networkidle");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(route.heading);
    await expect(page).toHaveTitle(/石田拓也|石田 拓也/);

    expect(errors, `コンソールエラー: ${errors.join(" / ")}`).toHaveLength(0);
  });

  test(`${route.name}: 狭い画面で横スクロールが出ない`, async ({ page }) => {
    await page.goto(route.path);

    for (const width of MOBILE_WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(150);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${width}px で ${overflow}px はみ出している`).toBeLessThanOrEqual(1);
    }
  });

  test(`${route.name}: クリックできる文字が 2 行に折り返らない`, async ({ page }) => {
    await page.goto(route.path);
    await page.setViewportSize({ width: 375, height: 800 });
    await page.waitForTimeout(200);

    // ボタンと、ナビ・CTA として機能するリンクだけを対象にする。
    // 高さではなく Range の行ボックス数で数える（min-height を折り返しと誤検出しないため）。
    const wrapped = await page.evaluate(() => {
      const targets = [...document.querySelectorAll("button, nav a, header a, footer a")];
      return targets
        .filter((el) => {
          // 複数行を前提にしたブロック（ゲートの扉など）は対象外
          if (getComputedStyle(el).display === "grid") return false;

          // 文字だけを測る。マーカーやアイコンの矩形を数に入れない。
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          const tops: number[] = [];
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const rect of range.getClientRects()) {
              if (rect.width > 0 && rect.height > 0) tops.push(rect.top);
            }
          }

          if (tops.length === 0) return false;
          // 同じ行なら top はほぼ揃う。行が増えれば行送りぶん離れる。
          return Math.max(...tops) - Math.min(...tops) > 4;
        })
        .map((el) => el.textContent?.trim().slice(0, 24));
    });

    expect(wrapped, `2 行になっている: ${wrapped.join(" / ")}`).toHaveLength(0);
  });
}

test("ゲートから両方のページへ行ける", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /職務経歴/ }).click();
  await expect(page).toHaveURL(/\/engineer/);
  await expect(page.getByRole("heading", { level: 2, name: "職務経歴" })).toBeVisible();

  await page.goto("/");
  await page.getByRole("link", { name: /できることと実績/ }).click();
  await expect(page).toHaveURL(/\/business/);
});

test("職務経歴: 目次から各セクションへ飛べる", async ({ page }) => {
  await page.goto("/engineer/");
  const rail = page.getByRole("navigation", { name: "ページ内の目次" });

  for (const label of ["職務経歴", "スキル", "事例", "連絡先"]) {
    await rail.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`#`));
    await expect(page.getByRole("heading", { level: 2, name: label })).toBeInViewport();
  }
});

test("職務経歴: 目次が現在地を示す", async ({ page }) => {
  await page.goto("/engineer/");
  const rail = page.getByRole("navigation", { name: "ページ内の目次" });

  await expect(rail.getByRole("link", { name: "要約" })).toHaveAttribute("aria-current", "true");

  await rail.getByRole("link", { name: "スキル" }).click();
  await page.waitForTimeout(600);
  await expect(rail.getByRole("link", { name: "スキル" })).toHaveAttribute("aria-current", "true");
  await expect(rail.getByRole("link", { name: "要約" })).not.toHaveAttribute("aria-current", "true");
});

test("キーボードだけで主要な導線をたどれる", async ({ page }) => {
  await page.goto("/engineer/");

  // 最初の Tab でスキップリンクに入り、フォーカスが見える状態であること
  await page.keyboard.press("Tab");
  const skip = page.locator(".skip-link");
  await expect(skip).toBeFocused();

  const outline = await skip.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe("none");
});

test("画像・見出し階層・言語設定が崩れていない", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route.path);

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");

    // 見出しレベルが飛んでいないこと（h1 → h3 のような飛びを検出）
    const levels = await page.$$eval("h1, h2, h3, h4", (nodes) =>
      nodes.map((n) => Number(n.tagName[1])),
    );
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i]! - levels[i - 1]!, `${route.path} の見出し階層が飛んでいる`).toBeLessThanOrEqual(1);
    }

    // alt のない img がないこと
    const missingAlt = await page.$$eval("img", (imgs) =>
      imgs.filter((img) => !img.hasAttribute("alt")).length,
    );
    expect(missingAlt).toBe(0);
  }
});
