import gsap from 'gsap'

const bgMusic = new Audio('/assets/audio/Alex_Mason-Nostromo.mp3')

const preloader = document.createElement("div")
{
  preloader.id = "preloader"
  document.body.appendChild(preloader);
}

const enterBtn = document.createElement("button")
{
  enterBtn.id = "enter"
  enterBtn.innerText = "Start exploring ZZRC"
  preloader.appendChild(enterBtn);
  enterBtn.addEventListener("click", () => {
    gsap.fromTo(bgMusic, {
      volume: 0.1
    }, {
      duration: 30,
      volume: 0.5,
      onStart: () => void bgMusic.play()
    })

    gsap.fromTo("#preloader", {
      opacity: 1,
    }, {
      duration: 0.5,
      opacity: 0,
      onComplete: args => preloader.remove()
    });
  })
}
