# Portfolio — Shota Nogami

Frontend-focused Full-stack Engineer のポートフォリオサイト。

静的な HTML / CSS / JavaScript の単一ページ構成。

公開URL（GitHub Pages）: https://nogashoo.github.io/portfolio/

## 構成

```
portfolio/
├── index.html   # トップページ（Hero / About / Services / Works / Skills / Contact）
├── style.css    # 全ページ共通のデザイントークン・レイアウト・モーション
├── main.js      # 全ページ共通のスクロール演出・SPナビ・ヒーローのテキストアニメーション
├── gallery/     # 制作物ギャラリー（完成した LP を丸ごと公開）
├── lab/         # サイト構築カタログ（5 層。詳しくは下記）
└── assets/brand/# ロゴ・ファビコン・OGP
```

`gallery/` と `lab/` はどちらもデータ駆動で、一覧の HTML は編集しない。

| | 中身 | 追加するとき触るファイル |
|---|---|---|
| `gallery/` | 完成したページそのもの | `gallery/works.js` の配列の先頭に 1 エントリ |
| `lab/section/` | ページを構成する塊 | `lab/data/sections.js` の `LAB_SECTIONS` に 1 オブジェクト |
| `lab/motion/` | 塊に乗せる動き | `lab/data/motions.js` の `LAB_MOTIONS` に 1 オブジェクト |

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

## Lab — サイト構築カタログ

サイトを「上から順に決めていく」順序でカタログにしたもの。層は 5 つで、
上の層は下の層で出来ている。入口は `/lab/`。

| | 層 | 何を決めるか | ページ |
|---|---|---|---|
| 0 | 下地 Foundation | 配色・書体・余白・動きの速さ | `lab/foundation/` |
| 1 | 骨格 Shell | 幕開け・ヘッダー・ナビ・スクロールの効き | `lab/shell/` |
| 2 | 場面 Section | ヒーロー・特徴・流れ・実績・FAQ・CTA | `lab/section/` |
| 3 | 部品 Component | ボタン・入力欄・開閉・状態のしるし | `lab/component/` |
| 4 | 動き Motion | 登場・反応・待ち・結果・常時 | `lab/motion/` |

層の一覧と件数は `lab/data/layers.js` が持つ。件数は各層のページが起動時に検算し、
ずれていればコンソールに出る。

**見本の組み立ては `lab-core.js` が一手に持つ**（`itemCss` / `itemSrcdoc` /
`dressFrame` / `fitFrame`）。骨格・場面・部品はどれも「下地 → 動き → 橋 → 本体」を
連結して `<iframe srcdoc>` に流す点が同じなので、層ごとに書き写さない。
層ごとのページが持つのは、一覧の組み方と詳細パネルだけ。

**カタログはコードを画面に出さない。** 見せる相手が書き手ではないため、選ぶのに
要らないものは置かない。`html` / `css` をデータで持っているのは見本を描くためで、
コピー用ではない。

```
lab/
├── index.html / index.js   入口（5 層のダッシュボード）
├── lab-core.js             共通の下回り（整形 / 層ナビ / 絞り込み / 入切 / コピー）
├── lab.css                 コンソールの見た目（全ページ共通）
├── data/                   層ごとのデータ（layers / foundation / motions / sections）
├── foundation/             層 0 のページ
├── shell/                  層 1 のページ
├── section/                層 2 のページ
├── component/              層 3 のページ
└── motion/                 層 4 のページ
```

**Lab の見た目はポートフォリオ本体と揃えない。** 本体は読み物、Lab は見比べて選ぶ
道具なので、管理画面の作法（固定サイドバー・白い面・明快な罫線・詰めた行間）に寄せて
ある。`../style.css` からは色・書体・リセットだけ借り、見た目は `lab.css` が全部持つ。
`body.lab-body` を付けて本体の地と書体を上書きし、共通ヘッダー / フッター / グレインと
`main.js`（スクロール演出）は読み込まない。

### 下地（層 0）の追加

