# Portfolio — Shota Nogami

Frontend-focused Full-stack Engineer のポートフォリオサイト。

静的な HTML / CSS / JavaScript の単一ページ構成。

公開URL（GitHub Pages）: https://nogashoo.github.io/portfolio/

## 構成

```
portfolio/
├── index.html   # ページ本体（Hero / About / Works / Skills / Contact）
├── style.css    # スタイル（デザイントークン・レイアウト・モーション）
└── main.js      # スクロール演出・ヒーローのテキストアニメーション
```

## ローカル確認

```
open index.html        # ブラウザで直接開く
# または簡易サーバ
python3 -m http.server 8000   # http://localhost:8000
```

## デプロイ（GitHub Pages）

リポジトリの **Settings → Pages** で `Branch: main / root` を選択して保存すると公開される。

## 実績の追加

`index.html` の Works セクションにある `<!-- TIMELINE ITEM -->` のブロックをコピーして、
期間・カテゴリ・タイトル・概要・技術タグ・成果を編集する。
