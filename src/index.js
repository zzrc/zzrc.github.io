import "./reset.css";
import "./style.css";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

document.addEventListener("DOMContentLoaded", () => {
  const setVH = () =>
    document.documentElement.style.setProperty(
      "--vh",
      `${innerHeight * 0.01}px`
    );
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

  if (navigator.serviceWorker) {
    try {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          navigator.serviceWorker.ready
            .then((reg) => console.log(reg))
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  }

  document.body.classList.add("loaded");
});
