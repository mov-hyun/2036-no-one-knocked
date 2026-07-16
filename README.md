# 2036, No One Knocked

**정상 작동한 AI 돌봄의 실패 | When AI Care Works as Designed and Still Fails**

2026 KAIST 실패연구소 AIx실패 아이디어 공모전 출품작입니다. 2036년의 실패를 미리 기록하고, 그 원인을 2026년의 선택에서 역추적하는 Pre-Mortem 프로젝트입니다.

This project was created for the 2026 KAIST Failure Lab AIxFailure Idea Contest. It is a pre-mortem from 2036 that traces a future failure back to choices already being made in 2026.

## 바로 보기 | Open the Project

- [라이브 웹 체험 | Live web experience](https://mov-hyun.github.io/2036-no-one-knocked/)
- [최종 제안서 PDF | Final proposal PDF](./2036_No_One_Knocked_이동현.pdf)

## 핵심 시나리오 | Core Scenario

2036년 11월 18일, 독거노인 김OO(82) 씨의 AI 돌봄 기록은 모두 정상입니다. 복약 이행률은 100%, 수면 점수는 91, 전력 사용은 정상, 위험 점수는 0.11입니다. 대면 접촉만 412일 동안 0회였고, 시스템은 경보를 울리지 않았습니다.

On November 18, 2036, every AI care metric for Kim, an 82-year-old living alone, is normal: 100% medication adherence, a sleep score of 91, normal power usage, and a low risk score of 0.11. The only missing value is human contact. No one has visited for 412 days, yet the system raises no alert.

AI는 주어진 목표를 정확히 최적화했습니다. 행정은 접속 건수, 응답률, 복약 이행률을 돌봄의 성공으로 측정했고, 사람의 방문은 줄일 수 있는 비용이 됐습니다. 이 프로젝트는 시스템이 측정하지 않은 관계가 어떻게 경보 없이 사라지는지 보여줍니다.

The AI optimizes exactly what it was asked to optimize. Administrators define successful care through connection counts, response rates, and medication compliance, turning human visits into a reducible cost. The project shows how relationships disappear without warning when the system never measures them.

## 웹 경험 | Web Experience

GitHub Pages는 어두운 사이버펑크 공공주택을 배경으로 한 반응형 디오라마입니다. 관람자는 빗속의 건물을 따라 내려가며 정상 지표, 412일의 접촉 공백, 원인 역추적, CARE+ 대응안을 순서대로 경험합니다.

The GitHub Pages site is a responsive cyberpunk diorama set in a rain-soaked public housing tower. Visitors move through normal system metrics, a 412-day contact gap, the reconstructed causes of failure, and the CARE+ response plan.

## CARE+ 프로토콜 | CARE+ Protocol

| 원칙 | 한국어 | English |
| --- | --- | --- |
| **C · Contact Floor** | 위험 점수와 무관한 월 1회 대면 방문 최저선 | A monthly in-person visit floor regardless of risk score |
| **A · Accountability Log** | 방문 생략을 포함한 AI 판단 이력의 추적·감사 | Traceable and auditable logs for AI-assisted decisions, including skipped visits |
| **R · Relational Metrics** | 대면 접촉률, 마지막 접촉 경과일, 관계망 변화를 핵심 KPI로 측정 | Core KPIs for in-person contact, time since last contact, and changes in social networks |
| **E · Escalation Rule** | 접촉 공백이 기준일을 넘으면 사람 방문을 자동 발령 | An automatic human visit when the contact gap exceeds the defined threshold |

CARE+는 계약, 감사, 평가, 경보의 네 층위에 사람의 방문 최저선을 고정합니다. 실행 로드맵은 2026년 제도 설계에서 시작해 2030년 접촉 공백 자동 경보 가동으로 이어집니다.

CARE+ protects a minimum level of human contact across contracts, audits, evaluation metrics, and alert rules. Its roadmap begins with policy design in 2026 and leads to automatic contact-gap alerts by 2030.

## 프로젝트 구성 | Project Structure

- `index.html` - 체험형 홈페이지 구조 | immersive experience structure
- `experience.css` - 반응형 디오라마, 비, HUD 시각 체계 | responsive diorama, rain, and HUD visual system
- `experience.js` - 장면 전환, 카운터, CARE+ 상호작용 | scene transitions, counters, and CARE+ interactions
- `2036_No_One_Knocked_이동현.pdf` - 최종 A4 2페이지 제안서 | final two-page A4 proposal
- `planning/research-backed-concept.md` - 연구 기반 기획 문서 | research-backed concept document
- `assets/contact-floor-tower-cyberpunk.png` - 디오라마 배경 이미지 | diorama background image

