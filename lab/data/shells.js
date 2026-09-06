/* =====================================================================
   Lab / 層 1 — 骨格（Shell）

   全ページに共通してかかる枠。開いた瞬間の印象と、読み進むあいだの手ざわり。
   場面と違って**1 サイトに 1 セットしか選ばない**ので、見本も「ページ 1 枚」の形で持つ。

   場面との違いは 1 点だけ。骨格は**スクロールしないと伝わらない**（ヘッダーが
   追従するか、進捗バーが伸びるか）。だから見本は画面 1 つぶんの高さに切り、
   中をスクロールさせる。ルート要素は data-shell を持つ 1 つの塊にする。

   書くときの約束
     1. id は一意・kebab-case。CSS の接頭辞 .h-<id> と URL のハッシュを兼ねる
     2. html のルート要素はちょうど 1 つ、data-shell を持ち、クラスは .h-<id>
     3. CSS のセレクタはすべて .h-<id> 始まりにする
     4. 値は下地（data/foundation.js）の CSS 変数で書く
     5. 中身のダミー本文は見本の主役ではない。骨格の挙動が読めるだけの量に留める
     6. スクロールを見せるので、ダミー本文は画面 2〜3 枚ぶんの高さを持たせる
     7. title は形を名指しする。件数は入れない（data/sections.js の約束 8 と同じ）
   ===================================================================== */

window.LAB_SHELL_KINDS = [
    { id: "opening", label: "Opening", labelJa: "幕開け",     note: "読み込みから最初の 1 秒" },
    { id: "header",  label: "Header",  labelJa: "ヘッダー",   note: "スクロール中ずっと見えるもの" },
    { id: "nav",     label: "Nav",     labelJa: "ナビ",       note: "行き先の見せ方" },
    { id: "scroll",  label: "Scroll",  labelJa: "スクロール", note: "いま どこを読んでいるか" },
];

/* 骨格の見本に共通で敷くダミー本文。骨格の挙動を見るための「読み物」なので、
   場面のように作り込まない。ここが主張し始めると、見るべきものがぼやける */
const FILLER = `
    <main class="h-filler">
        <h1>まちのパン屋のためのウェブサイト</h1>
        <p>
            スクロールしてみてください。上の枠がどう振る舞うかが、この見本の主題です。
        </p>
        <p>本文はここでは主役ではないので、量だけ置いています。</p>
        <p>読み進めるほど、骨格の挙動がはっきりします。</p>
        <p>もう少し下まで続きます。</p>
        <p>この辺りで、上の枠の変化が落ち着きます。</p>
        <p>最後まで来ました。</p>
    </main>`;

const FILLER_CSS = `
    .h-filler {
        max-width: 620px;
        margin: 0 auto;
        padding: var(--s-9) var(--s-5) var(--s-10);
    }
    .h-filler h1 {
        font-family: var(--font-display);
        font-size: clamp(24px, 3.4vw, 38px);
        font-weight: 600;
        line-height: 1.5;
        margin: 0 0 var(--s-6);
    }
    .h-filler p {
        font-size: 14px;
        line-height: 2.2;
        color: var(--ink-2);
        margin: 0 0 var(--s-8);
    }`;

/* 幕開けは「読み込み直後の 1 回」なので、見本では繰り返し見せる必要がある。
   閉じたあとに少し待って開き直す。実サイトでは 1 回で終わらせる */
const REPLAY_OPENING = `const curtain = document.querySelector("[data-curtain]");
const loop = () => {
    curtain.dataset.play = "0";
    setTimeout(() => { curtain.dataset.play = "1"; }, 400);
    setTimeout(loop, 6000);
};
loop();`;

