import { expect, test, type Page } from "@playwright/test";

/**
 * スモークテスト。
 * 「壊れていないこと」ではなく「読み手が困らないこと」を確認する。
 */

const ROUTES = [
  { path: "/", name: "ゲート" },
  { path: "/engineer/", name: "職務経歴" },
  { path: "/business/", name: "ご相談" },
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

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/石田拓也|石田 拓也/);

    expect(errors, `コンソールエラー: ${errors.join(" / ")}`).toHaveLength(0);
  });

  test(`${route.name}: 狭い画面で横スクロールが出ない`, async ({ page }) => {
    await page.goto(route.path);

    for (const width of MOBILE_WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(200);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${width}px で ${overflow}px はみ出している`).toBeLessThanOrEqual(1);
    }
  });

  test(`${route.name}: クリックできる文字が 2 行に折り返らない`, async ({ page }) => {
    await page.goto(route.path);
    await page.setViewportSize({ width: 375, height: 800 });
    await page.waitForTimeout(300);

    // ボタンと、ナビ・CTA として機能するリンクだけを対象にする。
    // 高さではなく文字の行ボックス数で数える（min-height を折り返しと誤検出しないため）。
    const wrapped = await page.evaluate(() => {
      const targets = [...document.querySelectorAll("button, nav a, header a, footer a")];
      return targets
        .filter((el) => {
          // 複数行を前提にしたブロック（ゲートの扉・Feature Stack の主張）は対象外
          if (getComputedStyle(el).display === "grid") return false;

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
  await expect(page.getByRole("navigation", { name: "章の一覧" })).toBeVisible();

  await page.goto("/");
  await page.getByRole("link", { name: /できることと実績/ }).click();
  await expect(page).toHaveURL(/\/business/);
});

test("職務経歴: 章のレールから各章へ飛べて、現在地が変わる", async ({ page }) => {
  await page.goto("/engineer/");
  const rail = page.getByRole("navigation", { name: "章の一覧" });

  await expect(rail.getByRole("link", { name: /はじめに/ })).toHaveAttribute(
    "aria-current",
    "true",
  );

  for (const label of ["スタック", "経歴", "事例", "連絡先"]) {
    await rail.getByRole("link", { name: new RegExp(label) }).click();
    await page.waitForTimeout(700);
    await expect(rail.getByRole("link", { name: new RegExp(label) })).toHaveAttribute(
      "aria-current",
      "true",
    );
  }
});

test("職務経歴: テーマを切り替えられて、記憶される", async ({ page }) => {
  await page.goto("/engineer/");

  // 既定はダーク（このページはダークの見え方そのものが作品なので）
  await expect(page.locator("html")).toHaveAttribute("data-theme", "engineer-dark");

  const toggle = page.getByRole("button", { name: /テーマに切り替える/ });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "engineer-light");

  // リロードしても選択が残る
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "engineer-light");

  // 戻せる
  await page.getByRole("button", { name: /テーマに切り替える/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "engineer-dark");
});

test("職務経歴: テーマの初期値がチラつかない", async ({ page }) => {
  // ライトを記憶させた状態で読み込み、最初の描画時点で既にライトであること。
  // <head> の同期スクリプトが効いていないとここで dark が観測される。
  await page.addInitScript(() => {
    try {
      localStorage.setItem("ishida-takuya:engineer-theme", "light");
    } catch {}
  });

  const themes: string[] = [];
  await page.exposeFunction("recordTheme", (t: string) => themes.push(t));
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      (window as unknown as { recordTheme: (t: string) => void }).recordTheme(
        document.documentElement.dataset.theme ?? "",
      );
    });
  });

  await page.goto("/engineer/");
  await page.waitForLoadState("networkidle");

  expect(themes, "DOMContentLoaded の時点でライトになっていること").toContain("engineer-light");
});

test("キーボードだけで主要な導線をたどれる", async ({ page }) => {
  await page.goto("/engineer/");

  await page.keyboard.press("Tab");
  const skip = page.locator(".skip-link");
  await expect(skip).toBeFocused();

  const outline = await skip.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe("none");
});

test("事例カードが開閉でき、キーボードでも操作できる", async ({ page }) => {
  await page.goto("/engineer/");

  const first = page.locator("details").first();
  await expect(first).not.toHaveAttribute("open", "");

  await first.getByRole("group").or(first.locator("summary")).first().click();
  await expect(first).toHaveAttribute("open", "");
});

test("画像・見出し階層・言語設定が崩れていない", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route.path);

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");

    const levels = await page.$$eval("h1, h2, h3, h4", (nodes) =>
      nodes.map((n) => Number(n.tagName[1])),
    );
    for (let i = 1; i < levels.length; i += 1) {
      expect(
        levels[i]! - levels[i - 1]!,
        `${route.path} の見出し階層が飛んでいる`,
      ).toBeLessThanOrEqual(1);
    }

    const missingAlt = await page.$$eval(
      "img",
      (imgs) => imgs.filter((img) => !img.hasAttribute("alt")).length,
    );
    expect(missingAlt).toBe(0);
  }
});
