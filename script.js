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
      title: "위험은 감지됐지만 방문은 밀렸다",
      body:
        "점수는 아직 임계값 아래였고, 대면 방문은 더 높은 점수의 가구로 재배정됐다. 시스템은 돌봄의 위험을 계산했지만 관계의 부재는 계산하지 않았다.",
    },
    {
      title: "권고는 생성됐지만 책임자는 생기지 않았다",
      body:
        "모델은 방문 권고를 만들었고, 기관은 배정 대기열에 넣었고, 현장은 다음 순서를 기다렸다. 모든 단계는 기록됐지만 누구도 문 앞까지 가지 않았다.",
    },
    {
      title: "현장의 부재가 데이터 완료로 바뀌었다",
      body:
        "챗봇 응답, 복약 센서, 냉장고 개폐 기록은 모두 수집됐다. 대면 접촉이 없다는 사실은 위험 신호가 아니라 비용 절감의 결과로 처리됐다.",
    },
    {
      title: "뒤늦은 빨간불은 구조를 설명하지 못했다",
      body:
        "위험 점수가 급등했을 때 시스템은 응급 가능성을 표시했다. 그러나 왜 그 사람이 도움을 청할 관계망을 잃었는지는 설명하지 못했다.",
    },
  ];

  const buttons = Array.from(document.querySelectorAll("[data-log-index]"));
  const detail = document.querySelector("[data-log-detail]");

  function activateLog(index) {
    const safeIndex = Math.max(0, Math.min(index, logDetails.length - 1));
    buttons.forEach((button) => {
      const isActive = Number(button.dataset.logIndex) === safeIndex;
      button.classList.toggle("is-active", isActive);
      if (button.classList.contains("log-button")) {
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
