/* =====================================================================
   Lab / 層 2「場面」のページ（/lab/section/）

   見本を <iframe srcdoc> に入れる。理由は 3 つ:
     1. 場面はコンテナ幅・グリッド・全幅の背景を持つので、動きのページのように
        接頭辞（.p-<id>）だけでは隔離しきれない
     2. 枠の幅を変えるだけで、SP / PC の実物プレビューになる
     3. 下地 → 動き → 場面 と層の順に連結するだけで組み立てられる

   一覧はサムネイルだけ。実物大の見本と短い説明は詳細パネルへ送る
   （並べて見比べるのが一覧の仕事、読むのは 1 つに決めたあとの仕事）。

   **カタログはコードを出さない。** 見せる相手が書き手ではないため。

   見本の組み立て（下地 → 動き → 橋 → 場面の連結）と採寸は lab-core.js が持つ。
   骨格・部品も同じものを使うので、層ごとに書き写さない。

   読み込み順は lab-core.js → data/{layers,foundation,motions,sections}.js
   → section.js（いずれも defer）。
   ===================================================================== */
(() => {
    "use strict";

    const {
        esc,
        layerNav,
        buildFilter,
        onMotionChange,
        currentFoundation,
        setFoundation,
        onFoundationChange,
        normalize,
        itemCss,
        itemSrcdoc,
        dressFrame,
        fitFrame,
    } = window.LabCore;

    const sections = window.LAB_SECTIONS || [];
    const foundations = window.LAB_FOUNDATIONS || [];
    let kinds = window.LAB_SECTION_KINDS || [];
    if (!sections.length || !foundations.length) return;

    let foundation = currentFoundation();

    /* ---------------- 正規化 & 検証 ---------------- */

    normalize(sections, "場面");
    if (window.LAB_LAYERS) window.LAB_LAYERS.check("section", sections.length);

    kinds = kinds.filter((k) => sections.some((s) => s.kind === k.id));
    const byId = new Map(sections.map((s) => [s.id, s]));

    /* 見本の実幅。中のメディアクエリを本物として評価させるため、
       枠に合わせて細くはしない（縮小は transform でやる） */
    const WIDTHS = { pc: 1180, sp: 390 };

    /* ---------------- 一覧（サムネイル） ---------------- */

    const thumbs = new Map();

    const fitThumb = (iframe) =>
        fitFrame(iframe, { width: WIDTHS.pc, mode: "thumb", trimTop: true });

    const mountThumb = (card) => {
        const sec = byId.get(card.dataset.scene);
        if (!sec || thumbs.has(sec.id)) return;
        const holder = card.querySelector("[data-frame]");
        const iframe = document.createElement("iframe");
        iframe.title = `${sec.title} の見本`;
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("tabindex", "-1");
        iframe.setAttribute("aria-hidden", "true");
        dressFrame(iframe, () => fitThumb(iframe));
        iframe.srcdoc = itemSrcdoc(sec);
        holder.appendChild(iframe);
        thumbs.set(sec.id, iframe);
    };

    /* 枠は div のまま。<button> の中に <iframe> を置くと Chrome が中身を描かない。
       当たり判定はタイトルのボタンを疑似要素でカード全面に伸ばして作る */
    const cardHTML = (sec) => `
        <li class="lab-card lab-scene" id="${esc(sec.id)}" data-scene="${esc(sec.id)}">
            <div class="lab-scene__frame" data-frame></div>
            <div class="lab-scene__body">
                <h3 class="lab-scene__title">
                    <button class="lab-scene__open" type="button">${esc(sec.title)}</button>
                </h3>
                <span class="lab-scene__en">${esc(sec.titleEn)}</span>
            </div>
        </li>`;

    const groupsRoot = document.querySelector("[data-lab-groups]");
    if (!groupsRoot) return;

    groupsRoot.innerHTML = kinds
        .map((kind) => {
            const items = sections.filter((s) => s.kind === kind.id);
            return `
            <section class="lab-group" id="kind-${esc(kind.id)}" aria-labelledby="kind-${esc(kind.id)}-title">
                <div class="lab-group__head">
                    <h2 class="lab-group__title" id="kind-${esc(kind.id)}-title">${esc(kind.labelJa)}</h2>
                    <span class="lab-group__n">${items.length}</span>
                    <p class="lab-group__note">${esc(kind.note)}</p>
                </div>
                <ol class="lab-grid lab-grid--scenes" data-grid="${esc(kind.id)}">
                    ${items.map(cardHTML).join("")}
                </ol>
            </section>`;
        })
        .join("");

    /* ---------------- 詳細パネル ---------------- */

    const panel = document.querySelector("[data-lab-detail]");
    const scrim = document.querySelector("[data-lab-detail-scrim]");
    let detailFrame = null;
    let detailId = null;
    let widthKey = "pc";
    let lastFocus = null;
    let closeTimer = null;

    const fitDetail = () => {
        if (!detailFrame) return;
        const w = WIDTHS[widthKey];
        const r = fitFrame(detailFrame, { width: w, mode: "full" });
        const badge = panel.querySelector("[data-detail-scale]");
        if (badge && r) badge.textContent = `${w}px · ${Math.round(r.scale * 100)}%`;
    };

    const setWidth = (key) => {
        widthKey = key;
        panel.dataset.w = key;
        panel.querySelectorAll("[data-width-key]").forEach((b) =>
            b.setAttribute(
                "aria-pressed",
                b.dataset.widthKey === key ? "true" : "false",
            ),
        );
        requestAnimationFrame(fitDetail);
        setTimeout(fitDetail, 350);
    };

    const openDetail = (id, { focus = true } = {}) => {
        const sec = byId.get(id);
        if (!sec || !panel) return;
        detailId = id;
        lastFocus = document.activeElement;

        panel.querySelector("[data-detail-title]").textContent = sec.title;
        panel.querySelector("[data-detail-en]").textContent = sec.titleEn;
        panel.querySelector("[data-detail-note]").textContent = sec.note;

        const holder = panel.querySelector("[data-detail-frame]");
        holder.innerHTML = "";
        detailFrame = document.createElement("iframe");
        detailFrame.title = `${sec.title} の見本`;
        detailFrame.setAttribute("scrolling", "no");
        dressFrame(detailFrame, fitDetail);
        detailFrame.srcdoc = itemSrcdoc(sec);
        holder.appendChild(detailFrame);

        /* 閉じかけのまま次を開かれることがある。後片づけの予約を先に取り消さないと、
           開いた直後に「閉じる」処理が走って中身ごと消える */
        clearTimeout(closeTimer);
        panel.hidden = false;
        scrim.hidden = false;
        /* hidden を外した直後だと transition が走らないので 1 フレーム置く */
        requestAnimationFrame(() => {
            panel.dataset.open = "1";
            scrim.dataset.open = "1";
        });
        panel.querySelector("[data-detail-body]").scrollTop = 0;
        setWidth(widthKey);
        if (focus) panel.querySelector("[data-detail-close]").focus();

        if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
    };

    const closeDetail = () => {
        if (!panel || panel.hidden) return;
        panel.dataset.open = "0";
        scrim.dataset.open = "0";
        detailId = null;
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            panel.hidden = true;
            scrim.hidden = true;
            panel.querySelector("[data-detail-frame]").innerHTML = "";
            detailFrame = null;
        }, 300);
        if (location.hash) history.replaceState(null, "", location.pathname);
        if (lastFocus && lastFocus.isConnected) lastFocus.focus();
    };

    if (panel) {
        groupsRoot.addEventListener("click", (e) => {
            const card = e.target.closest("[data-scene]");
            if (card) openDetail(card.dataset.scene);
        });
        panel.querySelector("[data-detail-close]").addEventListener("click", closeDetail);
        scrim.addEventListener("click", closeDetail);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && detailId) closeDetail();
        });
        panel.querySelectorAll("[data-width-key]").forEach((btn) => {
            btn.addEventListener("click", () => setWidth(btn.dataset.widthKey));
        });
    }

    /* ---------------- サイドバーの索引 ---------------- */

    const side = document.querySelector("[data-lab-side]");
    if (side) {
        side.innerHTML = kinds
            .map(
                (k) => `
            <li>
                <a class="lab-navlink" href="#kind-${esc(k.id)}" data-side="kind-${esc(k.id)}">
                    <span class="lab-navlink__label">${esc(k.labelJa)}</span>
                    <span class="lab-navlink__n">${sections.filter((s) => s.kind === k.id).length}</span>
                </a>
            </li>`,
            )
            .join("");
    }

    /* ---------------- 絞り込み ---------------- */

    buildFilter({
        chipsEl: document.querySelector("[data-lab-chips]"),
        searchEl: document.querySelector("[data-lab-search]"),
        countEl: document.querySelector("[data-lab-count]"),
        emptyEl: document.querySelector("[data-lab-empty]"),
        kinds,
        items: sections,
        cardOf: (s) => document.getElementById(s.id),
        groupOf: (id) => document.getElementById(`kind-${id}`),
        navOf: (id) => {
            const a = document.querySelector(`[data-side="kind-${id}"]`);
            return a && a.closest("li");
        },
        unit: "件",
    });

    /* ---------------- 下地の切り替え ---------------- */

    const fSel = document.querySelector("[data-lab-foundation]");
    if (fSel) {
        fSel.innerHTML = foundations
            .map((f) => `<option value="${esc(f.id)}">${esc(f.label)}</option>`)
            .join("");
        fSel.value = foundation.id;
        fSel.addEventListener("change", () => setFoundation(fSel.value));
    }

    onFoundationChange((f) => {
        foundation = f;
        if (fSel) fSel.value = f.id;
        /* 生成済みの見本を作り直す。srcdoc を入れ直せば load がもう一度走り、
           dress() が付けた後処理（配線の差し込みと採寸）もそのまま効く */
        thumbs.forEach((iframe, id) => {
            iframe.srcdoc = itemSrcdoc(byId.get(id));
        });
        if (detailFrame && detailId) {
            detailFrame.srcdoc = itemSrcdoc(byId.get(detailId));
        }
    });

    /* ---------------- 生成と再生の制御 ---------------- */

    const cards = [...document.querySelectorAll(".lab-scene")];

    if ("IntersectionObserver" in window) {
        /* 近づいたら作る。12 枚を一斉に起こすと、どれも動き出す前に重くなる */
        const mountIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (!e.isIntersecting) return;
                    mountThumb(e.target);
                    mountIO.unobserve(e.target);
                });
            },
            { rootMargin: "600px 0px" },
        );
        cards.forEach((c) => mountIO.observe(c));

        /* 画面外に出たら止める。ループ物を何枚も回し続けないため */
        const playIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    const iframe = thumbs.get(e.target.dataset.scene);
                    const doc = iframe && iframe.contentDocument;
                    if (doc) doc.documentElement.dataset.paused = e.isIntersecting ? "0" : "1";
                });
            },
            { threshold: 0 },
        );
        cards.forEach((c) => playIO.observe(c));
    } else {
        cards.forEach(mountThumb);
    }

    /* アニメーションの入切は一覧にも詳細にも伝える */
    onMotionChange((on) => {
        const tell = (iframe) => {
            const doc = iframe && iframe.contentDocument;
            if (doc && doc.documentElement) {
                doc.documentElement.dataset.motion = on ? "on" : "off";
            }
        };
        thumbs.forEach(tell);
        tell(detailFrame);
    });

    /* 親の幅が変われば縮尺も折り返しも変わる */
    let resizeTimer = null;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            thumbs.forEach(fitThumb);
            fitDetail();
        }, 200);
    });

    /* ---------------- サイドバーをスクロールに追従させる ---------------- */

    const sideLinks = document.querySelectorAll("[data-side]");
    if (sideLinks.length && "IntersectionObserver" in window) {
        const visible = new Set();
        const spyIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) =>
                    e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id),
                );
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

    /* ---------------- 層のナビ & ハッシュ ---------------- */

    layerNav(document.querySelector("[data-lab-layers]"), {
        currentId: "section",
        base: "../",
    });

    /* 場面の id で名指しされたら、その詳細を開いた状態で始める。
       behavior は "instant"。"auto" だと ../../style.css の
       html{scroll-behavior:smooth} を拾って、深いリンクがゆっくり流れる */
    if (location.hash) {
        const raw = decodeURIComponent(location.hash.slice(1));
        if (byId.has(raw)) {
            const card = document.getElementById(raw);
            if (card) {
                requestAnimationFrame(() =>
                    card.scrollIntoView({ block: "center", behavior: "instant" }),
                );
            }
            openDetail(raw, { focus: false });
        } else {
            const group = document.getElementById(raw);
            if (group) {
                requestAnimationFrame(() =>
                    group.scrollIntoView({ block: "start", behavior: "instant" }),
                );
            }
        }
    }
})();
