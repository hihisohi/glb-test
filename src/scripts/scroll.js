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

  // 페이지 로드 후 ScrollTrigger 새로고침 (높이 계산을 위해)
  ScrollTrigger.refresh();
});
