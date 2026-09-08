import { expect, test, type Page } from "@playwright/test";

/**
 * スモークテスト。
 * 「壊れていないこと」ではなく「読み手が困らないこと」を確認する。
 */

const ROUTES = [
  { path: "/", name: "ゲート" },
  { path: "/engineer/", name: "職務経歴" },
  { path: "/business/", name: "ご相談" },
  { path: "/business/profile/", name: "プロフィール" },
  { path: "/business/legal/", name: "特商法の表記" },
  { path: "/business/privacy/", name: "プライバシーポリシー" },
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
    await expect(page).toHaveTitle(/石田卓也|石田 卓也/);

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

  // 見出しではなく「誰向けか」の札で選ぶ。見出しは扱う商売が変われば変わるが、
  // 読み手の区分は変わらない。文言を直すたびにテストが落ちるのを避ける。
  await page.getByRole("link", { name: /採用・技術の方へ/ }).click();
  await expect(page).toHaveURL(/\/engineer/);
  await expect(page.getByRole("navigation", { name: "ページ内の移動" })).toBeVisible();

  await page.goto("/");
  await page.getByRole("link", { name: /お仕事のご相談の方へ/ }).click();
  await expect(page).toHaveURL(/\/business/);
});

test("職務経歴から入口へ戻れる", async ({ page }) => {
  await page.goto("/engineer/");
  await page.getByRole("link", { name: "入口へ戻る" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("職務経歴: ナビから各節へ飛べて、現在地が変わる", async ({ page }) => {
  await page.goto("/engineer/");
  const nav = page.getByRole("navigation", { name: "ページ内の移動" });

  for (const { label, id } of [
    { label: "職務経歴", id: "career" },
    { label: "スキル", id: "skills" },
    { label: "制作実績", id: "projects" },
    { label: "お問い合わせ", id: "contact" },
  ]) {
    // ナビには節の一覧とは別に「お問い合わせ」の CTA も入っているので、
    // 一覧（<ul>）の中に絞ってから選ぶ。
    await nav.getByRole("list").getByRole("link", { name: label, exact: true }).click();
    await page.waitForTimeout(700);
    await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.1 });
  }
});

test("職務経歴: 経歴・スキル・実績がデータから描かれている", async ({ page }) => {
  await page.goto("/engineer/");
  await page.waitForLoadState("networkidle");

  expect(await page.getByTestId("career-entry").count()).toBeGreaterThan(0);
  expect(await page.getByTestId("skill-bar").count()).toBeGreaterThan(0);
  expect(await page.getByTestId("project-card").count()).toBeGreaterThan(0);
});

/**
 * 通算年数はゲートと職務経歴で同じ 1 つのデータから出している。
 * 片方だけ手で書くと、同じサイトの中で違う年数が出る。
 */
test("通算年数がゲートと職務経歴で一致する", async ({ page }) => {
  await page.goto("/");
  const gateMeta = await page.getByRole("link", { name: /採用・技術の方へ/ }).innerText();
  const gateYears = gateMeta.match(/(\d+)\s*年/)?.[1];
  expect(gateYears, "ゲートの扉に年数が出ていること").toBeTruthy();

  await page.goto("/engineer/");
  await expect(page.getByText("Web 開発の経験")).toBeVisible();
  const stat = await page
    .getByText("Web 開発の経験")
    .locator("xpath=preceding-sibling::div[1]")
    .innerText();
  expect(stat.replace(/\s/g, "")).toBe(`${gateYears}年`);
});

/**
 * Tailwind は /engineer のルートグループにしか読ませていない。
 *
 * 分離は import の位置だけで保っているので、ほかのレイアウトへ
 * src/styles/engineer.css を持っていくと静かに壊れる。
 * ユーティリティが効くかどうかで、実際に配信された CSS を見る。
 */
test("Tailwind が /engineer の外へ漏れていない", async ({ page }) => {
  const utilityWorks = () =>
    page.evaluate(() => {
      const probe = document.createElement("div");
      probe.className = "hidden";
      document.body.append(probe);
      const applied = getComputedStyle(probe).display === "none";
      probe.remove();
      return applied;
    });

  await page.goto("/engineer/");
  expect(await utilityWorks(), "/engineer では Tailwind が効くこと").toBe(true);

  for (const path of ["/", "/business/"]) {
    await page.goto(path);
    expect(await utilityWorks(), `${path} に Tailwind が漏れている`).toBe(false);
  }
});

test("キーボードだけで主要な導線をたどれる", async ({ page }) => {
  await page.goto("/engineer/");

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

/**
 * 法定の表記に空欄が残ったまま公開されるのを止める。
 *
 * ダミー表示を切る（IS_PLACEHOLDER_CONTENT = false）ということは
 * 「中身が入った」という宣言なので、そのとき未入力が残っていたら落とす。
 * 特商法の表記で所在地が空のまま公開されるのがいちばんまずい。
 */
test("中身を入れたと宣言したら、未入力が残っていない", async ({ page }) => {
  const { IS_PLACEHOLDER_CONTENT } = await import("../src/config/site");
  test.skip(IS_PLACEHOLDER_CONTENT, "まだダミー表示のままなので、未入力があってよい");

  for (const path of ["/business/", "/business/profile/", "/business/legal/", "/business/privacy/"]) {
    await page.goto(path);
    await expect(page.getByText("未入力"), `${path} に未入力が残っている`).toHaveCount(0);
    await expect(page.locator("body"), `${path} に穴埋めの括弧が残っている`).not.toContainText("［");
  }
});

test("下層ページから、法定の表記に行き来できる", async ({ page }) => {
  await page.goto("/business/");

  await page.getByRole("link", { name: "特定商取引法に基づく表記" }).click();
  await expect(page).toHaveURL(/\/business\/legal/);
  await expect(page.getByRole("heading", { name: "特定商取引法に基づく表記", level: 1 })).toBeVisible();

  await page.getByRole("link", { name: "プライバシーポリシー" }).click();
  await expect(page).toHaveURL(/\/business\/privacy/);

  await page.getByRole("link", { name: "プロフィール" }).click();
  await expect(page).toHaveURL(/\/business\/profile/);

  await page.getByRole("link", { name: /トップへ/ }).click();
  await expect(page).toHaveURL(/\/business\/?$/);
});
