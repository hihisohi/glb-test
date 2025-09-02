import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

document.addEventListener("DOMContentLoaded", () => {
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper", // ✅ 특정 래퍼만 부드럽게
    content: "#smooth-content", // ✅ 이 안의 내용만 이동
    smooth: 1,
    effects: true, // data-speed, data-lag 사용 가능
  });

  const frame = document.querySelector(".frame");
  ScrollTrigger.create({
    trigger: frame,
    start: "top top",
    end: () => `top+=${document.body.scrollHeight} bottom`,
    pin: true,
    pinSpacing: false,
    scrub: true,
  });

  // .ref 클래스 요소들에 pin 기능 추가
  const refElements = document.querySelectorAll(".ref");

  refElements.forEach((element, index) => {
    // 각 요소의 높이를 가져와서 pin 설정
    const elementHeight = element.offsetHeight;

    ScrollTrigger.create({
      trigger: element,
      start: "top top", // 요소의 top이 뷰포트 top에 닿을 때 시작
      end: `+=${elementHeight}`, // 요소 높이만큼 스크롤 후 종료
      pin: true, // 요소를 고정
      pinSpacing: true, // pin 공간 확보
      markers: false, // 디버깅용 마커 (필요시 true로 변경)
      onEnter: () => {
        console.log(`Element ${index + 1} pinned`);
      },
      onLeave: () => {
        console.log(`Element ${index + 1} unpinned`);
      },
    });
  });

  const heroRef = document.querySelector(".heroRef");
  const canvasContainer = document.querySelector(".canvas-container");

  ScrollTrigger.create({
    trigger: heroRef,
    target: canvasContainer,
    start: "top top",
    end: () => `top+=${heroRef.scrollHeight} bottom`,
    pin: true,
    pinSpacing: false,
    scrub: true,
  });

  // 페이지 로드 후 ScrollTrigger 새로고침 (높이 계산을 위해)
  ScrollTrigger.refresh();
});
