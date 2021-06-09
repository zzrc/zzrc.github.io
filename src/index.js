import "./reset.css";
import "./style.css";

import "./scripts/three";
import "./components";

const setVH = () =>
  document.documentElement.style.setProperty("--vh", `${innerHeight * 0.01}px`);
setVH();
addEventListener("resize", setVH);

document.querySelectorAll(`a[href^="#"]`).forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
