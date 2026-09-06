/* =====================================================================
   Lab の入口（/lab/）

   - data/layers.js から 5 層のナビ・流れ・カードを組み立てる
   - 層ごとにページを分ける前に共有されたリンク（/lab/#mask-rise など）を
     動きのページへ送り直す

   読み込み順は lab-core.js → data/layers.js → index.js（いずれも defer）。
   ===================================================================== */
(() => {
    "use strict";

    const { esc, layerNav } = window.LabCore;
    const layers = window.LAB_LAYERS || [];

    /* 層を分ける前、パーツの id はすべて /lab/#<id> だった。
       data/motions.js の規約が「id は URL のハッシュを兼ねる／変えない」と定めている以上、
       外で共有されたリンクはこちらで拾い直す責任がある。
       この入口が自前で持つハッシュは #top だけなので、それ以外は動きのページ行き */
    const sendToMotion = () => {
        if (!location.hash || location.hash === "#top") return false;
        location.replace(`./motion/${location.hash}`);
        return true;
    };
    /* 読み込み時だけでなく hashchange でも拾う。同一ページ内のハッシュ変更は
       再読み込みを伴わないので、起動時の 1 回では取りこぼす */
    window.addEventListener("hashchange", sendToMotion);
    if (sendToMotion()) return;

    layerNav(document.querySelector("[data-lab-layers]"), { base: "./" });

    const flow = document.querySelector("[data-lab-flow]");
    if (flow) {
        flow.innerHTML = layers
            .map(
                (l) =>
                    `<span class="lab-flow__step" data-state="${l.href ? "ready" : "soon"}">${esc(l.labelJa)}</span>`,
            )
            .join('<span class="lab-flow__arrow">→</span>');
    }

    const list = document.querySelector("[data-lab-cards]");
    if (!list) return;

    list.innerHTML = layers
        .map((l) => {
            const ready = Boolean(l.href);
            const tag = ready ? "a" : "div";
            const href = ready ? ` href="${esc(l.href)}"` : "";
            const foot = ready
                ? `<span><span class="lab-layercard__n">${l.count}</span><span class="lab-layercard__unit">件</span></span>
                   <span class="lab-layercard__go">開く →</span>`
                : `<span class="lab-layercard__soon">準備中</span>`;
            return `
            <li>
                <${tag} class="lab-layercard" data-state="${ready ? "ready" : "soon"}"${href}>
                    <span class="lab-layercard__top">
                        <span class="lab-layercard__step" aria-hidden="true">${l.n}</span>
                        <span>
                            <span class="lab-layercard__name">${esc(l.labelJa)}</span>
                            <span class="lab-layercard__en">${esc(l.label)}</span>
                        </span>
                    </span>
                    <p class="lab-layercard__note">${esc(l.note)}</p>
                    <p class="lab-layercard__scope">${esc(l.scope)}</p>
                    <span class="lab-layercard__foot">${foot}</span>
                </${tag}>
            </li>`;
        })
        .join("");
})();
