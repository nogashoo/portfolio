(() => {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector("[data-header]");

  /* ------------------------------------------------------------------
     Header: hairline appears on scroll
  ------------------------------------------------------------------ */
  const onHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.dataset.scrolled = "true";
    else header.dataset.scrolled = "false";
  };
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ------------------------------------------------------------------
     Reveal-on-scroll (rise) — per-section sequential cascade.
     When a section enters the viewport, its [data-anim='rise'] children
     animate in DOM order (= top-to-bottom for stacked text, left-to-right
     for grid items). One unified rhythm across the whole page.
  ------------------------------------------------------------------ */
  const STAGGER_MS = 80;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const sectionIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const root = entry.target;
          const items = root.querySelectorAll(
            "[data-anim='rise']:not(.is-in)"
          );
          items.forEach((el, i) => {
            el.style.transitionDelay = `${i * STAGGER_MS}ms`;
          });
          // Apply class in next frame so the delays are committed first.
          requestAnimationFrame(() => {
            items.forEach((el) => el.classList.add("is-in"));
          });
          sectionIO.unobserve(root);
        });
      },
      /* Fire after the section has scrolled ~25% into the viewport, so
         the user is already looking at it when the cascade plays. */
      { rootMargin: "0px 0px -25% 0px", threshold: 0.05 }
    );

    document.querySelectorAll("section").forEach((s) => sectionIO.observe(s));
  } else {
    document
      .querySelectorAll("[data-anim='rise']")
      .forEach((el) => el.classList.add("is-in"));
  }

  /* ------------------------------------------------------------------
     Hero: split each title line into <span.char><span.char__inner>X</span></span>
     so we can mask-reveal per character. Returns the inner spans.
  ------------------------------------------------------------------ */
  const splitHeroChars = (el) => {
    const text = el.textContent;
    el.textContent = "";
    const inners = [];
    Array.from(text).forEach((c) => {
      if (c === " ") {
        el.appendChild(document.createTextNode(" "));
        return;
      }
      const wrap = document.createElement("span");
      wrap.className = "char";
      const inner = document.createElement("span");
      inner.className = "char__inner";
      inner.textContent = c;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      inners.push(inner);
    });
    return inners;
  };

  const heroLines = document.querySelectorAll("[data-hero-line]");
  const heroChars = [];
  heroLines.forEach((line) => {
    splitHeroChars(line).forEach((inner) => heroChars.push(inner));
  });
  const heroFades = document.querySelectorAll("[data-hero-fade]");

  /* ------------------------------------------------------------------
     GSAP enhancements (Editorial × Kinetic)
     Loaded via CDN, may not be present immediately. Wait for window.load.
  ------------------------------------------------------------------ */
  const initGsap = () => {
    if (prefersReducedMotion) {
      heroFades.forEach((el) => (el.style.opacity = "1"));
      return;
    }
    if (typeof window.gsap === "undefined") {
      heroFades.forEach((el) => (el.style.opacity = "1"));
      return;
    }
    if (typeof window.ScrollTrigger === "undefined") return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    /* Hero intro timeline: eyebrow → per-char mask reveal → meta + scroll */
    if (heroChars.length) {
      gsap.set(heroChars, { yPercent: 115 });
      gsap.set(heroFades, { opacity: 0, y: 8 });

      const tl = gsap.timeline();
      tl.to(
        heroChars,
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.028,
        },
        0.25
      )
        .to(
          heroFades[0],
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          1.2
        )
        .to(
          heroFades[1],
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          1.5
        );
    }

    /* Refresh on resize (handle font load shifts) */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  };

  if (document.readyState === "complete") {
    initGsap();
  } else {
    window.addEventListener("load", initGsap, { once: true });
  }

  /* ------------------------------------------------------------------
     Contact form: prevent submission until backend is wired
  ------------------------------------------------------------------ */
  const form = document.querySelector(".contact__form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const button = form.querySelector("button[type='submit']");
      if (!button) return;
      const original = button.textContent;
      button.textContent = "送信先は準備中です — 直接ご連絡ください";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
      }, 4000);
    });
  }
})();
