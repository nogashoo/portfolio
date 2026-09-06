/* =====================================================================
   Lab / 層 3 — 部品（Component）

   場面の中に入る、単体で意味を持つもの。

   **動きとの違いは「状態を持つかどうか」。** 動きは振る舞いだけを切り出したもので、
   btn-fill は「触れると塗りが流れ込む」しか知らない。部品は主か副か、押せるか押せないか、
   開いているか閉じているかを知っている。だから見本も 1 個ではなく、
   **並びと状態を一枚に並べた見本帳**の形にする。

   動きに似たものがあっても（accordion-smooth、checkbox-check、label-float）、
   **部品の挙動そのものは部品が持つ**。あちらは升目の中で見せるための作り物で、
   勝手に開いたり hover でチェックが付いたりする。実際に使えるのはこちら。
   動きは、部品の上に飾りとして乗せるもの。

   書くときの約束
     1. id は一意・kebab-case。CSS の接頭辞 .c-<id> と URL のハッシュを兼ねる
     2. html のルート要素はちょうど 1 つ、data-component を持ち、クラスは .c-<id>
     3. CSS のセレクタは .c-<id> 始まり。見本帳の枠（.c-sheet）だけ共通で借りてよい
     4. 値は下地（data/foundation.js）の CSS 変数で書く
     5. **本物として動くこと。** input は input、開閉は details かボタン。
        見た目だけ似せた作り物は動きの層の役目で、この層に置く意味がない
     6. 状態は「並べて見せる」。ホバーしないと見えない状態は、見本帳では別の一行に置く
     7. title は形を名指しする。件数は入れない
   ===================================================================== */

window.LAB_COMPONENT_KINDS = [
    { id: "button", label: "Button", labelJa: "ボタン",   note: "押させるもの" },
    { id: "field",  label: "Field",  labelJa: "入力欄",   note: "書かせる・選ばせる" },
    { id: "panel",  label: "Panel",  labelJa: "開閉",     note: "隠して、必要なときだけ出す" },
    { id: "status", label: "Status", labelJa: "状態",     note: "いま何が起きているか" },
];

/* 見本帳の枠。部品そのものではないので、どの見本でも同じものを使う。
   1 行 = 1 状態。左に何の状態かを置き、右に実物を並べる */
const SHEET_CSS = `
    .c-sheet {
        padding: var(--s-7) var(--s-6);
        background: var(--bg);
    }
    .c-sheet__row {
        display: grid;
        grid-template-columns: 88px 1fr;
        align-items: center;
        gap: var(--s-5);
        padding: var(--s-4) 0;
        border-top: 1px solid var(--line);
    }
    .c-sheet__row:first-child {
        border-top: 0;
        padding-top: 0;
    }
    .c-sheet__tag {
        font-family: var(--font-latin);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ink-3);
    }
    .c-sheet__set {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--s-4);
    }`;

