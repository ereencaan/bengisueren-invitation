document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Dil (i18n) ---------- */
  const I18N = {
    tr: {
      married: "Evleniyoruz",
      intro_eyebrow: "BİR ÖMÜR BOYU",
      intro_text: "Hayatlarımızı birleştireceğimiz bu özel günde, sizleri de aramızda görmek bizi mutlu edecek.",
      fam_bride: "GELİN AİLESİ",
      fam_groom: "DAMAT AİLESİ",
      dow: "CUMARTESİ",
      month: "EKİM",
      year_words: "İKİ BİN YİRMİ ALTI",
      cd_days: "GÜN", cd_hours: "SAAT", cd_min: "DAKİKA", cd_sec: "SANİYE",
      cal_text: "Bu özel günü takviminize ekleyin",
      cal_google: "Google Takvim", cal_apple: "Apple Takvim", cal_outlook: "Outlook / .ics",
      sched_eyebrow: "GECE PLANI",
      sched_ceremony: "NİKAH", sched_dinner: "YEMEK", sched_party: "EĞLENCE", sched_wedding: "DÜĞÜN",
      venue_eyebrow: "DÜĞÜN YERİ",
      directions: "YOL TARİFİ",
      rsvp_eyebrow: "LÜTFEN BİLDİRİN",
      rsvp_text: "Bu güzel günü birlikte taçlandırmak için katılım durumunuzu bizimle paylaşırsanız seviniriz.",
      call: "Ara",
      thanks: "Sizleri aramızda görmek dileğiyle…",
      hashtag_hint: "Hikâyende bizi etiketle",
      aria_call_b: "Bengisu'yu ara", aria_wa_b: "Bengisu'ya WhatsApp",
      aria_call_e: "Eren'i ara", aria_wa_e: "Eren'e WhatsApp",
      aria_share: "Instagram'da paylaş: #BengisuErenWedding",
      toast_copied: "Hashtag kopyalandı · Instagram açılıyor",
      mem_eyebrow: "ANILARINIZ",
      mem_text: "Düğünümüzde çektiğiniz fotoğrafları, videoları ve bize dileklerinizi burada paylaşabilirsiniz.",
      mem_btn: "ANI BIRAKIN",
      tap_start: "Başlamak için dokun",
      skip: "Geç",
    },
    en: {
      married: "Getting Married",
      intro_eyebrow: "FOR A LIFETIME",
      intro_text: "On this special day, as we unite our lives, it would mean the world to have you by our side.",
      fam_bride: "THE BRIDE'S FAMILY",
      fam_groom: "THE GROOM'S FAMILY",
      dow: "SATURDAY",
      month: "OCTOBER",
      year_words: "TWO THOUSAND TWENTY-SIX",
      cd_days: "DAYS", cd_hours: "HOURS", cd_min: "MINUTES", cd_sec: "SECONDS",
      cal_text: "Add this special day to your calendar",
      cal_google: "Google Calendar", cal_apple: "Apple Calendar", cal_outlook: "Outlook / .ics",
      sched_eyebrow: "THE EVENING",
      sched_ceremony: "CEREMONY", sched_dinner: "DINNER", sched_party: "CELEBRATION", sched_wedding: "WEDDING CELEBRATION",
      venue_eyebrow: "VENUE",
      directions: "DIRECTIONS",
      rsvp_eyebrow: "KINDLY RSVP",
      rsvp_text: "We would be honoured if you would let us know whether you can join us in celebrating this beautiful day.",
      call: "Call",
      thanks: "We can't wait to celebrate with you…",
      hashtag_hint: "Tag us in your story",
      aria_call_b: "Call Bengisu", aria_wa_b: "WhatsApp Bengisu",
      aria_call_e: "Call Eren", aria_wa_e: "WhatsApp Eren",
      aria_share: "Share on Instagram: #BengisuErenWedding",
      toast_copied: "Hashtag copied · Opening Instagram",
      mem_eyebrow: "YOUR MEMORIES",
      mem_text: "Share the photos and videos you take at our wedding, along with your wishes for us.",
      mem_btn: "LEAVE A MEMORY",
      tap_start: "Tap to start",
      skip: "Skip",
    },
  };
  const META = {
    tr: { title: "Bengisu & Eren · Düğün Davetiyesi", desc: "Bengisu & Eren'in düğün davetiyesi — 24 Ekim 2026, Denizli." },
    en: { title: "Bengisu & Eren · Wedding Invitation", desc: "Bengisu & Eren's wedding invitation — 24 October 2026, Denizli." },
  };

  let currentLang = "tr";
  const t = (k) => (I18N[currentLang] && I18N[currentLang][k]) || "";

  function setLang(lang) {
    if (lang !== "tr" && lang !== "en") lang = "tr";
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (I18N[lang][k] != null) el.innerHTML = I18N[lang][k];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const k = el.getAttribute("data-i18n-aria");
      if (I18N[lang][k] != null) el.setAttribute("aria-label", I18N[lang][k]);
    });
    if (META[lang]) {
      document.title = META[lang].title;
      const md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", META[lang].desc);
    }
    document.querySelectorAll(".lang-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.addEventListener("click", () => setLang(b.getAttribute("data-lang")));
  });
  /* ---------- Yemekli / yemeksiz davet ---------- */
  // Varsayılan yemeksiz: sadece 20:00 düğün. Yemekli davetlilere linkin sonuna ?y eklenir:
  // nikah 18:00 + yemek 18:30 + eğlence 20:00.
  const isDinnerGuest = /(^|[?&#])(y|yemekli)(=|&|$)/i.test(location.search + location.hash);
  const START_HOUR = isDinnerGuest ? "18:00" : "20:00";
  if (isDinnerGuest) {
    const scheduleGrid = document.getElementById("scheduleGrid");
    const partyLabel = document.getElementById("partyLabel");
    const dTime = document.getElementById("dTime");
    const calGoogle = document.getElementById("calGoogle");
    if (scheduleGrid) scheduleGrid.classList.remove("no-dinner");
    if (partyLabel) partyLabel.setAttribute("data-i18n", "sched_party");
    if (dTime) dTime.textContent = START_HOUR;
    if (calGoogle) calGoogle.href = calGoogle.href.replace("20261024T170000Z/", "20261024T150000Z/");
  }

  let savedLang = "tr";
  try { savedLang = localStorage.getItem("lang") || "tr"; } catch (e) {}
  setLang(savedLang);

  /* ---------- Açılış videosu (intro) ---------- */
  const introOverlay = document.getElementById("introOverlay");
  if (introOverlay) {
    const introVideo = document.getElementById("introVideo");
    const introSkip = document.getElementById("introSkip");
    let started = false;
    let ended = false;

    document.body.classList.add("intro-active");

    const endIntro = () => {
      if (ended) return;
      ended = true;
      introOverlay.classList.add("hide");
      document.body.classList.remove("intro-active");
      document.dispatchEvent(new Event("invite:open"));
      setTimeout(() => {
        if (introOverlay.parentNode) introOverlay.parentNode.removeChild(introOverlay);
      }, 850);
    };

    const startVideo = () => {
      if (started || ended) return;
      started = true;
      introOverlay.classList.add("playing");
      if (introSkip) introSkip.hidden = false; // oynamazsa kullanıcı "Geç" ile çıkabilsin
      const p = introVideo && introVideo.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    // Dokununca HER ZAMAN oynatmayı dene; video kendiliğinden geçmesin.
    if (introVideo) introVideo.addEventListener("ended", endIntro);
    introOverlay.addEventListener("click", (e) => {
      if (e.target === introSkip) return;
      startVideo();
    });
    if (introSkip) introSkip.addEventListener("click", endIntro);
  }

  /* ---------- Animasyonlar: sarmaşık, kuşlar, çizilen ikonlar ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // İkonlar bölüm göründüğünde kendini çizer (uzunluk JS ile ölçülür; pathLength'e güvenmiyoruz)
  if (!reduceMotion) {
    document.querySelectorAll(".schedule-item svg, .venue .pin, .mem-ico").forEach((svg) => {
      svg.classList.add("draw-ico");
      svg.querySelectorAll("path, circle, ellipse, rect").forEach((el) => {
        let len = 0;
        try { len = Math.ceil(el.getTotalLength()); } catch (e) {}
        if (!len) return;
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
      });
    });
  }

  // Sarmaşık: kartın iki kenarındaki altın çerçeve boyunca, kaydırdıkça büyür
  const invite = document.querySelector(".invite");
  const hero = document.querySelector(".hero");
  if (invite && hero && !reduceMotion) {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "vines");
    svg.setAttribute("aria-hidden", "true");
    invite.appendChild(svg);

    let vines = [];
    let shownY = 0;
    let targetY = 0;
    let running = false;
    let lastW = 0;
    let lastH = 0;

    const el = (tag, attrs) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    };

    // Her yeniden çizimde aynı yaprak dizilimi için sabit tohumlu rastgele
    const seeded = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    function makeVine(cx, side, phase, top, bottom, mobile, rand) {
      const amp = mobile ? 5 : 8;
      const period = mobile ? 170 : 230;
      const pts = [];
      for (let y = top; y <= bottom; y += 6) {
        pts.push([cx + amp * Math.sin(((y - top) / period) * Math.PI * 2 + phase), y]);
      }
      const cum = [0];
      for (let i = 1; i < pts.length; i++) {
        cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      }
      const total = cum[cum.length - 1];

      const g = el("g", {});
      const stem = el("path", {
        class: "vine-stem",
        d: "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L"),
      });
      stem.style.strokeDasharray = total;
      stem.style.strokeDashoffset = total;
      g.appendChild(stem);

      // Yapraklar ve arada küçük altın çiçekler
      const leaves = [];
      const L = mobile ? 10 : 13;
      let y = top + 40;
      let n = 0;
      while (y < bottom - 20) {
        const i = Math.min(pts.length - 1, Math.round((y - top) / 6));
        const px = pts[i][0];
        const py = pts[i][1];
        const inward = n % 2 === 0;
        const len = inward ? L : L * 0.7;
        const tilt = 25 + rand() * 25;
        // içeri bakan yaprak: yukarı-içeri; dışarı bakan: yukarı-dışarı
        const angle = inward ? (side > 0 ? -tilt : 180 + tilt) : side > 0 ? 180 + tilt : -tilt;
        const holder = el("g", { transform: `translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${angle.toFixed(1)})` });
        const leaf = el("g", { class: "vine-leaf" });
        leaf.appendChild(el("path", {
          d: `M0 0Q${len * 0.45} ${-len * 0.4} ${len} 0Q${len * 0.45} ${len * 0.4} 0 0Z`,
        }));
        leaf.appendChild(el("path", { class: "vine-rib", d: `M1 0L${len * 0.8} 0` }));
        holder.appendChild(leaf);
        g.appendChild(holder);
        leaves.push({ y: py, node: leaf });

        if (n % 5 === 3) {
          const fx = px + side * (mobile ? 9 : 12);
          const fy = py - 6;
          const fh = el("g", { transform: `translate(${fx.toFixed(1)} ${fy.toFixed(1)})` });
          const fl = el("g", { class: "vine-flower" });
          for (let k = 0; k < 5; k++) {
            const a = (k / 5) * Math.PI * 2;
            fl.appendChild(el("circle", { cx: (Math.cos(a) * 2.6).toFixed(2), cy: (Math.sin(a) * 2.6).toFixed(2), r: 1.9 }));
          }
          fl.appendChild(el("circle", { class: "vine-flower-c", cx: 0, cy: 0, r: 1.3 }));
          fh.appendChild(fl);
          g.appendChild(fh);
          leaves.push({ y: fy, node: fl });
        }

        y += (mobile ? 46 : 58) + rand() * 26;
        n++;
      }
      svg.appendChild(g);
      return { pts, cum, total, stem, leaves, top };
    }

    function build() {
      const w = invite.clientWidth;
      const h = invite.scrollHeight;
      if (w === lastW && Math.abs(h - lastH) < 2) return;
      lastW = w;
      lastH = h;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      svg.textContent = "";
      const mobile = w < 720;
      const inset = mobile ? 9 : 14; // .invite::before çerçeve çizgisi
      const top = hero.offsetHeight - 30;
      const bottom = h - (mobile ? 24 : 34);
      const rand = seeded(20261024);
      vines = [
        makeVine(inset, 1, 0, top, bottom, mobile, rand),
        makeVine(w - inset, -1, Math.PI * 0.7, top, bottom, mobile, rand),
      ];
      paint(true);
    }

    function lengthAt(v, y) {
      if (y <= v.top) return 0;
      const i = Math.min(v.pts.length - 1, Math.floor((y - v.top) / 6));
      return v.cum[i];
    }

    function paint(force) {
      vines.forEach((v) => {
        v.stem.style.strokeDashoffset = v.total - lengthAt(v, shownY);
        v.leaves.forEach((lf) => {
          if (lf.y <= shownY - 8) lf.node.classList.add("on");
          else if (force) lf.node.classList.remove("on");
        });
      });
    }

    function tick() {
      shownY += (targetY - shownY) * 0.07;
      if (targetY - shownY < 0.5) shownY = targetY;
      paint(false);
      if (shownY < targetY) requestAnimationFrame(tick);
      else running = false;
    }

    function onScroll() {
      if (document.body.classList.contains("intro-active")) return;
      const inviteTop = invite.getBoundingClientRect().top + window.scrollY;
      const y = window.scrollY + window.innerHeight * 0.82 - inviteTop;
      if (y > targetY) {
        targetY = y; // sadece büyür, yukarı kaydırınca geri sarmaz
        if (!running) {
          running = true;
          requestAnimationFrame(tick);
        }
      }
    }

    build();
    let rt;
    new ResizeObserver(() => {
      clearTimeout(rt);
      rt = setTimeout(build, 150);
    }).observe(invite);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("invite:open", onScroll);
  }

  // Kuşlar: davetiye açılınca fotoğrafın üstünden bir kez süzülüp geçer
  const heroPhoto = document.querySelector(".hero-photo");
  if (heroPhoto && !reduceMotion) {
    const BIRDS = [
      { top: 34, scale: 1.15, delay: 0.3, dur: 7.2, flap: 0.46 },
      { top: 41, scale: 0.85, delay: 0.9, dur: 7.8, flap: 0.4 },
      { top: 29, scale: 0.7, delay: 1.6, dur: 8.4, flap: 0.36 },
    ];
    let flown = false;
    const fly = () => {
      if (flown) return;
      flown = true;
      const box = document.createElement("div");
      box.className = "birds";
      box.setAttribute("aria-hidden", "true");
      BIRDS.forEach((b) => {
        const wrap = document.createElement("div");
        wrap.className = "bird";
        wrap.style.cssText =
          `top:${b.top}%;--s:${b.scale};--dist:${heroPhoto.clientWidth + 120}px;` +
          `animation-delay:${b.delay}s;animation-duration:${b.dur}s;--flap:${b.flap}s`;
        wrap.innerHTML =
          '<div class="bird-bob"><svg viewBox="-20 -12 40 24">' +
          '<path class="wing wl" d="M0 0Q-7 -9 -18 -4"/>' +
          '<path class="wing wr" d="M0 0Q7 -9 18 -4"/></svg></div>';
        box.appendChild(wrap);
      });
      heroPhoto.appendChild(box);
      setTimeout(() => box.remove(), 11500);
    };
    document.addEventListener("invite:open", () => setTimeout(fly, 500));
    if (!document.getElementById("introOverlay")) setTimeout(fly, 800);
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));

  /* ---------- Countdown ---------- */
  const target = new Date("2026-10-24T" + START_HOUR + ":00+03:00").getTime();
  const cd = document.getElementById("countdown");

  if (cd) {
    const dEl = cd.querySelector("[data-d]");
    const hEl = cd.querySelector("[data-h]");
    const mEl = cd.querySelector("[data-m]");
    const sEl = cd.querySelector("[data-s]");
    const pad = (n) => String(n).padStart(2, "0");

    const tick = () => {
      let diff = target - Date.now();

      if (diff <= 0) {
        dEl.textContent = "00";
        hEl.textContent = "00";
        mEl.textContent = "00";
        sEl.textContent = "00";
        cd.classList.add("done");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000);
      diff -= hours * 3600000;
      const mins = Math.floor(diff / 60000);
      diff -= mins * 60000;
      const secs = Math.floor(diff / 1000);

      dEl.textContent = days;
      hEl.textContent = pad(hours);
      mEl.textContent = pad(mins);
      sEl.textContent = pad(secs);
    };

    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ---------- Takvime ekle (.ics) ---------- */
  function icsDate(d) {
    const p = (n) => String(n).padStart(2, "0");
    return (
      d.getUTCFullYear() +
      p(d.getUTCMonth() + 1) +
      p(d.getUTCDate()) +
      "T" +
      p(d.getUTCHours()) +
      p(d.getUTCMinutes()) +
      p(d.getUTCSeconds()) +
      "Z"
    );
  }

  function downloadIcs() {
    const start = new Date("2026-10-24T" + START_HOUR + ":00+03:00");
    const end = new Date("2026-10-24T23:00:00+03:00");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Bengisu Eren Wedding//TR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:bengisu-eren-2026-10-24@wedding",
      "DTSTAMP:" + icsDate(new Date("2026-01-01T00:00:00Z")),
      "DTSTART:" + icsDate(start),
      "DTEND:" + icsDate(end),
      "SUMMARY:Bengisu & Eren Düğünü",
      "LOCATION:Saray Bahçe Düğün & Davet\\, Kayalar Mah. 6010 Sk. No:2 Merkezefendi/DENİZLİ",
      "DESCRIPTION:Sizleri düğünümüze bekliyoruz. #BengisuErenWedding",
      "GEO:37.828034;29.050481",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BengisuEren-Dugun.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  const calApple = document.getElementById("calApple");
  const calOutlook = document.getElementById("calOutlook");
  if (calApple) calApple.addEventListener("click", downloadIcs);
  if (calOutlook) calOutlook.addEventListener("click", downloadIcs);

  /* ---------- Hashtag → Instagram ---------- */
  const hashtagBtn = document.getElementById("hashtagBtn");
  if (hashtagBtn) {
    const TAG = "#BengisuErenWedding";
    const WEB = "https://www.instagram.com/explore/tags/bengisuerenwedding/";

    const showToast = (msg) => {
      const t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      t.textContent = msg;
      document.body.appendChild(t);
      requestAnimationFrame(() => t.classList.add("show"));
      setTimeout(() => {
        t.classList.remove("show");
        setTimeout(() => t.remove(), 450);
      }, 2600);
    };

    const openInstagram = () => {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
      if (!isMobile) {
        window.open(WEB, "_blank", "noopener");
        return;
      }
      // Mobil: önce Instagram kamerasını dene, açılmazsa hashtag sayfasına düş
      const fallback = setTimeout(() => {
        if (!document.hidden) window.location.href = WEB;
      }, 1300);
      const onHide = () => {
        if (document.hidden) {
          clearTimeout(fallback);
          document.removeEventListener("visibilitychange", onHide);
        }
      };
      document.addEventListener("visibilitychange", onHide);
      window.location.href = "instagram://camera";
    };

    hashtagBtn.addEventListener("click", () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(TAG).catch(() => {});
      }
      showToast(t("toast_copied"));
      openInstagram();
    });
  }
});
