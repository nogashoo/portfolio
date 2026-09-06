/* =====================================================================
   Lab / 層 4 — 動き（Motion）

   カタログは 5 層でできている: 下地 → 骨格 → 場面 → 部品 → 動き。
   このファイルはいちばん下の「動き」で、上の 4 層に乗せる属性を集めたもの。
   場面（data/sections.js）は uses.motions でここの id を名指しし、その CSS を
   連結して見本を組み立てる。つまり id は層をまたぐ契約であって、ただの名前ではない。

   kind は層の中の種別（区画の見出しになる）。層をまたいで同じキー名を使う。

   パーツを 1 つ増やすときは、この配列にオブジェクトを 1 つ足すだけ。
   HTML も motion.js も触らない（kind を新設する場合も LAB_MOTION_KINDS に
   1 行足せば、区画・索引・凡例が自動で増える）。

   書くときの約束
     1. id は一意・kebab-case。CSS の接頭辞 .p-<id>、URL のハッシュ、
        場面からの参照キーを兼ねる。**一度公開したら変えない**
     2. html のルート要素はちょうど 1 つ、クラスは .p-<id>
     3. CSS のセレクタと @keyframes 名はすべて p-<id> 始まりにする
     4. 値は CSS 変数ではなくリテラルで書く。場面の iframe へ連結されたときも、
        下地の変数がそろっているかに関係なくそのまま動く
     5. CSS には「何をしているか」の日本語コメントを 1 行以上入れる
     6. trigger を選ぶ: replay（1 回再生）/ hover（触れて反応）/ loop（回り続ける）
     7. hover のパーツは .p-x:hover と .p-x.is-hover の二重セレクタで書く
        （.is-hover はタッチ端末用。忘れるとスマートフォンで確認できない）

   kind は 3 件たまるまで公開しない（空箱が並ぶと網羅量の印象がむしろ落ちる）。
   motion.js は 0 件の kind を索引にも区画にも出さない。
   ===================================================================== */

window.LAB_MOTION_KINDS = [
    { id: "text",       label: "Text",       labelJa: "文字・見出し",   note: "見出しやコピーの出方" },
    { id: "button",     label: "Button",     labelJa: "ボタン",         note: "CTA・送信・切り替え" },
    { id: "link",       label: "Link",       labelJa: "リンク・矢印",   note: "本文中の導線" },
    { id: "image",      label: "Image",      labelJa: "画像・写真",     note: "サムネイルと見せ方" },
    { id: "card",       label: "Card",       labelJa: "カード・一覧",   note: "タイルとグリッド" },
    { id: "nav",        label: "Nav",        labelJa: "ナビ・メニュー", note: "開閉と現在地" },
    { id: "panel",      label: "Panel",      labelJa: "開閉・展開",     note: "折りたたみと吹き出し" },
    { id: "form",       label: "Form",       labelJa: "入力フォーム",   note: "記入中の手ざわり" },
    { id: "feedback",   label: "Feedback",   labelJa: "通知・状態",     note: "結果の伝え方" },
    { id: "loading",    label: "Loading",    labelJa: "読み込み中",     note: "待ち時間の表現" },
    { id: "background", label: "Background", labelJa: "背景・地",       note: "止まって見えない画面" },
    { id: "decor",      label: "Decor",      labelJa: "区切り・装飾",   note: "帯・罫線・しるし" },
    { id: "transition", label: "Transition", labelJa: "画面遷移",       note: "ページの切り替わり" },
];

