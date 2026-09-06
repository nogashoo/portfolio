/* =====================================================================
   Lab / 層 0 — 下地（Foundation）

   サイトの人格。色・書体・動きの速さをひとかたまりで持つ。
   場面の見本を組み立てるとき、選ばれた 1 つがスタイルシートの先頭に付く。
   **だから場面の CSS は var() で書いてよい。**
   （動きのパーツだけは下地なしでも成り立つ前提なのでリテラル値のまま）

   トークンは役割で呼ぶ。--green-deep のような色そのものの名前にすると、
   青い下地や黒い下地を足した瞬間に名前が嘘になる。

   足すときの約束
     1. 下の TOKENS をすべて埋める。1 つでも欠けると、その下地に切り替えた
        場面だけ色が抜ける（var() のフォールバックは書いていない）
     2. --invert-* は「地と文字をひっくり返した帯」用。地が明るい下地なら暗く、
        暗い下地なら明るくする。ここを地と同系にすると CTA の帯が読めなくなる
     3. 余白（--s-*）は下地で変えない。変えると場面のレイアウトが崩れ、
        「同じ場面の色違い」として見比べられなくなる
     4. swatch は一覧に出す 3 色。地・主役・差し色の順
   ===================================================================== */

/* 余白の目盛りは全下地で共通。ここが動くと場面の組み方が壊れる */
const SCALE = `
    :root {
        --s-1: 4px;
        --s-2: 8px;
        --s-3: 12px;
        --s-4: 16px;
        --s-5: 24px;
        --s-6: 32px;
        --s-7: 48px;
        --s-8: 64px;
        --s-9: 96px;
        --s-10: 144px;
    }`;

const RESET = `
    *, *::before, *::after { box-sizing: border-box; }
    body {
        margin: 0;
        font-family: var(--font-body);
        color: var(--ink);
        background: var(--bg);
        -webkit-font-smoothing: antialiased;
    }
    img { max-width: 100%; display: block; }`;

/* 動きのパーツは単体で成り立つようリテラル値で書いてある（data/motions.js の約束 4）。
   場面に載せると、その色が下地と喧嘩する ——「重厚」の暗い地に生成りのカードが浮く、など。
   そこで**場面に載せるときだけ**、色を下地のトークンに向け直す。
   場面ごとに書くと 12 か所に散らばるので、1 枚にまとめてここに置く。

   連結の順は 動き → この橋 → 場面。だから場面側からはさらに上書きできる。
   写真の見立て（image-zoom-frame の地）は「写真そのもの」なので合わせない */
const MOTION_BRIDGE = `
    .p-btn-fill { color: var(--accent); border-color: var(--accent); }
    .p-btn-fill::before { background: var(--accent); }
    .p-btn-fill:hover, .p-btn-fill.is-hover { color: var(--bg); }

    .p-btn-arrow-slide { color: var(--bg); background: var(--accent); }

    .p-card-border-draw { background: var(--bg-2); border-color: var(--line); }
    .p-card-border-draw::before,
    .p-card-border-draw::after { border-color: var(--accent); }
    .p-card-border-draw__title { color: var(--ink); }
    .p-card-border-draw__note { color: var(--ink-2); }

    .p-card-lift { background: var(--bg-2); border-color: var(--line); }
    .p-card-lift:hover, .p-card-lift.is-hover { border-color: var(--accent); }
    .p-card-lift__cat { color: var(--accent); }
    .p-card-lift__title { color: var(--ink); }
    .p-card-lift__note { color: var(--ink-2); }

    .p-card-stack-in__c { background: var(--bg-2); border-color: var(--line); }

    .p-char-stagger { color: var(--accent); }

    .p-divider-draw__num { color: var(--mark); }
    .p-divider-draw__rule { background: var(--line-2); }
    .p-divider-draw__label { color: var(--ink-2); }

    .p-label-float input {
        color: var(--ink);
        background: var(--surface);
        border-color: var(--line);
    }
    .p-label-float input:focus { border-color: var(--accent); }
    .p-label-float label { color: var(--ink-3); }
    .p-label-float:hover label,
    .p-label-float:focus-within label,
    .p-label-float.is-hover label,
    .p-label-float input:not(:placeholder-shown) + label { color: var(--accent); }

    .p-link-arrow { color: var(--accent); }
    .p-link-arrow::after,
    .p-link-arrow__arrow { background: var(--accent); }
    .p-link-arrow__arrow i { border-color: var(--accent); }

    /* 帯の中で使うので、地ではなく反転側の色に向ける */
    .p-marquee-seamless {
        border-block-color: color-mix(in srgb, var(--invert-ink) 25%, transparent);
    }
    .p-marquee-seamless__track span { color: var(--invert-ink); }

    /* 板の地は消して、光だけを下地の色で残す */
    .p-mesh-breathe { background: transparent; }
    .p-mesh-breathe__blob--a { background: var(--mark-2); }
    .p-mesh-breathe__blob--b { background: var(--accent-2); }
    .p-mesh-breathe__blob--c { background: var(--mark); }

    .p-scroll-hint__label { color: var(--ink-3); }
    .p-scroll-hint__rail { background: var(--line); }
    .p-scroll-hint__rail i { background: var(--accent); }

    .p-underline-draw em { color: var(--ink); }
    .p-underline-draw em::after { background: var(--mark); }
    .p-underline-draw[data-play="1"] em { color: var(--accent); }`;

