class Progress {
  constructor(container, options = {}) {
    if (!container) throw new Error("Progress: нужен контейнер!!!");
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
    this.progress.setAttribute("stroke-linecap", "butt");

    this.svg.append(this.bg, this.progress);
    this.container.appendChild(this.svg);

    this.circumference = 2 * Math.PI * 40;
    this.progress.style.strokeDasharray = String(this.circumference);

    this.value = 0;
    this.animated = false;
    this.hidden = false;

    this.opts = Object.assign(
      {
        errorThreshold: 101,
        hiddenClass: "hidden",
        animatedClass: "animated",
        errorClass: "error",
      },
      options,
    );

    this.update();
  }

  setValue(val) {
    this.value = Math.max(0, Number(val) || 0);
    this.update();

    this.svg.dispatchEvent(
      new CustomEvent("progress:change", { detail: { value: this.value } }),
    );
  }

  setAnimated(isOn) {
    this.animated = !!isOn;
    this.svg.classList.toggle(this.opts.animatedClass, this.animated);
  }

  setHidden(isHidden) {
    this.hidden = !!isHidden;
    if (this.container) {
      this.container.classList.toggle(this.opts.hiddenClass, this.hidden);
    }
  }

  getElement() {
    return this.svg;
  }

  destroy() {
    if (this.svg && this.svg.parentNode)
      this.svg.parentNode.removeChild(this.svg);
    this.svg = null;
    this.progress = null;
    this.bg = null;
    this.container = null;
  }

  update() {
    let progressRatio = Math.min(1, this.value / 100);
    const isError = this.value >= this.opts.errorThreshold;

    if (isError) progressRatio = 1;

    const offset = this.circumference * (1 - progressRatio);
    this.progress.style.setProperty("stroke-dashoffset", offset);

    if (isError) {
      this.progress.style.stroke = "#ef4444";
    } else {
      this.progress.style.stroke = "";
    }

    this.svg.classList.toggle(this.opts.errorClass, isError);
  }
}
