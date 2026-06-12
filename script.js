document.addEventListener("DOMContentLoaded", function () {
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
});