`lab/data/foundation.js` の `LAB_FOUNDATIONS` にオブジェクトを 1 つ足すだけ。
選んだ下地は `localStorage` に残り、場面のページへ移っても引き継がれる。

トークンは**役割で呼ぶ**（`--accent` `--mark` `--ink-2` …）。`--green-deep` のような
色そのものの名前にすると、青い下地や暗い下地を足した瞬間に名前が嘘になる。

1. トークンを 1 つ残らず埋める。欠けるとその下地でだけ色が抜ける（フォールバックは書いていない）
2. `--invert-*` は「地と文字をひっくり返した帯」用。地が明るいなら暗く、暗いなら明るく
3. 余白（`--s-*`）は下地で変えない。変えると場面のレイアウトが崩れて「色違い」として比べられない

**動きのパーツは下地に合わせない**（単体で成り立つようリテラル値で書く約束のため）。
場面に載せたときだけ色を下地へ向け直す 1 枚を `LAB_FOUNDATIONS.motionBridge` が持っており、
連結の順は **動き → この橋 → 場面**。だから場面側からさらに上書きできる。

### 骨格（層 1）の追加

`lab/data/shells.js` の `LAB_SHELLS` にオブジェクトを 1 つ足すだけ。

場面との違いは 1 点。**骨格はスクロールしないと伝わらない**（ヘッダーが追従するか、
進捗が伸びるか）。だから詳細の見本は高さぶん全部出すのではなく、**画面 1 つぶんの
高さに切って中をスクロールさせる**（`fitFrame` の `mode: "viewport"`）。
一覧のサムネイルは上端が主題なので 16:9 で、上を切り詰めない。

1. `id` は一意・kebab-case。CSS の接頭辞 `.h-<id>` と URL のハッシュを兼ねる
2. `html` のルート要素はちょうど 1 つ、`data-shell` を持ち、クラスは `.h-<id>`
3. CSS のセレクタはすべて `.h-<id>` 始まりにする
4. ダミー本文は主役ではない。骨格の挙動が読めるだけの量に留め、
   スクロールを見せるので画面 2〜3 枚ぶんの高さを持たせる

### 場面（層 2）の追加

`lab/data/sections.js` の `LAB_SECTIONS` にオブジェクトを 1 つ足すだけ。HTML も
`section.js` も編集しない。`kind` を新設する場合は `LAB_SECTION_KINDS` に 1 行足す。

見本は `<iframe srcdoc>` に入る。srcdoc は
**下地の CSS → `uses.motions` で名指しした動きの CSS → 動きを下地になじませる 1 枚
→ 場面の CSS → 場面の HTML** の順に連結して組み立てる。だから場面の CSS は `var(--…)` で書いてよい
（下地の変数定義が同じスタイルシートの先頭に付く）。

一覧は**高さを揃えたサムネイルだけ**にしてある（枠を 5:2 に固定し、場面が持つ上余白を
詰めた位置から切り取る）。実物大の見本・PC/SP 切替・短い説明は、タイルを押すと出る
**詳細パネル**が持つ。

1. `id` は一意・kebab-case。CSS の接頭辞 `.s-<id>` と URL のハッシュを兼ねる
2. `html` のルート要素はちょうど 1 つの `<section>`、クラスは `.s-<id>`
3. CSS のセレクタはすべて `.s-<id>` 始まりにする
4. 動きの見た目を場面に合わせるときは `.s-<id>` 側で上書きする（連結順が後なので後勝ち）。
   上書きしてよいのは寸法・寄せ・濃さまで。`@keyframes` と `transition` には触らない
5. 一度きりの登場は `data-play-on-view` を付け、`js` に `PLAY_ON_VIEW` を渡す
6. 写真は外部ファイルを使わず CSS で置く（貼った先で画像が割れないように）
7. `kind` ごとに案を 2 つ以上そろえてから公開する

### 部品（層 3）の追加

`lab/data/components.js` の `LAB_COMPONENTS` にオブジェクトを 1 つ足すだけ。