window.LAB_FOUNDATIONS = [
    {
        id: "kinari",
        label: "生成り",
        labelEn: "Kinari",
        note: "紙と緑。落ち着いた明朝の見出しに、広めの余白。長く読ませたいサイトに",
        motion: "ゆっくり",
        swatch: ["#f4eede", "#1f3a2e", "#b85c3a"],
        fonts: `@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;600;700&family=Noto+Sans+JP:wght@300;400;500;600&family=DM+Sans:wght@400;500;600&display=swap");`,
        css: `
            :root {
                --bg: #f4eede;
                --bg-2: #fbf8f0;
                --surface: #ffffff;
                --line: #dbd5c5;
                --line-2: #a89e88;

                --ink: #262624;
                --ink-2: #5a5a55;
                --ink-3: #8a857a;

                --accent: #1f3a2e;
                --accent-2: #5a6a4d;
                --mark: #b85c3a;
                --mark-2: #d99478;

                --invert-bg: #15291f;
                --invert-ink: #f4eede;

                --font-display: "Noto Serif JP", "Hiragino Mincho ProN", serif;
                --font-body: "Noto Sans JP", "Hiragino Sans", sans-serif;
                --font-latin: "DM Sans", "Helvetica Neue", Arial, sans-serif;

                --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
                --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
                --dur-fast: 200ms;
                --dur-base: 600ms;
                --dur-slow: 1200ms;
            }`,
    },
    {
        id: "crisp",
        label: "軽快",
        labelEn: "Crisp",
        note: "白地と青。見出しもゴシックで、動きは短く速い。サービスや業務システムに",
        motion: "速い",
        swatch: ["#f4f6f9", "#1b4fd8", "#e0603a"],
        fonts: `@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap");`,
        css: `
            :root {
                --bg: #f4f6f9;
                --bg-2: #ffffff;
                --surface: #ffffff;
                --line: #e2e6ec;
                --line-2: #b8c0cc;

                --ink: #14181f;
                --ink-2: #4c5563;
                --ink-3: #8a94a3;

                --accent: #1b4fd8;
                --accent-2: #4a7bff;
                --mark: #e0603a;
                --mark-2: #ffb59c;

                --invert-bg: #14181f;
                --invert-ink: #f4f6f9;

                --font-display: "Noto Sans JP", "Hiragino Sans", sans-serif;
                --font-body: "Noto Sans JP", "Hiragino Sans", sans-serif;
                --font-latin: "DM Sans", "Helvetica Neue", Arial, sans-serif;

                --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
                --ease-in-out: cubic-bezier(0.6, 0, 0.4, 1);
                --dur-fast: 140ms;
                --dur-base: 380ms;
                --dur-slow: 700ms;
            }`,
    },
    {
        id: "noir",
        label: "重厚",
        labelEn: "Noir",
        note: "暗い地に金。明朝を大きく組んで、動きは長い。作品や高額商材に",
        motion: "とてもゆっくり",
        swatch: ["#14161a", "#c9a227", "#d9603f"],
        fonts: `@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;600;700&family=Noto+Sans+JP:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap");`,
        css: `
            :root {
                --bg: #14161a;
                --bg-2: #1b1e24;
                --surface: #22262e;
                --line: #313743;
                --line-2: #4a5262;

                --ink: #f0ece4;
                --ink-2: #b9b3a7;
                --ink-3: #857f70;

                --accent: #c9a227;
                --accent-2: #8c7218;
                --mark: #d9603f;
                --mark-2: #f0a184;

                /* 地が暗いので、反転した帯は明るい側になる */
                --invert-bg: #f0ece4;
                --invert-ink: #14161a;

                --font-display: "Noto Serif JP", "Hiragino Mincho ProN", serif;
                --font-body: "Noto Sans JP", "Hiragino Sans", sans-serif;
                --font-latin: "DM Sans", "Helvetica Neue", Arial, sans-serif;

                --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
                --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
                --dur-fast: 260ms;
                --dur-base: 800ms;
                --dur-slow: 1600ms;
            }`,
    },
    {
        id: "plain",
        label: "素朴",
        labelEn: "Plain",
        note: "生成りより白く、見出しは丸ゴシック。焦茶と弁柄で、やわらかく。個人店に",
        motion: "ふつう",
        swatch: ["#f7f5f0", "#6b5b45", "#a3512f"],
        fonts: `@import url("https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700&family=Noto+Sans+JP:wght@300;400;500;600&family=DM+Sans:wght@400;500;600&display=swap");`,
        css: `
            :root {
                --bg: #f7f5f0;
                --bg-2: #ffffff;
                --surface: #ffffff;
                --line: #e6e2d9;
                --line-2: #c2bcae;

                --ink: #2b2a26;
                --ink-2: #615f57;
                --ink-3: #93907f;

                --accent: #6b5b45;
                --accent-2: #94815f;
                --mark: #a3512f;
                --mark-2: #d59b7c;

                --invert-bg: #2b2a26;
                --invert-ink: #f7f5f0;

                --font-display: "Zen Maru Gothic", "Hiragino Sans", sans-serif;
                --font-body: "Noto Sans JP", "Hiragino Sans", sans-serif;
                --font-latin: "DM Sans", "Helvetica Neue", Arial, sans-serif;

                --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
                --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
                --dur-fast: 200ms;
                --dur-base: 520ms;
                --dur-slow: 1000ms;
            }`,
    },
];

/* 見本に流し込む 1 枚。@import は必ず先頭でなければ効かないので、この順は動かせない */
window.LAB_FOUNDATIONS.cssFor = (f) =>
    [f.fonts, SCALE, f.css, RESET].join("\n");

/* 動きを下地になじませる 1 枚。連結では動きの CSS の直後に置く */
window.LAB_FOUNDATIONS.motionBridge = MOTION_BRIDGE;
