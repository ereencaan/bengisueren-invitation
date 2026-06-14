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
      month: "EYLÜL",
      year_words: "İKİ BİN YİRMİ ALTI",
      cd_days: "GÜN", cd_hours: "SAAT", cd_min: "DAKİKA", cd_sec: "SANİYE",
      cal_text: "Bu özel günü takviminize ekleyin",
      cal_google: "Google Takvim", cal_apple: "Apple Takvim", cal_outlook: "Outlook / .ics",
      sched_eyebrow: "GECE PLANI",
      sched_ceremony: "NİKAH", sched_dinner: "YEMEK", sched_party: "EĞLENCE",
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
      month: "SEPTEMBER",
      year_words: "TWO THOUSAND TWENTY-SIX",
      cd_days: "DAYS", cd_hours: "HOURS", cd_min: "MINUTES", cd_sec: "SECONDS",
      cal_text: "Add this special day to your calendar",
      cal_google: "Google Calendar", cal_apple: "Apple Calendar", cal_outlook: "Outlook / .ics",
      sched_eyebrow: "THE EVENING",
      sched_ceremony: "CEREMONY", sched_dinner: "DINNER", sched_party: "CELEBRATION",
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
      tap_start: "Tap to start",
      skip: "Skip",
    },
  };
  const META = {
    tr: { title: "Bengisu & Eren · Düğün Davetiyesi", desc: "Bengisu & Eren'in düğün davetiyesi — 5 Eylül 2026, Denizli." },
    en: { title: "Bengisu & Eren · Wedding Invitation", desc: "Bengisu & Eren's wedding invitation — 5 September 2026, Denizli." },
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
    let videoBroken = false;

    document.body.classList.add("intro-active");

    const endIntro = () => {
      if (ended) return;
      ended = true;
      introOverlay.classList.add("hide");
      document.body.classList.remove("intro-active");
      setTimeout(() => {
        if (introOverlay.parentNode) introOverlay.parentNode.removeChild(introOverlay);
      }, 850);
    };

    // Video oynatılamazsa intro KENDİLİĞİNDEN kapanmasın; sadece çıkış (Geç) görünsün
    const markBroken = () => {
      videoBroken = true;
      if (introSkip) introSkip.hidden = false;
    };

    const startVideo = () => {
      if (started || ended) return;
      started = true;
      introOverlay.classList.add("playing");
      if (introSkip) introSkip.hidden = false;
      const p = introVideo && introVideo.play();
      if (p && typeof p.catch === "function") p.catch(markBroken);
    };

    if (introVideo) {
      introVideo.addEventListener("ended", endIntro);
      introVideo.addEventListener("error", markBroken);
    }
    introOverlay.addEventListener("click", (e) => {
      if (e.target === introSkip) return;
      if (!introVideo || videoBroken) { endIntro(); return; }
      startVideo();
    });
    if (introSkip) introSkip.addEventListener("click", endIntro);
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
  const target = new Date("2026-09-05T18:00:00+03:00").getTime();
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
    const start = new Date("2026-09-05T18:00:00+03:00");
    const end = new Date("2026-09-05T23:00:00+03:00");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Bengisu Eren Wedding//TR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:bengisu-eren-2026-09-05@wedding",
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