**動きとの違いは「状態を持つかどうか」。** 動きは振る舞いだけを切り出したもので、
`btn-fill` は「触れると塗りが流れ込む」しか知らない。部品は主か副か、押せるか、
開いているかを知っている。だから見本は 1 個ではなく、**並びと状態を一枚に並べた
見本帳**（`.c-sheet`）の形にする。等身大で見せたいので幅は 720px。

動きに似たものがあっても（`accordion-smooth` `checkbox-check` `label-float`）、
**部品の挙動そのものは部品が持つ**。あちらは升目の中で見せるための作り物で、
勝手に開いたり hover でチェックが付いたりする。実際に使えるのはこちら。

1. `id` は一意・kebab-case。CSS の接頭辞 `.c-<id>` と URL のハッシュを兼ねる
2. `html` のルート要素はちょうど 1 つ、`data-component` を持ち、クラスは `.c-<id>`
3. **本物として動くこと。** input は input、開閉は `<details>` かボタン。
   見た目だけ似せた作り物は動きの層の役目で、この層に置く意味がない
4. 状態は「並べて見せる」。ホバーしないと見えない状態は見本帳の別の行に置く

### 動き（層 4）の追加

`lab/data/motions.js` の `LAB_MOTIONS` にオブジェクトを 1 つ足すだけ。
`kind` を新設する場合も `LAB_MOTION_KINDS` に 1 行足せば、区画・索引・凡例が自動で増える。
HTML と `motion.js` は編集しない。

カードは**プレビューと題だけ**にしてある（`note` と `tags` はデータには残っているが
画面には出さない）。動きは読むより見たほうが早いので、説明を並べても選ぶ助けにならない。
再生・ホバーのボタンはプレビューに重ねる（本文に置くと、ボタンのある / ない で高さが揃わない）。

1. `id` は一意・kebab-case。CSS の接頭辞 `.p-<id>`、URL のハッシュ、
   **場面からの参照キー**を兼ねる。一度公開したら変えない
2. `html` のルート要素はちょうど 1 つ、クラスは `.p-<id>`
3. CSS のセレクタと `@keyframes` 名はすべて `p-<id>` 始まりにする（他のパーツと衝突させない）
4. 値は CSS 変数ではなくリテラルで書く。**単体でコピーしてよそのサイトに貼っても、
   場面の iframe に連結されても、そのまま動くこと**を優先するので `var(--…)` は使わない
5. CSS に「何をしているか」の日本語コメントを 1 行以上入れる（読み手は非エンジニア）
6. `trigger` を選ぶ — `replay`（1 回再生）/ `hover`（触れて反応）/ `loop`（回り続ける）
7. `hover` のパーツは `.p-x:hover, .p-x.is-hover { … }` の二重セレクタで書く
   （`.is-hover` はタッチ端末用。これを忘れるとスマートフォンで動きが確認できない）

### 規約違反の検出

追加後は下のスクリプトで機械的に検出できる。

```
node -e '
global.window={};
require("./lab/data/motions.js");require("./lab/data/sections.js");
const M=window.LAB_MOTIONS, S=window.LAB_SECTIONS, mids=new Set(M.map(m=>m.id));
const ids=new Set();
M.forEach(x=>{
  if(ids.has(x.id))console.log("id 重複",x.id);ids.add(x.id);
  if(!x.html.trim().split("\n")[0].includes("class=\"p-"+x.id+"\""))console.log("ルート要素のクラス",x.id);
  [...x.css.matchAll(/var\(--[\w-]+/g)].forEach(m=>console.log("動きに CSS 変数",x.id,m[0]));
});
S.forEach(x=>{
  if(ids.has(x.id))console.log("id 重複",x.id);ids.add(x.id);
  if(!x.html.includes("class=\"s-"+x.id+"\""))console.log("ルート要素のクラス",x.id);
  (x.uses.motions||[]).forEach(m=>{if(!mids.has(m))console.log("知らない動きを参照",x.id,m)});
});
console.log("動き "+M.length+" 件 / 場面 "+S.length+" 件を検査した");'
```