window.LAB_SHELLS = [
    /* ======================== Opening ======================== */
    {
        id: "opening-curtain",
        title: "上がる幕",
        titleEn: "Rising Curtain",
        kind: "opening",
        note: "地の色の幕が上へ抜けて、本文が現れます。読み込みの間を隠しつつ、始まりの合図になります。",
        uses: { motions: [] },
        html: `
            <div class="h-opening-curtain" data-shell>
                <div class="h-opening-curtain__curtain" data-curtain data-play="1" aria-hidden="true">
                    <span class="h-opening-curtain__name">Komugi</span>
                </div>
                ${FILLER}
            </div>`,
        css: `
            .h-opening-curtain {
                position: relative;
                min-height: 100%;
                background: var(--bg);
            }
            /* 幕は position: fixed。iframe の中では画面 1 つぶんを覆う */
            .h-opening-curtain__curtain {
                position: fixed;
                inset: 0;
                z-index: 10;
                display: grid;
                place-items: center;
                background: var(--invert-bg);
                transform: translateY(0);
            }
            .h-opening-curtain__name {
                font-family: var(--font-display);
                font-size: 26px;
                font-weight: 600;
                letter-spacing: 0.12em;
                color: var(--invert-ink);
            }
            /* 幕が上へ抜けるより一拍早く、名前だけ先に消す */
            .h-opening-curtain__curtain[data-play="1"] {
                animation: h-opening-curtain-up 900ms cubic-bezier(0.65, 0, 0.35, 1) 700ms forwards;
            }
            .h-opening-curtain__curtain[data-play="1"] .h-opening-curtain__name {
                animation: h-opening-curtain-fade 400ms ease 500ms forwards;
            }
            @keyframes h-opening-curtain-up {
                to { transform: translateY(-100%); }
            }
            @keyframes h-opening-curtain-fade {
                to { opacity: 0; }
            }
            ${FILLER_CSS}`,
        js: REPLAY_OPENING,
    },
    {
        id: "opening-line",
        title: "結ばれる名前",
        titleEn: "Drawn Name",
        kind: "opening",
        note: "細い線が横に伸び、その上に名前が浮かんでから退きます。幕で覆わないぶん、待たせている感じが薄くなります。",
        uses: { motions: [] },
        html: `
            <div class="h-opening-line" data-shell>
                <div class="h-opening-line__veil" data-curtain data-play="1" aria-hidden="true">
                    <span class="h-opening-line__name">Komugi</span>
                    <span class="h-opening-line__rule"></span>
                </div>
                ${FILLER}
            </div>`,
        css: `
            .h-opening-line {
                position: relative;
                min-height: 100%;
                background: var(--bg);
            }
            .h-opening-line__veil {
                position: fixed;
                inset: 0;
                z-index: 10;
                display: grid;
                place-content: center;
                justify-items: center;
                gap: 14px;
                background: var(--bg);
            }
            .h-opening-line__name {
                font-family: var(--font-display);
                font-size: 24px;
                font-weight: 600;
                letter-spacing: 0.14em;
                color: var(--ink);
                opacity: 0;
            }
            /* 線は幅ではなく scaleX で伸ばす。幅を変えると毎フレーム再レイアウトになる */
            .h-opening-line__rule {
                display: block;
                width: 180px;
                height: 1px;
                background: var(--accent);
                transform: scaleX(0);
            }
            .h-opening-line__veil[data-play="1"] .h-opening-line__rule {
                animation: h-opening-line-draw 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .h-opening-line__veil[data-play="1"] .h-opening-line__name {
                animation: h-opening-line-in 600ms ease 400ms forwards;
            }
            .h-opening-line__veil[data-play="1"] {
                animation: h-opening-line-out 500ms ease 1500ms forwards;
            }
            @keyframes h-opening-line-draw {
                to { transform: scaleX(1); }
            }
            @keyframes h-opening-line-in {
                to { opacity: 1; }
            }
            @keyframes h-opening-line-out {
                to { opacity: 0; visibility: hidden; }
            }
            ${FILLER_CSS}`,
        js: REPLAY_OPENING,
    },

    /* ========================= Header ======================== */
    {
        id: "header-shrink",
        title: "追従して縮むヘッダー",
        titleEn: "Shrinking Header",
        kind: "header",
        note: "上に貼りついたまま、少し下げると高さが縮んで薄い罫線が出ます。常に戻り道があるので、長いページ向き。",
        uses: { motions: [] },
        html: `
            <div class="h-header-shrink" data-shell>
                <header class="h-header-shrink__bar" data-bar>
                    <span class="h-header-shrink__brand">Komugi</span>
                    <nav class="h-header-shrink__nav">
                        <a href="#0">お店について</a>
                        <a href="#0">パンのこと</a>
                        <a href="#0">アクセス</a>
                    </nav>
                </header>
                ${FILLER}
            </div>`,
        css: `
            .h-header-shrink {
                min-height: 100%;
                background: var(--bg);
            }
            /* position: sticky なら、追従のためのスクロール監視が要らない */
            .h-header-shrink__bar {
                position: sticky;
                top: 0;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--s-5);
                height: 78px;
                padding: 0 var(--s-5);
                background: var(--bg);
                border-bottom: 1px solid transparent;
                transition:
                    height var(--dur-fast) var(--ease-out),
                    border-color var(--dur-fast) var(--ease-out);
            }
            .h-header-shrink__bar[data-scrolled="1"] {
                height: 54px;
                border-bottom-color: var(--line);
            }
            .h-header-shrink__brand {
                font-family: var(--font-display);
                font-size: 17px;
                font-weight: 600;
                letter-spacing: 0.06em;
            }
            .h-header-shrink__nav {
                display: flex;
                gap: var(--s-5);
            }
            .h-header-shrink__nav a {
                font-size: 13px;
                color: var(--ink-2);
                text-decoration: none;
            }
            .h-header-shrink__nav a:hover {
                color: var(--ink);
            }
            ${FILLER_CSS}`,
        js: `const bar = document.querySelector("[data-bar]");
/* しきい値は 1 つだけ。上下で別の値にすると、境目で行き来したときに震える */
addEventListener("scroll", () => {
    bar.dataset.scrolled = scrollY > 40 ? "1" : "0";
}, { passive: true });`,
    },
    {
        id: "header-reveal",
        title: "透過から塗りへ",
        titleEn: "Transparent to Solid",
        kind: "header",
        note: "最初は写真に重なって透け、下げると地の色で塗りつぶされます。ファーストビューを広く見せたいときに。",
        uses: { motions: [] },
        html: `
            <div class="h-header-reveal" data-shell>
                <header class="h-header-reveal__bar" data-bar>
                    <span class="h-header-reveal__brand">Komugi</span>
                    <nav class="h-header-reveal__nav">
                        <a href="#0">お店について</a>
                        <a href="#0">パンのこと</a>
                        <a href="#0">アクセス</a>
                    </nav>
                </header>
                <div class="h-header-reveal__hero">
                    <p class="h-header-reveal__copy">ちいさく、ていねいに。</p>
                </div>
                ${FILLER}
            </div>`,
        css: `
            .h-header-reveal {
                min-height: 100%;
                background: var(--bg);
            }
            .h-header-reveal__bar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--s-5);
                height: 64px;
                padding: 0 var(--s-5);
                color: var(--invert-ink);
                background: transparent;
                border-bottom: 1px solid transparent;
                transition:
                    background var(--dur-base) var(--ease-out),
                    color var(--dur-base) var(--ease-out),
                    border-color var(--dur-base) var(--ease-out);
            }
            .h-header-reveal__bar[data-scrolled="1"] {
                color: var(--ink);
                background: var(--bg);
                border-bottom-color: var(--line);
            }
            .h-header-reveal__brand {
                font-family: var(--font-display);
                font-size: 17px;
                font-weight: 600;
                letter-spacing: 0.06em;
            }
            .h-header-reveal__nav {
                display: flex;
                gap: var(--s-5);
            }
            .h-header-reveal__nav a {
                font-size: 13px;
                color: inherit;
                text-decoration: none;
                opacity: 0.85;
            }

            /* 写真の代わり。外部ファイルを持たせない */
            .h-header-reveal__hero {
                display: grid;
                place-items: center;
                height: 340px;
                background:
                    radial-gradient(60% 80% at 30% 20%, var(--mark) 0%, transparent 60%),
                    linear-gradient(160deg, var(--invert-bg), var(--accent));
            }
            .h-header-reveal__copy {
                font-family: var(--font-display);
                font-size: clamp(22px, 3vw, 34px);
                font-weight: 600;
                letter-spacing: 0.06em;
                color: var(--invert-ink);
                margin: 0;
            }
            ${FILLER_CSS}`,
        js: `const bar = document.querySelector("[data-bar]");
/* 塗りに変わる位置は「写真を抜けたところ」。数値で決め打ちせず、写真の高さから取る */
const hero = document.querySelector(".h-header-reveal__hero");
addEventListener("scroll", () => {
    bar.dataset.scrolled = scrollY > hero.offsetHeight - 64 ? "1" : "0";
}, { passive: true });`,
    },

    /* ========================== Nav ========================== */
    {
        id: "nav-drawer",
        title: "横から出る引き出し",
        titleEn: "Side Drawer",
        kind: "nav",
        note: "広い画面では横並び、狭い画面では引き出し。行き先が 5 つ前後までのサイトに。",
        uses: { motions: ["burger-x"] },
        html: `
            <div class="h-nav-drawer" data-shell>
                <header class="h-nav-drawer__bar">
                    <span class="h-nav-drawer__brand">Komugi</span>
                    <nav class="h-nav-drawer__wide">
                        <a href="#0">お店について</a>
                        <a href="#0">パンのこと</a>
                        <a href="#0">アクセス</a>
                    </nav>
                    <button class="h-nav-drawer__toggle p-burger-x" type="button" data-toggle aria-label="メニュー">
                        <span class="p-burger-x__box">
                            <span class="p-burger-x__bar"></span>
                            <span class="p-burger-x__bar"></span>
                            <span class="p-burger-x__bar"></span>
                        </span>
                    </button>
                </header>
                <div class="h-nav-drawer__scrim" data-scrim></div>
                <aside class="h-nav-drawer__panel" data-panel>
                    <a href="#0">お店について</a>
                    <a href="#0">パンのこと</a>
                    <a href="#0">アクセス</a>
                    <a href="#0">お問い合わせ</a>
                </aside>
                ${FILLER}
            </div>`,
        css: `
            .h-nav-drawer {
                min-height: 100%;
                background: var(--bg);
            }
            .h-nav-drawer__bar {
                position: sticky;
                top: 0;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--s-5);
                height: 64px;
                padding: 0 var(--s-5);
                background: var(--bg);
                border-bottom: 1px solid var(--line);
            }
            .h-nav-drawer__brand {
                font-family: var(--font-display);
                font-size: 17px;
                font-weight: 600;
                letter-spacing: 0.06em;
            }
            .h-nav-drawer__wide {
                display: none;
                gap: var(--s-5);
            }
            .h-nav-drawer__wide a {
                font-size: 13px;
                color: var(--ink-2);
                text-decoration: none;
            }
            /* 広い画面では横並びに切り替え、引き出しの取っ手を隠す */
            @media (min-width: 720px) {
                .h-nav-drawer__wide { display: flex; }
                .h-nav-drawer__toggle { display: none; }
            }

            .h-nav-drawer__toggle {
                background: transparent;
                border: 0;
                padding: 0;
                cursor: pointer;
            }
            .h-nav-drawer__scrim {
                position: fixed;
                inset: 0;
                z-index: 11;
                background: rgba(0, 0, 0, 0.35);
                opacity: 0;
                pointer-events: none;
                transition: opacity var(--dur-base) var(--ease-out);
            }
            .h-nav-drawer[data-open="1"] .h-nav-drawer__scrim {
                opacity: 1;
                pointer-events: auto;
            }
            .h-nav-drawer__panel {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: 12;
                width: min(260px, 78%);
                display: flex;
                flex-direction: column;
                gap: var(--s-5);
                padding: var(--s-8) var(--s-6);
                background: var(--bg-2);
                border-left: 1px solid var(--line);
                transform: translateX(100%);
                transition: transform var(--dur-base) var(--ease-out);
            }
            .h-nav-drawer[data-open="1"] .h-nav-drawer__panel {
                transform: translateX(0);
            }
            .h-nav-drawer__panel a {
                font-family: var(--font-display);
                font-size: 16px;
                font-weight: 600;
                color: var(--ink);
                text-decoration: none;
            }
            ${FILLER_CSS}`,
        js: `const root = document.querySelector("[data-shell]");
const toggle = document.querySelector("[data-toggle]");
const set = (open) => {
    root.dataset.open = open ? "1" : "0";
    /* 三本線を × に変える動きは burger-x に任せる。状態だけ渡す */
    toggle.classList.toggle("is-hover", open);
};
toggle.addEventListener("click", () => set(root.dataset.open !== "1"));
document.querySelector("[data-scrim]").addEventListener("click", () => set(false));`,
    },
    {
        id: "nav-overlay",
        title: "画面いっぱいのナビ",
        titleEn: "Fullscreen Nav",
        kind: "nav",
        note: "開くと画面を覆い、行き先が順に立ち上がります。行き先が少なく、ひとつずつ選ばせたいサイトに。",
        uses: { motions: ["burger-x", "nav-link-stagger"] },
        html: `
            <div class="h-nav-overlay" data-shell>
                <header class="h-nav-overlay__bar">
                    <span class="h-nav-overlay__brand">Komugi</span>
                    <button class="h-nav-overlay__toggle p-burger-x" type="button" data-toggle aria-label="メニュー">
                        <span class="p-burger-x__box">
                            <span class="p-burger-x__bar"></span>
                            <span class="p-burger-x__bar"></span>
                            <span class="p-burger-x__bar"></span>
                        </span>
                    </button>
                </header>
                <div class="h-nav-overlay__sheet" data-sheet>
                    <ul class="h-nav-overlay__list p-nav-link-stagger" data-list>
                        <li><a href="#0">お店について</a></li>
                        <li><a href="#0">パンのこと</a></li>
                        <li><a href="#0">アクセス</a></li>
                        <li><a href="#0">お問い合わせ</a></li>
                    </ul>
                </div>
                ${FILLER}
            </div>`,
        css: `
            .h-nav-overlay {
                min-height: 100%;
                background: var(--bg);
            }
            .h-nav-overlay__bar {
                position: sticky;
                top: 0;
                z-index: 13;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 64px;
                padding: 0 var(--s-5);
                background: var(--bg);
                border-bottom: 1px solid var(--line);
            }
            .h-nav-overlay__brand {
                font-family: var(--font-display);
                font-size: 17px;
                font-weight: 600;
                letter-spacing: 0.06em;
            }
            .h-nav-overlay__toggle {
                background: transparent;
                border: 0;
                padding: 0;
                cursor: pointer;
            }

            /* 覆いは clip-path で開く。高さを動かすと中身が毎フレーム流れ直す */
            .h-nav-overlay__sheet {
                position: fixed;
                inset: 0;
                z-index: 12;
                display: grid;
                place-items: center;
                background: var(--invert-bg);
                clip-path: inset(0 0 100% 0);
                transition: clip-path var(--dur-base) var(--ease-in-out);
            }
            .h-nav-overlay[data-open="1"] .h-nav-overlay__sheet {
                clip-path: inset(0 0 0 0);
            }
            .h-nav-overlay__list {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: var(--s-5);
                text-align: center;
            }
            .h-nav-overlay__list a {
                font-family: var(--font-display);
                font-size: clamp(22px, 4vw, 32px);
                font-weight: 600;
                color: var(--invert-ink);
                text-decoration: none;
            }
            ${FILLER_CSS}`,
        js: `const root = document.querySelector("[data-shell]");
const toggle = document.querySelector("[data-toggle]");
const list = document.querySelector("[data-list]");
toggle.addEventListener("click", () => {
    const open = root.dataset.open !== "1";
    root.dataset.open = open ? "1" : "0";
    toggle.classList.toggle("is-hover", open);
    /* 行き先が順に立ち上がる動きは、覆いが開くたびに頭から流し直す */
    list.removeAttribute("data-play");
    if (open) { void list.offsetWidth; list.dataset.play = "1"; }
});`,
    },

    /* ======================== Scroll ========================= */
    {
        id: "scroll-progress",
        title: "読み進み度のバー",
        titleEn: "Reading Progress",
        kind: "scroll",
        note: "上端の細い線が、読んだぶんだけ伸びます。長い記事で「あとどれくらいか」を黙って伝えられます。",
        uses: { motions: [] },
        html: `
            <div class="h-scroll-progress" data-shell>
                <header class="h-scroll-progress__bar">
                    <span class="h-scroll-progress__brand">Komugi</span>
                    <span class="h-scroll-progress__meter" data-meter aria-hidden="true"></span>
                </header>
                ${FILLER}
            </div>`,
        css: `
            .h-scroll-progress {
                min-height: 100%;
                background: var(--bg);
            }
            .h-scroll-progress__bar {
                position: sticky;
                top: 0;
                z-index: 10;
                display: flex;
                align-items: center;
                height: 60px;
                padding: 0 var(--s-5);
                background: var(--bg);
                border-bottom: 1px solid var(--line);
            }
            .h-scroll-progress__brand {
                font-family: var(--font-display);
                font-size: 17px;
                font-weight: 600;
                letter-spacing: 0.06em;
            }
            /* 罫線に重ねる。幅ではなく scaleX を動かす */
            .h-scroll-progress__meter {
                position: absolute;
                left: 0;
                right: 0;
                bottom: -1px;
                height: 2px;
                background: var(--accent);
                transform: scaleX(0);
                transform-origin: left center;
            }
            ${FILLER_CSS}`,
        js: `const meter = document.querySelector("[data-meter]");
const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    meter.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
};
addEventListener("scroll", update, { passive: true });
addEventListener("resize", update);
update();`,
    },
    {
        id: "scroll-index",
        title: "追従する目次",
        titleEn: "Sticky Index",
        kind: "scroll",
        note: "横に目次が貼りつき、いま読んでいる項目に印がつきます。項目が多いページで迷わせないために。",
        uses: { motions: [] },
        html: `
            <div class="h-scroll-index" data-shell>
                <header class="h-scroll-index__bar">
                    <span class="h-scroll-index__brand">Komugi</span>
                </header>
                <div class="h-scroll-index__body">
                    <nav class="h-scroll-index__nav" data-index>
                        <a href="#s1">お店について</a>
                        <a href="#s2">パンのこと</a>
                        <a href="#s3">アクセス</a>
                    </nav>
                    <div class="h-scroll-index__main">
                        <section id="s1"><h2>お店について</h2><p>朝に焼いて、その日のうちに売り切るぶんだけ作っています。</p></section>
                        <section id="s2"><h2>パンのこと</h2><p>粉と水と塩と酵母。余計なものを入れずに、時間をかけて膨らませます。</p></section>
                        <section id="s3"><h2>アクセス</h2><p>駅から歩いて 7 分。角のポストを曲がってすぐです。</p></section>
                    </div>
                </div>
            </div>`,
        css: `
            .h-scroll-index {
                min-height: 100%;
                background: var(--bg);
            }
            .h-scroll-index__bar {
                position: sticky;
                top: 0;
                z-index: 10;
                display: flex;
                align-items: center;
                height: 60px;
                padding: 0 var(--s-5);
                background: var(--bg);
                border-bottom: 1px solid var(--line);
            }
            .h-scroll-index__brand {
                font-family: var(--font-display);
                font-size: 17px;
                font-weight: 600;
                letter-spacing: 0.06em;
            }
            .h-scroll-index__body {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--s-6);
                max-width: 860px;
                margin: 0 auto;
                padding: var(--s-8) var(--s-5) var(--s-10);
            }
            @media (min-width: 720px) {
                .h-scroll-index__body {
                    grid-template-columns: 180px 1fr;
                    gap: var(--s-8);
                }
            }
            /* ヘッダーのぶんだけ下げて貼りつける */
            .h-scroll-index__nav {
                position: sticky;
                top: 84px;
                align-self: start;
                display: flex;
                flex-direction: column;
                gap: var(--s-3);
            }
            .h-scroll-index__nav a {
                font-size: 13px;
                color: var(--ink-3);
                text-decoration: none;
                padding-left: var(--s-3);
                border-left: 2px solid transparent;
                transition: color var(--dur-fast) var(--ease-out);
            }
            .h-scroll-index__nav a[aria-current="true"] {
                color: var(--accent);
                border-left-color: var(--accent);
                font-weight: 600;
            }
            .h-scroll-index__main section {
                min-height: 320px;
                scroll-margin-top: 76px;
            }
            .h-scroll-index__main h2 {
                font-family: var(--font-display);
                font-size: clamp(20px, 2.6vw, 26px);
                font-weight: 600;
                margin: 0 0 var(--s-4);
            }
            .h-scroll-index__main p {
                font-size: 14px;
                line-height: 2.2;
                color: var(--ink-2);
                margin: 0;
            }
            ${FILLER_CSS}`,
        js: `const links = [...document.querySelectorAll("[data-index] a")];
/* 上から 4 分の 1 の帯に入った見出しを「いま読んでいるところ」とみなす */
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => {
            a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false");
        });
    });
}, { rootMargin: "-20% 0px -70% 0px" });
document.querySelectorAll(".h-scroll-index__main section").forEach((s) => io.observe(s));`,
    },
];
