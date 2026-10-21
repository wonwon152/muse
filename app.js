// Tab Navigation, Category Filtering & Citizen Benefit Diagnosis Logic
document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================
     1. 수장고 탭 전환 로직
  ========================================================== */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const activeContent = document.getElementById(target);
      if (activeContent) {
        activeContent.classList.add("active");
      }
    });
  });

  /* ==========================================================
     2. 뉴스 카테고리 필터링
  ========================================================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const newsCards = document.querySelectorAll(".news-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.filter;

      newsCards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ==========================================================
     3. 부드러운 스크롤 처리
  ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  /* ==========================================================
     4. 대국민 맞춤 혜택 체크리스트 겸 자가진단 시스템
  ========================================================== */
  // 기관 제공 혜택 데이터베이스
  const SERVICE_DATABASE = {
    kids_program: {
      title: "어린이박물관 상설체험 & 수장고 놀이터 무료 이용",
      cost: "전액 무료",
      desc: "오감으로 즐기는 놀이형 체험 전시 '반짝반짝 폴짝콩짝'과 어린이 눈높이에 맞춘 수장고 탐험 활동지를 무상으로 제공합니다.",
      benefit: "💡 <strong>받을 수 있는 도움:</strong> 미취학~초등학생 자녀를 위한 고품질 문화예술 교육 프로그램 참여, 유아차 친화형 쾌적한 실내 여가 공간 제공",
      actionText: "어린이 체험실 사전예약 가이드",
      link: "https://www.nfm.go.kr/paju",
      tip: "주말 및 공휴일은 누리집 온라인 사전 신청 시 대기 없이 빠른 입장이 가능합니다."
    },
    archive_access: {
      title: "81만여 건의 민속 아카이브 및 전통 패턴 원문 무상 개방",
      cost: "공공누리 무료 개방",
      desc: "소장 중인 8만 6천여 점 유물의 고화질 사진, 도면, 3D 스캔 데이터 및 81만 건의 생활사 음원·영상·사진 자료를 저작권 걱정 없이 창작에 활용할 수 있도록 개방합니다.",
      benefit: "💡 <strong>받을 수 있는 도움:</strong> K-콘텐츠, 전통 공예, 서체·문양 디자인 시 필요한 공공 문화유산 디지털 에셋 및 상업적/비상업적 활용 지원",
      actionText: "민속 아카이브 센터 검색포털",
      link: "https://www.nfm.go.kr",
      tip: "1층 민속아카이브실에 방문하시면 전용 디지털 키오스크와 대형 모니터로 무제한 원문 열람 및 다운로드가 가능합니다."
    },
    research_support: {
      title: "유물 실측치·열람 대장 열람 및 학술 연구 데이터 지원",
      cost: "연구자 무상 지원",
      desc: "역사학, 인류학, 민속학, 박물관학 연구자 및 대학원생을 위한 비공개 수장고 유물 특별 열람 신청 및 학술 연구 데이터베이스를 지원합니다.",
      benefit: "💡 <strong>받을 수 있는 도움:</strong> 조선시대 목가구, 도기, 석물 등의 상세 제원, 방사선 투과 및 XRF 분석 학술 보고서 원문 열람 지원",
      actionText: "연구 목적 유물 열람 신청 안내",
      link: "https://www.nfm.go.kr",
      tip: "유물 열람 신청서 및 연구 계획서를 제출하시면 학예연구관과 1:1 일정 조율을 거쳐 안전하게 실물을 연구할 수 있습니다."
    },
    storage_tour: {
      title: "국내 최대 개방형 수장고(Open Storage) 자유 탐방",
      cost: "무료 관람",
      desc: "정형화된 전시관을 벗어나 15개 수장고의 웅장한 수장대와 유물들을 직접 둘러보는 특별한 문화 힐링 투어입니다. 헤이리 예술마을과 도보 연계가 가능합니다.",
      benefit: "💡 <strong>받을 수 있는 도움:</strong> 통유리창 너머의 '보이는 수장고'와 수장대 사이를 걷는 '열린 수장고'를 무료로 산책하며 선조들의 미학을 여유롭게 감상",
      actionText: "관람 시간 및 관람 동선 확인",
      link: "#explore",
      tip: "스마트폰으로 유물 태그 QR코드를 스캔하면 오디오 해설과 유물 정보를 즉시 청취하실 수 있습니다."
    },
    occult_night: {
      title: "야간 개방 문화행사 및 K-오컬트·세시풍속 특별 프로그램",
      cost: "무료 참여 (일부 체험 재료비 실비)",
      desc: "무속 신앙 유물, 액막이 부적, 도깨비·귀신 설화와 결합한 이색 야간 문화축제 및 테마 기획전시 프로그램에 참여할 수 있습니다.",
      benefit: "💡 <strong>받을 수 있는 도움:</strong> 뻔하지 않은 신선한 K-컬처 체험, 야간 개방 시 수장고의 신비로운 조명 분위기 속 큐레이터 특별 해설",
      actionText: "진행 중인 특별 문화 행사 보기",
      link: "#trends",
      tip: "인기 테마 행사는 조기 마감될 수 있으니 최신 뉴스 동향 탭의 공지 일정을 정기적으로 확인해보세요."
    },
    artifact_consult: {
      title: "소장 유물·고문서 과학 보존 상담 및 국가 기증·기탁 창구",
      cost: "상담 및 감정 무료",
      desc: "개인이나 문중이 소장 중인 오래된 고서적, 족보, 목가구 등의 곰팡이·해충 피해 방지 요령 상담 및 안전한 국가 수장고 기증·기탁 심의를 지원합니다.",
      benefit: "💡 <strong>받을 수 있는 도움:</strong> 가문 유산의 영구 멸실 방지, 최고 수준의 항온항습 수장고 보관 및 연구 유물 등록, 기증자 예우 혜택",
      actionText: "유물 기증·기탁 신청 절차 확인",
      link: "https://www.nfm.go.kr",
      tip: "유물의 보관 상태가 위태로운 경우 국립박물관 보존과학팀의 전문적인 보존 처리 자문을 받으실 수 있습니다."
    },
    accessible_visit: {
      title: "전 구역 무장애(Barrier-Free) 안심 관람 및 패밀리 케어 서비스",
      cost: "무료 대여 및 지원",
      desc: "턱이 전혀 없는 평면형 수장고 설계로 휠체어와 유모차가 모든 수장고와 전시 구역을 막힘없이 쾌적하게 이동할 수 있습니다.",
      benefit: "💡 <strong>받을 수 있는 도움:</strong> 휠체어·유모차 무료 현장 대여, 수유실 및 가족 화장실, 장애인 전용 넓은 주차 공간, 엘리베이터 완비",
      actionText: "방문 편의시설 상세 안내",
      link: "#info",
      tip: "1층 안내데스크에서 신분증 확인 후 유모차 및 휠체어를 즉시 대여받으실 수 있습니다."
    },
    conservation_tour: {
      title: "보존과학실 공개 견학 및 유물 복원 처리 과정 관람",
      cost: "무료 견학",
      desc: "박물관 지하에 숨겨져 있던 보존과학실을 유리창으로 공개하여 지류, 목재, 금속 문화재가 첨단 과학 장비로 세척·복원되는 과정을 직접 목격할 수 있습니다.",
      benefit: "💡 <strong>받을 수 있는 도움:</strong> 이공계 지망 청소년과 과학에 관심 있는 국민을 위한 과학+인문학 융합 생생 견학 교육",
      actionText: "보이는 보존과학실 안내",
      link: "#tasks",
      tip: "실제 연구원들이 유물을 현미경으로 관찰하고 약품 처리하는 리얼한 작업 풍경을 직접 확인하실 수 있습니다."
    }
  };

  const checklistGrid = document.getElementById("checklistGrid");
  const checkItems = document.querySelectorAll(".check-item");
  const selectedCounter = document.getElementById("selectedCounter");
  const btnDiagSubmit = document.getElementById("btnDiagSubmit");
  const btnDiagReset = document.getElementById("btnDiagReset");
  const diagResultContainer = document.getElementById("diagResultContainer");
  const resultServicesList = document.getElementById("resultServicesList");
  const resultTitle = document.getElementById("resultTitle");

  // 체크 상태 업데이트 함수
  function updateCheckCount() {
    const checked = document.querySelectorAll(".check-item input[type='checkbox']:checked");
    if (selectedCounter) {
      selectedCounter.textContent = checked.length;
    }
  }

  // 카드 클릭 시 체크박스 연동 및 active 클래스 토글
  checkItems.forEach((item) => {
    const chk = item.querySelector("input[type='checkbox']");

    item.addEventListener("click", (e) => {
      // 체크박스 자체 클릭이 아닌 카드를 누른 경우 상태 토글
      if (e.target !== chk) {
        chk.checked = !chk.checked;
      }
      if (chk.checked) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
      updateCheckCount();
    });

    chk.addEventListener("change", () => {
      if (chk.checked) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
      updateCheckCount();
    });
  });

  // 설문 유형 필터 탭 (가족, 창작자, 문화, 유물 등)
  const pillBtns = document.querySelectorAll(".pill-btn");
  pillBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      pillBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.diagFilter;
      checkItems.forEach((item) => {
        if (filter === "all" || item.dataset.group === filter) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // 초기화 버튼
  btnDiagReset.addEventListener("click", () => {
    checkItems.forEach((item) => {
      const chk = item.querySelector("input[type='checkbox']");
      chk.checked = false;
      item.classList.remove("selected");
    });
    updateCheckCount();
    diagResultContainer.style.display = "none";
  });

  // 진단 및 결과 출력 버튼
  btnDiagSubmit.addEventListener("click", () => {
    const checkedBoxes = Array.from(document.querySelectorAll(".check-item input[type='checkbox']:checked"));

    // 선택이 없을 경우 전체 추천 모드로 안내
    let targetKeys = [];
    if (checkedBoxes.length === 0) {
      // 아무것도 선택하지 않은 경우 기본 핵심 3개 서비스 추천
      targetKeys = ["storage_tour", "kids_program", "archive_access"];
      resultTitle.innerHTML = `🌟 추천 서비스: 모든 국민을 위한 국립민속박물관 파주 베스트 혜택 (기본 안내)`;
    } else {
      targetKeys = checkedBoxes.map((chk) => chk.value);
      resultTitle.innerHTML = `🎯 선택하신 맞춤 조건 (${targetKeys.length}개)에 부합하는 지원 혜택 및 이용 가이드`;
    }

    // 결과 HTML 생성
    let html = "";
    targetKeys.forEach((key, index) => {
      const s = SERVICE_DATABASE[key];
      if (!s) return;

      const isExternal = s.link.startsWith("http");

      html += `
        <div class="service-card">
          <div class="service-card-top">
            <h4 class="service-title">${index + 1}. ${s.title}</h4>
            <span class="service-cost-tag">${s.cost}</span>
          </div>
          <p class="service-desc">${s.desc}</p>
          <div class="service-benefit">${s.benefit}</div>
          <div class="service-action-row">
            <span class="service-guide-tip">📌 ${s.tip}</span>
            <a href="${s.link}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="service-btn-link">
              ${s.actionText} →
            </a>
          </div>
        </div>
      `;
    });

    resultServicesList.innerHTML = html;
    diagResultContainer.style.display = "block";

    // 결과 위치로 스무스 스크롤
    diagResultContainer.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});
