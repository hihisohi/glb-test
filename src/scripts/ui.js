import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

document.addEventListener("DOMContentLoaded", () => {

  // ***
  // Landing
  // ***
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


  // ***
  // Project Intro
  // ***
  const projectIntroRef = document.querySelector(".projectIntroRef");
  const projectIntroHeight = projectIntroRef.getBoundingClientRect().height;
  const projectIntroDataAnis = document.querySelectorAll(".homeProjectIntro [data-ani]");
  const projectJsLines = document.querySelectorAll(".homeProjectIntro .js-line");
  const projectIntroMedia = document.querySelector(".homeProjectIntro__media");
  const projectIntroDescription = document.querySelector(".homeProjectIntro__description");

  const projectStoryRef = document.querySelector(".projectStoryRef");
  const projectStoryHeight = projectStoryRef.getBoundingClientRect().height;

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

    ScrollTrigger.create({
      trigger: projectStoryRef,
      start: `top ${100 - index * 12}%`,
      end: `+=${projectStoryHeight * 0.15}`,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        aniElement.style.transform = `translateY(-${Math.min(progress * 8, 8)}vh)`;
        aniElement.style.opacity = 1 - progress;
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

        if (progress > 0.5) {
          // projectIntroMedia.style.opacity = Math.min(progress * 2, 1);
          projectIntroMedia.style.opacity = (progress - 0.5) / 0.2;
        } else {
          projectIntroMedia.style.opacity = 0;
        }
        projectIntroMedia.style.transform = `translate3d(${-100 + progress * 100}%, 0, ${-500 + progress * 500}px) rotateY(${50 - progress * 50}deg) scaleX(${0.8 + progress * 0.2})`;

      },
    });

    ScrollTrigger.create({
      trigger: projectStoryRef,
      start: "top bottom",
      end: `+=${projectStoryHeight * 0.2}`,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        line.style.opacity = 1 - progress;

        projectIntroDescription.style.opacity = 1 - progress;

        projectIntroMedia.style.transform = `translate3d(0, -${progress * 20}%, 0) rotateY(${progress * 90 * 1.5}deg) scaleX(1)`;

        if (progress * 90 * 1.5 > 90) {
          projectIntroMedia.style.opacity = 0;
        } else {
          projectIntroMedia.style.opacity = 1;
        }
      },
    });
  });

  // ***
  // Project Story
  // ***
  const projectStoryBg = document.querySelector(".homeProjectStory-bg");
  const prohectStorySection = document.querySelector(".homeProjectStory");
  const projectStoryDataAnis = document.querySelectorAll(".homeProjectStory [data-ani]");
  const stroyJsLines = document.querySelectorAll(".homeProjectStory .js-line");

  prohectStorySection.style.transform = `translateY(${window.innerHeight}px)`;

  ScrollTrigger.create({
    trigger: projectStoryRef,
    start: "top bottom",
    end: `+=${projectStoryHeight}`,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      prohectStorySection.style.transform = `translateY(${window.innerHeight - projectStoryHeight * progress}px)`;

      if (progress > 0.1) {
        projectStoryBg.style.opacity = Math.min((progress - 0.2) / 0.1, 0.9);

        const bg = document.querySelector(".homeProjectStory-bg .parallax-bg");
        if (bg) {
          // 더 자연스러운 패럴럭스 효과: 가속도와 easing을 적용
          const parallaxSpeed = 0.8; // 패럴럭스 속도 조절
          const easedProgress = progress * progress * (3 - 2 * progress); // smoothstep easing
          const offset = easedProgress * -20 * parallaxSpeed; // -20%까지 이동

          bg.style.transform = `translateY(${offset}%) scale(1.1)`;
          bg.style.willChange = 'transform'; // 성능 최적화
        }
      }

      if (progress > 0.1) {
        prohectStorySection.style.opacity = Math.min((progress - 0.2) / 0.1, 0.9);
      }

      if (progress > 0.9) {
        projectStoryBg.style.opacity = 1 - (progress - 0.9) / 0.1;
        prohectStorySection.style.opacity = 1 - (progress - 0.9) / 0.1;
      }

    }
  });

  projectStoryDataAnis.forEach((aniElement, index) => {
    ScrollTrigger.create({
      trigger: projectStoryRef,
      start: `top ${30 - index * 12}%`,
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        aniElement.style.transform = `translateY(${Math.max(8 - progress * 8, 0)}vh)`;
        aniElement.style.opacity = progress;
      },
    });

    ScrollTrigger.create({
      trigger: projectStoryRef,
      start: `top ${100 - index * 12}%`,
      end: `+=${projectStoryHeight * 0.15}`,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        aniElement.style.transform = `translateY(-${Math.min(progress * 8, 8)}vh)`;
        aniElement.style.opacity = 1 - progress;
      },
    });

  });



  // ***
  // Collection Intro
  // ***
  const collectionIntroRef = document.querySelector(".collectionIntroRef");
  const collectionIntroHeight = collectionIntroRef.getBoundingClientRect().height;
  const collectionIntroSection = document.querySelector(".homeCollectionIntro");
  const collectionIntroCount = document.querySelector(".collectionIntroCount__count [data-ui='count']");
  const collectionIntroMediaWrap = document.querySelector(".homeCollectionIntro__mediaWrap[data-ui='mediaWrap']");
  const homeCollectionIntroHero = document.querySelector(".homeCollectionIntro-bg__inner");
  const homeCollectionIntroRectItems = document.querySelectorAll(".homeCollectionIntro-bg .rect-item");

  collectionIntroSection.style.transform = `translateY(${window.innerHeight}px)`;

  // 마우스 3D 효과를 위한 변수들
  let mouseX = 0;
  let mouseY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;

  // 3D 애니메이션 활성화 상태
  let is3DAnimationActive = false;
  let animationFrameId = null;

  // 스크롤 progress 저장 변수
  let scrollProgress = 0;

  // 마우스 움직임 이벤트 리스너
  document.addEventListener('mousemove', (event) => {
    // 마우스 위치를 -1 ~ 1 범위로 정규화
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    // 회전 각도 계산 (최대 10도)
    targetRotateX = mouseY * -10; // Y 마우스 움직임은 X축 회전
    targetRotateY = mouseX * 10;  // X 마우스 움직임은 Y축 회전
  });

  // 부드러운 3D 회전 애니메이션
  function animate3D() {
    // 3D 애니메이션이 비활성화되면 중단
    if (!is3DAnimationActive) {
      return;
    }

    // 부드러운 보간
    currentRotateX += (targetRotateX - currentRotateX) * 0.1;
    currentRotateY += (targetRotateY - currentRotateY) * 0.1;

    // homeCollectionIntroHero에 3D transform 적용 (스케일 + 마우스 효과 결합)
    if (homeCollectionIntroHero) {
      const scale = 1 - scrollProgress;
      homeCollectionIntroHero.style.transform = `
        perspective(1000px) 
        scale(${scale})
        rotateX(${currentRotateX}deg) 
        rotateY(${currentRotateY}deg) 
        translateZ(20px)
      `;
    }

    animationFrameId = requestAnimationFrame(animate3D);
  }

  // 3D 애니메이션 시작 함수
  function start3DAnimation() {
    if (!is3DAnimationActive) {
      is3DAnimationActive = true;
      animate3D();
    }
  }

  // 3D 애니메이션 중단 함수
  function stop3DAnimation() {
    is3DAnimationActive = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  ScrollTrigger.create({
    trigger: collectionIntroRef,
    start: "top bottom",
    end: `+=${collectionIntroHeight}`,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      collectionIntroSection.style.transform = `translateY(${Math.max(window.innerHeight - collectionIntroHeight * progress, 0)}px)`;

      if (progress > 0.5) {
        collectionIntroMediaWrap.style.setProperty('--inPr', (progress - 0.5) / 0.5);
      }

      homeCollectionIntroHero.style.transform = `
      translate3d(0, 0, 0)
      rotateY(${-90 + progress * 90}deg)
      skew(${-10 + progress * 10}deg, ${10 - progress * 10}deg)
      `;

      if (progress >= 1) {
        // 3D 애니메이션 시작
        start3DAnimation();
      } else {
        // progress < 1일 때 3D 애니메이션 중단
        stop3DAnimation();
      }

    },

  });

  ScrollTrigger.create({
    trigger: collectionIntroRef,
    start: "top 80%",
    end: `+=${collectionIntroHeight}`,
    scrub: true,
    onEnter: () => {
      let count = 0;

      const interval = setInterval(() => {
        collectionIntroCount.textContent = count.toString().padStart(2, '0');
        count++;
        if (count > 10) {
          clearInterval(interval);
        }
      }, 80);
    }
  });


  // ***
  // Collection Gallery
  // ***
  const collectionGalleryRef = document.querySelector(".collectionGalleryRef");
  const collectionGalleryHeight = collectionGalleryRef.getBoundingClientRect().height;
  const collectionGallerySection = document.querySelector(".homeCollectionGallery");

  const collectionGalleryTopLeft = document.querySelector(".homeCollectionGallery .block--topleft");
  const collectionGalleryTopRight = document.querySelector(".homeCollectionGallery .block--topright");
  const collectionGalleryBottom = document.querySelector(".homeCollectionGallery .block--bottom");

  const collectionGallery = document.querySelector(".collectionGallery");

  collectionGallerySection.style.transform = `translateY(${window.innerHeight}px)`;

  ScrollTrigger.create({
    trigger: collectionGalleryRef,
    start: "top bottom",
    end: `+=${collectionGalleryHeight}`,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      collectionGallerySection.style.transform = `translateY(${Math.max(window.innerHeight - collectionGalleryHeight * progress, 0)}px)`;

      // 스크롤 progress 업데이트 (3D 애니메이션에서 사용)
      scrollProgress = progress;

      // 3D 애니메이션이 비활성화된 경우에도 스케일 적용
      if (!is3DAnimationActive && homeCollectionIntroHero) {
        const scale = 1 - progress;
        homeCollectionIntroHero.style.transform = `
        translate3d(0, 0, 0)
        rotateY(${-90 + progress * 90}deg)
        skew(${-10 + progress * 10}deg, ${10 - progress * 10}deg)
        scale(${scale})
        `;
      }

      collectionGallery.style.transform = `translate(0, ${-180 + Math.min(progress * 180 * 1.4, 180)}%)`;

      if (progress > 0.3) {
        collectionIntroSection.style.opacity = Math.max((1 - (progress - 0.3) / 0.1), 0);
        collectionIntroSection.style.transform = `translateY(-${(progress - 0.3) / 0.7 * window.innerHeight}px)`;
      }

      if (progress > 0.45) {
        collectionGalleryTopLeft.style.opacity = 1;
        collectionGalleryTopRight.style.opacity = 1;
        collectionGalleryBottom.style.opacity = 1;

        homeCollectionIntroHero.style.opacity = 0;
      } else {
        collectionGalleryTopLeft.style.opacity = 0;
        collectionGalleryTopRight.style.opacity = 0;
        collectionGalleryBottom.style.opacity = 0;

        homeCollectionIntroHero.style.opacity = 1;
      }
    }
  });

  // ScrollTrigger.create({
  //   trigger: collectionGalleryRef,
  //   start: "top 31%",
  //   end: `+=${collectionGalleryHeight}`,
  //   scrub: true,
  //   onEnter: () => {
  //     stop3DAnimation();
  //     homeCollectionIntroHero.style.transform = `
  //     translate3d(0, 0, 0)
  //     rotateY(0deg)
  //     skew(0deg, 0deg)
  //     `;
  //   },
  //   onEnterBack: () => {
  //     // 3D 애니메이션 상태 강제 재설정
  //     is3DAnimationActive = false;
  //     if (animationFrameId) {
  //       cancelAnimationFrame(animationFrameId);
  //       animationFrameId = null;
  //     }

  //     // 회전 값들 초기화
  //     currentRotateX = 0;
  //     currentRotateY = 0;
  //     targetRotateX = 0;
  //     targetRotateY = 0;

  //     // 원래 transform 상태로 복원
  //     homeCollectionIntroHero.style.transform = `
  //     translate3d(0, 0, 0)
  //     rotateY(-90deg)
  //     skew(-10deg, 10deg)
  //     `;

  //     // 3D 애니메이션 재시작
  //     start3DAnimation();
  //   },
  // });

  homeCollectionIntroRectItems.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: collectionGalleryRef,
      start: `top ${100 - index * 33}%`,
      end: `+=${collectionIntroHeight * 0.5}`,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        item.style.transform = `translate(-50%, -50%) scale(${progress * 1.8})`;

      }
    });
  });


  // ***
  // launch
  // ***
  const launchRef = document.querySelector(".launchRef");
  const launchHeight = launchRef.getBoundingClientRect().height;
  const launchSection = document.querySelector(".homeLaunch");

  const singleCards = document.querySelectorAll(".singleCard");

  launchSection.style.transform = `translateY(${window.innerHeight}px)`;

  ScrollTrigger.create({
    trigger: launchRef,
    start: "top bottom",
    end: `+=${launchHeight * 2}`,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      launchSection.style.transform = `translateY(${window.innerHeight - launchHeight * progress}px)`;

      if (progress > 0.15) {
        collectionGallerySection.style.transform = `translateY(-${(progress - 0.15) / 0.7 * window.innerHeight}px)`;

        collectionGalleryBottom.style.transform = `rotateY(${Math.min((progress - 0.15) / 0.1, 1) * -90}deg)`;

        if ((progress - 0.15) / 0.1 > 1) {
          collectionGalleryBottom.style.opacity = 0;
        } else {
          collectionGalleryBottom.style.opacity = 1;
        }


        homeCollectionIntroRectItems.forEach((item, index) => {
          item.style.opacity = 1 - (progress - 0.15) / 0.2;
        });

      }

      if (progress > 0.25) {
        const singleCardProgress = (progress - 0.25) / 0.1;

        singleCards.forEach((card, index) => {
          card.style.transform = `
          translate(-50%, -50%)
          rotateY(${-90 + Math.min(singleCardProgress * 90, 90)}deg) `;

          card.style.opacity = 1;
        });
      } else {
        singleCards.forEach((card, index) => {
          card.style.opacity = 0;
        });
      }


      if (progress > 0.5) {
        launchSection.style.opacity = Math.max(1 - (progress - 0.5) / 0.1, 0);
      }
    }
  });







});
