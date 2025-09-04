import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

document.addEventListener("DOMContentLoaded", () => {

  const landingRef = document.querySelector(".landingRef");
  const landingHeight = landingRef.getBoundingClientRect().height;
  const landingInner = document.querySelector(".homeLanding__inner");

  ScrollTrigger.create({
    trigger: landingRef,
    start: "top top",
    end: `+=${landingHeight}`,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      landingInner.style.opacity = Math.max(1 - (progress - 0.1) / 0.2, 0);
    },
  });


  const projectIntroRef = document.querySelector(".projectIntroRef");
  const projectIntroHeight = projectIntroRef.getBoundingClientRect().height;
  const projectIntroDataAnis = document.querySelectorAll(".homeProjectIntro [data-ani]");
  const projectJsLines = document.querySelectorAll(".homeProjectIntro .js-line");
  const projectIntroMedia = document.querySelector(".homeProjectIntro__media");
  const projectIntroDescription = document.querySelector(".homeProjectIntro__description");

  projectIntroDataAnis.forEach((aniElement, index) => {
    ScrollTrigger.create({
      trigger: projectIntroRef,
      start: `top ${50 - index * 12}%`,
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        aniElement.style.transform = `translateY(${Math.max(8 - progress * 8, 0)}vh)`;
        aniElement.style.opacity = progress;
      },
    });
  });

  projectJsLines.forEach((line, index) => {
    ScrollTrigger.create({
      trigger: projectIntroRef,
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress > 0.7) {
          line.style.opacity = (progress - 0.7) / 0.3;
        }

        if (progress > 0.5) {
          projectIntroDescription.style.opacity = (progress - 0.5) / 0.3;
        }

        if (progress < 0.5) {
          projectIntroMedia.style.opacity = Math.min(progress * 2, 1);
        }
        projectIntroMedia.style.transform = `translate3d(${-100 + progress * 100}%, 0, ${-500 + progress * 500}px) rotateY(${50 - progress * 50}deg) scaleX(${0.8 + progress * 0.2})`;

      },
    });
  });





});
