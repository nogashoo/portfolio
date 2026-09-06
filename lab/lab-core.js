/* =====================================================================
   Lab — 全ページ共通の下回り

   層ごとにページを分けている（/lab/、/lab/motion/、/lab/section/）ので、
   どの層でも同じでなければ困るものだけをここに集める:
   文字列の整形、サイドバーの層ナビ、絞り込み、下地の選択、
   見本（iframe）の組み立てと採寸、アニメーションの入切。
   層ごとの組み立ては各ページのスクリプトが持つ。

   読み込み順は lab-core.js → data/*.js → 各ページのスクリプト（いずれも defer）。
   ===================================================================== */
window.LabCore = (() => {
    "use strict";

    const root = document.documentElement;

    /* ---------------- 文字列 ---------------- */

    const esc = (s) =>
        String(s).replace(
            /[&<>"']/g,
            (c) =>
                ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                })[c],
        );

    /* データファイルの中では配列のインデントぶん字下げされているので、
       起動時に一度だけ揃える。場面の CSS は連結して 1 枚のスタイルシートにするため、
       字下げが揃っていないと読めない塊になる */
    const dedent = (src) => {
        const lines = String(src).replace(/\t/g, "    ").split("\n");
        while (lines.length && !lines[0].trim()) lines.shift();
        while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
        const indent = lines
            .filter((l) => l.trim())
            .reduce((min, l) => Math.min(min, l.match(/^ */)[0].length), Infinity);
        return lines.map((l) => l.slice(indent)).join("\n");
    };

    /* ---------------- サイドバーの層ナビ ---------------- */

    /* 5 層の並びはカタログの主張そのものなので、どのページでも同じ順・同じ形で出す。
       base は各ページから /lab/ までの相対パス（入口なら "./"、層のページなら "../"） */
    const layerNav = (listEl, { currentId, base = "./" } = {}) => {
        const layers = window.LAB_LAYERS || [];
        if (!listEl || !layers.length) return;
        listEl.innerHTML = layers
            .map((l) => {
                const here = l.id === currentId;
                const ready = Boolean(l.href);
                const tail = ready
                    ? `<span class="lab-navlink__n">${l.count}</span>`
                    : `<span class="lab-navlink__soon">準備中</span>`;
                const inner = `
                    <span class="lab-navlink__step" aria-hidden="true">${l.n}</span>
                    <span class="lab-navlink__label">${esc(l.labelJa)}</span>
                    ${tail}`;
                if (!ready) {
                    return `<li><span class="lab-navlink lab-navlink--soon">${inner}</span></li>`;
                }
                const href = base + l.href.replace(/^\.\//, "");
                return `<li><a class="lab-navlink" href="${esc(href)}"${
                    here ? ' aria-current="page"' : ""
                }>${inner}</a></li>`;
            })
            .join("");
    };

    /* ---------------- 絞り込み ---------------- */

    /* 区画チップと検索。2 つのページで挙動がずれると学習が無駄になるので
       ここに 1 つだけ置く。呼ぶ側は「この item のカード / 区画 / 索引はどれか」
       を返す関数を渡すだけでよい */
    const buildFilter = ({
        chipsEl,
        searchEl,
        countEl,
        emptyEl,
        kinds,
        items,
        cardOf,
        groupOf,
        navOf,
        predicate,
        unit = "件",
    }) => {
        let kindKey = "all";
        let query = "";

        const hay = (it) =>
            [
                it.id,
                it.title,
                it.titleEn,
                it.note,
                it.kind,
                (it.tags || []).join(" "),
                (it.uses?.motions || []).join(" "),
            ]
                .join(" ")
                .toLowerCase();

        if (chipsEl) {
            const rows = [{ id: "all", labelJa: "すべて", n: items.length }].concat(
                kinds.map((k) => ({
                    id: k.id,
                    labelJa: k.labelJa,
                    n: items.filter((i) => i.kind === k.id).length,
                })),
            );
            chipsEl.innerHTML = rows
                .map(
                    (k) => `
                <button class="lab-chip" type="button" data-kind="${esc(k.id)}"
                        aria-pressed="${k.id === "all" ? "true" : "false"}">
                    ${esc(k.labelJa)}<span class="lab-chip__n">${k.n}</span>
                </button>`,
                )
                .join("");
        }

        const apply = () => {
            let shown = 0;
            items.forEach((it) => {
                const ok =
                    (kindKey === "all" || it.kind === kindKey) &&
                    (!query || hay(it).includes(query)) &&
                    (!predicate || predicate(it));
                const card = cardOf(it);
                if (card) card.hidden = !ok;
                if (ok) shown += 1;
            });

            kinds.forEach((k) => {
                const alive = items.some(
                    (it) => it.kind === k.id && cardOf(it) && !cardOf(it).hidden,
                );
                const group = groupOf && groupOf(k.id);
                if (group) group.hidden = !alive;
                const nav = navOf && navOf(k.id);
                if (nav) nav.hidden = !alive;
            });

            if (countEl) countEl.textContent = `${shown} / ${items.length} ${unit}`;
            if (emptyEl) emptyEl.hidden = shown > 0;
            if (chipsEl) {
                chipsEl.querySelectorAll("[data-kind]").forEach((b) =>
                    b.setAttribute(
                        "aria-pressed",
                        b.dataset.kind === kindKey ? "true" : "false",
                    ),
                );
            }
        };

        if (chipsEl) {
            chipsEl.addEventListener("click", (e) => {
                const btn = e.target.closest("[data-kind]");
                if (!btn) return;
                kindKey = btn.dataset.kind;
                apply();
            });
        }
        if (searchEl) {
            searchEl.addEventListener("input", () => {
                query = searchEl.value.trim().toLowerCase();
                apply();
            });
        }
        apply();
        return { apply, setKind: (k) => { kindKey = k; apply(); } };
    };

    /* ---------------- 下地の選択 ---------------- */

    /* 選んだ下地はページをまたいで持ち回る。層 0 で選んで層 2 を見に行く、
       という順路がカタログの主張そのものなので、移動で消えては意味がない */
    const F_KEY = "lab-foundation";
    const fListeners = new Set();

    const foundations = () => window.LAB_FOUNDATIONS || [];
    const currentFoundation = () => {
        const list = foundations();
        if (!list.length) return null;
        let id = null;
        try {
            id = localStorage.getItem(F_KEY);
        } catch {
            /* プライベートモード等では読めない。先頭の下地で続行する */
        }
        return list.find((f) => f.id === id) || list[0];
    };
    const setFoundation = (id) => {
        try {
            localStorage.setItem(F_KEY, id);
        } catch {
            /* 保存できなくてもこの画面の表示は正しいので無視する */
        }
        const f = currentFoundation();
        fListeners.forEach((fn) => fn(f));
    };
    const onFoundationChange = (fn) => {
        fListeners.add(fn);
    };

    /* ---------------- 見本の組み立て（層 1・2・3 で共通） ---------------- */

    /* Lab 側の配線。srcdoc には混ぜず、読み込み後に差し込む。
       混ぜると、見本そのものの CSS と Lab の都合が見分けられなくなる */
    const CHROME_CSS = `
        html[data-motion="off"] *,
        html[data-motion="off"] *::before,
        html[data-motion="off"] *::after,
        html[data-paused="1"] *,
        html[data-paused="1"] *::before,
        html[data-paused="1"] *::after {
            animation-play-state: paused !important;
        }
        html[data-motion="off"] *,
        html[data-motion="off"] *::before,
        html[data-motion="off"] *::after {
            transition: none !important;
        }

        /* 「一度きりの登場」だけは止めずに最後のコマへ飛ばす。
           止めると最初のコマ（opacity:0 や translateY）で固まり、
           登場するはずの中身がそのまま消える。
           回り続けるものに data-play は付かないので、これで選り分けられる */
        html[data-motion="off"] [data-play="1"],
        html[data-motion="off"] [data-play="1"] *,
        html[data-motion="off"] [data-play="1"] *::before,
        html[data-motion="off"] [data-play="1"] *::after {
            animation-play-state: running !important;
            animation-delay: 0ms !important;
            animation-duration: 1ms !important;
        }`;

    /* データの字下げをそろえ、規約違反をその場で知らせる。
       id はプレビューの CSS 接頭辞そのものなので、重複すると別の見本のスタイルが混ざる */
    const normalize = (items, layerLabel) => {
        const seen = new Set();
        items.forEach((it) => {
            if (seen.has(it.id)) {
                console.warn(`[lab] ${layerLabel}の id が重複しています: ${it.id}`);
            }
            seen.add(it.id);
            it.html = dedent(it.html);
            it.css = dedent(it.css);
            if (it.js) it.js = dedent(it.js);
        });
        return items;
    };

    /* 層の重なりを、そのまま CSS の重なりにする。
       この 1 枚で下地も動きも揃うので、iframe は追加の読み込みを要らない */
    const itemCss = (item) => {
        const f = currentFoundation();
        const list = foundations();
        const motions = window.LAB_MOTIONS || [];
        const blocks = [
            `/* ── 下地 Foundation ── ${f.label} ── */\n${dedent(list.cssFor(f))}`,
        ];
        (item.uses?.motions || []).forEach((id) => {
            const m = motions.find((x) => x.id === id);
            if (!m) {
                console.warn(`[lab] ${item.id} が知らない動きを参照しています: ${id}`);
                return;
            }
            blocks.push(`/* ── 動き Motion ── ${m.title}（${id}） ── */\n${dedent(m.css)}`);
        });
        /* 動きのリテラル色を下地に向け直す 1 枚。動きの後・本体の前に挟むので、
           本体側からはさらに上書きできる */
        blocks.push(`/* ── 動きを下地になじませる ── */\n${dedent(list.motionBridge)}`);
        blocks.push(`/* ── ${item.title}（${item.id}） ── */\n${dedent(item.css)}`);
        return blocks.join("\n\n");
    };

    const itemSrcdoc = (item) =>
        [
            "<!doctype html>",
            '<html lang="ja">',
            "<head>",
            '<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            "<style>",
            itemCss(item),
            "</style>",
            "</head>",
            "<body>",
            item.html,
            item.js ? `<script>\n${item.js}\n<\/script>` : "",
            "</body>",
            "</html>",
        ]
            .filter(Boolean)
            .join("\n");

    /* 読み込みのたびに配線を差し込み、採寸をやり直す。
       書体が届いてから行数が変わることがあるので二度測る */
    const dressFrame = (iframe, after) => {
        iframe.addEventListener("load", () => {
            const doc = iframe.contentDocument;
            const style = doc.createElement("style");
            style.textContent = CHROME_CSS;
            doc.head.appendChild(style);
            doc.documentElement.dataset.motion = motionOn ? "on" : "off";
            after();
            setTimeout(after, 400);
        });
    };

    /* iframe は実幅のまま描いて transform で縮める。枠に合わせて細くすると、
       中のメディアクエリが SP 側に落ちて「PC の見た目」を確かめられなくなる。

       mode: "full"     中身の高さぶん全部出す（場面）
             "viewport" 画面 1 つぶんの高さで、中をスクロールさせる（骨格）
             "thumb"    枠の比率は CSS が固定。幅だけ合わせ、はみ出しは枠が切る */
    const fitFrame = (iframe, { width, mode = "full", viewportH = 640, trimTop = false }) => {
        const doc = iframe.contentDocument;
        if (!doc || !doc.documentElement) return null;
        const holder = iframe.parentElement;

        iframe.style.width = `${width}px`;
        const avail = holder.clientWidth;
        const scale = Math.min(1, avail / width);

        let h = viewportH;
        if (mode !== "viewport") {
            /* body の高さではなく documentElement を測る。
               本体のルートが margin を持つと body の高さでは足りなくなる */
            iframe.style.height = "0px";
            h = doc.documentElement.scrollHeight;
        }
        /* 枠より中身が短いと、下に枠の地色が残って「途中で終わった」ように見える。
           枠を埋めるところまで伸ばす（伸ばしたぶんは見本自身の地色で埋まる） */
        if (mode === "thumb") {
            h = Math.max(h, Math.ceil(holder.clientHeight / scale));
        }
        iframe.style.height = `${h}px`;
        iframe.style.transform = `scale(${scale})`;

        if (mode === "thumb") {
            iframe.style.left = "0px";
            /* 見本は上下に大きな余白を持つのが普通なので、そのまま上から見せると
               タイルの 2 割が地色になる。中身が始まる位置まで持ち上げ、12px 残す */
            let shift = 0;
            if (trimTop) {
                const root = doc.querySelector("section, [data-shell]") || doc.body;
                const first = root && root.firstElementChild;
                if (first) {
                    const pad =
                        first.getBoundingClientRect().top - root.getBoundingClientRect().top;
                    shift = Math.max(0, Math.round(pad * scale) - 12);
                }
            }
            iframe.style.top = `${-shift}px`;
        } else {
            iframe.style.top = "0px";
            iframe.style.left = `${Math.max(0, (avail - width * scale) / 2)}px`;
            holder.style.height = `${Math.round(h * scale)}px`;
        }
        return { scale, width, height: h };
    };

    /* ---------------- モーションのオン / オフ ---------------- */

    /* 購読するのは各ページのスクリプト。場面ページは iframe の中にも伝える必要が
       あるので、属性を立てるだけでなく購読を配る */
    const listeners = new Set();
    let motionOn = true;

    const setMotion = (on) => {
        motionOn = on;
        root.dataset.motion = on ? "on" : "off";
        document.querySelectorAll("[data-motion-toggle]").forEach((btn) => {
            btn.setAttribute("aria-pressed", on ? "true" : "false");
            const label = btn.querySelector("[data-motion-label]");
            if (label) label.textContent = on ? "アニメーション オン" : "アニメーション オフ";
        });
        try {
            localStorage.setItem("lab-motion", on ? "on" : "off");
        } catch {
            /* 保存できなくても表示は正しいので無視する */
        }
        listeners.forEach((fn) => fn(on));
    };

    /* 登録と同時に今の状態を 1 回配る。あとから生成される要素でも
       初期状態の反映を書き忘れられない */
    const onMotionChange = (fn) => {
        listeners.add(fn);
        fn(motionOn);
    };

    document.addEventListener("click", (e) => {
        if (e.target.closest("[data-motion-toggle]")) {
            setMotion(root.dataset.motion !== "on");
        }
    });

    /* ---------------- サイドバーの引き出し（狭い画面） ---------------- */

    document.addEventListener("click", (e) => {
        if (e.target.closest("[data-nav-open]")) {
            root.dataset.labnav = root.dataset.labnav === "open" ? "closed" : "open";
            return;
        }
        /* 引き出しの外側、または中のリンクを押したら閉じる */
        if (root.dataset.labnav !== "open") return;
        if (e.target.closest(".lab-scrim") || e.target.closest(".lab-nav a")) {
            root.dataset.labnav = "closed";
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") root.dataset.labnav = "closed";
    });

    /* ---------------- 起動 ---------------- */

    const prefersReduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let stored = null;
    try {
        stored = localStorage.getItem("lab-motion");
    } catch {
        /* プライベートモード等では読めない。既定値で続行する */
    }

    /* 既定は OS 設定を尊重する。訪問者が明示的に選んだ場合だけそれを上書き */
    setMotion(stored ? stored === "on" : !prefersReduced);

    return {
        esc,
        dedent,
        layerNav,
        buildFilter,
        onMotionChange,
        isMotionOn: () => motionOn,
        currentFoundation,
        setFoundation,
        onFoundationChange,
        normalize,
        itemCss,
        itemSrcdoc,
        dressFrame,
        fitFrame,
    };
})();
