document.addEventListener("DOMContentLoaded", () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--100ui", `${vh * 100}px`);
});
