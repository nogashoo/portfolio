// デモサイト専用: URLの ?t=テナントID で表示テナントを差し替える。
// 例) demo/?t=797dc8dfb2e8 → そのテナント(=その人のLINE)の更新がこのデモ画面に映る。
// 付けなければ decafedecafe（見本）を表示。
// ※ これはデモ用の仕掛け。実顧客サイトの widget は data-lu-tenant 固定で、URLでは差し替わらない。
// ※ 表示するのは公開データ(お知らせ等)のみで読み取り専用。書き込みは一切できない。
(function () {
  var p = new URLSearchParams(location.search);
  var t = (p.get('t') || '').trim().toLowerCase();
  if (!/^[0-9a-f]{12}$/.test(t)) return; // テナントID形式(12桁hex)のみ受理

  // 各widgetの表示テナントを差し替え（widget.js が読み込む前に実行）
  var els = document.querySelectorAll('[data-lu-tenant]');
  for (var i = 0; i < els.length; i++) els[i].setAttribute('data-lu-tenant', t);

  // 内部リンク(トップ/一覧)に ?t= を引き継いで、ページ遷移しても同じテナントを保つ
  var links = document.querySelectorAll('a[data-keep-t]');
  for (var j = 0; j < links.length; j++) {
    var base = (links[j].getAttribute('href') || '').split('#')[0].split('?')[0];
    links[j].setAttribute('href', base + '?t=' + encodeURIComponent(t));
  }
})();