window.LAB_COMPONENTS = [
    /* ========================= Button ======================== */
    {
        id: "button-pair",
        title: "主と副のボタン",
        titleEn: "Primary and Secondary",
        kind: "button",
        note: "一画面に主役はひとつだけ。塗りは行かせたい先に使い、それ以外は枠線か文字だけにします。押せない状態も同じ形で持ちます。",
        uses: { motions: [] },
        html: `
            <div class="c-button-pair" data-component>
                <div class="c-sheet">
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">通常</span>
                        <span class="c-sheet__set">
                            <button class="c-button-pair__btn" type="button">お問い合わせ</button>
                            <button class="c-button-pair__btn c-button-pair__btn--sub" type="button">資料を見る</button>
                            <button class="c-button-pair__btn c-button-pair__btn--text" type="button">あとで</button>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">押せない</span>
                        <span class="c-sheet__set">
                            <button class="c-button-pair__btn" type="button" disabled>お問い合わせ</button>
                            <button class="c-button-pair__btn c-button-pair__btn--sub" type="button" disabled>資料を見る</button>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">大きさ</span>
                        <span class="c-sheet__set">
                            <button class="c-button-pair__btn c-button-pair__btn--lg" type="button">大</button>
                            <button class="c-button-pair__btn" type="button">中</button>
                            <button class="c-button-pair__btn c-button-pair__btn--sm" type="button">小</button>
                        </span>
                    </div>
                </div>
            </div>`,
        css: `
            .c-button-pair__btn {
                font-family: var(--font-body);
                font-size: 14px;
                font-weight: 500;
                line-height: 1;
                padding: 14px 26px;
                color: var(--bg);
                background: var(--accent);
                border: 1px solid var(--accent);
                border-radius: 4px;
                cursor: pointer;
                transition:
                    background var(--dur-fast) var(--ease-out),
                    color var(--dur-fast) var(--ease-out),
                    border-color var(--dur-fast) var(--ease-out);
            }
            .c-button-pair__btn:hover {
                background: var(--invert-bg);
                border-color: var(--invert-bg);
            }
            /* キーボードで辿る人にも、いまどこにいるかを見せる */
            .c-button-pair__btn:focus-visible {
                outline: 2px solid var(--mark);
                outline-offset: 2px;
            }

            .c-button-pair__btn--sub {
                color: var(--accent);
                background: transparent;
            }
            .c-button-pair__btn--sub:hover {
                color: var(--bg);
                background: var(--accent);
            }

            .c-button-pair__btn--text {
                color: var(--ink-2);
                background: transparent;
                border-color: transparent;
                padding-inline: 10px;
            }
            .c-button-pair__btn--text:hover {
                color: var(--ink);
                background: var(--bg-2);
                border-color: transparent;
            }

            /* 押せないことは色を薄くするだけでなく、カーソルでも伝える */
            .c-button-pair__btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }
            .c-button-pair__btn:disabled:hover {
                background: var(--accent);
                border-color: var(--accent);
                color: var(--bg);
            }
            .c-button-pair__btn--sub:disabled:hover {
                color: var(--accent);
                background: transparent;
            }

            .c-button-pair__btn--lg {
                font-size: 15px;
                padding: 18px 34px;
            }
            .c-button-pair__btn--sm {
                font-size: 12.5px;
                padding: 10px 18px;
            }
            ${SHEET_CSS}`,
        js: null,
    },
    {
        id: "button-submit",
        title: "送信ボタンの一生",
        titleEn: "Submit States",
        kind: "button",
        note: "押す前・送信中・終わったあと。押した瞬間に見た目が変わらないと、二度押しされます。押してみてください。",
        uses: { motions: ["btn-loading", "success-check"] },
        html: `
            <div class="c-button-submit" data-component>
                <div class="c-sheet">
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">押す前</span>
                        <span class="c-sheet__set">
                            <button class="c-button-submit__btn" type="button" data-demo>この内容で送信する</button>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">送信中</span>
                        <span class="c-sheet__set">
                            <button class="p-btn-loading" type="button" disabled>
                                <i aria-hidden="true"></i><span>送信中</span>
                            </button>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">終わった</span>
                        <span class="c-sheet__set c-button-submit__done">
                            <svg class="p-success-check" viewBox="0 0 52 52" role="img" aria-label="完了" data-play="1">
                                <circle class="p-success-check__ring" cx="26" cy="26" r="23" />
                                <path class="p-success-check__tick" d="M15 27 L23 35 L38 19" />
                            </svg>
                            <span>送信しました。折り返しご連絡します。</span>
                        </span>
                    </div>
                </div>
            </div>`,
        css: `
            .c-button-submit__btn {
                font-family: var(--font-body);
                font-size: 14px;
                font-weight: 500;
                line-height: 1;
                padding: 14px 26px;
                color: var(--bg);
                background: var(--accent);
                border: 1px solid var(--accent);
                border-radius: 4px;
                cursor: pointer;
            }
            .c-button-submit__btn:focus-visible {
                outline: 2px solid var(--mark);
                outline-offset: 2px;
            }
            .c-button-submit__btn[data-state="sending"] {
                opacity: 0.55;
                cursor: progress;
            }
            .c-button-submit__done {
                font-size: 13px;
                color: var(--ink-2);
            }
            .c-button-submit__done .p-success-check {
                width: 26px;
                height: 26px;
                flex: 0 0 auto;
            }
            ${SHEET_CSS}`,
        js: `const btn = document.querySelector("[data-demo]");
/* 押した瞬間に押せなくする。ここを怠ると同じ問い合わせが二通届く */
btn.addEventListener("click", () => {
    if (btn.dataset.state === "sending") return;
    const label = btn.textContent;
    btn.dataset.state = "sending";
    btn.disabled = true;
    btn.textContent = "送信中…";
    setTimeout(() => {
        btn.textContent = "送信しました";
        setTimeout(() => {
            btn.textContent = label;
            btn.disabled = false;
            delete btn.dataset.state;
        }, 1600);
    }, 1400);
});`,
    },

    /* ========================== Field ======================== */
    {
        id: "field-text",
        title: "浮くラベルの入力欄",
        titleEn: "Floating Label Field",
        kind: "field",
        note: "書き始めるとラベルが上に逃げるので、何を書く欄か消えません。空欄・入力済み・エラーを同じ形で持ちます。実際に書き込めます。",
        uses: { motions: [] },
        html: `
            <div class="c-field-text" data-component>
                <div class="c-sheet">
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">空欄</span>
                        <span class="c-sheet__set">
                            <label class="c-field-text__field">
                                <input type="text" placeholder=" " />
                                <span>お名前</span>
                            </label>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">入力済み</span>
                        <span class="c-sheet__set">
                            <label class="c-field-text__field">
                                <input type="email" placeholder=" " value="komugi@example.com" />
                                <span>メールアドレス</span>
                            </label>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">エラー</span>
                        <span class="c-sheet__set">
                            <label class="c-field-text__field" data-invalid="1">
                                <input type="tel" placeholder=" " value="090" aria-describedby="c-field-text-err" />
                                <span>電話番号</span>
                                <em id="c-field-text-err">数字のみで、10 桁か 11 桁で入れてください</em>
                            </label>
                        </span>
                    </div>
                </div>
            </div>`,
        css: `
            .c-field-text__field {
                position: relative;
                display: block;
                width: 280px;
            }
            .c-field-text__field input {
                width: 100%;
                font-family: var(--font-body);
                font-size: 14px;
                color: var(--ink);
                background: var(--surface);
                border: 1px solid var(--line);
                border-radius: 3px;
                padding: 20px 12px 8px;
            }
            .c-field-text__field input:focus {
                outline: none;
                border-color: var(--accent);
            }
            .c-field-text__field > span {
                position: absolute;
                left: 13px;
                top: 15px;
                font-size: 14px;
                color: var(--ink-3);
                pointer-events: none;
                transition:
                    transform var(--dur-fast) var(--ease-out),
                    font-size var(--dur-fast) var(--ease-out),
                    color var(--dur-fast) var(--ease-out);
            }
            /* :placeholder-shown が「まだ空」の判定。value の有無を JS で見なくてよい */
            .c-field-text__field input:focus + span,
            .c-field-text__field input:not(:placeholder-shown) + span {
                transform: translateY(-9px);
                font-size: 10.5px;
                letter-spacing: 0.06em;
                color: var(--accent);
            }

            .c-field-text__field em {
                display: block;
                font-style: normal;
                font-size: 11.5px;
                line-height: 1.7;
                color: var(--mark);
                margin-top: 6px;
            }
            /* エラーは色だけで伝えない。文言を必ず添える */
            .c-field-text__field[data-invalid="1"] input {
                border-color: var(--mark);
            }
            .c-field-text__field[data-invalid="1"] input:not(:placeholder-shown) + span {
                color: var(--mark);
            }
            ${SHEET_CSS}`,
        js: null,
    },
    {
        id: "field-choice",
        title: "選ぶ・チェックする",
        titleEn: "Choice Controls",
        kind: "field",
        note: "ひとつだけ選ぶ・いくつでも選ぶ・一覧から選ぶ。見た目を作り替えても、中身は本物の input なのでキーボードでも操作できます。",
        uses: { motions: [] },
        html: `
            <div class="c-field-choice" data-component>
                <div class="c-sheet">
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">ひとつ</span>
                        <span class="c-sheet__set">
                            <label class="c-field-choice__opt">
                                <input type="radio" name="c-field-choice-plan" checked />
                                <span>新しく作る</span>
                            </label>
                            <label class="c-field-choice__opt">
                                <input type="radio" name="c-field-choice-plan" />
                                <span>いまのを直す</span>
                            </label>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">いくつでも</span>
                        <span class="c-sheet__set">
                            <label class="c-field-choice__opt">
                                <input type="checkbox" checked />
                                <span>写真の撮影</span>
                            </label>
                            <label class="c-field-choice__opt">
                                <input type="checkbox" />
                                <span>文章の作成</span>
                            </label>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">一覧から</span>
                        <span class="c-sheet__set">
                            <label class="c-field-choice__select">
                                <select>
                                    <option>すぐにでも</option>
                                    <option>3 か月以内</option>
                                    <option>まだ決めていない</option>
                                </select>
                            </label>
                        </span>
                    </div>
                </div>
            </div>`,
        css: `
            .c-field-choice__opt {
                display: inline-flex;
                align-items: center;
                gap: 9px;
                font-size: 13.5px;
                color: var(--ink);
                cursor: pointer;
            }
            /* 本物の input を残したまま見た目だけ作る。
               隠して span で描き直すと、キーボードとスクリーンリーダーを失う */
            .c-field-choice__opt input {
                appearance: none;
                width: 19px;
                height: 19px;
                margin: 0;
                flex: 0 0 auto;
                background: var(--surface);
                border: 1px solid var(--line-2);
                cursor: pointer;
                display: grid;
                place-items: center;
                transition:
                    background var(--dur-fast) var(--ease-out),
                    border-color var(--dur-fast) var(--ease-out);
            }
            .c-field-choice__opt input[type="radio"] {
                border-radius: 50%;
            }
            .c-field-choice__opt input[type="checkbox"] {
                border-radius: 3px;
            }
            .c-field-choice__opt input::before {
                content: "";
                transform: scale(0);
                transition: transform var(--dur-fast) var(--ease-out);
            }
            .c-field-choice__opt input[type="radio"]::before {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: var(--bg);
            }
            .c-field-choice__opt input[type="checkbox"]::before {
                width: 10px;
                height: 6px;
                border-left: 2px solid var(--bg);
                border-bottom: 2px solid var(--bg);
                transform: scale(0) rotate(-45deg);
                margin-top: -2px;
            }
            .c-field-choice__opt input:checked {
                background: var(--accent);
                border-color: var(--accent);
            }
            .c-field-choice__opt input[type="radio"]:checked::before {
                transform: scale(1);
            }
            .c-field-choice__opt input[type="checkbox"]:checked::before {
                transform: scale(1) rotate(-45deg);
            }
            .c-field-choice__opt input:focus-visible {
                outline: 2px solid var(--mark);
                outline-offset: 2px;
            }

            .c-field-choice__select select {
                font-family: var(--font-body);
                font-size: 13.5px;
                color: var(--ink);
                background: var(--surface);
                border: 1px solid var(--line);
                border-radius: 3px;
                padding: 11px 14px;
                cursor: pointer;
            }
            .c-field-choice__select select:focus {
                outline: none;
                border-color: var(--accent);
            }
            ${SHEET_CSS}`,
        js: null,
    },

    /* ========================== Panel ======================= */
    {
        id: "panel-accordion",
        title: "開閉する質問",
        titleEn: "Accordion",
        kind: "panel",
        note: "押すと開き、もう一度押すと閉じます。答えの長さが違っても動きが崩れず、閉じているあいだも中身は検索に拾われます。押してみてください。",
        uses: { motions: [] },
        html: `
            <div class="c-panel-accordion" data-component>
                <div class="c-sheet">
                    <div class="c-panel-accordion__list">
                        <details class="c-panel-accordion__item" open>
                            <summary>対応エリアはどこまでですか？</summary>
                            <div class="c-panel-accordion__wrap">
                                <div class="c-panel-accordion__inner">
                                    <p>オンラインで完結するため全国対応しています。東京近郊であれば対面での打ち合わせも可能です。</p>
                                </div>
                            </div>
                        </details>
                        <details class="c-panel-accordion__item">
                            <summary>どのくらいの期間がかかりますか？</summary>
                            <div class="c-panel-accordion__wrap">
                                <div class="c-panel-accordion__inner">
                                    <p>一枚もののサイトで最短 2 週間、ページ数のあるサイトで 1〜2 か月が目安です。</p>
                                </div>
                            </div>
                        </details>
                        <details class="c-panel-accordion__item">
                            <summary>公開したあとの更新はできますか？</summary>
                            <div class="c-panel-accordion__wrap">
                                <div class="c-panel-accordion__inner">
                                    <p>ご自身で更新できる形でお渡しします。手が回らない場合は更新代行も承っています。</p>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </div>`,
        css: `
            .c-panel-accordion__list {
                border-top: 1px solid var(--line);
            }
            .c-panel-accordion__item {
                border-bottom: 1px solid var(--line);
            }
            .c-panel-accordion__item summary {
                position: relative;
                list-style: none;
                cursor: pointer;
                padding: 16px 40px 16px 0;
                font-family: var(--font-display);
                font-size: 14.5px;
                font-weight: 600;
                line-height: 1.7;
            }
            .c-panel-accordion__item summary::-webkit-details-marker {
                display: none;
            }
            .c-panel-accordion__item summary:focus-visible {
                outline: 2px solid var(--mark);
                outline-offset: 2px;
            }
            /* ＋ と − は 1px の線 2 本。translateY(-50%) を外すと 1px ぶん下にずれる */
            .c-panel-accordion__item summary::after,
            .c-panel-accordion__item summary::before {
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
            .c-panel-accordion__item summary::before {
                transform: translateY(-50%) rotate(90deg);
            }
            .c-panel-accordion__item[open] summary::before {
                transform: translateY(-50%) rotate(0deg);
            }

            /* height:auto はアニメーションできないが、grid の行を 0fr から 1fr へ
               変えれば中身の高さのまま開く。子の overflow:hidden が要 */
            .c-panel-accordion__wrap {
                display: grid;
                grid-template-rows: 0fr;
                transition: grid-template-rows var(--dur-base) var(--ease-out);
            }
            .c-panel-accordion__item[open] .c-panel-accordion__wrap {
                grid-template-rows: 1fr;
            }
            .c-panel-accordion__inner {
                overflow: hidden;
                min-height: 0;
            }
            .c-panel-accordion__inner p {
                font-size: 13px;
                line-height: 2.1;
                color: var(--ink-2);
                margin: 0 0 16px;
            }
            ${SHEET_CSS}`,
        js: null,
    },
    {
        id: "panel-tabs",
        title: "切り替えるタブ",
        titleEn: "Tabs",
        kind: "panel",
        note: "同じ場所で中身だけ入れ替えます。矢印キーでも移動できます。項目が 4 つを超えるなら、タブではなく見出しで並べたほうが読めます。",
        uses: { motions: [] },
        html: `
            <div class="c-panel-tabs" data-component>
                <div class="c-sheet">
                    <div class="c-panel-tabs__bar" role="tablist" aria-label="料金プラン">
                        <button class="c-panel-tabs__tab" type="button" role="tab" aria-selected="true" aria-controls="c-panel-tabs-a" id="c-panel-tabs-ta">一枚もの</button>
                        <button class="c-panel-tabs__tab" type="button" role="tab" aria-selected="false" aria-controls="c-panel-tabs-b" id="c-panel-tabs-tb" tabindex="-1">複数ページ</button>
                        <button class="c-panel-tabs__tab" type="button" role="tab" aria-selected="false" aria-controls="c-panel-tabs-c" id="c-panel-tabs-tc" tabindex="-1">保守</button>
                    </div>
                    <div class="c-panel-tabs__panel" role="tabpanel" id="c-panel-tabs-a" aria-labelledby="c-panel-tabs-ta">
                        <p class="c-panel-tabs__price">25<small>万円から</small></p>
                        <p>写真と文章がそろっていれば、最短 2 週間で公開できます。</p>
                    </div>
                    <div class="c-panel-tabs__panel" role="tabpanel" id="c-panel-tabs-b" aria-labelledby="c-panel-tabs-tb" hidden>
                        <p class="c-panel-tabs__price">60<small>万円から</small></p>
                        <p>ページ数と、更新する仕組みを入れるかどうかで変わります。</p>
                    </div>
                    <div class="c-panel-tabs__panel" role="tabpanel" id="c-panel-tabs-c" aria-labelledby="c-panel-tabs-tc" hidden>
                        <p class="c-panel-tabs__price">1<small>万円 / 月から</small></p>
                        <p>毎月の更新と、数字を見ながらの改善をまとめてお受けします。</p>
                    </div>
                </div>
            </div>`,
        css: `
            .c-panel-tabs__bar {
                display: flex;
                gap: var(--s-5);
                border-bottom: 1px solid var(--line);
            }
            .c-panel-tabs__tab {
                position: relative;
                font-family: var(--font-body);
                font-size: 13.5px;
                font-weight: 500;
                color: var(--ink-3);
                background: transparent;
                border: 0;
                padding: 10px 2px 12px;
                cursor: pointer;
            }
            .c-panel-tabs__tab:focus-visible {
                outline: 2px solid var(--mark);
                outline-offset: 2px;
            }
            /* 選ばれていることは色と下線の両方で示す。色だけだと見分けられない人がいる */
            .c-panel-tabs__tab::after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: -1px;
                height: 2px;
                background: var(--accent);
                transform: scaleX(0);
                transition: transform var(--dur-fast) var(--ease-out);
            }
            .c-panel-tabs__tab[aria-selected="true"] {
                color: var(--ink);
                font-weight: 600;
            }
            .c-panel-tabs__tab[aria-selected="true"]::after {
                transform: scaleX(1);
            }

            .c-panel-tabs__panel {
                padding-top: var(--s-5);
            }
            .c-panel-tabs__panel p {
                font-size: 13px;
                line-height: 2;
                color: var(--ink-2);
                margin: 0;
            }
            .c-panel-tabs__price {
                font-family: var(--font-latin);
                font-size: 34px;
                font-weight: 600;
                color: var(--ink);
                margin: 0 0 var(--s-3);
                line-height: 1.2;
            }
            .c-panel-tabs__price small {
                font-family: var(--font-body);
                font-size: 12px;
                font-weight: 400;
                color: var(--ink-3);
                margin-left: 6px;
            }
            ${SHEET_CSS}`,
        js: `const tabs = [...document.querySelectorAll('[role="tab"]')];
const show = (i) => {
    tabs.forEach((t, n) => {
        const on = n === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        /* 選ばれていないタブは Tab キーで素通りさせる（矢印キーで移動する作法） */
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
};
tabs.forEach((t, i) => {
    t.addEventListener("click", () => show(i));
    t.addEventListener("keydown", (e) => {
        const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        const next = (i + step + tabs.length) % tabs.length;
        show(next);
        tabs[next].focus();
    });
});`,
    },

    /* ========================= Status ======================== */
    {
        id: "status-toast",
        title: "その場の知らせ",
        titleEn: "Toast",
        kind: "status",
        note: "操作の結果を、画面を止めずに伝えます。成功・注意・失敗で色と印を変え、消えるまでの時間も変えます。押すと出ます。",
        uses: { motions: ["toast-slide"] },
        html: `
            <div class="c-status-toast" data-component>
                <div class="c-sheet">
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">出しかた</span>
                        <span class="c-sheet__set">
                            <button class="c-status-toast__trigger" type="button" data-toast="ok">成功</button>
                            <button class="c-status-toast__trigger" type="button" data-toast="warn">注意</button>
                            <button class="c-status-toast__trigger" type="button" data-toast="ng">失敗</button>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">見た目</span>
                        <span class="c-sheet__set c-status-toast__list">
                            <span class="c-status-toast__item" data-tone="ok"><i></i>送信が完了しました</span>
                            <span class="c-status-toast__item" data-tone="warn"><i></i>下書きのまま保存しました</span>
                            <span class="c-status-toast__item" data-tone="ng"><i></i>送信できませんでした</span>
                        </span>
                    </div>
                </div>
                <div class="c-status-toast__stack" data-stack aria-live="polite"></div>
            </div>`,
        css: `
            .c-status-toast {
                position: relative;
                min-height: 260px;
            }
            .c-status-toast__trigger {
                font-family: var(--font-body);
                font-size: 12.5px;
                color: var(--ink-2);
                background: var(--surface);
                border: 1px solid var(--line);
                border-radius: 4px;
                padding: 8px 14px;
                cursor: pointer;
            }
            .c-status-toast__trigger:hover {
                border-color: var(--line-2);
                color: var(--ink);
            }
            .c-status-toast__trigger:focus-visible {
                outline: 2px solid var(--mark);
                outline-offset: 2px;
            }

            .c-status-toast__list {
                flex-direction: column;
                align-items: flex-start;
                gap: var(--s-3);
            }
            .c-status-toast__item {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                font-size: 13px;
                color: var(--ink);
                background: var(--surface);
                border: 1px solid var(--line);
                border-radius: 5px;
                padding: 11px 18px 11px 14px;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
            }
            /* 色だけで区別しない。丸の色と、その左の縦線で二重に示す */
            .c-status-toast__item i {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                flex: 0 0 auto;
            }
            .c-status-toast__item[data-tone="ok"] i { background: var(--accent); }
            .c-status-toast__item[data-tone="warn"] i { background: var(--mark); }
            .c-status-toast__item[data-tone="ng"] i { background: var(--mark); }
            .c-status-toast__item[data-tone="ok"] { border-left: 3px solid var(--accent); }
            .c-status-toast__item[data-tone="warn"] { border-left: 3px solid var(--mark-2); }
            .c-status-toast__item[data-tone="ng"] { border-left: 3px solid var(--mark); }

            /* 実際に出る場所。重なっても下から積み上がる */
            .c-status-toast__stack {
                position: absolute;
                right: var(--s-6);
                bottom: var(--s-6);
                display: flex;
                flex-direction: column;
                gap: var(--s-3);
                align-items: flex-end;
            }
            .c-status-toast__stack .c-status-toast__item {
                animation: c-status-toast-in 420ms cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes c-status-toast-in {
                from { opacity: 0; transform: translateX(16px); }
            }
            ${SHEET_CSS}`,
        js: `const stack = document.querySelector("[data-stack]");
const WORDS = { ok: "送信が完了しました", warn: "下書きのまま保存しました", ng: "送信できませんでした" };
/* 失敗は読む時間が要るので長く出す。成功はすぐ消してよい */
const LIFE = { ok: 2600, warn: 3400, ng: 4800 };
document.querySelectorAll("[data-toast]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const tone = btn.dataset.toast;
        const el = document.createElement("span");
        el.className = "c-status-toast__item";
        el.dataset.tone = tone;
        el.innerHTML = "<i></i>" + WORDS[tone];
        stack.appendChild(el);
        setTimeout(() => el.remove(), LIFE[tone]);
    });
});`,
    },
    {
        id: "status-badge",
        title: "状態のしるし",
        titleEn: "Status Marks",
        kind: "status",
        note: "受付中か、締め切ったか。文字で書くほどではないが、ひと目で分かってほしいものに。動いている印は、いま生きていることを伝えます。",
        uses: { motions: ["badge-pulse"] },
        html: `
            <div class="c-status-badge" data-component>
                <div class="c-sheet">
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">静かな印</span>
                        <span class="c-sheet__set">
                            <span class="c-status-badge__tag" data-tone="on">受付中</span>
                            <span class="c-status-badge__tag" data-tone="wait">準備中</span>
                            <span class="c-status-badge__tag" data-tone="off">締切</span>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">動く印</span>
                        <span class="c-sheet__set">
                            <span class="p-badge-pulse">
                                <span class="p-badge-pulse__dot"></span>
                                <span class="p-badge-pulse__label">Available for projects</span>
                            </span>
                        </span>
                    </div>
                    <div class="c-sheet__row">
                        <span class="c-sheet__tag">数と一緒</span>
                        <span class="c-sheet__set">
                            <span class="c-status-badge__count">お問い合わせ<b>3</b></span>
                            <span class="c-status-badge__count">下書き<b>12</b></span>
                        </span>
                    </div>
                </div>
            </div>`,
        css: `
            .c-status-badge__tag {
                font-family: var(--font-body);
                font-size: 11.5px;
                font-weight: 500;
                letter-spacing: 0.04em;
                border-radius: 999px;
                padding: 5px 12px;
                border: 1px solid transparent;
            }
            /* 地の色を薄く敷き、文字は濃く。塗りつぶすと本文より目立ちすぎる */
            .c-status-badge__tag[data-tone="on"] {
                color: var(--accent);
                background: color-mix(in srgb, var(--accent) 12%, transparent);
            }
            .c-status-badge__tag[data-tone="wait"] {
                color: var(--mark);
                background: color-mix(in srgb, var(--mark) 12%, transparent);
            }
            .c-status-badge__tag[data-tone="off"] {
                color: var(--ink-3);
                background: transparent;
                border-color: var(--line);
            }

            .c-status-badge__count {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: var(--ink-2);
            }
            .c-status-badge__count b {
                font-family: var(--font-latin);
                font-size: 11.5px;
                font-weight: 600;
                color: var(--bg);
                background: var(--accent);
                border-radius: 999px;
                min-width: 20px;
                padding: 2px 6px;
                text-align: center;
            }
            ${SHEET_CSS}`,
        js: null,
    },
];
