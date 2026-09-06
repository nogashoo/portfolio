/* =====================================================================
   Lab — 5 つの層の目録

   カタログ全体の骨組み。入口（/lab/）がこの配列から層の一覧を組み立て、
   各層のページは自分の件数がここと合っているかを起動時に検算する。
   件数を二重に持つのは冗長だが、入口に全層のデータを読み込ませずに
   件数を出すための割り切り。ズレたらコンソールに出るので気づける。

   href が null の層はまだ実体がない。**入口では隠さず「準備中」として見せる。**
   「上から順に決めていく」という並び自体がこのカタログの主張なので、
   途中の層を抜くと主張が伝わらない（層の中身の 0 件は従来どおり隠す）。
   ===================================================================== */

window.LAB_LAYERS = [
    {
        id: "foundation",
        n: 0,
        label: "Foundation",
        labelJa: "下地",
        note: "配色・書体と文字組・余白のリズム・動きの速さ",
        scope: "1 サイトに 1 セット",
        href: "./foundation/",
        count: 4,
    },
    {
        id: "shell",
        n: 1,
        label: "Shell",
        labelJa: "骨格",
        note: "幕開け・ヘッダー・ナビ・スクロールの効き",
        scope: "1 サイトに 1 セット",
        href: "./shell/",
        count: 8,
    },
    {
        id: "section",
        n: 2,
        label: "Section",
        labelJa: "場面",
        note: "ヒーロー・特徴・流れ・実績・よくある質問・問い合わせ",
        scope: "5〜12 個を選んで並べる",
        href: "./section/",
        count: 12,
    },
    {
        id: "component",
        n: 3,
        label: "Component",
        labelJa: "部品",
        note: "ボタン・入力欄・開閉・状態のしるし",
        scope: "場面の中で選ぶ",
        href: "./component/",
        count: 8,
    },
    {
        id: "motion",
        n: 4,
        label: "Motion",
        labelJa: "動き",
        note: "登場・反応・待ち・結果・常時",
        scope: "上の 4 層すべてに乗せられる",
        href: "./motion/",
        count: 49,
    },
];

/* 層のページから呼ぶ検算。件数がズレたら黙って古い数字を出さない */
window.LAB_LAYERS.check = (id, actual) => {
    const layer = window.LAB_LAYERS.find((l) => l.id === id);
    if (layer && layer.count !== actual) {
        console.warn(
            `[lab] ${id} の件数がずれています: data/layers.js は ${layer.count}、実際は ${actual}`,
        );
    }
};
