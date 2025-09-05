import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// GSAP 플러그인 전역 등록
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

document.addEventListener("DOMContentLoaded", () => {
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper", // ✅ 특정 래퍼만 부드럽게
    content: "#smooth-content", // ✅ 이 안의 내용만 이동
    smooth: 1,
    effects: true, // data-speed, data-lag 사용 가능
  });

  // 100ui 설정
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--100ui", `${vh * 100}px`);

  // 섹션에 따른 테마 변경 감지 및 적용
  setupThemeObserver();

  // 페이지 로드 후 ScrollTrigger 새로고침 (높이 계산을 위해)
  ScrollTrigger.refresh();
});


function setupThemeObserver() {
  const farmeLayerLight = document.querySelector('.frame-layer.theme-light');
  const farmeLayerDark = document.querySelector('.frame-layer.theme-dark');

  const sections = document.querySelectorAll('.ui-container section');

  const refsMap = new Map();
  document.querySelectorAll('.homePage .ref').forEach(ref => {
    refsMap.set(ref.dataset.ui, ref);
  });

  sections.forEach(section => {
    const sectionRef = section.dataset.ref;
    const triggerElement = refsMap.get(sectionRef);

    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 50%",
      end: `bottom 50%`,
      onEnter: () => {
        section.style.pointerEvents = 'auto';
      },
      onLeave: () => {
        section.style.pointerEvents = 'none';
      },
      onEnterBack: () => {
        section.style.pointerEvents = 'auto';
      },
      onLeaveBack: () => {
        section.style.pointerEvents = 'none';
      },
    });

    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 80%",
      end: `+=${window.innerHeight * 0.3}`,
      onUpdate: (self) => {
        const progress = self.progress;

        if (section.classList.contains('lightTheme')) {
          farmeLayerLight.style.opacity = progress * 1.1;
          farmeLayerDark.style.opacity = (1 - progress) * 1.1;
        } else if (section.classList.contains('darkTheme')) {
          farmeLayerLight.style.opacity = (1 - progress) * 1.1;
          farmeLayerDark.style.opacity = progress * 1.1;
        }
      },
    });
  });
}

