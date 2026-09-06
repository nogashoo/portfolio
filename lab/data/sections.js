/* =====================================================================
   Lab / 層 2 — 場面（Section）

   ページを構成する塊。ここを選んで並べた時点で、サイトの形は決まる。
   カタログの主役はこの層。

   **動きは持たない。uses.motions で層 4 のパーツを名指しし、その CSS を
   連結して組み立てる。** だから見本の中で実際に動いているのは、動きのページに
   並んでいるのと同じ CSS そのもの。連結は section/section.js の buildCss() が行う。

   書くときの約束
     1. id は一意・kebab-case。CSS の接頭辞 .s-<id> と URL のハッシュを兼ねる
     2. html のルート要素はちょうど 1 つの <section>、クラスは .s-<id>
     3. CSS のセレクタはすべて .s-<id> 始まりにする
     4. 値は下地（data/foundation.js）の CSS 変数で書く。見本を組み立てるときに
        変数の定義ごと連結されるので、そのまま解決する
        —— 動きのパーツだけは単体で持ち出される前提なのでリテラル値のまま
     5. 動きのパーツの見た目（字送りや寄せ）を場面に合わせたいときは、
        .s-<id> 側で上書きしてよい。連結順が「動き → 場面」なので後勝ちになる。
        上書きしてよいのは寸法・寄せ・濃さまで。@keyframes と transition には触らない
     6. 一度きりの登場は data-play-on-view を付け、js に PLAY_ON_VIEW を渡す
     7. 写真は外部ファイルを使わず CSS で置く。貼った先で画像が割れないように
     8. title は形を名指しする。件数（3 枚 / 4 段）は入れない —— 数は見本の都合で、
        貼る側は増やしても減らしてもよい。数えられる形に固定して見せない

   kind ごとに案を 2 つ以上そろえてから公開する（1 案だけだと「選ぶ」にならない）。
   ===================================================================== */

window.LAB_SECTION_KINDS = [
    { id: "hero",    label: "Hero",    labelJa: "ヒーロー",       note: "開いていちばん最初に見える場面" },
    { id: "feature", label: "Feature", labelJa: "特徴・強み",     note: "何がいいのかを並べる" },
    { id: "flow",    label: "Flow",    labelJa: "流れ・ステップ", note: "頼んでから納品までの順序" },
    { id: "works",   label: "Works",   labelJa: "実績・事例",     note: "作ったものを見せる" },
    { id: "faq",     label: "FAQ",     labelJa: "よくある質問",   note: "申し込み前の不安をつぶす" },
    { id: "cta",     label: "CTA",     labelJa: "問い合わせ",     note: "最後のひと押し" },
];

/* 一度きりの登場を「画面に入ったら」に変える 8 行。
   使う場面すべてに同じものが付く（見本は 1 つで完結していないと持ち出せない）。
   ここで書き分けると場面ごとに挙動がずれるので、必ずこの定数を渡すこと */
const PLAY_ON_VIEW = `document.querySelectorAll("[data-play-on-view]").forEach((el) => {
    new IntersectionObserver((entries, io) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.dataset.play = "1";
            io.unobserve(entry.target);
        });
    }, { threshold: 0.35 }).observe(el);
});`;

