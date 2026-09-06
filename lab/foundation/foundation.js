/* =====================================================================
   Lab / 層 0「下地」のページ（/lab/foundation/）

   下地は色と書体そのものなので、見本は**その下地の値で描く**。
   カードの色と書体は data/foundation.js の CSS から実際に読み取って当てる
   （手で書き写すと、値を直したときに一覧だけ古いまま残る）。

   読み込み順は lab-core.js → data/{layers,foundation}.js → foundation.js。
   ===================================================================== */
(() => {
    "use strict";

    const { esc, layerNav, currentFoundation, setFoundation, onFoundationChange } =
        window.LabCore;

    const list = window.LAB_FOUNDATIONS || [];
    if (!list.length) return;

    if (window.LAB_LAYERS) window.LAB_LAYERS.check("foundation", list.length);

    /* :root の宣言をそのまま読む。一覧が下地の定義とずれない唯一の方法 */
    const tokens = (f) => {
        const out = {};
        String(f.css).replace(
            /--([a-z0-9-]+):\s*([^;]+);/g,
            (_, k, v) => {
                out[k] = v.trim();
                return "";
            },
        );
        return out;
    };

    const root = document.querySelector("[data-lab-foundations]");
    if (!root) return;

    root.innerHTML = list
        .map((f) => {
            const t = tokens(f);
            const chips = [
                ["地", t.bg],
                ["面", t.surface],
                ["文字", t.ink],
                ["主役", t.accent],
                ["差し色", t.mark],
            ]
                .map(
                    ([name, color]) =>
                        `<span class="lab-found__chip" title="${esc(name)}"
                               style="background:${esc(color)}"></span>`,
                )
                .join("");

            return `
            <li class="lab-card lab-found" id="${esc(f.id)}" data-found="${esc(f.id)}">
                <div class="lab-found__sample"
                     style="background:${esc(t.bg)};color:${esc(t.ink)};border-color:${esc(t.line)}">
                    <p class="lab-found__display" style="font-family:${esc(t["font-display"])}">
                        見出しはこう組みます
                    </p>
                    <p class="lab-found__text"
                       style="font-family:${esc(t["font-body"])};color:${esc(t["ink-2"])}">
                        本文はこの太さ、この行間で流れます。
                    </p>
                    <p class="lab-found__mark"
                       style="font-family:${esc(t["font-latin"])};color:${esc(t.mark)}">
                        ${esc(f.labelEn)}
                    </p>
                    <span class="lab-found__chips">${chips}</span>
                </div>
                <div class="lab-card__body">
                    <p class="lab-card__en">${esc(f.labelEn)}</p>
                    <h3 class="lab-card__title">${esc(f.label)}</h3>
                    <p class="lab-found__note">${esc(f.note)}</p>
                    <div class="lab-found__foot">
                        <span class="lab-found__motion">動き：${esc(f.motion)}</span>
                        <button class="lab-btn" type="button" data-pick="${esc(f.id)}">この下地にする</button>
                        <a class="lab-btn lab-found__go" href="../section/">場面で見る →</a>
                    </div>
                </div>
            </li>`;
        })
        .join("");

    const mark = (f) => {
        root.querySelectorAll("[data-found]").forEach((card) => {
            const on = card.dataset.found === f.id;
            card.dataset.selected = on ? "1" : "0";
            const btn = card.querySelector("[data-pick]");
            btn.textContent = on ? "選択中" : "この下地にする";
            btn.setAttribute("aria-pressed", on ? "true" : "false");
            btn.disabled = on;
        });
    };

    root.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-pick]");
        if (btn) setFoundation(btn.dataset.pick);
    });

    onFoundationChange(mark);
    mark(currentFoundation());

    layerNav(document.querySelector("[data-lab-layers]"), {
        currentId: "foundation",
        base: "../",
    });
})();
