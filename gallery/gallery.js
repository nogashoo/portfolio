/* =====================================================================
   gallery/index.html 専用スクリプト
   - works.js の GALLERY_WORKS から作品カードを生成する
   - サムネイル iframe を実ページ幅 1280px からカード幅に縮小フィット
   - プレビュー内の「← Gallery」フローティングリンクを隠す
   読み込み順は works.js → gallery.js → main.js（いずれも defer）。
   main.js より先にカードを DOM に入れることで data-anim="rise" の
   カスケードがそのまま効く。
   ===================================================================== */
(() => {
    "use strict";

    /* ---------------- カード生成 ---------------- */
    const grid = document.querySelector(".gallery-grid");
    if (!grid) return;

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

    const cardHTML = (work) => {
        const slug = esc(work.slug);
        /* slug 先頭の YYYY-MM-DD が公開日 */
        const date = String(work.slug).slice(0, 10);
        const dateLabel = date.split("-").join(".");
        const tags = (work.tags || [])
            .map((t) => `<li>${esc(t)}</li>`)
            .join("");
        return `
            <li class="g-card" data-anim="rise">
                <div class="g-card__preview" aria-hidden="true">
                    <div class="g-card__browser">
                        <div class="g-card__browser-bar">
                            <span class="g-card__browser-dots"><i></i><i></i><i></i></span>
                            <span class="g-card__browser-url">…/gallery/${slug}/</span>
                        </div>
                        <div class="g-card__thumb">
                            <iframe
                                src="./${slug}/"
                                title="${esc(work.title)} プレビュー"
                                loading="lazy"
                                scrolling="no"
                                tabindex="-1"
                                inert
                            ></iframe>
                        </div>
                    </div>
                </div>
                <div class="g-card__body">
                    <div class="g-card__meta">
                        <p class="g-card__cat">${esc(work.category)}</p>
                        <time class="g-card__date" datetime="${esc(date)}">${esc(dateLabel)}</time>
                    </div>
                    <h2 class="g-card__title">
                        <a class="g-card__link" href="./${slug}/">${esc(work.title)}</a>
                    </h2>
                    <p class="g-card__summary">${esc(work.summary)}</p>
                    <ul class="g-card__tags" aria-label="使用技術">${tags}</ul>
                    <span class="g-card__cta" aria-hidden="true">View Site <span class="g-card__arrow">→</span></span>
                </div>
            </li>`;
    };

    grid.innerHTML = (window.GALLERY_WORKS || []).map(cardHTML).join("");

    /* ---------------- サムネイル縮小フィット ---------------- */
    const BASE_WIDTH = 1280;
    const fit = (thumb) => {
        const frame = thumb.querySelector("iframe");
        if (!frame) return;
        frame.style.transform = `scale(${thumb.clientWidth / BASE_WIDTH})`;
    };

    /* プレビュー内では各LPの「← Gallery」リンクを隠す（同一オリジン前提） */
    const hideReturnLink = (frame) => {
        try {
            const doc = frame.contentDocument;
            if (!doc || !doc.head) return;
            const style = doc.createElement("style");
            style.textContent = ".gallery-return{display:none!important}";
            doc.head.appendChild(style);
        } catch {
            /* file:// などクロスオリジン扱いの環境では何もしない */
        }
    };

    const thumbs = grid.querySelectorAll(".g-card__thumb");
    thumbs.forEach((t) => {
        const frame = t.querySelector("iframe");
        if (!frame) return;
        frame.addEventListener("load", () => hideReturnLink(frame));
        hideReturnLink(frame);
    });

    if ("ResizeObserver" in window) {
        const ro = new ResizeObserver((entries) =>
            entries.forEach((e) => fit(e.target)),
        );
        thumbs.forEach((t) => ro.observe(t));
    } else {
        const fitAll = () => thumbs.forEach(fit);
        window.addEventListener("resize", fitAll, { passive: true });
        fitAll();
    }
})();
