/* GA4 の読み込みと、分析用のイベント送信。
   個人を特定する情報（入力内容・メールアドレスの文字列など）は送らない */
(function () {
  'use strict';
  var GA_ID = 'G-WMJBMSHWLJ';
  // 本番のドメイン以外（手元の確認など）では送らず、コンソールに出すだけにする
  var live = location.hostname === 'nogami-works.com';

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
    if (!live && window.console) console.debug('[analytics]', [].slice.call(arguments));
  };
  if (live) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  gtag('js', new Date());
  gtag('config', GA_ID);

  function send(name, params) { gtag('event', name, params || {}); }
  function text(el, max) { return (el ? el.textContent : '').replace(/\s+/g, ' ').trim().slice(0, max || 100); }
  // ボタンやリンクがページのどこにあったか（いちばん近い id 付きの区切り）
  function where(el) {
    var box = el.closest('#bar, nav, section[id], .closing, header, footer');
    return box ? (box.id || box.tagName.toLowerCase()) : 'other';
  }

  /* ---- クリック：相談ボタン・ページ内メニュー・リンク ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var pos = where(a);
    if (href.indexOf('https://lin.ee/') === 0) send('contact_line', { cta_position: pos, transport_type: 'beacon' });
    else if (href.indexOf('mailto:') === 0) send('contact_mail', { cta_position: pos, transport_type: 'beacon' });
    else if (href.charAt(0) === '#') send('nav_click', { nav_target: href.slice(1), cta_position: pos });
    else send('link_click', { link_url: a.href, link_text: text(a), cta_position: pos, transport_type: 'beacon' });
  }, true);

  /* ---- 折りたたみ・よくあるご質問を開いた ---- */
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (!d.open || !d.matches || !d.matches('details')) return;
    var q = d.querySelector(':scope > summary .q') || d.querySelector(':scope > summary > span');
    // 見出しの下の小さな補足（<small>）は名前に含めない
    if (q && q.querySelector('small')) { q = q.cloneNode(true); q.querySelector('small').remove(); }
    send('content_open', { content_type: d.classList.contains('qa') ? 'faq' : 'fold', content_name: text(q) });
  }, true);

  /* ---- 文字のコピー（中身は送らず、メールアドレスらしさだけ） ---- */
  document.addEventListener('copy', function () {
    var sel = String(window.getSelection ? window.getSelection() : '');
    if (sel) send('copy_text', { contains_email: sel.indexOf('@') >= 0, text_length: sel.length });
  });

  function ready() {
    /* ---- どのセクションまで読んだか：画面の中央を通過したら一度だけ ---- */
    var secs = [].slice.call(document.querySelectorAll('header.fv, section[id], #contact'));
    if (secs.length && window.IntersectionObserver) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          send('section_view', { section_id: el.id || 'first_view', section_index: secs.indexOf(el) });
          io.unobserve(el);
        });
      }, { rootMargin: '-50% 0px -50% 0px' });
      secs.forEach(function (el) { io.observe(el); });
    }

    /* ---- スクロールの深さ（25・50・75・100%） ---- */
    var marks = [25, 50, 75, 100], ticking = false;
    function depth() {
      ticking = false;
      var max = document.documentElement.scrollHeight - innerHeight;
      var pct = max > 0 ? Math.round(scrollY / max * 100) : 100;
      while (marks.length && pct >= marks[0]) send('scroll_depth', { percent_scrolled: marks.shift() });
      if (!marks.length) removeEventListener('scroll', onScroll);
    }
    function onScroll() { if (!ticking) { ticking = true; setTimeout(depth, 200); } }
    addEventListener('scroll', onScroll, { passive: true });

    /* ---- 写真のひとこと：PC は 0.8 秒以上ホバー、スマホはタップ ---- */
    var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    [].forEach.call(document.querySelectorAll('.snaps li'), function (li) {
      var name = text(li.querySelector('figcaption')), timer = null, sent = false;
      function fire(how) { if (!sent) { sent = true; send('photo_view', { photo_name: name, interaction: how }); } }
      if (canHover) {
        li.addEventListener('mouseenter', function () { timer = setTimeout(function () { fire('hover'); }, 800); });
        li.addEventListener('mouseleave', function () { clearTimeout(timer); });
      } else {
        // 開閉の処理がクリックの伝わりを止めるので、先に（キャプチャで）受け取る
        li.addEventListener('click', function () { fire('tap'); }, true);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
