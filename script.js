(function () {
  const label = document.querySelector("[data-deadline-label]");
  if (label) {
    const deadline = new Date("2026-07-17T23:59:00+09:00");
    const now = new Date();
    const ms = deadline.getTime() - now.getTime();

    if (!Number.isNaN(ms)) {
      if (ms > 0) {
        const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
        label.textContent = `2026.07.17 23:59 · D-${days}`;
      } else {
        label.textContent = "2026.07.17 23:59 · 접수 종료";
      }
    }
  }

  const logDetails = [
    {
      title: "Contact Floor",
      body:
        "위험 점수와 무관하게 최소 대면 접촉선을 둔다. 월 1회 이상 대면 확인 또는 지역 관계망 확인을 공공 AI 돌봄의 기본 조건으로 만든다.",
    },
    {
      title: "Accountability Log",
      body:
        "모델 권고, 기관 배정, 현장 조치, 방문 생략 사유를 하나의 책임 로그로 남긴다. AI가 권고했다는 말이 책임의 끝이 되지 않게 한다.",
    },
    {
      title: "Relationship Metric",
      body:
        "복약 성공률만 보지 않는다. 도움을 청할 수 있는 사람 수, 최근 대면 접촉, 정기 연락망, 지역 참여도를 핵심 성과 지표로 둔다.",
    },
    {
      title: "Exit & Escalation",
      body:
        "당사자는 AI 돌봄 방식과 데이터 수집 범위를 거부하거나 대면 지원으로 전환할 수 있어야 한다. 사람이 와줬으면 한다는 요청이 시스템 안에 있어야 한다.",
    },
    {
      title: "Institutional Oversight",
      body:
        "인간 감독은 담당자 한 명의 최종 클릭이 아니라, 기관이 AI 도입의 적절성, 지표 설계, 현장 영향, 이의제기 절차를 공개적으로 설명하고 검증받는 구조여야 한다.",
    },
  ];

  const buttons = Array.from(document.querySelectorAll("[data-log-index]"));
  const detail = document.querySelector("[data-log-detail]");

  function activateLog(index) {
    const safeIndex = Math.max(0, Math.min(index, logDetails.length - 1));
    buttons.forEach((button) => {
      const isActive = Number(button.dataset.logIndex) === safeIndex;
      button.classList.toggle("is-active", isActive);
      if (button.classList.contains("principle-button")) {
        button.setAttribute("aria-pressed", String(isActive));
      }
    });

    if (!detail) return;
    const title = detail.querySelector("h3");
    const body = detail.querySelector("p:not(.detail-label)");
    if (title) title.textContent = logDetails[safeIndex].title;
    if (body) body.textContent = logDetails[safeIndex].body;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activateLog(Number(button.dataset.logIndex || 0));
    });
  });

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    document.documentElement.style.setProperty("--page-progress", progress.toFixed(4));
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
})();