window.LAB_MOTIONS = [
    /* ========================= Text ========================= */
    {
        id: "mask-rise",
        title: "マスク・リビール",
        titleEn: "Mask Reveal",
        kind: "text",
        note: "一行ぶんの窓から、文字が下から迫り上がって現れます。見出しの第一印象を作るときに。",
        trigger: "replay",
        bg: "paper",
        tags: ["overflow", "@keyframes"],
        html: `
            <div class="p-mask-rise">
                <span class="p-mask-rise__line"><i>作ったものは、</i></span>
                <span class="p-mask-rise__line"><i>触ってもらうのが早い。</i></span>
            </div>`,
        css: `
            /* 行そのものを overflow:hidden の「窓」にして、
               中の文字を translateY で下から持ち上げる */
            .p-mask-rise {
                font-family: "Noto Serif JP", serif;
                font-size: clamp(17px, 5cqw, 26px);
                font-weight: 600;
                line-height: 1.6;
                text-align: center;
            }
            .p-mask-rise__line {
                display: block;
                overflow: hidden;
            }
            .p-mask-rise__line i {
                display: block;
                font-style: normal;
                transform: translateY(110%);
            }
            .p-mask-rise[data-play="1"] .p-mask-rise__line i {
                animation: p-mask-rise-up 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            /* 2 行目をわずかに遅らせると、機械的な同時再生に見えない */
            .p-mask-rise[data-play="1"] .p-mask-rise__line:nth-child(2) i {
                animation-delay: 140ms;
            }
            @keyframes p-mask-rise-up {
                to { transform: translateY(0); }
            }`,
        js: null,
    },
    {
        id: "char-stagger",
        title: "一文字ずつ、点灯",
        titleEn: "Char Stagger",
        kind: "text",
        note: "文字が左から順に、少しずつ遅れて浮かび上がります。短いキャッチコピー向き。",
        trigger: "replay",
        bg: "kinari",
        tags: ["animation-delay", "nth-child"],
        html: `
            <p class="p-char-stagger" aria-label="ちいさく、ていねいに。">
                <span aria-hidden="true">ち</span><span aria-hidden="true">い</span
                ><span aria-hidden="true">さ</span><span aria-hidden="true">く</span
                ><span aria-hidden="true">、</span><span aria-hidden="true">て</span
                ><span aria-hidden="true">い</span><span aria-hidden="true">ね</span
                ><span aria-hidden="true">い</span><span aria-hidden="true">に</span
                ><span aria-hidden="true">。</span>
            </p>`,
        css: `
            /* 1 文字 = 1 span。nth-child で遅延を階段状に配る。
               読み上げが「ち・い・さ・く」と分断されないよう、
               文字は aria-hidden にして親に aria-label を持たせている */
            .p-char-stagger {
                font-family: "Noto Serif JP", serif;
                font-size: clamp(18px, 6cqw, 30px);
                font-weight: 600;
                color: #1f3a2e;
                margin: 0;
            }
            .p-char-stagger span {
                display: inline-block;
                opacity: 0;
                transform: translateY(14px);
            }
            .p-char-stagger[data-play="1"] span {
                animation: p-char-stagger-in 620ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .p-char-stagger[data-play="1"] span:nth-child(1)  { animation-delay: 0ms; }
            .p-char-stagger[data-play="1"] span:nth-child(2)  { animation-delay: 40ms; }
            .p-char-stagger[data-play="1"] span:nth-child(3)  { animation-delay: 80ms; }
            .p-char-stagger[data-play="1"] span:nth-child(4)  { animation-delay: 120ms; }
            .p-char-stagger[data-play="1"] span:nth-child(5)  { animation-delay: 160ms; }
            .p-char-stagger[data-play="1"] span:nth-child(6)  { animation-delay: 200ms; }
            .p-char-stagger[data-play="1"] span:nth-child(7)  { animation-delay: 240ms; }
            .p-char-stagger[data-play="1"] span:nth-child(8)  { animation-delay: 280ms; }
            .p-char-stagger[data-play="1"] span:nth-child(9)  { animation-delay: 320ms; }
            .p-char-stagger[data-play="1"] span:nth-child(10) { animation-delay: 360ms; }
            .p-char-stagger[data-play="1"] span:nth-child(11) { animation-delay: 400ms; }
            @keyframes p-char-stagger-in {
                to { opacity: 1; transform: translateY(0); }
            }`,
        js: null,
    },
    {
        id: "underline-draw",
        title: "引かれる下線",
        titleEn: "Underline Draw",
        kind: "text",
        note: "見出しの下に線が左から引かれ、追いかけて文字色が深緑に変わります。強調したい一語に。",
        trigger: "replay",
        bg: "paper",
        tags: ["scaleX", "transform-origin"],
        html: `
            <p class="p-underline-draw">
                いちばん大事なのは<em>伝わること</em>
            </p>`,
        css: `
            /* 疑似要素の線を scaleX(0) から 1 へ伸ばす。
               transform-origin: left で「左から引かれる」向きが決まる */
            .p-underline-draw {
                font-family: "Noto Serif JP", serif;
                font-size: clamp(16px, 4.6cqw, 24px);
                font-weight: 600;
                line-height: 1.8;
                text-align: center;
                margin: 0;
            }
            .p-underline-draw em {
                position: relative;
                font-style: normal;
                color: #262624;
                transition: color 500ms ease 420ms;
                padding-bottom: 2px;
            }
            .p-underline-draw em::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 2px;
                background: #b85c3a;
                transform: scaleX(0);
                transform-origin: left center;
            }
            .p-underline-draw[data-play="1"] em::after {
                animation: p-underline-draw-line 620ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .p-underline-draw[data-play="1"] em {
                color: #1f3a2e;
            }
            @keyframes p-underline-draw-line {
                to { transform: scaleX(1); }
            }`,
        js: null,
    },
    {
        id: "gradient-sweep",
        title: "文字を横切る光",
        titleEn: "Gradient Sweep",
        kind: "text",
        note: "文字の内側だけをグラデーションが一度だけ通り抜けます。ロゴタイプや数字の見せ場に。",
        trigger: "replay",
        bg: "deep",
        tags: ["background-clip", "background-position"],
        html: `
            <p class="p-gradient-sweep">PORTFOLIO</p>`,
        css: `
            /* 文字の形で背景を切り抜き（background-clip: text）、
               その背景の位置を動かすことで「光が文字を横切る」ように見せる */
            .p-gradient-sweep {
                font-family: "DM Sans", sans-serif;
                font-size: clamp(20px, 7cqw, 40px);
                font-weight: 600;
                letter-spacing: 0.14em;
                margin: 0;
                background-image: linear-gradient(
                    100deg,
                    #f4eede 0%,
                    #f4eede 38%,
                    #d99478 50%,
                    #f4eede 62%,
                    #f4eede 100%
                );
                background-size: 300% 100%;
                background-position: 100% 0;
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
            .p-gradient-sweep[data-play="1"] {
                animation: p-gradient-sweep-move 1500ms ease-in-out forwards;
            }
            @keyframes p-gradient-sweep-move {
                to { background-position: -60% 0; }
            }`,
        js: null,
    },
    {
        id: "typing-caret",
        title: "打ち込まれる文字",
        titleEn: "Typing Caret",
        kind: "text",
        note: "文字が一字ずつ打ち込まれ、カーソルが点滅します。肩書きや職種の紹介に。",
        trigger: "loop",
        bg: "deep",
        tags: ["steps()", "ch"],
        html: `
            <p class="p-typing-caret"><span>Frontend Engineer</span></p>`,
        css: `
            /* 文字幅の単位 ch と steps() を組み合わせると、
               幅を「1 文字ずつ」広げられる。文字数と steps の数を合わせるのが要
               （Frontend Engineer = 17 文字なので 17ch / steps(17)） */
            .p-typing-caret {
                font-family: "JetBrains Mono", monospace;
                font-size: clamp(12px, 4.6cqw, 18px);
                color: #f4eede;
                margin: 0;
            }
            .p-typing-caret span {
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                vertical-align: bottom;
                width: 0;
                border-right: 2px solid #d99478;
                animation:
                    p-typing-caret-type 4s steps(17) infinite,
                    p-typing-caret-blink 800ms step-end infinite;
            }
            @keyframes p-typing-caret-type {
                0%   { width: 0; }
                45%  { width: 17ch; }
                85%  { width: 17ch; }
                100% { width: 0; }
            }
            @keyframes p-typing-caret-blink {
                50% { border-color: transparent; }
            }`,
        js: null,
    },
    {
        id: "letter-spread",
        title: "広がる字間",
        titleEn: "Letter Spread",
        kind: "text",
        note: "触れると文字の間隔がゆっくり開きます。ロゴタイプやセクション見出しに一手間。",
        trigger: "hover",
        bg: "paper",
        tags: ["letter-spacing", "transition"],
        html: `
            <p class="p-letter-spread">PORTFOLIO</p>`,
        css: `
            /* letter-spacing はアニメーションできるプロパティ。
               広がる向きが片側に寄らないよう、中央揃えで使う */
            .p-letter-spread {
                font-family: "DM Sans", sans-serif;
                font-size: clamp(15px, 5cqw, 24px);
                font-weight: 600;
                letter-spacing: 0.1em;
                color: #1f3a2e;
                text-align: center;
                margin: 0;
                cursor: default;
                transition:
                    letter-spacing 520ms cubic-bezier(0.16, 1, 0.3, 1),
                    color 520ms ease;
            }
            .p-letter-spread:hover,
            .p-letter-spread.is-hover {
                letter-spacing: 0.36em;
                color: #b85c3a;
            }`,
        js: null,
    },

    /* ========================= Button ========================= */
    {
        id: "btn-fill",
        title: "流れ込むボタン",
        titleEn: "Button Fill",
        kind: "button",
        note: "背景色が左端から流れ込み、文字色が入れ替わります。問い合わせボタンなどに。",
        trigger: "hover",
        bg: "paper",
        tags: ["::before", "scaleX"],
        html: `
            <button class="p-btn-fill" type="button">
                <span>お問い合わせ</span>
            </button>`,
        css: `
            /* 塗りは疑似要素で用意し、scaleX を 0 から 1 へ。
               文字は position:relative で塗りより前に出しておく */
            .p-btn-fill {
                position: relative;
                overflow: hidden;
                padding: 15px 34px;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.04em;
                color: #1f3a2e;
                background: transparent;
                border: 1px solid #1f3a2e;
                border-radius: 4px;
                cursor: pointer;
                transition: color 380ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-btn-fill::before {
                content: "";
                position: absolute;
                inset: 0;
                background: #1f3a2e;
                transform: scaleX(0);
                transform-origin: left center;
                transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-btn-fill span {
                position: relative;
            }
            .p-btn-fill:hover::before,
            .p-btn-fill.is-hover::before {
                transform: scaleX(1);
            }
            .p-btn-fill:hover,
            .p-btn-fill.is-hover {
                color: #f4eede;
            }`,
        js: null,
    },
    {
        id: "btn-arrow-slide",
        title: "矢印が入るボタン",
        titleEn: "Arrow Slide",
        kind: "button",
        note: "触れると文字が少し左へ詰め、空いたところに矢印が滑り込みます。次へ進む導線に。",
        trigger: "hover",
        bg: "paper",
        tags: ["translateX", "opacity"],
        html: `
            <button class="p-btn-arrow-slide" type="button">
                <span class="p-btn-arrow-slide__t">詳しく見る</span>
                <span class="p-btn-arrow-slide__a" aria-hidden="true">→</span>
            </button>`,
        css: `
            /* 矢印を既定で透明かつ左に寄せておき、hover で定位置へ。
               文字も同じ量だけ左へ動かすと、矢印が「割り込んだ」ように見える */
            .p-btn-arrow-slide {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 15px 30px;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 14px;
                font-weight: 500;
                color: #f4eede;
                background: #1f3a2e;
                border: 0;
                border-radius: 4px;
                cursor: pointer;
                overflow: hidden;
            }
            .p-btn-arrow-slide__t {
                transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-btn-arrow-slide__a {
                display: inline-block;
                opacity: 0;
                transform: translateX(-10px);
                transition:
                    opacity 320ms ease,
                    transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-btn-arrow-slide:hover .p-btn-arrow-slide__t,
            .p-btn-arrow-slide.is-hover .p-btn-arrow-slide__t {
                transform: translateX(-6px);
            }
            .p-btn-arrow-slide:hover .p-btn-arrow-slide__a,
            .p-btn-arrow-slide.is-hover .p-btn-arrow-slide__a {
                opacity: 1;
                transform: translateX(0);
            }`,
        js: null,
    },
    {
        id: "btn-press",
        title: "押し込めるボタン",
        titleEn: "Press Down",
        kind: "button",
        note: "厚みのある影が縮んで、実際に沈み込んだように見えます。押し心地を伝えたいときに。",
        trigger: "hover",
        bg: "kinari",
        tags: ["box-shadow", "translateY"],
        html: `
            <button class="p-btn-press" type="button">申し込む</button>`,
        css: `
            /* ぼかさない box-shadow は「厚み」として読める。
               沈む量と影の減り幅を同じ 3px に揃えると、底面が動かず接地して見える */
            .p-btn-press {
                padding: 15px 32px;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 14px;
                font-weight: 500;
                color: #ffffff;
                background: #b85c3a;
                border: 0;
                border-radius: 4px;
                cursor: pointer;
                box-shadow: 0 4px 0 #8f4429;
                transition:
                    transform 140ms ease,
                    box-shadow 140ms ease;
            }
            .p-btn-press:hover,
            .p-btn-press.is-hover {
                transform: translateY(3px);
                box-shadow: 0 1px 0 #8f4429;
            }`,
        js: null,
    },
    {
        id: "btn-loading",
        title: "送信中のボタン",
        titleEn: "Button Loading",
        kind: "button",
        note: "押したあと、ボタン自身がそのまま待ち状態になります。二重送信を防ぐ表示に。",
        trigger: "loop",
        bg: "paper",
        tags: ["border-radius", "rotate"],
        html: `
            <button class="p-btn-loading" type="button" disabled>
                <i aria-hidden="true"></i><span>送信中</span>
            </button>`,
        css: `
            /* 円の 1 辺だけ色を変えて回すと、それだけで輪のスピナーになる。
               ボタンの文字色を継承させるので、色違いのボタンにも流用できる */
            .p-btn-loading {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 15px 30px;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 14px;
                font-weight: 500;
                color: #f4eede;
                background: #1f3a2e;
                border: 0;
                border-radius: 4px;
                opacity: 0.9;
                cursor: progress;
            }
            .p-btn-loading i {
                width: 14px;
                height: 14px;
                border: 2px solid rgba(244, 238, 222, 0.3);
                border-top-color: currentColor;
                border-radius: 50%;
                animation: p-btn-loading-spin 800ms linear infinite;
            }
            @keyframes p-btn-loading-spin {
                to { transform: rotate(360deg); }
            }`,
        js: null,
    },

    /* ========================= Link ========================= */
    {
        id: "link-arrow",
        title: "伸びる矢印",
        titleEn: "Link Arrow",
        kind: "link",
        note: "矢印が右へ伸びながら、同時に下線が引かれます。テキストリンクを目立たせすぎずに。",
        trigger: "hover",
        bg: "paper",
        tags: ["::after", "transition"],
        html: `
            <a class="p-link-arrow" href="#0">
                制作物を見る
                <span class="p-link-arrow__arrow" aria-hidden="true"><i></i></span>
            </a>`,
        css: `
            /* 矢印の軸は高さ 1px の span を広げて作る。
               下線は疑似要素の width を 0 から 100% へ */
            .p-link-arrow {
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 15px;
                font-weight: 500;
                color: #1f3a2e;
                text-decoration: none;
                padding-bottom: 6px;
            }
            .p-link-arrow::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: 0;
                height: 1px;
                width: 0;
                background: #1f3a2e;
                transition: width 420ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-link-arrow:hover::after,
            .p-link-arrow.is-hover::after {
                width: 100%;
            }
            .p-link-arrow__arrow {
                position: relative;
                display: inline-block;
                width: 18px;
                height: 1px;
                background: #1f3a2e;
                transition: width 420ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            /* 穂先は正方形を 45 度回して 2 辺だけ残す */
            .p-link-arrow__arrow i {
                position: absolute;
                right: 0;
                top: 50%;
                width: 7px;
                height: 7px;
                border-top: 1px solid #1f3a2e;
                border-right: 1px solid #1f3a2e;
                transform: translateY(-50%) rotate(45deg);
            }
            .p-link-arrow:hover .p-link-arrow__arrow,
            .p-link-arrow.is-hover .p-link-arrow__arrow {
                width: 32px;
            }`,
        js: null,
    },
    {
        id: "link-underline-swap",
        title: "入れ替わる下線",
        titleEn: "Underline Swap",
        kind: "link",
        note: "下線が右へ抜けていき、入れ違いに左から新しい線が入ります。ナビの項目にも。",
        trigger: "hover",
        bg: "paper",
        tags: ["overflow", "translateX"],
        html: `
            <a class="p-link-underline-swap" href="#0">お知らせ一覧</a>`,
        css: `
            /* 線を 2 本用意し、片方を外へ逃がしながらもう片方を入れる。
               遅延を付けないのが要で、同時に動くから「入れ違い」に見える */
            .p-link-underline-swap {
                position: relative;
                display: inline-block;
                overflow: hidden;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 15px;
                font-weight: 500;
                color: #1f3a2e;
                text-decoration: none;
                padding-bottom: 6px;
            }
            .p-link-underline-swap::before,
            .p-link-underline-swap::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 1px;
                background: #1f3a2e;
                transition: transform 460ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-link-underline-swap::after {
                transform: translateX(-100%);
            }
            .p-link-underline-swap:hover::before,
            .p-link-underline-swap.is-hover::before {
                transform: translateX(100%);
            }
            .p-link-underline-swap:hover::after,
            .p-link-underline-swap.is-hover::after {
                transform: translateX(0);
            }`,
        js: null,
    },
    {
        id: "link-marker",
        title: "引かれるマーカー",
        titleEn: "Marker Highlight",
        kind: "link",
        note: "蛍光ペンで塗ったような帯が、文字の下半分に広がります。本文中の重要な導線に。",
        trigger: "hover",
        bg: "kinari",
        tags: ["scaleX", "opacity"],
        html: `
            <a class="p-link-marker" href="#0"><span>資料をダウンロード</span></a>`,
        css: `
            /* 帯は文字の下半分にだけ重ねる。半透明にすると
               インクが乗ったように見え、文字も潰れない */
            .p-link-marker {
                position: relative;
                display: inline-block;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 15px;
                font-weight: 500;
                color: #262624;
                text-decoration: none;
                padding: 0 4px;
            }
            .p-link-marker::before {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 2px;
                height: 9px;
                background: #d99478;
                opacity: 0.6;
                transform: scaleX(0);
                transform-origin: left center;
                transition: transform 480ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-link-marker span {
                position: relative;
            }
            .p-link-marker:hover::before,
            .p-link-marker.is-hover::before {
                transform: scaleX(1);
            }`,
        js: null,
    },

    /* ========================= Image ========================= */
    {
        id: "image-shutter",
        title: "開くシャッター",
        titleEn: "Image Shutter",
        kind: "image",
        note: "写真にかぶさった板が斜めに滑って抜け、中身が現れます。ギャラリーのサムネイルに。",
        trigger: "hover",
        bg: "kinari",
        tags: ["clip-path", "transform"],
        html: `
            <figure class="p-image-shutter">
                <div class="p-image-shutter__photo"></div>
                <span class="p-image-shutter__blind"></span>
                <figcaption>Lily nail</figcaption>
            </figure>`,
        css: `
            /* 覆いを clip-path で斜めに切り、hover で枠の外へ滑らせる。
               写真部分はサンプルなのでグラデーションで代用している */
            .p-image-shutter {
                position: relative;
                width: 100%;
                max-width: 240px;
                margin: 0;
                overflow: hidden;
                border-radius: 4px;
            }
            .p-image-shutter__photo {
                aspect-ratio: 4 / 3;
                background:
                    radial-gradient(circle at 30% 30%, #d99478 0%, transparent 55%),
                    linear-gradient(140deg, #5a6a4d 0%, #1f3a2e 100%);
            }
            .p-image-shutter__blind {
                position: absolute;
                inset: 0;
                background: #f4eede;
                clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                transform: translateX(0);
                transition: transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-image-shutter:hover .p-image-shutter__blind,
            .p-image-shutter.is-hover .p-image-shutter__blind {
                /* 右上がりに切った覆いを、右へ完全に逃がす */
                clip-path: polygon(18% 0, 100% 0, 100% 100%, 0 100%);
                transform: translateX(104%);
            }
            .p-image-shutter figcaption {
                position: absolute;
                left: 14px;
                bottom: 12px;
                font-family: "DM Sans", sans-serif;
                font-size: 12px;
                letter-spacing: 0.1em;
                color: #f4eede;
                opacity: 0;
                transform: translateY(6px);
                transition:
                    opacity 420ms ease 220ms,
                    transform 420ms cubic-bezier(0.16, 1, 0.3, 1) 220ms;
            }
            .p-image-shutter:hover figcaption,
            .p-image-shutter.is-hover figcaption {
                opacity: 1;
                transform: translateY(0);
            }`,
        js: null,
    },
    {
        id: "image-zoom-frame",
        title: "枠は動かずズーム",
        titleEn: "Zoom In Frame",
        kind: "image",
        note: "枠の大きさはそのままに、中の写真だけがゆっくり寄ります。一覧の整列を崩さずに動きを足せます。",
        trigger: "hover",
        bg: "paper",
        tags: ["overflow", "scale"],
        html: `
            <figure class="p-image-zoom-frame">
                <div class="p-image-zoom-frame__photo"></div>
            </figure>`,
        css: `
            /* 拡大するのは中身だけ。枠側の overflow: hidden がはみ出しを切るので、
               グリッドの整列が一切崩れない */
            .p-image-zoom-frame {
                width: 100%;
                max-width: 240px;
                margin: 0;
                overflow: hidden;
                border-radius: 4px;
            }
            .p-image-zoom-frame__photo {
                aspect-ratio: 4 / 3;
                background:
                    radial-gradient(circle at 70% 25%, #d99478 0%, transparent 50%),
                    linear-gradient(200deg, #5a6a4d 0%, #15291f 100%);
                transform: scale(1);
                transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-image-zoom-frame:hover .p-image-zoom-frame__photo,
            .p-image-zoom-frame.is-hover .p-image-zoom-frame__photo {
                transform: scale(1.12);
            }`,
        js: null,
    },
    {
        id: "image-split-reveal",
        title: "上下に割れて開く",
        titleEn: "Split Reveal",
        kind: "image",
        note: "写真を覆う板が上下に分かれて逃げ、中身が現れます。実績の一枚目を印象づけたいときに。",
        trigger: "replay",
        bg: "kinari",
        tags: ["@keyframes", "translateY"],
        html: `
            <figure class="p-image-split-reveal">
                <div class="p-image-split-reveal__photo"></div>
                <span class="p-image-split-reveal__half p-image-split-reveal__half--t"></span>
                <span class="p-image-split-reveal__half p-image-split-reveal__half--b"></span>
            </figure>`,
        css: `
            /* 覆いを上下 2 枚に分け、それぞれ反対向きに逃がす。
               1 枚で消すより「開いた」感じが出る */
            .p-image-split-reveal {
                position: relative;
                width: 100%;
                max-width: 240px;
                margin: 0;
                overflow: hidden;
                border-radius: 4px;
            }
            .p-image-split-reveal__photo {
                aspect-ratio: 4 / 3;
                background:
                    radial-gradient(circle at 50% 80%, #b85c3a 0%, transparent 55%),
                    linear-gradient(160deg, #1f3a2e 0%, #15291f 100%);
            }
            .p-image-split-reveal__half {
                position: absolute;
                left: 0;
                width: 100%;
                height: 50%;
                background: #f4eede;
            }
            .p-image-split-reveal__half--t { top: 0; }
            .p-image-split-reveal__half--b { bottom: 0; }
            .p-image-split-reveal[data-play="1"] .p-image-split-reveal__half--t {
                animation: p-image-split-reveal-up 760ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .p-image-split-reveal[data-play="1"] .p-image-split-reveal__half--b {
                animation: p-image-split-reveal-down 760ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes p-image-split-reveal-up   { to { transform: translateY(-100%); } }
            @keyframes p-image-split-reveal-down { to { transform: translateY(100%); } }`,
        js: null,
    },
    {
        id: "image-duotone",
        title: "触れて色がつく",
        titleEn: "Duotone Fade",
        kind: "image",
        note: "白黒で並べておき、触れたものだけ色が戻ります。写真点数が多い一覧で視線を導けます。",
        trigger: "hover",
        bg: "paper",
        tags: ["filter", "grayscale"],
        html: `
            <figure class="p-image-duotone">
                <div class="p-image-duotone__photo"></div>
            </figure>`,
        css: `
            /* filter は複数つなげられる。彩度を少し上げ気味に戻すと、
               白黒からの復帰が「点いた」ように見える */
            .p-image-duotone {
                width: 100%;
                max-width: 240px;
                margin: 0;
                overflow: hidden;
                border-radius: 4px;
            }
            .p-image-duotone__photo {
                aspect-ratio: 4 / 3;
                background:
                    radial-gradient(circle at 25% 70%, #d99478 0%, transparent 55%),
                    linear-gradient(120deg, #5a6a4d 0%, #1f3a2e 100%);
                filter: grayscale(1) contrast(1.1);
                transition: filter 620ms ease;
            }
            .p-image-duotone:hover .p-image-duotone__photo,
            .p-image-duotone.is-hover .p-image-duotone__photo {
                filter: grayscale(0) saturate(1.15);
            }`,
        js: null,
    },

    /* ========================= Card ========================= */
    {
        id: "card-lift",
        title: "浮き上がるカード",
        titleEn: "Card Lift",
        kind: "card",
        note: "カードがわずかに浮き、影が伸び、枠線が濃くなります。一覧のカードすべてに効きます。",
        trigger: "hover",
        bg: "kinari",
        tags: ["transform", "box-shadow"],
        html: `
            <div class="p-card-lift">
                <p class="p-card-lift__cat">Landing Page</p>
                <p class="p-card-lift__title">こむぎの時間</p>
                <p class="p-card-lift__note">小さなまちのパン屋さん</p>
            </div>`,
        css: `
            /* .is-hover は「触れた状態」を指で再現するための予備クラス。
               タッチ端末には :hover が無いので二重に指定しておく */
            .p-card-lift {
                width: 100%;
                max-width: 240px;
                padding: 22px;
                background: #fbf8f0;
                border: 1px solid #dbd5c5;
                border-radius: 4px;
                box-shadow: 0 2px 6px rgba(38, 38, 36, 0.05);
                transition:
                    transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
                    box-shadow 420ms cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 420ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-card-lift:hover,
            .p-card-lift.is-hover {
                transform: translateY(-6px);
                box-shadow: 0 16px 32px rgba(38, 38, 36, 0.16);
                border-color: #1f3a2e;
            }
            .p-card-lift__cat {
                font-family: "DM Sans", sans-serif;
                font-size: 10px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: #1f3a2e;
                margin: 0 0 10px;
            }
            .p-card-lift__title {
                font-family: "Noto Serif JP", serif;
                font-size: 18px;
                font-weight: 600;
                color: #262624;
                margin: 0 0 6px;
            }
            .p-card-lift__note {
                font-size: 12px;
                color: #5a5a55;
                margin: 0;
            }`,
        js: null,
    },
    {
        id: "card-border-draw",
        title: "描かれる枠線",
        titleEn: "Border Draw",
        kind: "card",
        note: "枠線が角から二手に分かれて、カードの四辺を描いていきます。影を使わず精密に見せたいときに。",
        trigger: "hover",
        bg: "paper",
        tags: ["::before", "scaleX / scaleY"],
        html: `
            <div class="p-card-border-draw">
                <p class="p-card-border-draw__title">保守・改善の伴走</p>
                <p class="p-card-border-draw__note">公開したあとも、毎月すこしずつ良くしていきます。</p>
            </div>`,
        css: `
            /* 疑似要素 2 つに「上＋右」「下＋左」を持たせ、
               scaleX と scaleY を時間差で効かせると線が角を曲がって進む */
            .p-card-border-draw {
                position: relative;
                width: 100%;
                max-width: 240px;
                padding: 22px;
                background: #fbf8f0;
                border: 1px solid #dbd5c5;
            }
            .p-card-border-draw::before,
            .p-card-border-draw::after {
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                border: 1px solid #1f3a2e;
                transition: transform 320ms linear;
            }
            .p-card-border-draw::before {
                top: -1px;
                left: -1px;
                border-right-color: transparent;
                border-bottom-color: transparent;
                transform: scaleX(0);
                transform-origin: left top;
            }
            .p-card-border-draw::after {
                bottom: -1px;
                right: -1px;
                border-top-color: transparent;
                border-left-color: transparent;
                transform: scaleY(0);
                transform-origin: right bottom;
            }
            .p-card-border-draw:hover::before,
            .p-card-border-draw.is-hover::before {
                transform: scaleX(1);
            }
            .p-card-border-draw:hover::after,
            .p-card-border-draw.is-hover::after {
                transform: scaleY(1);
                transition-delay: 320ms;
            }
            .p-card-border-draw__title {
                font-family: "Noto Serif JP", serif;
                font-size: 16px;
                font-weight: 600;
                color: #262624;
                margin: 0 0 8px;
            }
            .p-card-border-draw__note {
                font-size: 12px;
                line-height: 1.8;
                color: #5a5a55;
                margin: 0;
            }`,
        js: null,
    },
    {
        id: "card-stack-in",
        title: "重なって差し込まれる",
        titleEn: "Stack In",
        kind: "card",
        note: "カードが少しずつ遅れて、奥から手前に差し込まれます。一覧の初回表示に。",
        trigger: "replay",
        bg: "kinari",
        tags: ["animation-delay", "scale"],
        html: `
            <div class="p-card-stack-in">
                <span class="p-card-stack-in__c"></span>
                <span class="p-card-stack-in__c"></span>
                <span class="p-card-stack-in__c"></span>
            </div>`,
        css: `
            /* 拡大と上げを同時にかけると「奥から手前へ」に読める。
               遅延の差は 90ms 程度が、速すぎず待たされずのちょうど良さ */
            .p-card-stack-in {
                display: flex;
                gap: 10px;
                width: 100%;
                max-width: 240px;
            }
            .p-card-stack-in__c {
                flex: 1 1 0;
                aspect-ratio: 3 / 4;
                background: #fbf8f0;
                border: 1px solid #dbd5c5;
                opacity: 0;
                transform: translateY(16px) scale(0.94);
            }
            .p-card-stack-in[data-play="1"] .p-card-stack-in__c {
                animation: p-card-stack-in-pop 640ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .p-card-stack-in[data-play="1"] .p-card-stack-in__c:nth-child(2) { animation-delay: 90ms; }
            .p-card-stack-in[data-play="1"] .p-card-stack-in__c:nth-child(3) { animation-delay: 180ms; }
            @keyframes p-card-stack-in-pop {
                to { opacity: 1; transform: translateY(0) scale(1); }
            }`,
        js: null,
    },
    {
        id: "card-flip",
        title: "裏返るカード",
        titleEn: "Card Flip",
        kind: "card",
        note: "触れると回転して、裏面の情報が出ます。料金や仕様など、必要な人にだけ見せたい中身に。",
        trigger: "hover",
        bg: "paper",
        tags: ["rotateY", "backface-visibility"],
        html: `
            <div class="p-card-flip">
                <div class="p-card-flip__inner">
                    <div class="p-card-flip__face p-card-flip__face--front">LP 制作</div>
                    <div class="p-card-flip__face p-card-flip__face--back">1 ページ / 2 週間〜</div>
                </div>
            </div>`,
        css: `
            /* 親に perspective、回す箱に transform-style: preserve-3d。
               裏面は最初から 180 度回しておき、backface-visibility で
               「そのとき見えていない側」を隠す */
            .p-card-flip {
                width: 100%;
                max-width: 200px;
                aspect-ratio: 3 / 2;
                perspective: 800px;
            }
            .p-card-flip__inner {
                position: relative;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                transition: transform 720ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-card-flip:hover .p-card-flip__inner,
            .p-card-flip.is-hover .p-card-flip__inner {
                transform: rotateY(180deg);
            }
            .p-card-flip__face {
                position: absolute;
                inset: 0;
                display: grid;
                place-items: center;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 14px;
                font-weight: 500;
                border: 1px solid #dbd5c5;
            }
            .p-card-flip__face--front {
                background: #fbf8f0;
                color: #262624;
            }
            .p-card-flip__face--back {
                background: #1f3a2e;
                color: #f4eede;
                border-color: #1f3a2e;
                transform: rotateY(180deg);
            }`,
        js: null,
    },

    /* ========================= Nav ========================= */
    {
        id: "burger-x",
        title: "×に変わる三本線",
        titleEn: "Burger to X",
        kind: "nav",
        note: "メニューボタンの三本線が、回転しながら×印に組み替わります。スマートフォンのナビに必須。",
        trigger: "hover",
        bg: "deep",
        tags: ["rotate", "translateY"],
        html: `
            <button class="p-burger-x" type="button" aria-label="メニュー">
                <span></span><span></span><span></span>
            </button>`,
        css: `
            /* 上下の線を中央へ寄せてから回し、真ん中の線は消す。
               寄せる量（7px）は線の間隔と厚みから決まる */
            .p-burger-x {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 5px;
                width: 48px;
                height: 48px;
                background: transparent;
                border: 1px solid rgba(244, 238, 222, 0.3);
                cursor: pointer;
            }
            .p-burger-x span {
                display: block;
                width: 22px;
                height: 2px;
                background: #f4eede;
                transition:
                    transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
                    opacity 200ms ease;
            }
            .p-burger-x:hover span:nth-child(1),
            .p-burger-x.is-hover span:nth-child(1) {
                transform: translateY(7px) rotate(45deg);
            }
            .p-burger-x:hover span:nth-child(2),
            .p-burger-x.is-hover span:nth-child(2) {
                opacity: 0;
            }
            .p-burger-x:hover span:nth-child(3),
            .p-burger-x.is-hover span:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg);
            }`,
        js: null,
    },
    {
        id: "drawer-slide",
        title: "横から出るメニュー",
        titleEn: "Drawer Slide",
        kind: "nav",
        note: "画面の右端からメニュー板が滑り出し、背景がうっすら暗くなります。スマートフォンの全画面メニューに。",
        trigger: "replay",
        bg: "paper",
        tags: ["translateX", "@keyframes"],
        html: `
            <div class="p-drawer-slide">
                <span class="p-drawer-slide__scrim"></span>
                <div class="p-drawer-slide__panel">
                    <span></span><span></span><span></span>
                </div>
            </div>`,
        css: `
            /* 板と暗幕を別々に動かす。暗幕を先に出すと
               「板が幕の上に乗って出てくる」順序が伝わる */
            .p-drawer-slide {
                position: relative;
                width: 100%;
                max-width: 240px;
                aspect-ratio: 4 / 3;
                background: #fbf8f0;
                border: 1px solid #dbd5c5;
                overflow: hidden;
            }
            .p-drawer-slide__scrim {
                position: absolute;
                inset: 0;
                background: rgba(21, 41, 31, 0.45);
                opacity: 0;
            }
            .p-drawer-slide__panel {
                position: absolute;
                top: 0;
                right: 0;
                width: 62%;
                height: 100%;
                padding: 18px 16px;
                background: #15291f;
                transform: translateX(100%);
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .p-drawer-slide__panel span {
                display: block;
                height: 7px;
                background: rgba(244, 238, 222, 0.55);
            }
            .p-drawer-slide__panel span:nth-child(2) { width: 78%; }
            .p-drawer-slide__panel span:nth-child(3) { width: 56%; }
            .p-drawer-slide[data-play="1"] .p-drawer-slide__scrim {
                animation: p-drawer-slide-fade 2600ms ease forwards;
            }
            .p-drawer-slide[data-play="1"] .p-drawer-slide__panel {
                animation: p-drawer-slide-in 2600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes p-drawer-slide-fade {
                0% { opacity: 0; } 18% { opacity: 1; }
                75% { opacity: 1; } 100% { opacity: 0; }
            }
            @keyframes p-drawer-slide-in {
                0% { transform: translateX(100%); } 22% { transform: translateX(0); }
                72% { transform: translateX(0); } 100% { transform: translateX(100%); }
            }`,
        js: null,
    },
    {
        id: "nav-link-stagger",
        title: "順に出るメニュー項目",
        titleEn: "Nav Stagger",
        kind: "nav",
        note: "メニューを開いたあと、項目が上から順に流れ込みます。全画面メニューの中身に添えると印象が変わります。",
        trigger: "replay",
        bg: "deep",
        tags: ["animation-delay", "translateX"],
        html: `
            <ul class="p-nav-link-stagger">
                <li>About</li><li>Services</li><li>Works</li><li>Contact</li>
            </ul>`,
        css: `
            /* 横から入れると、縦積みのメニューでは項目の順序が読みやすい。
               遅延は 70ms ずつ。合計 280ms なら待たされた感じにならない */
            .p-nav-link-stagger {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: 100%;
                max-width: 180px;
            }
            .p-nav-link-stagger li {
                font-family: "DM Sans", sans-serif;
                font-size: 15px;
                color: #f4eede;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(244, 238, 222, 0.18);
                opacity: 0;
                transform: translateX(-18px);
            }
            .p-nav-link-stagger[data-play="1"] li {
                animation: p-nav-link-stagger-in 560ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .p-nav-link-stagger[data-play="1"] li:nth-child(2) { animation-delay: 70ms; }
            .p-nav-link-stagger[data-play="1"] li:nth-child(3) { animation-delay: 140ms; }
            .p-nav-link-stagger[data-play="1"] li:nth-child(4) { animation-delay: 210ms; }
            @keyframes p-nav-link-stagger-in {
                to { opacity: 1; transform: translateX(0); }
            }`,
        js: null,
    },

    /* ========================= Panel ========================= */
    {
        id: "accordion-smooth",
        title: "なめらかな開閉",
        titleEn: "Smooth Accordion",
        kind: "panel",
        note: "高さを決め打ちせずに開閉できます。中身の量が変わるよくある質問でも、動きが崩れません。",
        trigger: "replay",
        bg: "paper",
        tags: ["grid-template-rows", "0fr"],
        html: `
            <div class="p-accordion-smooth">
                <p class="p-accordion-smooth__q">対応エリアは？</p>
                <div class="p-accordion-smooth__wrap">
                    <div class="p-accordion-smooth__inner">
                        <p>オンラインで完結するため全国対応しています。東京近郊であれば対面での打ち合わせも可能です。</p>
                    </div>
                </div>
            </div>`,
        css: `
            /* height: auto はアニメーションできないが、
               grid の行を 0fr から 1fr へ変えると中身の高さのまま滑らかに開く。
               子に overflow: hidden を置くのが要 */
            .p-accordion-smooth {
                width: 100%;
                max-width: 260px;
                padding: 18px 20px;
                background: #fbf8f0;
                border: 1px solid #dbd5c5;
            }
            .p-accordion-smooth__q {
                font-family: "Noto Serif JP", serif;
                font-size: 15px;
                font-weight: 600;
                color: #262624;
                margin: 0;
            }
            .p-accordion-smooth__wrap {
                display: grid;
                grid-template-rows: 0fr;
            }
            .p-accordion-smooth__inner {
                overflow: hidden;
                min-height: 0;
            }
            .p-accordion-smooth__inner p {
                font-size: 12.5px;
                line-height: 1.9;
                color: #5a5a55;
                margin: 12px 0 0;
            }
            .p-accordion-smooth[data-play="1"] .p-accordion-smooth__wrap {
                animation: p-accordion-smooth-open 3200ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes p-accordion-smooth-open {
                0%   { grid-template-rows: 0fr; }
                22%  { grid-template-rows: 1fr; }
                78%  { grid-template-rows: 1fr; }
                100% { grid-template-rows: 0fr; }
            }`,
        js: null,
    },
    {
        id: "modal-scale-in",
        title: "立ち上がるダイアログ",
        titleEn: "Modal Scale In",
        kind: "panel",
        note: "背景が沈み、確認ダイアログがわずかに拡大しながら現れます。削除確認や申し込みの最終確認に。",
        trigger: "replay",
        bg: "kinari",
        tags: ["scale", "backdrop"],
        html: `
            <div class="p-modal-scale-in">
                <span class="p-modal-scale-in__scrim"></span>
                <div class="p-modal-scale-in__box">
                    <p>この内容で送信しますか？</p>
                    <span class="p-modal-scale-in__btn"></span>
                </div>
            </div>`,
        css: `
            /* 0.92 → 1 のごく小さな拡大で十分。大きく跳ねさせると
               確認ダイアログの落ち着きが失われる */
            .p-modal-scale-in {
                position: relative;
                display: grid;
                place-items: center;
                width: 100%;
                max-width: 240px;
                aspect-ratio: 4 / 3;
                background: #fbf8f0;
                border: 1px solid #dbd5c5;
                overflow: hidden;
            }
            .p-modal-scale-in__scrim {
                position: absolute;
                inset: 0;
                background: rgba(21, 41, 31, 0.5);
                opacity: 0;
            }
            .p-modal-scale-in__box {
                position: relative;
                width: 74%;
                padding: 16px;
                background: #ffffff;
                border: 1px solid #dbd5c5;
                text-align: center;
                opacity: 0;
                transform: scale(0.92);
            }
            .p-modal-scale-in__box p {
                font-size: 12px;
                color: #262624;
                margin: 0 0 12px;
            }
            .p-modal-scale-in__btn {
                display: block;
                height: 24px;
                background: #1f3a2e;
            }
            .p-modal-scale-in[data-play="1"] .p-modal-scale-in__scrim {
                animation: p-modal-scale-in-scrim 3000ms ease forwards;
            }
            .p-modal-scale-in[data-play="1"] .p-modal-scale-in__box {
                animation: p-modal-scale-in-box 3000ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes p-modal-scale-in-scrim {
                0% { opacity: 0; } 15% { opacity: 1; }
                80% { opacity: 1; } 100% { opacity: 0; }
            }
            @keyframes p-modal-scale-in-box {
                0%   { opacity: 0; transform: scale(0.92); }
                20%  { opacity: 1; transform: scale(1); }
                80%  { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.96); }
            }`,
        js: null,
    },
    {
        id: "tooltip-pop",
        title: "浮き出る吹き出し",
        titleEn: "Tooltip Pop",
        kind: "panel",
        note: "触れると補足が真上に浮き出ます。用語の説明や、入力欄の注意書きに。",
        trigger: "hover",
        bg: "paper",
        tags: ["::after", "translateY"],
        html: `
            <span class="p-tooltip-pop" tabindex="0">
                初期費用
                <span class="p-tooltip-pop__tip" role="tooltip">制作にかかる一度きりの費用です</span>
            </span>`,
        css: `
            /* 吹き出しは position: absolute + bottom 100% で真上に。
               left:50% と translateX(-50%) の組み合わせで中央に揃う */
            .p-tooltip-pop {
                position: relative;
                display: inline-block;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 14px;
                color: #262624;
                border-bottom: 1px dotted #a89e88;
                cursor: help;
            }
            .p-tooltip-pop__tip {
                position: absolute;
                bottom: 100%;
                left: 50%;
                margin-bottom: 10px;
                width: max-content;
                max-width: 180px;
                padding: 7px 11px;
                background: #15291f;
                color: #f4eede;
                font-size: 11px;
                line-height: 1.6;
                opacity: 0;
                transform: translateX(-50%) translateY(6px);
                pointer-events: none;
                transition:
                    opacity 260ms ease,
                    transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            /* 下向きの三角は、正方形を 45 度回して半分だけ覗かせる */
            .p-tooltip-pop__tip::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                width: 8px;
                height: 8px;
                margin: -4px 0 0 -4px;
                background: #15291f;
                transform: rotate(45deg);
            }
            .p-tooltip-pop:hover .p-tooltip-pop__tip,
            .p-tooltip-pop:focus-visible .p-tooltip-pop__tip,
            .p-tooltip-pop.is-hover .p-tooltip-pop__tip {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }`,
        js: null,
    },

    /* ========================= Form ========================= */
    {
        id: "label-float",
        title: "持ち上がるラベル",
        titleEn: "Floating Label",
        kind: "form",
        note: "入力欄に触れるとラベルが枠の上へ移り、小さくなります。項目名を消さずに欄を広く使えます。",
        trigger: "hover",
        bg: "paper",
        tags: [":focus-within", "translateY"],
        html: `
            <div class="p-label-float">
                <input id="p-label-float-i" type="text" placeholder=" " />
                <label for="p-label-float-i">お名前</label>
            </div>`,
        css: `
            /* :focus-within は「自分か子孫にフォーカスがある」状態。
               placeholder-shown を併用すると、入力済みならラベルを上げたままにできる */
            .p-label-float {
                position: relative;
                width: 100%;
                max-width: 240px;
            }
            .p-label-float input {
                width: 100%;
                padding: 16px 12px 8px;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 14px;
                color: #262624;
                background: #ffffff;
                border: 1px solid #dbd5c5;
                border-radius: 3px;
            }
            .p-label-float input:focus {
                outline: none;
                border-color: #1f3a2e;
            }
            .p-label-float label {
                position: absolute;
                left: 13px;
                top: 14px;
                font-size: 14px;
                color: #8a857a;
                pointer-events: none;
                transition:
                    transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
                    font-size 260ms ease,
                    color 260ms ease;
            }
            .p-label-float:hover label,
            .p-label-float:focus-within label,
            .p-label-float.is-hover label,
            .p-label-float input:not(:placeholder-shown) + label {
                transform: translateY(-9px);
                font-size: 10px;
                color: #1f3a2e;
            }`,
        js: null,
    },
    {
        id: "checkbox-check",
        title: "描かれるチェック",
        titleEn: "Check Draw",
        kind: "form",
        note: "四角が塗られ、そのあとチェックの線が引かれます。同意欄や絞り込みの選択に。",
        trigger: "hover",
        bg: "paper",
        tags: ["SVG", "stroke-dashoffset"],
        html: `
            <span class="p-checkbox-check">
                <span class="p-checkbox-check__box">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5 L8.5 15 L16 6" /></svg>
                </span>
                <span class="p-checkbox-check__label">利用規約に同意する</span>
            </span>`,
        css: `
            /* 線の長さぶんの破線を作り（dasharray）、
               開始位置（dashoffset）を 0 へ動かすと線が描かれていく。
               22 は M→L→L の道のりのおおよその長さ */
            .p-checkbox-check {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 13px;
                color: #262624;
                cursor: pointer;
            }
            .p-checkbox-check__box {
                display: grid;
                place-items: center;
                width: 22px;
                height: 22px;
                background: #ffffff;
                border: 1px solid #a89e88;
                border-radius: 3px;
                transition:
                    background 260ms ease,
                    border-color 260ms ease;
            }
            .p-checkbox-check__box svg {
                width: 15px;
                height: 15px;
                fill: none;
                stroke: #f4eede;
                stroke-width: 2.4;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-dasharray: 22;
                stroke-dashoffset: 22;
                transition: stroke-dashoffset 320ms ease 120ms;
            }
            .p-checkbox-check:hover .p-checkbox-check__box,
            .p-checkbox-check.is-hover .p-checkbox-check__box {
                background: #1f3a2e;
                border-color: #1f3a2e;
            }
            .p-checkbox-check:hover .p-checkbox-check__box svg,
            .p-checkbox-check.is-hover .p-checkbox-check__box svg {
                stroke-dashoffset: 0;
            }`,
        js: null,
    },
    {
        id: "toggle-switch",
        title: "滑るスイッチ",
        titleEn: "Toggle Switch",
        kind: "form",
        note: "つまみが滑り、地の色が入れ替わります。設定のオン・オフや、料金プランの切り替えに。",
        trigger: "hover",
        bg: "kinari",
        tags: ["translateX", "border-radius"],
        html: `
            <span class="p-toggle-switch" role="switch" tabindex="0" aria-checked="false">
                <span class="p-toggle-switch__knob"></span>
            </span>`,
        css: `
            /* つまみの移動量は「軌道の幅 − つまみの幅 − 余白×2」。
               ここでは 52 − 20 − 3×2 = 26px */
            .p-toggle-switch {
                display: inline-block;
                position: relative;
                width: 52px;
                height: 26px;
                background: #a89e88;
                border-radius: 999px;
                cursor: pointer;
                transition: background 320ms ease;
            }
            .p-toggle-switch__knob {
                position: absolute;
                top: 3px;
                left: 3px;
                width: 20px;
                height: 20px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(38, 38, 36, 0.3);
                transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            .p-toggle-switch:hover,
            .p-toggle-switch.is-hover {
                background: #5a6a4d;
            }
            .p-toggle-switch:hover .p-toggle-switch__knob,
            .p-toggle-switch.is-hover .p-toggle-switch__knob {
                transform: translateX(26px);
            }`,
        js: null,
    },
    {
        id: "input-error-shake",
        title: "首を振るエラー",
        titleEn: "Error Shake",
        kind: "form",
        note: "入力欄が短く左右に振れ、赤い注記が出ます。どこが問題かを一瞬で伝えられます。",
        trigger: "replay",
        bg: "paper",
        tags: ["@keyframes", "translateX"],
        html: `
            <div class="p-input-error-shake">
                <span class="p-input-error-shake__field">yamada@</span>
                <span class="p-input-error-shake__msg">メールアドレスの形式が正しくありません</span>
            </div>`,
        css: `
            /* 揺れは 3 往復・振幅 5px 以内に留める。
               大きく振ると「壊れた」印象になり、指摘として読まれなくなる */
            .p-input-error-shake {
                width: 100%;
                max-width: 240px;
            }
            .p-input-error-shake__field {
                display: block;
                padding: 12px;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 13px;
                color: #262624;
                background: #ffffff;
                border: 1px solid #a13a2c;
                border-radius: 3px;
            }
            .p-input-error-shake__msg {
                display: block;
                margin-top: 7px;
                font-size: 11px;
                color: #a13a2c;
                opacity: 0;
            }
            .p-input-error-shake[data-play="1"] .p-input-error-shake__field {
                animation: p-input-error-shake-move 420ms ease-in-out;
            }
            .p-input-error-shake[data-play="1"] .p-input-error-shake__msg {
                animation: p-input-error-shake-msg 300ms ease 200ms forwards;
            }
            @keyframes p-input-error-shake-move {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-5px); }
                40% { transform: translateX(5px); }
                60% { transform: translateX(-3px); }
                80% { transform: translateX(3px); }
            }
            @keyframes p-input-error-shake-msg {
                to { opacity: 1; }
            }`,
        js: null,
    },

    /* ========================= Feedback ========================= */
    {
        id: "toast-slide",
        title: "滑り込む通知",
        titleEn: "Toast Slide",
        kind: "feedback",
        note: "画面のすみに通知が滑り込み、しばらくして自分で消えます。保存や送信の完了報告に。",
        trigger: "replay",
        bg: "deep",
        tags: ["@keyframes", "translateY"],
        html: `
            <div class="p-toast-slide">
                <span class="p-toast-slide__dot"></span>
                <span>送信が完了しました</span>
            </div>`,
        css: `
            /* 出る（0-12%）→ 留まる（12-80%）→ 消える（80-100%）を
               1 本の keyframes に畳む。JS でタイマーを持たなくてよくなる */
            .p-toast-slide {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 12px 18px;
                background: #fbf8f0;
                border-left: 3px solid #5a6a4d;
                font-family: "Noto Sans JP", sans-serif;
                font-size: 13px;
                color: #262624;
                box-shadow: 0 8px 24px rgba(9, 20, 15, 0.35);
                opacity: 0;
                transform: translateY(14px);
            }
            .p-toast-slide__dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #5a6a4d;
                flex-shrink: 0;
            }
            .p-toast-slide[data-play="1"] {
                animation: p-toast-slide-in 3400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes p-toast-slide-in {
                0%   { opacity: 0; transform: translateY(14px); }
                12%  { opacity: 1; transform: translateY(0); }
                80%  { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-8px); }
            }`,
        js: null,
    },
    {
        id: "success-check",
        title: "描かれる完了印",
        titleEn: "Success Check",
        kind: "feedback",
        note: "円が一周描かれ、続けてチェックが引かれます。申し込み完了ページの主役に。",
        trigger: "replay",
        bg: "paper",
        tags: ["SVG", "stroke-dasharray"],
        html: `
            <svg class="p-success-check" viewBox="0 0 52 52" role="img" aria-label="完了">
                <circle class="p-success-check__ring" cx="26" cy="26" r="23" />
                <path class="p-success-check__tick" d="M15 27 L23 35 L38 19" />
            </svg>`,
        css: `
            /* 円周は 2πr = 約 145、チェックの道のりは約 33。
               その長さぶんの破線を引いて dashoffset を 0 へ動かすと「描かれる」 */
            .p-success-check {
                width: 78px;
                height: 78px;
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            .p-success-check__ring {
                stroke: #5a6a4d;
                stroke-width: 2.5;
                stroke-dasharray: 145;
                stroke-dashoffset: 145;
            }
            .p-success-check__tick {
                stroke: #1f3a2e;
                stroke-width: 3.5;
                stroke-dasharray: 33;
                stroke-dashoffset: 33;
            }
            .p-success-check[data-play="1"] .p-success-check__ring {
                animation: p-success-check-draw 700ms ease forwards;
            }
            /* 円が閉じきってからチェックを始める */
            .p-success-check[data-play="1"] .p-success-check__tick {
                animation: p-success-check-draw 380ms ease 620ms forwards;
            }
            @keyframes p-success-check-draw {
                to { stroke-dashoffset: 0; }
            }`,
        js: null,
    },
    {
        id: "badge-pulse",
        title: "脈打つしるし",
        titleEn: "Badge Pulse",
        kind: "feedback",
        note: "点のまわりに輪が広がって消えます。稼働中・受付中といった「いま生きている」表示に。",
        trigger: "loop",
        bg: "deep",
        tags: ["scale", "opacity"],
        html: `
            <span class="p-badge-pulse">
                <span class="p-badge-pulse__dot"></span>
                <span class="p-badge-pulse__label">Available for projects</span>
            </span>`,
        css: `
            /* 広がる輪は疑似要素。点そのものは動かさないので、
               隣の文字がつられて揺れない */
            .p-badge-pulse {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                font-family: "DM Sans", sans-serif;
                font-size: 13px;
                letter-spacing: 0.04em;
                color: #f4eede;
            }
            .p-badge-pulse__dot {
                position: relative;
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: #d99478;
                flex-shrink: 0;
            }
            .p-badge-pulse__dot::after {
                content: "";
                position: absolute;
                inset: 0;
                border-radius: 50%;
                background: #d99478;
                animation: p-badge-pulse-ring 2000ms ease-out infinite;
            }
            @keyframes p-badge-pulse-ring {
                0%   { transform: scale(1);   opacity: 0.7; }
                100% { transform: scale(3.2); opacity: 0; }
            }`,
        js: null,
    },

    /* ========================= Loading ========================= */
    {
        id: "wave-dots",
        title: "波打つ三点",
        titleEn: "Wave Dots",
        kind: "loading",
        note: "三つの点が順番に沈んで浮きます。送信中・検索中のいちばん軽い合図に。",
        trigger: "loop",
        bg: "paper",
        tags: ["animation-delay", "infinite"],
        html: `
            <div class="p-wave-dots" role="status" aria-label="読み込み中">
                <i></i><i></i><i></i>
            </div>`,
        css: `
            /* 同じアニメーションを、遅延だけずらして 3 つに配ると波になる */
            .p-wave-dots {
                display: flex;
                gap: 10px;
            }
            .p-wave-dots i {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #1f3a2e;
                animation: p-wave-dots-bounce 1200ms ease-in-out infinite;
            }
            .p-wave-dots i:nth-child(2) { animation-delay: 160ms; }
            .p-wave-dots i:nth-child(3) { animation-delay: 320ms; }
            @keyframes p-wave-dots-bounce {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
                30% { transform: translateY(-10px); opacity: 1; }
            }`,
        js: null,
    },
    {
        id: "ink-ring",
        title: "描かれる円弧",
        titleEn: "Ink Ring",
        kind: "loading",
        note: "一本の線が回りながら伸び縮みします。全画面の読み込み中に置いても品を落としません。",
        trigger: "loop",
        bg: "deep",
        tags: ["SVG", "stroke-dasharray"],
        html: `
            <svg class="p-ink-ring" viewBox="0 0 50 50" role="status" aria-label="読み込み中">
                <circle cx="25" cy="25" r="20" />
            </svg>`,
        css: `
            /* 破線の間隔（dasharray）と開始位置（dashoffset）を動かすと、
               線そのものが伸び縮みしているように見える。
               図形の回転と合わせて 2 つのアニメーションを重ねている */
            .p-ink-ring {
                width: 56px;
                height: 56px;
                animation: p-ink-ring-spin 2s linear infinite;
            }
            .p-ink-ring circle {
                fill: none;
                stroke: #f4eede;
                stroke-width: 2.5;
                stroke-linecap: round;
                stroke-dasharray: 90 126;
                animation: p-ink-ring-dash 1600ms ease-in-out infinite;
            }
            @keyframes p-ink-ring-spin {
                to { transform: rotate(360deg); }
            }
            @keyframes p-ink-ring-dash {
                0%   { stroke-dasharray: 10 116; stroke-dashoffset: 0; }
                50%  { stroke-dasharray: 90 36;  stroke-dashoffset: -20; }
                100% { stroke-dasharray: 10 116; stroke-dashoffset: -125; }
            }`,
        js: null,
    },
    {
        id: "skeleton-shimmer",
        title: "光が通る骨組み",
        titleEn: "Skeleton Shimmer",
        kind: "loading",
        note: "本文が入る場所を先に灰色で描き、光の帯を流します。読み込み中の画面がガタつきません。",
        trigger: "loop",
        bg: "paper",
        tags: ["linear-gradient", "background-position"],
        html: `
            <div class="p-skeleton-shimmer" role="status" aria-label="読み込み中">
                <div class="p-skeleton-shimmer__thumb"></div>
                <div class="p-skeleton-shimmer__line"></div>
                <div class="p-skeleton-shimmer__line p-skeleton-shimmer__line--short"></div>
            </div>`,
        css: `
            /* 「灰色の板」を作り、その背景に細い明色の帯を仕込んで
               background-position だけを動かす。要素は 1 枚も動かさない */
            .p-skeleton-shimmer {
                width: 100%;
                max-width: 240px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .p-skeleton-shimmer__thumb,
            .p-skeleton-shimmer__line {
                border-radius: 3px;
                background-color: #e6e0d0;
                background-image: linear-gradient(
                    100deg,
                    rgba(255, 255, 255, 0) 20%,
                    rgba(255, 255, 255, 0.75) 50%,
                    rgba(255, 255, 255, 0) 80%
                );
                background-size: 220% 100%;
                background-repeat: no-repeat;
                animation: p-skeleton-shimmer-move 1800ms linear infinite;
            }
            .p-skeleton-shimmer__thumb { aspect-ratio: 16 / 9; }
            .p-skeleton-shimmer__line { height: 12px; }
            .p-skeleton-shimmer__line--short { width: 60%; }
            @keyframes p-skeleton-shimmer-move {
                from { background-position: 140% 0; }
                to   { background-position: -40% 0; }
            }`,
        js: null,
    },
    {
        id: "progress-indeterminate",
        title: "終わりの見えない進捗",
        titleEn: "Indeterminate Bar",
        kind: "loading",
        note: "細い帯が伸び縮みしながら往復します。残り時間が読めない処理の待ち表示に。",
        trigger: "loop",
        bg: "kinari",
        tags: ["translateX", "scaleX"],
        html: `
            <div class="p-progress-indeterminate" role="status" aria-label="処理中">
                <span></span>
            </div>`,
        css: `
            /* 移動と伸縮を 1 本の keyframes にまとめる。
               端で縮むようにすると、行って戻る動きが不自然にならない */
            .p-progress-indeterminate {
                position: relative;
                width: 100%;
                max-width: 220px;
                height: 4px;
                background: #dbd5c5;
                overflow: hidden;
            }
            .p-progress-indeterminate span {
                position: absolute;
                inset: 0;
                background: #1f3a2e;
                transform-origin: left center;
                animation: p-progress-indeterminate-run 1900ms cubic-bezier(0.65, 0, 0.35, 1) infinite;
            }
            @keyframes p-progress-indeterminate-run {
                0%   { transform: translateX(-100%) scaleX(0.3); }
                50%  { transform: translateX(0)     scaleX(0.7); }
                100% { transform: translateX(100%)  scaleX(0.3); }
            }`,
        js: null,
    },
    {
        id: "spinner-square",
        title: "折り返す四角",
        titleEn: "Folding Square",
        kind: "loading",
        note: "四角が縦横に折り返しながら向きを変えます。回る輪に飽きたときの、もう一つの定番。",
        trigger: "loop",
        bg: "deep",
        tags: ["rotate", "border-radius"],
        html: `
            <div class="p-spinner-square" role="status" aria-label="読み込み中"></div>`,
        css: `
            /* 90 度ずつ 4 段階で回し、角の丸みも一緒に変える。
               同じ回転でも、丸みが動くと「折れている」ように見える */
            .p-spinner-square {
                width: 34px;
                height: 34px;
                border: 3px solid #f4eede;
                animation: p-spinner-square-fold 2400ms ease-in-out infinite;
            }
            @keyframes p-spinner-square-fold {
                0%   { transform: rotate(0deg);   border-radius: 2px; }
                25%  { transform: rotate(90deg);  border-radius: 50%; }
                50%  { transform: rotate(180deg); border-radius: 2px; }
                75%  { transform: rotate(270deg); border-radius: 50%; }
                100% { transform: rotate(360deg); border-radius: 2px; }
            }`,
        js: null,
    },

    /* ========================= Background ========================= */
    {
        id: "grain-drift",
        title: "流れる紙目",
        titleEn: "Grain Drift",
        kind: "background",
        note: "紙のざらつきをごく低速で流し、止まった画面に呼吸を足します。写真の上にも重ねられます。",
        trigger: "loop",
        bg: "deep",
        tags: ["feTurbulence", "data URI"],
        html: `
            <div class="p-grain-drift">
                <span class="p-grain-drift__noise"></span>
                <p>静かに、動く。</p>
            </div>`,
        css: `
            /* ノイズ画像は SVG の feTurbulence をデータ URI にして焼き込む。
               画像ファイルを 1 枚も持たずに紙の質感が出せる */
            .p-grain-drift {
                position: relative;
                width: 100%;
                height: 100%;
                display: grid;
                place-items: center;
                overflow: hidden;
                background: linear-gradient(140deg, #1f3a2e 0%, #15291f 100%);
            }
            .p-grain-drift__noise {
                position: absolute;
                inset: -50%;
                opacity: 0.28;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>");
                background-size: 180px 180px;
                animation: p-grain-drift-move 14s linear infinite;
            }
            .p-grain-drift p {
                position: relative;
                font-family: "Noto Serif JP", serif;
                font-size: clamp(16px, 4.4cqw, 22px);
                font-weight: 600;
                color: #f4eede;
                margin: 0;
            }
            @keyframes p-grain-drift-move {
                from { transform: translate3d(0, 0, 0); }
                to   { transform: translate3d(180px, 180px, 0); }
            }`,
        js: null,
    },
    {
        id: "mesh-breathe",
        title: "呼吸する背景",
        titleEn: "Mesh Breathe",
        kind: "background",
        note: "大きくぼかした色の塊が、ゆっくり位置を変えて重なります。ヒーローの背景に一枚敷くだけで効きます。",
        trigger: "loop",
        bg: "paper",
        tags: ["filter: blur", "@keyframes"],
        html: `
            <div class="p-mesh-breathe">
                <span class="p-mesh-breathe__blob p-mesh-breathe__blob--a"></span>
                <span class="p-mesh-breathe__blob p-mesh-breathe__blob--b"></span>
                <span class="p-mesh-breathe__blob p-mesh-breathe__blob--c"></span>
            </div>`,
        css: `
            /* 円を 3 つ置いて強くぼかし、それぞれ別々の周期で動かす。
               周期をわざと割り切れない秒数にすると、同じ絵が戻ってこない */
            .p-mesh-breathe {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: #fbf8f0;
            }
            .p-mesh-breathe__blob {
                position: absolute;
                width: 62%;
                aspect-ratio: 1;
                border-radius: 50%;
                filter: blur(34px);
                opacity: 0.7;
            }
            .p-mesh-breathe__blob--a {
                background: #d99478;
                top: -14%;
                left: -8%;
                animation: p-mesh-breathe-a 11s ease-in-out infinite alternate;
            }
            .p-mesh-breathe__blob--b {
                background: #5a6a4d;
                bottom: -18%;
                right: -6%;
                animation: p-mesh-breathe-b 13s ease-in-out infinite alternate;
            }
            .p-mesh-breathe__blob--c {
                background: #b85c3a;
                top: 26%;
                right: 18%;
                width: 40%;
                opacity: 0.45;
                animation: p-mesh-breathe-c 17s ease-in-out infinite alternate;
            }
            @keyframes p-mesh-breathe-a { to { transform: translate(22%, 18%) scale(1.15); } }
            @keyframes p-mesh-breathe-b { to { transform: translate(-18%, -14%) scale(1.2); } }
            @keyframes p-mesh-breathe-c { to { transform: translate(-26%, 22%) scale(0.85); } }`,
        js: null,
    },
    {
        id: "ruled-scroll",
        title: "流れる製図線",
        titleEn: "Ruled Scroll",
        kind: "background",
        note: "細い斜めの線が一定の速さで流れ続けます。工事中・準備中の画面や、帯の下地に。",
        trigger: "loop",
        bg: "kinari",
        tags: ["repeating-linear-gradient"],
        html: `
            <div class="p-ruled-scroll"></div>`,
        css: `
            /* 斜めの縞は repeating-linear-gradient 一発で作れる。
               背景の位置を 1 周期ぶんだけ動かすと、継ぎ目なく流れ続ける */
            .p-ruled-scroll {
                width: 100%;
                height: 100%;
                background-image: repeating-linear-gradient(
                    -45deg,
                    #a89e88 0 1px,
                    transparent 1px 12px
                );
                background-size: 17px 17px;
                animation: p-ruled-scroll-move 900ms linear infinite;
            }
            @keyframes p-ruled-scroll-move {
                to { background-position: 17px 0; }
            }`,
        js: null,
    },
    {
        id: "dot-grid-pulse",
        title: "明滅する方眼の点",
        titleEn: "Dot Grid Pulse",
        kind: "background",
        note: "等間隔に並んだ点が、ゆっくり濃くなったり薄くなったりします。図面のような下地に。",
        trigger: "loop",
        bg: "deep",
        tags: ["radial-gradient", "background-size"],
        html: `
            <div class="p-dot-grid-pulse"></div>`,
        css: `
            /* 点の方眼は radial-gradient を background-size で敷き詰めるだけ。
               背景の位置を斜めに流しつつ、opacity で濃淡を付ける */
            .p-dot-grid-pulse {
                width: 100%;
                height: 100%;
                background-color: #15291f;
                background-image: radial-gradient(
                    circle,
                    rgba(244, 238, 222, 0.55) 1.4px,
                    transparent 1.5px
                );
                background-size: 18px 18px;
                animation: p-dot-grid-pulse-fade 5s ease-in-out infinite;
            }
            @keyframes p-dot-grid-pulse-fade {
                0%, 100% { opacity: 0.35; background-position: 0 0; }
                50%      { opacity: 1;    background-position: 9px 9px; }
            }`,
        js: null,
    },

    /* ========================= Decor ========================= */
    {
        id: "marquee-seamless",
        title: "継ぎ目のない帯",
        titleEn: "Seamless Marquee",
        kind: "decor",
        note: "同じ文字列が途切れずに流れ続けます。取扱ブランドや対応技術の羅列に。",
        trigger: "loop",
        bg: "deep",
        tags: ["translateX", "max-content"],
        html: `
            <div class="p-marquee-seamless">
                <div class="p-marquee-seamless__track">
                    <span>HTML — CSS — JavaScript — TypeScript — Vue — Laravel — AWS —&nbsp;</span>
                    <span aria-hidden="true">HTML — CSS — JavaScript — TypeScript — Vue — Laravel — AWS —&nbsp;</span>
                </div>
            </div>`,
        css: `
            /* まったく同じ文字列を 2 つ並べ、全体を左へ 50% ずらす。
               ずらし終わった瞬間の絵が開始時と一致するので、継ぎ目が見えない */
            .p-marquee-seamless {
                width: 100%;
                overflow: hidden;
                border-block: 1px solid rgba(244, 238, 222, 0.25);
                padding-block: 14px;
            }
            .p-marquee-seamless__track {
                display: flex;
                width: max-content;
                animation: p-marquee-seamless-run 18s linear infinite;
            }
            .p-marquee-seamless__track span {
                font-family: "DM Sans", sans-serif;
                font-size: 14px;
                letter-spacing: 0.08em;
                color: #f4eede;
                white-space: nowrap;
            }
            @keyframes p-marquee-seamless-run {
                to { transform: translateX(-50%); }
            }`,
        js: null,
    },
    {
        id: "divider-draw",
        title: "引かれる区切り線",
        titleEn: "Divider Draw",
        kind: "decor",
        note: "章番号のあとに罫線が伸びていきます。長いページを読み物として区切りたいときに。",
        trigger: "replay",
        bg: "paper",
        tags: ["scaleX", "animation-delay"],
        html: `
            <div class="p-divider-draw">
                <span class="p-divider-draw__num">03</span>
                <span class="p-divider-draw__rule"></span>
                <span class="p-divider-draw__label">Works</span>
            </div>`,
        css: `
            /* 線が伸びきってからラベルを出す。順番があるだけで
               「区切り」という意味が読み取りやすくなる */
            .p-divider-draw {
                display: flex;
                align-items: center;
                gap: 14px;
                width: 100%;
                max-width: 240px;
            }
            .p-divider-draw__num {
                font-family: "JetBrains Mono", monospace;
                font-size: 12px;
                color: #b85c3a;
                flex-shrink: 0;
            }
            .p-divider-draw__rule {
                flex: 1 1 auto;
                height: 1px;
                background: #a89e88;
                transform: scaleX(0);
                transform-origin: left center;
            }
            .p-divider-draw__label {
                font-family: "DM Sans", sans-serif;
                font-size: 12px;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                color: #5a5a55;
                opacity: 0;
                flex-shrink: 0;
            }
            .p-divider-draw[data-play="1"] .p-divider-draw__rule {
                animation: p-divider-draw-line 760ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .p-divider-draw[data-play="1"] .p-divider-draw__label {
                animation: p-divider-draw-label 420ms ease 620ms forwards;
            }
            @keyframes p-divider-draw-line  { to { transform: scaleX(1); } }
            @keyframes p-divider-draw-label { to { opacity: 1; } }`,
        js: null,
    },
    {
        id: "scroll-hint",
        title: "下へ促すしるし",
        titleEn: "Scroll Hint",
        kind: "decor",
        note: "細い線の中を光が下りていきます。ファーストビューに「まだ下に続く」と伝えるために。",
        trigger: "loop",
        bg: "kinari",
        tags: ["translateY", "infinite"],
        html: `
            <div class="p-scroll-hint">
                <span class="p-scroll-hint__label">Scroll</span>
                <span class="p-scroll-hint__rail"><i></i></span>
            </div>`,
        css: `
            /* 軌道は薄い線、走る光は濃い短い線。
               軌道を overflow: hidden にすると、光が枠の外へ出ない */
            .p-scroll-hint {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }
            .p-scroll-hint__label {
                font-family: "DM Sans", sans-serif;
                font-size: 10px;
                letter-spacing: 0.24em;
                text-transform: uppercase;
                color: #8a857a;
            }
            .p-scroll-hint__rail {
                position: relative;
                display: block;
                width: 1px;
                height: 64px;
                background: #dbd5c5;
                overflow: hidden;
            }
            .p-scroll-hint__rail i {
                position: absolute;
                left: 0;
                top: 0;
                width: 1px;
                height: 22px;
                background: #1f3a2e;
                animation: p-scroll-hint-run 1800ms cubic-bezier(0.65, 0, 0.35, 1) infinite;
            }
            @keyframes p-scroll-hint-run {
                0%   { transform: translateY(-100%); }
                100% { transform: translateY(300%); }
            }`,
        js: null,
    },

    /* ========================= Transition ========================= */
    {
        id: "curtain-wipe",
        title: "降りて上がる幕",
        titleEn: "Curtain Wipe",
        kind: "transition",
        note: "画面を幕が覆い、次のページを見せてから引き上がります。ページ間の断絶をなくしたいときに。",
        trigger: "replay",
        bg: "deep",
        tags: ["scaleY", "transform-origin"],
        html: `
            <div class="p-curtain-wipe">
                <span class="p-curtain-wipe__page">NEXT PAGE</span>
                <span class="p-curtain-wipe__curtain"></span>
            </div>`,
        css: `
            /* 覆うときは上から（origin: top）、抜けるときは上へ（origin: top で scaleY(0)）。
               1 本の keyframes の途中で transform-origin を差し替えるのが要 */
            .p-curtain-wipe {
                position: relative;
                display: grid;
                place-items: center;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: #15291f;
            }
            .p-curtain-wipe__page {
                font-family: "DM Sans", sans-serif;
                font-size: 13px;
                letter-spacing: 0.2em;
                color: #f4eede;
            }
            .p-curtain-wipe__curtain {
                position: absolute;
                inset: 0;
                background: #b85c3a;
                transform: scaleY(0);
                transform-origin: top center;
            }
            .p-curtain-wipe[data-play="1"] .p-curtain-wipe__curtain {
                animation: p-curtain-wipe-run 2600ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
            }
            @keyframes p-curtain-wipe-run {
                0%   { transform: scaleY(0); transform-origin: top center; }
                35%  { transform: scaleY(1); transform-origin: top center; }
                50%  { transform: scaleY(1); transform-origin: bottom center; }
                85%  { transform: scaleY(0); transform-origin: bottom center; }
                100% { transform: scaleY(0); transform-origin: bottom center; }
            }`,
        js: null,
    },
    {
        id: "circle-expand",
        title: "広がる円で切り替え",
        titleEn: "Circle Expand",
        kind: "transition",
        note: "小さな円が画面いっぱいに広がって、次の面に入れ替わります。押した場所から world が開く演出に。",
        trigger: "replay",
        bg: "paper",
        tags: ["clip-path", "circle()"],
        html: `
            <div class="p-circle-expand">
                <span class="p-circle-expand__under">BEFORE</span>
                <span class="p-circle-expand__over">AFTER</span>
            </div>`,
        css: `
            /* clip-path: circle() の半径を 0 から 150% へ。
               150% にすると、円が四隅まで確実に届く */
            .p-circle-expand {
                position: relative;
                display: grid;
                place-items: center;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: #fbf8f0;
            }
            .p-circle-expand__under,
            .p-circle-expand__over {
                position: absolute;
                inset: 0;
                display: grid;
                place-items: center;
                font-family: "DM Sans", sans-serif;
                font-size: 14px;
                letter-spacing: 0.2em;
            }
            .p-circle-expand__under {
                background: #fbf8f0;
                color: #8a857a;
            }
            .p-circle-expand__over {
                background: #1f3a2e;
                color: #f4eede;
                clip-path: circle(0% at 50% 50%);
            }
            .p-circle-expand[data-play="1"] .p-circle-expand__over {
                animation: p-circle-expand-open 2600ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
            }
            @keyframes p-circle-expand-open {
                0%   { clip-path: circle(0% at 50% 50%); }
                40%  { clip-path: circle(150% at 50% 50%); }
                80%  { clip-path: circle(150% at 50% 50%); }
                100% { clip-path: circle(0% at 50% 50%); }
            }`,
        js: null,
    },
    {
        id: "page-slide",
        title: "押し出される画面",
        titleEn: "Page Slide",
        kind: "transition",
        note: "いまの画面が左へ抜け、次の画面が右から入ります。順序のある読み物や、申し込みの手順に。",
        trigger: "replay",
        bg: "kinari",
        tags: ["translateX", "@keyframes"],
        html: `
            <div class="p-page-slide">
                <span class="p-page-slide__pane p-page-slide__pane--a">STEP 1</span>
                <span class="p-page-slide__pane p-page-slide__pane--b">STEP 2</span>
            </div>`,
        css: `
            /* 2 面を同じ量・同じ時間で動かすと、間に隙間ができない。
               ずれると「継ぎ目」が見えてしまうので、遅延は付けない */
            .p-page-slide {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: #f4eede;
            }
            .p-page-slide__pane {
                position: absolute;
                inset: 0;
                display: grid;
                place-items: center;
                font-family: "DM Sans", sans-serif;
                font-size: 14px;
                letter-spacing: 0.2em;
            }
            .p-page-slide__pane--a {
                background: #fbf8f0;
                color: #262624;
            }
            .p-page-slide__pane--b {
                background: #1f3a2e;
                color: #f4eede;
                transform: translateX(100%);
            }
            .p-page-slide[data-play="1"] .p-page-slide__pane--a {
                animation: p-page-slide-out 2600ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
            }
            .p-page-slide[data-play="1"] .p-page-slide__pane--b {
                animation: p-page-slide-in 2600ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
            }
            @keyframes p-page-slide-out {
                0% { transform: translateX(0); }      30% { transform: translateX(-100%); }
                70% { transform: translateX(-100%); } 100% { transform: translateX(0); }
            }
            @keyframes p-page-slide-in {
                0% { transform: translateX(100%); }   30% { transform: translateX(0); }
                70% { transform: translateX(0); }     100% { transform: translateX(100%); }
            }`,
        js: null,
    },
];