window.LAB_SECTIONS = [
    /* ========================= Hero ========================= */
    {
        id: "hero-split",
        title: "左右に割るヒーロー",
        titleEn: "Split Hero",
        kind: "hero",
        note: "左に言葉、右に写真。読ませたい言葉があるサイト向き。見出しは窓から迫り上がって出ます。",
        uses: { motions: ["mask-rise", "btn-fill", "scroll-hint"] },
        tags: ["grid", "clamp()"],
        html: `
            <section class="s-hero-split">
                <div class="s-hero-split__inner">
                    <div class="s-hero-split__copy">
                        <p class="s-hero-split__eyebrow">Web 制作 / 東京</p>
                        <h1 class="s-hero-split__title p-mask-rise" data-play-on-view>
                            <span class="p-mask-rise__line"><i>作ったものは、</i></span>
                            <span class="p-mask-rise__line"><i>触ってもらうのが早い。</i></span>
                        </h1>
                        <p class="s-hero-split__lead">
                            小さなお店とサービスのための Web サイトを、
                            企画から実装までひとりで作っています。
                        </p>
                        <div class="s-hero-split__actions">
                            <button class="p-btn-fill" type="button"><span>お問い合わせ</span></button>
                            <a class="s-hero-split__sub" href="#works">制作したサイトを見る</a>
                        </div>
                    </div>
                    <div class="s-hero-split__visual">
                        <div class="s-hero-split__photo" role="img" aria-label="制作したサイトの写真"></div>
                    </div>
                </div>
                <div class="s-hero-split__hint p-scroll-hint" aria-hidden="true">
                    <span class="p-scroll-hint__label">Scroll</span>
                    <span class="p-scroll-hint__rail"><i></i></span>
                </div>
            </section>`,
        css: `
            .s-hero-split {
                position: relative;
                padding: var(--s-9) var(--s-5) var(--s-8);
                background: var(--bg);
            }
            .s-hero-split__inner {
                max-width: 1180px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--s-7);
                align-items: center;
            }
            /* 言葉が主役なので、写真側をやや細くする（1 : 0.85） */
            @media (min-width: 880px) {
                .s-hero-split__inner {
                    grid-template-columns: 1fr 0.85fr;
                    gap: var(--s-8);
                }
            }
            .s-hero-split__eyebrow {
                font-family: var(--font-latin);
                font-size: 11px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--mark);
                margin: 0 0 var(--s-4);
            }

            /* 動き（mask-rise）は中央寄せ・小さめが既定。
               連結順が「動き → 場面」なので、寸法と寄せだけここで上書きする */
            .s-hero-split__title {
                text-align: left;
                font-size: clamp(28px, 4.2vw, 52px);
                line-height: 1.45;
                margin: 0 0 var(--s-5);
                font-feature-settings: "palt" 1;
            }

            .s-hero-split__lead {
                font-size: 15px;
                line-height: 2;
                color: var(--ink-2);
                max-width: 34em;
                margin: 0 0 var(--s-6);
            }
            .s-hero-split__actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: var(--s-5);
            }
            .s-hero-split__sub {
                font-size: 13px;
                color: var(--ink-2);
                text-decoration: none;
                border-bottom: 1px solid var(--line-2);
                padding-bottom: 2px;
            }
            .s-hero-split__sub:hover {
                color: var(--ink);
            }

            /* 写真は外部ファイルを持たせず、地の色と罫線で「入る場所」だけ示す */
            .s-hero-split__photo {
                aspect-ratio: 4 / 5;
                border: 1px solid var(--line);
                background:
                    repeating-linear-gradient(
                        -45deg,
                        transparent 0 11px,
                        rgba(168, 158, 136, 0.16) 11px 12px
                    ),
                    linear-gradient(150deg, var(--surface), var(--bg-2));
            }

            .s-hero-split__hint {
                margin: var(--s-8) auto 0;
                width: max-content;
            }`,
        js: PLAY_ON_VIEW,
    },
    {
        id: "hero-center",
        title: "中央に置くヒーロー",
        titleEn: "Centered Hero",
        kind: "hero",
        note: "短いコピーを画面の真ん中に。背景がゆっくり呼吸しているので、言葉が少なくても間が持ちます。",
        uses: { motions: ["mesh-breathe", "char-stagger", "btn-arrow-slide"] },
        tags: ["position: absolute", "blur"],
        html: `
            <section class="s-hero-center">
                <div class="s-hero-center__bg p-mesh-breathe" aria-hidden="true">
                    <span class="p-mesh-breathe__blob p-mesh-breathe__blob--a"></span>
                    <span class="p-mesh-breathe__blob p-mesh-breathe__blob--b"></span>
                    <span class="p-mesh-breathe__blob p-mesh-breathe__blob--c"></span>
                </div>
                <div class="s-hero-center__inner">
                    <p class="s-hero-center__eyebrow">Nogami Design</p>
                    <p class="s-hero-center__title p-char-stagger"
                       aria-label="ちいさく、ていねいに。" data-play-on-view>
                        <span aria-hidden="true">ち</span><span aria-hidden="true">い</span
                        ><span aria-hidden="true">さ</span><span aria-hidden="true">く</span
                        ><span aria-hidden="true">、</span><span aria-hidden="true">て</span
                        ><span aria-hidden="true">い</span><span aria-hidden="true">ね</span
                        ><span aria-hidden="true">い</span><span aria-hidden="true">に</span
                        ><span aria-hidden="true">。</span>
                    </p>
                    <p class="s-hero-center__lead">
                        ひとつのお店に、ひとつのサイトを。
                        テンプレートに寄せずに、そのお店の言葉で作ります。
                    </p>
                    <button class="p-btn-arrow-slide" type="button">
                        <span class="p-btn-arrow-slide__t">詳しく見る</span>
                        <span class="p-btn-arrow-slide__a" aria-hidden="true">→</span>
                    </button>
                </div>
            </section>`,
        css: `
            .s-hero-center {
                position: relative;
                display: grid;
                place-items: center;
                min-height: 560px;
                padding: var(--s-9) var(--s-5);
                overflow: hidden;
            }

            /* 動き（mesh-breathe）は幅も高さも 100% の板。敷く位置と濃さを決める。
               動きのページでは升目 1 つぶんの絵だが、ヒーローの全面に広げると
               そのままでは文字が沈むので、ここで薄める */
            .s-hero-center__bg {
                position: absolute;
                inset: 0;
                opacity: 0.5;
            }

            /* 見出しは 11 文字を 1 行で見せたい。em 基準だと見出しの級数と
               連動しないので、折り返さない実寸で押さえる */
            .s-hero-center__inner {
                position: relative;
                text-align: center;
                max-width: 780px;
            }
            .s-hero-center__eyebrow {
                font-family: var(--font-latin);
                font-size: 11px;
                letter-spacing: 0.24em;
                text-transform: uppercase;
                color: var(--ink-3);
                margin: 0 0 var(--s-5);
            }

            /* 見出しを画面の主役の大きさまで持ち上げる（動き側の既定は 30px 上限） */
            .s-hero-center__title {
                font-size: clamp(30px, 6vw, 58px);
                line-height: 1.4;
                letter-spacing: 0.02em;
                margin: 0 0 var(--s-5);
            }

            .s-hero-center__lead {
                font-size: 14.5px;
                line-height: 2.1;
                color: var(--ink-2);
                margin: 0 auto var(--s-7);
                max-width: 30em;
            }`,
        js: PLAY_ON_VIEW,
    },
    /* ======================== Feature ======================== */
    {
        id: "feature-cards",
        title: "横並びのカード",
        titleEn: "Feature Cards",
        kind: "feature",
        note: "強みを絞って横並びに。画面に入ると左から順に差し込まれます。数を増やしたくなったら、増やさずに言葉を削るほうが効きます。",
        uses: { motions: ["underline-draw", "card-stack-in"] },
        tags: ["flex", "nth-child"],
        html: `
            <section class="s-feature-cards">
                <div class="s-feature-cards__inner">
                    <p class="s-feature-cards__label">Features</p>
                    <p class="s-feature-cards__head p-underline-draw" data-play-on-view>
                        作って終わりにせず、<em>育てるところまで</em>
                    </p>
                    <div class="s-feature-cards__grid p-card-stack-in" data-play-on-view>
                        <div class="s-feature-cards__card p-card-stack-in__c">
                            <p class="s-feature-cards__n">01</p>
                            <h3 class="s-feature-cards__t">何を言うかから決める</h3>
                            <p class="s-feature-cards__d">
                                デザインの前に、誰に何を伝えるサイトなのかを一緒に言葉にします。
                                ここが決まっていないサイトは、作り直しになります。
                            </p>
                        </div>
                        <div class="s-feature-cards__card p-card-stack-in__c">
                            <p class="s-feature-cards__n">02</p>
                            <h3 class="s-feature-cards__t">実装まで同じ人が</h3>
                            <p class="s-feature-cards__d">
                                デザインと実装を分けないので、細部の意図が落ちません。
                                動きも余白も、画面の中で調整しながら決めます。
                            </p>
                        </div>
                        <div class="s-feature-cards__card p-card-stack-in__c">
                            <p class="s-feature-cards__n">03</p>
                            <h3 class="s-feature-cards__t">公開してからが本番</h3>
                            <p class="s-feature-cards__d">
                                数字を見ながら、毎月すこしずつ直します。
                                作った時点がいちばん良い、という状態にしません。
                            </p>
                        </div>
                    </div>
                </div>
            </section>`,
        css: `
            .s-feature-cards {
                padding: var(--s-9) var(--s-5);
                background: var(--bg-2);
            }
            .s-feature-cards__inner {
                max-width: 1100px;
                margin: 0 auto;
            }
            .s-feature-cards__label {
                font-family: var(--font-latin);
                font-size: 11px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--mark);
                margin: 0 0 var(--s-3);
            }

            /* 動き（underline-draw）は中央寄せ・小さめが既定。見出しの座り方だけ変える */
            .s-feature-cards__head {
                text-align: left;
                font-size: clamp(20px, 2.6vw, 30px);
                margin: 0 0 var(--s-8);
            }
            /* underline-draw の下線は em に重ねた 1 本の絶対配置。em が行をまたぐと
               2 行目に下線が付かないので、inline-block にして途中で折らせない */
            .s-feature-cards__head em {
                display: inline-block;
            }

            /* 動き（card-stack-in）は 3 枚の抽象的な箱。中身が入る寸法に開く */
            .s-feature-cards__grid {
                max-width: none;
                gap: var(--s-5);
                flex-direction: column;
            }
            @media (min-width: 760px) {
                .s-feature-cards__grid {
                    flex-direction: row;
                }
            }
            .s-feature-cards__card {
                aspect-ratio: auto;
                padding: var(--s-6) var(--s-5) var(--s-7);
                background: var(--surface);
            }

            .s-feature-cards__n {
                font-family: var(--font-latin);
                font-size: 12px;
                letter-spacing: 0.16em;
                color: var(--mark);
                margin: 0 0 var(--s-4);
            }
            .s-feature-cards__t {
                font-family: var(--font-display);
                font-size: 17px;
                font-weight: 600;
                line-height: 1.6;
                margin: 0 0 var(--s-3);
            }
            .s-feature-cards__d {
                font-size: 13.5px;
                line-height: 2;
                color: var(--ink-2);
                margin: 0;
            }`,
        js: PLAY_ON_VIEW,
    },
    {
        id: "feature-rows",
        title: "左右交互の大段組み",
        titleEn: "Alternating Rows",
        kind: "feature",
        note: "1 つの強みに 1 画面を使います。説明が長くなるサービスや、写真で見せたいものに。写真は触れるとゆっくり寄ります。",
        uses: { motions: ["divider-draw", "image-zoom-frame"] },
        tags: ["order", "aspect-ratio"],
        html: `
            <section class="s-feature-rows">
                <div class="s-feature-rows__inner">
                    <article class="s-feature-rows__row">
                        <div class="s-feature-rows__copy">
                            <div class="s-feature-rows__mark p-divider-draw" data-play-on-view>
                                <span class="p-divider-draw__num">01</span>
                                <span class="p-divider-draw__rule"></span>
                                <span class="p-divider-draw__label">Plan</span>
                            </div>
                            <h3 class="s-feature-rows__t">聞くところから始めます</h3>
                            <p class="s-feature-rows__d">
                                いきなり画面の話をしません。誰に来てほしいのか、
                                来た人に何をしてほしいのかを先に決めます。
                                ここが揃っていれば、あとの判断はほとんど自動的に決まります。
                            </p>
                        </div>
                        <figure class="s-feature-rows__visual p-image-zoom-frame">
                            <div class="p-image-zoom-frame__photo"></div>
                        </figure>
                    </article>
                    <article class="s-feature-rows__row">
                        <div class="s-feature-rows__copy">
                            <div class="s-feature-rows__mark p-divider-draw" data-play-on-view>
                                <span class="p-divider-draw__num">02</span>
                                <span class="p-divider-draw__rule"></span>
                                <span class="p-divider-draw__label">Build</span>
                            </div>
                            <h3 class="s-feature-rows__t">画面の中で詰めます</h3>
                            <p class="s-feature-rows__d">
                                静止画で決めきれるのは半分までです。
                                動きや余白は実物を触りながら直すほうが早く、確かです。
                            </p>
                        </div>
                        <figure class="s-feature-rows__visual p-image-zoom-frame">
                            <div class="p-image-zoom-frame__photo"></div>
                        </figure>
                    </article>
                </div>
            </section>`,
        css: `
            .s-feature-rows {
                padding: var(--s-9) var(--s-5);
                background: var(--bg);
            }
            .s-feature-rows__inner {
                max-width: 1100px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: var(--s-9);
            }
            .s-feature-rows__row {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--s-6);
                align-items: center;
            }
            @media (min-width: 820px) {
                .s-feature-rows__row {
                    grid-template-columns: 1fr 1fr;
                    gap: var(--s-8);
                }
                /* 偶数行だけ写真を左へ。段が続いても視線が一方向に流れない */
                .s-feature-rows__row:nth-child(even) .s-feature-rows__copy {
                    order: 2;
                }
            }

            /* 動き（divider-draw）は 240px の帯が既定。段の幅いっぱいに伸ばす */
            .s-feature-rows__mark {
                max-width: none;
                margin-bottom: var(--s-5);
            }

            .s-feature-rows__t {
                font-family: var(--font-display);
                font-size: clamp(20px, 2.4vw, 28px);
                font-weight: 600;
                line-height: 1.6;
                margin: 0 0 var(--s-4);
            }
            .s-feature-rows__d {
                font-size: 14px;
                line-height: 2.1;
                color: var(--ink-2);
                margin: 0;
            }

            /* 動き（image-zoom-frame）も 240px 上限。段の片側いっぱいに使う */
            .s-feature-rows__visual {
                max-width: none;
                border: 1px solid var(--line);
            }`,
        js: PLAY_ON_VIEW,
    },

    /* ========================== Flow ========================= */
    {
        id: "flow-vertical",
        title: "縦につなぐ流れ",
        titleEn: "Vertical Flow",
        kind: "flow",
        note: "上から下へ読む順序を、そのまま形にした流れ。段が増えても崩れません。各段の罫線は、画面に入ると左から引かれます。",
        uses: { motions: ["divider-draw"] },
        tags: ["::before", "grid"],
        html: `
            <section class="s-flow-vertical">
                <div class="s-flow-vertical__inner">
                    <p class="s-flow-vertical__label">Flow</p>
                    <h2 class="s-flow-vertical__head">お問い合わせから公開まで</h2>
                    <ol class="s-flow-vertical__list">
                        <li class="s-flow-vertical__step">
                            <div class="s-flow-vertical__mark p-divider-draw" data-play-on-view>
                                <span class="p-divider-draw__num">01</span>
                                <span class="p-divider-draw__rule"></span>
                                <span class="p-divider-draw__label">Contact</span>
                            </div>
                            <h3 class="s-flow-vertical__t">お問い合わせ</h3>
                            <p class="s-flow-vertical__d">
                                フォームから、いま困っていることを一行だけでもお送りください。
                                2 営業日以内に返信します。
                            </p>
                        </li>
                        <li class="s-flow-vertical__step">
                            <div class="s-flow-vertical__mark p-divider-draw" data-play-on-view>
                                <span class="p-divider-draw__num">02</span>
                                <span class="p-divider-draw__rule"></span>
                                <span class="p-divider-draw__label">Hearing</span>
                            </div>
                            <h3 class="s-flow-vertical__t">打ち合わせ</h3>
                            <p class="s-flow-vertical__d">
                                オンラインで 1 時間ほど。目的と予算、公開したい時期をすり合わせます。
                            </p>
                        </li>
                        <li class="s-flow-vertical__step">
                            <div class="s-flow-vertical__mark p-divider-draw" data-play-on-view>
                                <span class="p-divider-draw__num">03</span>
                                <span class="p-divider-draw__rule"></span>
                                <span class="p-divider-draw__label">Build</span>
                            </div>
                            <h3 class="s-flow-vertical__t">制作</h3>
                            <p class="s-flow-vertical__d">
                                途中の画面を触れる状態でお見せします。
                                完成してから直すより、途中で直すほうが安く済みます。
                            </p>
                        </li>
                        <li class="s-flow-vertical__step">
                            <div class="s-flow-vertical__mark p-divider-draw" data-play-on-view>
                                <span class="p-divider-draw__num">04</span>
                                <span class="p-divider-draw__rule"></span>
                                <span class="p-divider-draw__label">Launch</span>
                            </div>
                            <h3 class="s-flow-vertical__t">公開と、そのあと</h3>
                            <p class="s-flow-vertical__d">
                                公開して終わりにせず、数字を見ながら毎月すこしずつ直します。
                            </p>
                        </li>
                    </ol>
                </div>
            </section>`,
        css: `
            .s-flow-vertical {
                padding: var(--s-9) var(--s-5);
                background: var(--bg-2);
            }
            .s-flow-vertical__inner {
                max-width: 760px;
                margin: 0 auto;
            }
            .s-flow-vertical__label {
                font-family: var(--font-latin);
                font-size: 11px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--mark);
                margin: 0 0 var(--s-3);
            }
            .s-flow-vertical__head {
                font-family: var(--font-display);
                font-size: clamp(20px, 2.6vw, 30px);
                font-weight: 600;
                margin: 0 0 var(--s-8);
            }

            .s-flow-vertical__list {
                list-style: none;
                margin: 0;
                padding: 0;
            }
            /* 段と段を縦の罫線でつなぐ。最後の段だけ線を出さない */
            .s-flow-vertical__step {
                position: relative;
                padding: 0 0 var(--s-7) var(--s-6);
            }
            .s-flow-vertical__step::before {
                content: "";
                position: absolute;
                left: 3px;
                top: 8px;
                bottom: 0;
                width: 1px;
                background: var(--line);
            }
            .s-flow-vertical__step:last-child {
                padding-bottom: 0;
            }
            .s-flow-vertical__step:last-child::before {
                display: none;
            }
            .s-flow-vertical__step::after {
                content: "";
                position: absolute;
                left: 0;
                top: 6px;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: var(--mark);
            }

            /* 動き（divider-draw）は 240px の帯が既定。段の幅いっぱいに伸ばす */
            .s-flow-vertical__mark {
                max-width: none;
                margin-bottom: var(--s-4);
            }

            .s-flow-vertical__t {
                font-family: var(--font-display);
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 var(--s-2);
            }
            .s-flow-vertical__d {
                font-size: 13.5px;
                line-height: 2;
                color: var(--ink-2);
                margin: 0;
            }`,
        js: PLAY_ON_VIEW,
    },
    {
        id: "flow-columns",
        title: "横に並べるステップ",
        titleEn: "Step Columns",
        kind: "flow",
        note: "手順が少なく、ひと目で「簡単そう」と伝えたいときに。画面に入ると左から順に差し込まれます。",
        uses: { motions: ["card-stack-in"] },
        tags: ["flex", "counter"],
        html: `
            <section class="s-flow-columns">
                <div class="s-flow-columns__inner">
                    <p class="s-flow-columns__label">Flow</p>
                    <h2 class="s-flow-columns__head">3 ステップで公開できます</h2>
                    <div class="s-flow-columns__grid p-card-stack-in" data-play-on-view>
                        <div class="s-flow-columns__step p-card-stack-in__c">
                            <p class="s-flow-columns__n">01</p>
                            <h3 class="s-flow-columns__t">相談する</h3>
                            <p class="s-flow-columns__d">
                                フォームから一行送るだけ。見積もりまで無料です。
                            </p>
                        </div>
                        <div class="s-flow-columns__step p-card-stack-in__c">
                            <p class="s-flow-columns__n">02</p>
                            <h3 class="s-flow-columns__t">内容を決める</h3>
                            <p class="s-flow-columns__d">
                                オンラインで 1 時間。載せるものと公開日を決めます。
                            </p>
                        </div>
                        <div class="s-flow-columns__step p-card-stack-in__c">
                            <p class="s-flow-columns__n">03</p>
                            <h3 class="s-flow-columns__t">公開する</h3>
                            <p class="s-flow-columns__d">
                                最短 2 週間。公開後の更新の仕方までお渡しします。
                            </p>
                        </div>
                    </div>
                </div>
            </section>`,
        css: `
            .s-flow-columns {
                padding: var(--s-9) var(--s-5);
                background: var(--bg);
            }
            .s-flow-columns__inner {
                max-width: 1000px;
                margin: 0 auto;
                text-align: center;
            }
            .s-flow-columns__label {
                font-family: var(--font-latin);
                font-size: 11px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--mark);
                margin: 0 0 var(--s-3);
            }
            .s-flow-columns__head {
                font-family: var(--font-display);
                font-size: clamp(20px, 2.6vw, 30px);
                font-weight: 600;
                margin: 0 0 var(--s-8);
            }

            /* 動き（card-stack-in）は 3 枚の抽象的な箱。中身が入る寸法に開く */
            .s-flow-columns__grid {
                max-width: none;
                gap: var(--s-5);
                flex-direction: column;
                text-align: left;
            }
            @media (min-width: 720px) {
                .s-flow-columns__grid {
                    flex-direction: row;
                }
            }
            .s-flow-columns__step {
                aspect-ratio: auto;
                padding: var(--s-6) var(--s-5);
                background: transparent;
                border-color: var(--line-2);
            }

            .s-flow-columns__n {
                font-family: var(--font-latin);
                font-size: 22px;
                font-weight: 600;
                color: var(--mark);
                margin: 0 0 var(--s-3);
            }
            .s-flow-columns__t {
                font-family: var(--font-display);
                font-size: 17px;
                font-weight: 600;
                margin: 0 0 var(--s-2);
            }
            .s-flow-columns__d {
                font-size: 13px;
                line-height: 2;
                color: var(--ink-2);
                margin: 0;
            }`,
        js: PLAY_ON_VIEW,
    },
    /* ========================== Works ======================== */
    {
        id: "works-grid",
        title: "実績のグリッド",
        titleEn: "Works Grid",
        kind: "works",
        note: "件数がそろっているときに。カードは触れると浮き、中の写真だけがゆっくり寄ります。",
        uses: { motions: ["image-zoom-frame", "card-lift"] },
        tags: ["grid", "auto-fill"],
        html: `
            <section class="s-works-grid">
                <div class="s-works-grid__inner">
                    <div class="s-works-grid__head">
                        <p class="s-works-grid__label">Works</p>
                        <h2 class="s-works-grid__title">つくったもの</h2>
                    </div>
                    <div class="s-works-grid__grid">
                        <a class="s-works-grid__card p-card-lift" href="#0">
                            <figure class="s-works-grid__visual p-image-zoom-frame">
                                <div class="p-image-zoom-frame__photo"></div>
                            </figure>
                            <p class="p-card-lift__cat">Landing Page</p>
                            <p class="p-card-lift__title">こむぎの時間</p>
                            <p class="p-card-lift__note">小さなまちのパン屋さん</p>
                        </a>
                        <a class="s-works-grid__card p-card-lift" href="#0">
                            <figure class="s-works-grid__visual p-image-zoom-frame">
                                <div class="p-image-zoom-frame__photo"></div>
                            </figure>
                            <p class="p-card-lift__cat">Corporate</p>
                            <p class="p-card-lift__title">ひだり設計</p>
                            <p class="p-card-lift__note">住宅設計事務所のコーポレートサイト</p>
                        </a>
                        <a class="s-works-grid__card p-card-lift" href="#0">
                            <figure class="s-works-grid__visual p-image-zoom-frame">
                                <div class="p-image-zoom-frame__photo"></div>
                            </figure>
                            <p class="p-card-lift__cat">Web App</p>
                            <p class="p-card-lift__title">夜更けの読書会</p>
                            <p class="p-card-lift__note">読書記録の共有サービス</p>
                        </a>
                    </div>
                </div>
            </section>`,
        css: `
            .s-works-grid {
                padding: var(--s-9) var(--s-5);
                background: var(--bg);
            }
            .s-works-grid__inner {
                max-width: 1100px;
                margin: 0 auto;
            }
            .s-works-grid__head {
                margin-bottom: var(--s-7);
            }
            .s-works-grid__label {
                font-family: var(--font-latin);
                font-size: 11px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--mark);
                margin: 0 0 var(--s-3);
            }
            .s-works-grid__title {
                font-family: var(--font-display);
                font-size: clamp(20px, 2.6vw, 30px);
                font-weight: 600;
                margin: 0;
            }

            .s-works-grid__grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                gap: var(--s-5);
            }

            /* 動き（card-lift）は 240px の単票が既定。列いっぱいに広げ、
               リンクとして使うので下線と文字色も止める */
            .s-works-grid__card {
                max-width: none;
                display: block;
                text-decoration: none;
                color: inherit;
            }

            /* 動き（image-zoom-frame）も 240px 上限。カードの幅に合わせる */
            .s-works-grid__visual {
                max-width: none;
                margin-bottom: var(--s-4);
            }`,
        js: null,
    },
    {
        id: "works-scroll",
        title: "横に流す実績",
        titleEn: "Scrolling Works",
        kind: "works",
        note: "件数が多いときや、縦を短く保ちたいときに。指でもトラックパッドでも横に送れて、止まる位置は 1 枚ずつ吸い付きます。",
        uses: { motions: ["card-border-draw", "link-arrow"] },
        tags: ["scroll-snap", "overflow-x"],
        html: `
            <section class="s-works-scroll">
                <div class="s-works-scroll__head">
                    <div>
                        <p class="s-works-scroll__label">Works</p>
                        <h2 class="s-works-scroll__title">直近のしごと</h2>
                    </div>
                    <a class="p-link-arrow" href="#0">
                        すべて見る
                        <span class="p-link-arrow__arrow" aria-hidden="true"><i></i></span>
                    </a>
                </div>
                <ul class="s-works-scroll__rail">
                    <li class="s-works-scroll__item p-card-border-draw">
                        <p class="p-card-border-draw__title">こむぎの時間</p>
                        <p class="p-card-border-draw__note">小さなまちのパン屋さんの一枚もの。写真を大きく、文字は少なく。</p>
                    </li>
                    <li class="s-works-scroll__item p-card-border-draw">
                        <p class="p-card-border-draw__title">ひだり設計</p>
                        <p class="p-card-border-draw__note">住宅設計事務所。施工事例を軸に、問い合わせまで一本道にしました。</p>
                    </li>
                    <li class="s-works-scroll__item p-card-border-draw">
                        <p class="p-card-border-draw__title">夜更けの読書会</p>
                        <p class="p-card-border-draw__note">読書記録の共有サービス。登録前に中身が見える構成にしています。</p>
                    </li>
                    <li class="s-works-scroll__item p-card-border-draw">
                        <p class="p-card-border-draw__title">ネイルサロン kuu</p>
                        <p class="p-card-border-draw__note">予約導線を最短に。スマートフォンでの見え方から先に決めました。</p>
                    </li>
                </ul>
            </section>`,
        css: `
            .s-works-scroll {
                padding: var(--s-9) 0;
                background: var(--bg-2);
            }
            .s-works-scroll__head {
                max-width: 1100px;
                margin: 0 auto var(--s-6);
                padding: 0 var(--s-5);
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: var(--s-5);
            }
            .s-works-scroll__label {
                font-family: var(--font-latin);
                font-size: 11px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--mark);
                margin: 0 0 var(--s-3);
            }
            .s-works-scroll__title {
                font-family: var(--font-display);
                font-size: clamp(20px, 2.6vw, 30px);
                font-weight: 600;
                margin: 0;
            }

            /* 横送り。左右の余白ぶんだけ内側に詰めて、端が切れて見えるようにする */
            .s-works-scroll__rail {
                list-style: none;
                margin: 0;
                padding: 0 var(--s-5) var(--s-3);
                display: flex;
                gap: var(--s-5);
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                scrollbar-width: thin;
            }
            @media (min-width: 1140px) {
                .s-works-scroll__rail {
                    padding-inline: calc((100% - 1100px) / 2);
                }
            }

            /* 動き（card-border-draw）は 240px の単票が既定。送りやすい幅に固定する */
            .s-works-scroll__item {
                max-width: none;
                flex: 0 0 300px;
                scroll-snap-align: start;
            }`,
        js: null,
    },

    /* =========================== FAQ ========================= */
    {
        id: "faq-accordion",
        title: "折りたたむ質問",
        titleEn: "FAQ Accordion",
        kind: "faq",
        note: "質問が多いときに。ひとつずつ開いて読む形で、たたんでいても中身は検索に拾われます。答えの長さが違っても崩れません。",
        uses: { motions: ["mask-rise"] },
        tags: ["details", "grid-template-rows"],
        html: `
            <section class="s-faq-accordion">
                <div class="s-faq-accordion__inner">
                    <h2 class="s-faq-accordion__head p-mask-rise" data-play-on-view>
                        <span class="p-mask-rise__line"><i>よくある質問</i></span>
                    </h2>
                    <div class="s-faq-accordion__list">
                        <details class="s-faq-accordion__item">
                            <summary class="s-faq-accordion__q">対応エリアはどこまでですか？</summary>
                            <div class="s-faq-accordion__wrap">
                                <div class="s-faq-accordion__inner-a">
                                    <p>オンラインで完結するため全国対応しています。東京近郊であれば対面での打ち合わせも可能です。</p>
                                </div>
                            </div>
                        </details>
                        <details class="s-faq-accordion__item">
                            <summary class="s-faq-accordion__q">どのくらいの期間がかかりますか？</summary>
                            <div class="s-faq-accordion__wrap">
                                <div class="s-faq-accordion__inner-a">
                                    <p>一枚もののサイトで最短 2 週間、ページ数のあるサイトで 1〜2 か月が目安です。載せる文章と写真がそろっているかで大きく変わります。</p>
                                </div>
                            </div>
                        </details>
                        <details class="s-faq-accordion__item">
                            <summary class="s-faq-accordion__q">公開したあとの更新はできますか？</summary>
                            <div class="s-faq-accordion__wrap">
                                <div class="s-faq-accordion__inner-a">
                                    <p>ご自身で更新できる形でお渡しします。手が回らない場合は、月額での更新代行も承っています。</p>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </section>`,
        css: `
            .s-faq-accordion {
                padding: var(--s-9) var(--s-5);
                background: var(--bg-2);
            }
            .s-faq-accordion__inner {
                max-width: 760px;
                margin: 0 auto;
            }

            /* 動き（mask-rise）は中央寄せ・小さめが既定。見出しの座り方だけ変える */
            .s-faq-accordion__head {
                text-align: left;
                font-size: clamp(20px, 2.6vw, 30px);
                margin: 0 0 var(--s-7);
            }

            .s-faq-accordion__list {
                border-top: 1px solid var(--line);
            }
            .s-faq-accordion__item {
                border-bottom: 1px solid var(--line);
            }
            .s-faq-accordion__q {
                position: relative;
                list-style: none;
                cursor: pointer;
                padding: var(--s-5) var(--s-7) var(--s-5) 0;
                font-family: var(--font-display);
                font-size: 15.5px;
                font-weight: 600;
                line-height: 1.7;
            }
            .s-faq-accordion__q::-webkit-details-marker {
                display: none;
            }
            /* ＋ と − は 1px の線 2 本。translateY(-50%) を外すと 1px ぶん下にずれる */
            .s-faq-accordion__q::after,
            .s-faq-accordion__q::before {
                content: "";
                position: absolute;
                right: 4px;
                top: 50%;
                width: 11px;
                height: 1px;
                background: var(--ink);
                transform: translateY(-50%);
                transition: transform var(--dur-fast) var(--ease-out);
            }
            .s-faq-accordion__q::before {
                transform: translateY(-50%) rotate(90deg);
            }
            .s-faq-accordion__item[open] .s-faq-accordion__q::before {
                transform: translateY(-50%) rotate(0deg);
            }

            /* height:auto はアニメーションできないが、grid の行を 0fr から 1fr へ
               変えれば中身の高さのまま開く。子の overflow:hidden が要 */
            .s-faq-accordion__wrap {
                display: grid;
                grid-template-rows: 0fr;
                transition: grid-template-rows var(--dur-base) var(--ease-out);
            }
            .s-faq-accordion__item[open] .s-faq-accordion__wrap {
                grid-template-rows: 1fr;
            }
            .s-faq-accordion__inner-a {
                overflow: hidden;
                min-height: 0;
            }
            .s-faq-accordion__inner-a p {
                font-size: 13.5px;
                line-height: 2.1;
                color: var(--ink-2);
                margin: 0 0 var(--s-5);
            }`,
        js: PLAY_ON_VIEW,
    },
    {
        id: "faq-columns",
        title: "並べる一問一答",
        titleEn: "FAQ Columns",
        kind: "faq",
        note: "質問が少なく、答えが短いときに。開かずに全部読めるので、迷わせません。",
        uses: { motions: ["underline-draw"] },
        tags: ["columns", "grid"],
        html: `
            <section class="s-faq-columns">
                <div class="s-faq-columns__inner">
                    <p class="s-faq-columns__lead p-underline-draw" data-play-on-view>
                        聞かれることは、<em>だいたい決まっています</em>
                    </p>
                    <dl class="s-faq-columns__list">
                        <div class="s-faq-columns__item">
                            <dt>費用はどのくらい？</dt>
                            <dd>一枚もののサイトで 25 万円から。お見積もりは無料です。</dd>
                        </div>
                        <div class="s-faq-columns__item">
                            <dt>写真は用意が必要？</dt>
                            <dd>お持ちのもので進められます。撮影が必要な場合はご紹介します。</dd>
                        </div>
                        <div class="s-faq-columns__item">
                            <dt>文章も頼めますか？</dt>
                            <dd>方向性を一緒に決めたうえで、こちらで書くこともできます。</dd>
                        </div>
                        <div class="s-faq-columns__item">
                            <dt>途中でやめられますか？</dt>
                            <dd>着手前であれば無料です。以降は進んだぶんのみ精算します。</dd>
                        </div>
                    </dl>
                </div>
            </section>`,
        css: `
            .s-faq-columns {
                padding: var(--s-9) var(--s-5);
                background: var(--bg);
            }
            .s-faq-columns__inner {
                max-width: 980px;
                margin: 0 auto;
            }

            /* 動き（underline-draw）の既定は中央寄せ。ここでは中央のまま大きさだけ上げる */
            .s-faq-columns__lead {
                font-size: clamp(19px, 2.4vw, 28px);
                margin: 0 0 var(--s-8);
            }
            /* underline-draw の下線は em に重ねた 1 本の絶対配置。em が行をまたぐと
               2 行目に下線が付かないので、inline-block にして途中で折らせない */
            .s-faq-columns__lead em {
                display: inline-block;
            }

            .s-faq-columns__list {
                display: grid;
                grid-template-columns: 1fr;
                gap: 0;
                margin: 0;
                border-top: 1px solid var(--line);
            }
            @media (min-width: 760px) {
                .s-faq-columns__list {
                    grid-template-columns: 1fr 1fr;
                    column-gap: var(--s-7);
                }
            }
            .s-faq-columns__item {
                padding: var(--s-5) 0;
                border-bottom: 1px solid var(--line);
            }
            .s-faq-columns__item dt {
                font-family: var(--font-display);
                font-size: 15px;
                font-weight: 600;
                margin-bottom: var(--s-2);
            }
            .s-faq-columns__item dd {
                font-size: 13.5px;
                line-height: 2;
                color: var(--ink-2);
                margin: 0;
            }`,
        js: PLAY_ON_VIEW,
    },

    /* =========================== CTA ========================= */
    {
        id: "cta-band",
        title: "地を反転させた帯",
        titleEn: "Inverted CTA Band",
        kind: "cta",
        note: "ページの最後に、色を反転させた帯を一本。上まで読んだ人が迷わないよう、出口をひとつだけ置きます。下の帯は継ぎ目なく流れ続けます。",
        uses: { motions: ["mask-rise", "btn-fill", "marquee-seamless"] },
        tags: ["色の反転", "infinite"],
        html: `
            <section class="s-cta-band">
                <div class="s-cta-band__inner">
                    <h2 class="s-cta-band__head p-mask-rise" data-play-on-view>
                        <span class="p-mask-rise__line"><i>まだ形になっていない話でも、</i></span>
                        <span class="p-mask-rise__line"><i>聞かせてください。</i></span>
                    </h2>
                    <p class="s-cta-band__lead">
                        「作るかどうかも決まっていない」で構いません。
                        2 営業日以内に返信します。
                    </p>
                    <button class="s-cta-band__btn p-btn-fill" type="button"><span>お問い合わせ</span></button>
                </div>
                <div class="p-marquee-seamless" aria-hidden="true">
                    <div class="p-marquee-seamless__track">
                        <span>LANDING PAGE — CORPORATE — WEB APP — LINE 連携 — 保守・改善 —&nbsp;</span>
                        <span aria-hidden="true">LANDING PAGE — CORPORATE — WEB APP — LINE 連携 — 保守・改善 —&nbsp;</span>
                    </div>
                </div>
            </section>`,
        css: `
            .s-cta-band {
                padding: var(--s-9) 0 0;
                background: var(--invert-bg);
                color: var(--invert-ink);
            }
            .s-cta-band__inner {
                max-width: 760px;
                margin: 0 auto;
                padding: 0 var(--s-5) var(--s-8);
                text-align: center;
            }

            /* 動き（mask-rise）は地の色を持たない。反転した帯なので文字色だけ渡す */
            .s-cta-band__head {
                color: var(--invert-ink);
                font-size: clamp(21px, 3vw, 34px);
                margin: 0 0 var(--s-5);
            }

            .s-cta-band__lead {
                font-size: 14px;
                line-height: 2.1;
                color: var(--invert-ink);
                opacity: 0.72;
                margin: 0 0 var(--s-7);
            }

            /* 動き（btn-fill）は緑の枠に緑の塗りが既定。反転した地の上では
               枠と塗りを生成りにして、流れ込んだあとに文字が沈むようにする */
            .s-cta-band__btn {
                color: var(--invert-ink);
                border-color: var(--invert-ink);
            }
            .s-cta-band__btn::before {
                background: var(--invert-ink);
            }
            .s-cta-band__btn:hover,
            .s-cta-band__btn.is-hover {
                color: var(--invert-bg);
            }`,
        js: PLAY_ON_VIEW,
    },
    {
        id: "cta-form",
        title: "その場で書ける問い合わせ",
        titleEn: "Inline Contact Form",
        kind: "cta",
        note: "別ページに飛ばさず、最後にフォームを置く形。項目を絞るほど、書きかけでやめられにくくなります。",
        uses: { motions: ["label-float", "btn-arrow-slide"] },
        tags: ["form", ":focus-within"],
        html: `
            <section class="s-cta-form">
                <div class="s-cta-form__inner">
                    <div class="s-cta-form__copy">
                        <p class="s-cta-form__label">Contact</p>
                        <h2 class="s-cta-form__head">まずは一行だけでも</h2>
                        <p class="s-cta-form__d">
                            いま困っていることを書いていただければ、こちらから質問します。
                            見積もりまで無料です。
                        </p>
                    </div>
                    <form class="s-cta-form__form" onsubmit="return false">
                        <div class="p-label-float">
                            <input id="s-cta-form-name" type="text" placeholder=" " />
                            <label for="s-cta-form-name">お名前</label>
                        </div>
                        <div class="p-label-float">
                            <input id="s-cta-form-mail" type="email" placeholder=" " />
                            <label for="s-cta-form-mail">メールアドレス</label>
                        </div>
                        <div class="s-cta-form__area p-label-float">
                            <textarea id="s-cta-form-body" rows="4" placeholder=" "></textarea>
                            <label for="s-cta-form-body">相談したいこと</label>
                        </div>
                        <button class="p-btn-arrow-slide" type="submit">
                            <span class="p-btn-arrow-slide__t">送信する</span>
                            <span class="p-btn-arrow-slide__a" aria-hidden="true">→</span>
                        </button>
                    </form>
                </div>
            </section>`,
        css: `
            .s-cta-form {
                padding: var(--s-9) var(--s-5);
                background: var(--bg-2);
            }
            .s-cta-form__inner {
                max-width: 1000px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--s-7);
            }
            @media (min-width: 820px) {
                .s-cta-form__inner {
                    grid-template-columns: 0.9fr 1fr;
                    gap: var(--s-9);
                    align-items: start;
                }
            }
            .s-cta-form__label {
                font-family: var(--font-latin);
                font-size: 11px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--mark);
                margin: 0 0 var(--s-3);
            }
            .s-cta-form__head {
                font-family: var(--font-display);
                font-size: clamp(20px, 2.6vw, 30px);
                font-weight: 600;
                margin: 0 0 var(--s-4);
            }
            .s-cta-form__d {
                font-size: 13.5px;
                line-height: 2.1;
                color: var(--ink-2);
                margin: 0;
            }

            .s-cta-form__form {
                display: flex;
                flex-direction: column;
                gap: var(--s-5);
                align-items: flex-start;
            }

            /* 動き（label-float）は 240px の単票が既定。欄の幅いっぱいに使う */
            .s-cta-form__form .p-label-float {
                max-width: none;
            }

            /* label-float は input 前提。textarea にも同じ浮き方をさせる */
            .s-cta-form__area textarea {
                width: 100%;
                padding: 22px 12px 8px;
                font-family: var(--font-body);
                font-size: 14px;
                line-height: 1.9;
                color: var(--ink);
                background: var(--surface);
                border: 1px solid var(--line);
                border-radius: 3px;
                resize: vertical;
            }
            .s-cta-form__area textarea:focus {
                outline: none;
                border-color: var(--accent);
            }
            .s-cta-form__area:focus-within label,
            .s-cta-form__area textarea:not(:placeholder-shown) + label {
                transform: translateY(-9px);
                font-size: 10.5px;
                letter-spacing: 0.06em;
                color: var(--accent);
            }`,
        js: null,
    },
];
