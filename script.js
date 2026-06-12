(function () {
  const label = document.querySelector("[data-deadline-label]");
  if (!label) return;

  const deadline = new Date("2026-07-17T23:59:00+09:00");
  const now = new Date();
  const ms = deadline.getTime() - now.getTime();

  if (Number.isNaN(ms)) return;

  if (ms > 0) {
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    label.textContent = `2026.07.17 23:59 · D-${days}`;
  } else {
    label.textContent = "2026.07.17 23:59 · 접수 종료";
  }
})();
