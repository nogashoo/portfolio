/* =====================================================================
   Gallery 作品データ
   ---------------------------------------------------------------------
   作品を追加するときは、この配列の「先頭」に JSON オブジェクトを 1 つ
   足すだけ（新しい作品が一覧の先頭に並ぶ）。カード HTML は gallery.js
   が自動生成する。

   - slug:     gallery/ 直下のフォルダ名（YYYY-MM-DD-作品名）。
               リンク先 URL と公開日表示はここから自動生成される
   - title:    カード見出し（リンクテキスト）
   - category: カード上部のカテゴリ表示
   - summary:  説明文（1〜2文）
   - tags:     使用技術の配列
   ===================================================================== */
window.GALLERY_WORKS = [
  {
    slug: "2026-06-13-nail",
    title: "Lily nail — private nail salon",
    category: "Landing Page — Design & Build",
    summary:
      "自宅プライベートネイルサロンのLP。ダスティピンク×生成りのやさしい配色で、デザインギャラリー・料金・LINE予約導線を1ページに。",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    slug: "2026-06-11-komugi",
    title: "こむぎの時間 Bakery & Morning",
    category: "Landing Page — Design & Build",
    summary:
      "小さなまちのパン屋さんのLP。クラフト紙のやわらかなトーンで、こだわり・焼き上がり時間・店舗情報までを1ページに。",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];
