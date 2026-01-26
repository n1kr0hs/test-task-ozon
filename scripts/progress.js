class Progress {
  constructor(container) {
    this.container = container;

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("viewBox", "0 0 100 100");

    this.bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.bg.classList.add("circle-bg");
    this.bg.setAttribute("cx", "50");
    this.bg.setAttribute("cy", "50");
    this.bg.setAttribute("r", "40");

    this.progress = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this.progress.classList.add("circle-progress");
    this.progress.setAttribute("cx", "50");
    this.progress.setAttribute("cy", "50");
    this.progress.setAttribute("r", "40");

    this.svg.append(this.bg, this.progress);
    this.container.appendChild(this.svg);

    this.circumference = 2 * Math.PI * 40;

    this.value = 0;
    this.animated = false;
    this.hidden = false;

    this.update();
  }

  setValue(val) {
    this.value = Math.max(0, Math.min(100, Number(val) || 0));
    this.update();
  }

  setAnimated(isOn) {
    this.animated = !!isOn;
    this.update();
  }

  setHidden(isHidden) {
    this.hidden = !!isHidden;
    this.update();
  }

  update() {
    let progress = this.value / 100;
    if (this.value === 100) progress = 0.99;

    const offset = this.circumference * (1 - progress);
    this.progress.style.strokeDashoffset = offset;

    this.svg.classList.toggle("animated", this.animated);
    this.container.classList.toggle("hidden", this.hidden);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("progress-container");
  const progress = new Progress(container);

  const valueInput = document.getElementById("value-input");
  if (valueInput) {
    valueInput.addEventListener("input", (e) => {
      progress.setValue(e.target.value);
    });
  }

  const animateToggle = document.getElementById("animate-toggle");
  if (animateToggle) {
    animateToggle.addEventListener("change", (e) => {
      progress.setAnimated(e.target.checked);
    });
  }

  const hideToggle = document.getElementById("hide-toggle");
  if (hideToggle) {
    hideToggle.addEventListener("change", (e) => {
      progress.setHidden(e.target.checked);
    });
  }

  progress.setValue(0);
});
