/* ==========================================================================
   喫茶よふけ — scroll = walk
   スクロール量をカメラの前進(translateZ)に変換して路地を歩く。
   - cam: ワールドの translateZ。要素は --d の位置 ( translateZ(-d) ) にあり、
     要素までの残り距離 dist = d - cam。dist が 0 で要素の真横を通過する
   - reduced-motion / JS無効 / トグル時は body.flat の平面レイアウトに切替
   ========================================================================== */

(() => {
  "use strict";

  const body = document.body;
  body.classList.remove("no-js");

  const world = document.getElementById("world");
  const camera = document.getElementById("camera");
  const facade = document.getElementById("facade");
  const hint = document.getElementById("hint");
  const hudSteps = document.getElementById("hudSteps");
  const stepsNum = document.getElementById("stepsNum");
  const rainBtn = document.getElementById("rainBtn");
  const modeBtn = document.getElementById("modeBtn");
  const againBtn = document.getElementById("againBtn");

  /* ---- 行程の定義 ---- */
  const CAM_START = -1150;        // 入口看板の手前から歩き始める
  const CAM_END = 8500;           // 店内パネルの手前で立ち止まる
  const TRAVEL = CAM_END - CAM_START;
  const DOOR_D = 8000;
  const DOOR_OPEN_AT = DOOR_D - 950;   // 接近すると扉がひらく
  const INSIDE_AT = DOOR_D + 60;       // 敷居をまたいだら「店内」
  const STEPS_TOTAL = 134;

  /* 奥行きで出し入れする要素（看板・小道具・扉・店内）
     near0/near1: 通過時フェードの距離（near0で透明・near1で不透明）。
     ファサードだけは「くぐり終えてから」消えるよう負の値を指定している */
  const items = Array.from(document.querySelectorAll("[data-d]")).map((el) => {
    const near0 = el.dataset.near0 !== undefined ? parseFloat(el.dataset.near0) : 60;
    const near1 = el.dataset.near1 !== undefined ? parseFloat(el.dataset.near1) : 320;
    return { el, d: parseFloat(el.dataset.d), near0, near1, base: 1, lastOpacity: -1 };
  });

  /* 壁の窓明かりは壁プレーンの子: --wx（壁に沿った位置, 原点 z=+200）から奥行きを算出。
     通過する瞬間に巨大投影されて画面が白く飛ぶのを防ぐため、手前でフェードさせる */
  document.querySelectorAll(".wall .win").forEach((el) => {
    const wx = parseFloat(el.style.getPropertyValue("--wx"));
    if (Number.isNaN(wx)) return;
    items.push({
      el,
      d: wx - 200,
      near0: 90,
      near1: 380,
      base: parseFloat(getComputedStyle(el).opacity) || 1,
      lastOpacity: -1,
    });
  });

  /* ---- 状態 ---- */
  let camTarget = CAM_START;
  let cam = CAM_START;
  let lookX = 0, lookY = 0;       // 視線の揺れ(目標)
  let curLX = 0, curLY = 0;       // 視線の揺れ(現在)
  let flat = false;
  let rafId = 0;
  let scrolled = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- スクロール → 歩行 ---- */

  const progress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return 0;
    return Math.min(1, Math.max(0, window.scrollY / max));
  };

  const onScroll = () => {
    if (flat) return;
    camTarget = CAM_START + progress() * TRAVEL;

    /* 歩数の更新（lerp前の目標値で即時反応させる） */
    const left = Math.max(0, Math.round((1 - (camTarget - CAM_START) / TRAVEL) * STEPS_TOTAL));
    if (left === 0) {
      hudSteps.textContent = "ようこそ。";
    } else {
      stepsNum.textContent = String(left);
      if (hudSteps.firstChild.nodeType !== Node.TEXT_NODE || !hudSteps.contains(stepsNum)) {
        hudSteps.innerHTML = "";
        hudSteps.append("店まで あと ", stepsNum, " 歩");
      }
    }

    if (!scrolled && window.scrollY > 40) {
      scrolled = true;
      hint.classList.add("is-hidden");
    }
  };

  /* ---- 視線の揺れ（マウス追従・ごく控えめ） ---- */

  const onPointer = (e) => {
    if (flat) return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    lookX = nx * 3.2;   /* deg */
    lookY = ny * -1.8;
  };

  /* ---- 毎フレーム: ドリーと霧の濃淡 ---- */

  const fogOpacity = (dist, near0, near1) => {
    /* 通り過ぎる手前でふっと消え、遠くは闇からにじみ出る */
    const nearFade = Math.min(1, Math.max(0, (dist - near0) / (near1 - near0)));
    const farFade = Math.min(1, Math.max(0, (5200 - dist) / 900));
    return Math.min(nearFade, farFade);
  };

  const frame = () => {
    rafId = requestAnimationFrame(frame);
    if (flat) return;

    cam += (camTarget - cam) * 0.11;
    if (Math.abs(camTarget - cam) < 0.05) cam = camTarget;

    curLX += (lookX - curLX) * 0.06;
    curLY += (lookY - curLY) * 0.06;

    world.style.transform = `translateZ(${cam.toFixed(2)}px)`;
    camera.style.transform = `rotateY(${curLX.toFixed(3)}deg) rotateX(${curLY.toFixed(3)}deg)`;

    for (const it of items) {
      const dist = it.d - cam;
      const o = dist > 5600 ? 0 : fogOpacity(dist, it.near0, it.near1);
      if (Math.abs(o - it.lastOpacity) < 0.01) continue;
      it.lastOpacity = o;
      it.el.style.opacity = (o * it.base).toFixed(3);
      it.el.style.visibility = o <= 0.01 ? "hidden" : "visible";
    }

    /* 扉は「目標位置」で先に開き始める: 高速スクロールでも
       カメラが着くころには開き切っていて、閉じた扉をすり抜けない */
    facade.classList.toggle("is-open", camTarget > DOOR_OPEN_AT);
    body.classList.toggle("is-inside", cam > INSIDE_AT);
  };

  /* ---- 平面 / 3D の切替 ---- */

  const setFlat = (next) => {
    flat = next;
    body.classList.toggle("flat", flat);
    modeBtn.textContent = flat ? "路地を歩く（3D）" : "平面で読む";
    if (!flat) {
      /* 3Dに戻るときは行程の途中から再開できるようにする */
      cam = camTarget = CAM_START + progress() * TRAVEL;
      for (const it of items) it.lastOpacity = -1;
      onScroll();
    }
  };

  /* ---- 雨（生成音 + 視覚レイヤー） ---- */

  let audioCtx = null;
  let rainGain = null;
  let rainOn = false;

  const buildRain = () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const seconds = 2.5;
    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * seconds, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.025 * white) / 1.025;   /* ブラウンノイズ ≒ 遠い雨 */
      data[i] = last * 4.2;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const lp = audioCtx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 720;
    rainGain = audioCtx.createGain();
    rainGain.gain.value = 0;
    src.connect(lp).connect(rainGain).connect(audioCtx.destination);
    src.start();
  };

  const toggleRain = () => {
    rainOn = !rainOn;
    if (rainOn && !audioCtx) buildRain();
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    if (rainGain) {
      const t = audioCtx.currentTime;
      rainGain.gain.cancelScheduledValues(t);
      rainGain.gain.linearRampToValueAtTime(rainOn ? 0.14 : 0, t + 1.2);
    }
    body.classList.toggle("rain-on", rainOn);
    rainBtn.setAttribute("aria-pressed", String(rainOn));
    rainBtn.textContent = rainOn ? "雨をやませる" : "雨を降らせる";
  };

  /* ---- 起動 ---- */

  rainBtn.addEventListener("click", toggleRain);
  modeBtn.addEventListener("click", () => setFlat(!flat));
  againBtn.addEventListener("click", () => {
    if (flat) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      hint.classList.remove("is-hidden");
      scrolled = false;
    }
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  reducedMotion.addEventListener?.("change", (e) => setFlat(e.matches));

  setFlat(reducedMotion.matches);
  onScroll();
  rafId = requestAnimationFrame(frame);
})();
