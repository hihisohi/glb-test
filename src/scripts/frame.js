import { ScrollTrigger } from 'gsap/ScrollTrigger';

document.addEventListener("DOMContentLoaded", () => {

    const frameFull = document.querySelector('.frame-container .full');
    const frameLayers = document.querySelectorAll(".frame-layer");
    const farmeLayerLight = document.querySelector('.frame-layer.theme-light');
    const farmeLayerDark = document.querySelector('.frame-layer.theme-dark');

    farmeLayerLight.style.opacity = 1;
    farmeLayerDark.style.opacity = 0;

    ScrollTrigger.create({
        trigger: frameFull,
        start: "top top",
        end: () => `top+=${document.body.scrollHeight} bottom`,
        pin: true,
        pinSpacing: false,
        scrub: true,
    });

    const homePage = document.querySelector('.homePage')
    const progressBars = document.querySelectorAll('.progressBar');
    const rightLines = document.querySelectorAll('.right-line');

    progressBars.forEach(progressBar => {
        ScrollTrigger.create({
            trigger: homePage,
            start: "top top",
            end: "bottom bottom",
            // scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;

                progressBar.style.width = `${progress * 100}%`
            },
        });
    });

    rightLines.forEach(rightLine => {
        ScrollTrigger.create({
            trigger: homePage,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const progress = self.progress;

                rightLine.style.left = `${progress * 100}%`
            },
        });
    });


});
