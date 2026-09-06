/* =====================================================================
   Lab / 層 4「動き」のページ（/lab/motion/）

   - data/motions.js の LAB_MOTIONS / LAB_MOTION_KINDS からカードを生成する
   - パーツの html / css をプレビューに流し込む
   - 画面外ではアニメーションを止める

   **カードは見せるだけで、コードは出さない。** 見る相手が書き手ではないため。
   html / css をデータで持っているのはプレビューを組み立てるためで、画面には出さない。

   読み込み順は lab-core.js → data/{layers,motions}.js → motion.js（いずれも defer）。
   ===================================================================== */
(() => {
    "use strict";

    const { esc, dedent, layerNav, buildFilter } = window.LabCore;

    const parts = window.LAB_MOTIONS || [];
    let kinds = window.LAB_MOTION_KINDS || [];
    if (!parts.length) return;

    /* ---------------- 正規化 & 検証 ---------------- */

    const seen = new Set();
    parts.forEach((p) => {
        if (seen.has(p.id)) {
            /* id はプレビューの CSS 接頭辞そのものなので、重複すると
               別のパーツのスタイルが混ざる。規約が破れた瞬間に気づける唯一の防壁 */
            console.warn(`[lab] パーツ id が重複しています: ${p.id}`);
        }
        seen.add(p.id);
        p.html = dedent(p.html);
        p.css = dedent(p.css);
    });

    /* 入口が出す件数はこのファイルを読まずに済ませるため data/layers.js に
       写してある。写しがずれたまま古い数字を出さないよう検算する */
    if (window.LAB_LAYERS) window.LAB_LAYERS.check("motion", parts.length);

    /* 空の kind は索引にも区画にも出さない。
       作りかけの箱が並ぶと、網羅量の印象がむしろ落ちるため */
    kinds = kinds.filter((k) => parts.some((p) => p.kind === k.id));

    /* ---------------- 動き方の呼び名 ---------------- */

    /* パーツ側は trigger に機械的な値しか持たないので、画面に出す語はここで与える */
    const TRIGGERS = [
        { id: "replay", label: "1 回" },
        { id: "hover", label: "ホバー" },
        { id: "loop", label: "ループ" },
        { id: "scroll", label: "スクロール" },
    ];
    const triggerLabel = (id) =>
        (TRIGGERS.find((t) => t.id === id) || {}).label || id;

    /* ---------------- カード ---------------- */

    /* カードは「どう動くか」を見せるだけに絞る。説明もタグも置かない
       —— 動きは読むより見たほうが早く、並べて見比べるのが一覧の仕事だから。
       操作ボタンはプレビューに重ねる（本文に置くと高さが揃わない） */
    const cardHTML = (part) => {
        const id = esc(part.id);

        let controls = "";
        if (part.trigger === "replay") {
            controls = `<button class="lab-btn" type="button" data-replay>もう一度</button>`;
        } else if (part.trigger === "hover") {
            /* タッチ端末では :hover が発火しないので、状態を手で作れるようにする */
            controls = `<button class="lab-btn" type="button" data-hover aria-pressed="false">触れた状態にする</button>`;
        }

        return `
            <li class="lab-card" id="${id}" data-part="${id}">
                <div class="lab-card__stage">
                    <div class="lab-preview" data-bg="${esc(part.bg || "paper")}" data-playing="0"></div>
                    <span class="lab-badge" data-trigger="${esc(part.trigger)}">${esc(triggerLabel(part.trigger))}</span>
                    ${controls ? `<div class="lab-card__ctrl">${controls}</div>` : ""}
                </div>
                <div class="lab-card__body">
                    <p class="lab-card__en">${esc(part.titleEn)}</p>
                    <h3 class="lab-card__title">${esc(part.title)}</h3>
                </div>
            </li>`;
    };

    /* パーツの中身を DOM に流し込む。
       html / css はサイト作者が書いた静的データなので innerHTML でよい */
    const hydrate = (card, part) => {
        const preview = card.querySelector(".lab-preview");
        preview.innerHTML = part.html;

        const style = document.createElement("style");
        style.dataset.part = part.id;
        style.textContent = part.css;
        document.head.appendChild(style);

        /* パーツの html はルート要素をちょうど 1 つ持ち、
           そのクラスが .p-<id> であることを規約としている */
        const el = preview.querySelector(`.p-${part.id}`);
        if (typeof part.js === "function") part.js(el || preview);
        if (!el) return;

        const replay = () => {
            el.removeAttribute("data-play");
            /* 一度リフローさせないと、外して付け直しても再生されない */
            void el.offsetWidth;
            el.dataset.play = "1";
        };

        const replayBtn = card.querySelector("[data-replay]");
        if (replayBtn) replayBtn.addEventListener("click", replay);

        const hoverBtn = card.querySelector("[data-hover]");
        if (hoverBtn) {
            hoverBtn.addEventListener("click", () => {
                const on = el.classList.toggle("is-hover");
                hoverBtn.setAttribute("aria-pressed", on ? "true" : "false");
                hoverBtn.textContent = on ? "手を離す" : "触れた状態にする";
            });
        }

        card._labPlay = part.trigger === "replay" ? replay : null;
    };

    /* ---------------- 一覧の組み立て ---------------- */

    const groupsRoot = document.querySelector("[data-lab-groups]");
    if (!groupsRoot) return;

    groupsRoot.innerHTML = kinds
        .map((kind) => {
            const items = parts.filter((p) => p.kind === kind.id);
            return `
            <section class="lab-group" id="kind-${esc(kind.id)}" aria-labelledby="kind-${esc(kind.id)}-title">
                <div class="lab-group__head">
                    <h2 class="lab-group__title" id="kind-${esc(kind.id)}-title">${esc(kind.labelJa)}</h2>
                    <span class="lab-group__n">${items.length}</span>
                    <p class="lab-group__note">${esc(kind.note)}</p>
                </div>
                <ol class="lab-grid" data-grid="${esc(kind.id)}"></ol>
            </section>`;
        })
        .join("");

    kinds.forEach((kind) => {
        const grid = groupsRoot.querySelector(`[data-grid="${kind.id}"]`);
        const items = parts.filter((p) => p.kind === kind.id);
        grid.innerHTML = items.map(cardHTML).join("");
        items.forEach((part) => {
            const card = grid.querySelector(`[data-part="${part.id}"]`);
            if (card) hydrate(card, part);
        });
    });

    /* サイドバーの索引 */
    const side = document.querySelector("[data-lab-side]");
    if (side) {
        side.innerHTML = kinds
            .map(
                (k) => `
            <li>
                <a class="lab-navlink" href="#kind-${esc(k.id)}" data-side="kind-${esc(k.id)}">
                    <span class="lab-navlink__label">${esc(k.labelJa)}</span>
                    <span class="lab-navlink__n">${parts.filter((p) => p.kind === k.id).length}</span>
                </a>
            </li>`,
            )
            .join("");
    }

    /* ---------------- 絞り込み ---------------- */

    const seg = document.querySelector("[data-lab-trigger]");
    let triggerKey = "all";

    const filter = buildFilter({
        chipsEl: document.querySelector("[data-lab-chips]"),
        searchEl: document.querySelector("[data-lab-search]"),
        countEl: document.querySelector("[data-lab-count]"),
        emptyEl: document.querySelector("[data-lab-empty]"),
        kinds,
        items: parts,
        cardOf: (p) => document.getElementById(p.id),
        groupOf: (id) => document.getElementById(`kind-${id}`),
        navOf: (id) => {
            const a = document.querySelector(`[data-side="kind-${id}"]`);
            return a && a.closest("li");
        },
        predicate: (p) => triggerKey === "all" || p.trigger === triggerKey,
        unit: "件",
    });

    if (seg) {
        const usable = TRIGGERS.filter((t) => parts.some((p) => p.trigger === t.id));
        seg.innerHTML = [{ id: "all", label: "すべて" }]
            .concat(usable)
            .map(
                (t) =>
                    `<button type="button" data-trigger-key="${esc(t.id)}"
                             aria-pressed="${t.id === "all" ? "true" : "false"}">${esc(t.label)}</button>`,
            )
            .join("");
        seg.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-trigger-key]");
            if (!btn) return;
            triggerKey = btn.dataset.triggerKey;
            seg.querySelectorAll("[data-trigger-key]").forEach((b) =>
                b.setAttribute(
                    "aria-pressed",
                    b.dataset.triggerKey === triggerKey ? "true" : "false",
                ),
            );
            filter.apply();
        });
    }

    /* ---------------- サイドバーをスクロールに追従させる ---------------- */

    const sideLinks = document.querySelectorAll("[data-side]");
    if (sideLinks.length && "IntersectionObserver" in window) {
        const visible = new Set();
        const spyIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) =>
                    e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id),
                );
                /* 複数の区画が同時に見えているときは、いちばん上のものを現在地とする */
                const first = kinds
                    .map((k) => `kind-${k.id}`)
                    .find((id) => visible.has(id));
                if (first) {
                    sideLinks.forEach((a) =>
                        a.setAttribute("aria-current", a.dataset.side === first ? "true" : "false"),
                    );
                }
            },
            { rootMargin: "-20% 0px -60% 0px" },
        );
        document.querySelectorAll(".lab-group").forEach((s) => spyIO.observe(s));
    }

    /* ---------------- 再生制御 ---------------- */

    const cards = document.querySelectorAll(".lab-card");

    if ("IntersectionObserver" in window) {
        const playIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const card = entry.target;
                    const preview = card.querySelector(".lab-preview");
                    if (!preview) return;
                    preview.dataset.playing = entry.isIntersecting ? "1" : "0";
                    /* 一度きりの演出は、画面に入った最初の 1 回だけ自動再生する */
                    if (entry.isIntersecting && card._labPlay && !card._labPlayed) {
                        card._labPlayed = true;
                        card._labPlay();
                    }
                });
            },
            { threshold: 0.25 },
        );
        cards.forEach((c) => playIO.observe(c));
    } else {
        cards.forEach((c) => {
            const preview = c.querySelector(".lab-preview");
            if (preview) preview.dataset.playing = "1";
            if (c._labPlay) c._labPlay();
        });
    }

    /* ---------------- 層のナビ & ハッシュ ---------------- */

    layerNav(document.querySelector("[data-lab-layers]"), {
        currentId: "motion",
        base: "../",
    });

    /* カードは motion.js が生成するため、ページ読み込み時点ではまだ存在しない。
       生成後に自分でスクロールし直す。behavior は "instant" でなければならない
       —— "auto" は ../../style.css の html{scroll-behavior:smooth} を拾ってしまい、
       深いリンクで開いたとき数千 px をゆっくり流れることになる */
    if (location.hash) {
        const raw = decodeURIComponent(location.hash.slice(1));
        /* 区画の見出しは以前 cat-<kind> だった。共有済みのリンクを拾い直す */
        const target =
            document.getElementById(raw) ||
            document.getElementById(raw.replace(/^cat-/, "kind-"));
        if (target) {
            requestAnimationFrame(() =>
                target.scrollIntoView({ block: "start", behavior: "instant" }),
            );
        }
    }
})();
