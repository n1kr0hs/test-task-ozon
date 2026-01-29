class Progress {
  constructor(container, options = {}) {
    if (!container) throw new Error("Progress: нужен контейнер!!!");
    this.container = container;

    this.opts = Object.assign(
      {
        radius: 40,
        strokeWidthBg: 8,
        strokeWidthFg: 8,
        colorBg: "#eee",
        colorFg: "#007aff",
        errorColor: "#ef4444",
        initialValue: 0,
        animatedClass: "animated",
        errorClass: "error",
        hiddenClass: "hidden",
        errorThreshold: 101,
        strokeLinecap: "butt",
      },
      options,
    );

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("viewBox", "0 0 100 100");

    this.bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.bg.classList.add("circle-bg");
    this.bg.setAttribute("cx", "50");
    this.bg.setAttribute("cy", "50");
    this.bg.setAttribute("r", this.opts.radius);
    this.bg.setAttribute("stroke-width", this.opts.strokeWidthBg);
    this.bg.setAttribute("stroke", this.opts.colorBg);
    this.bg.setAttribute("fill", "none");

    this.progress = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this.progress.classList.add("circle-progress");
    this.progress.setAttribute("cx", "50");
    this.progress.setAttribute("cy", "50");
    this.progress.setAttribute("r", this.opts.radius);
    this.progress.setAttribute("stroke-width", this.opts.strokeWidthFg);
    this.progress.setAttribute("stroke-linecap", this.opts.strokeLinecap);
    this.progress.setAttribute("fill", "none");
    this.progress.setAttribute("stroke", this.opts.colorFg);
    this.progress.style.transition =
      "stroke-dashoffset 0.6s ease-out, stroke 0.4s ease";
    this.progress.style.transform = "rotate(-90deg)";
    this.progress.style.transformOrigin = "50% 50%";

    this.svg.append(this.bg, this.progress);
    this.container.appendChild(this.svg);

    this.circumference = 2 * Math.PI * this.opts.radius;
    this.progress.style.strokeDasharray = String(this.circumference);
    this.progress.style.strokeDashoffset = String(this.circumference);

    this.value = this.opts.initialValue;
    this.animated = false;
    this.hidden = false;

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
      this.container.style.opacity = isHidden ? "0" : "1";
      this.container.style.visibility = isHidden ? "hidden" : "visible";
      this.container.style.pointerEvents = isHidden ? "none" : "auto";
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
    this.progress.style.strokeDashoffset = String(offset);

    this.progress.setAttribute(
      "stroke",
      isError ? this.opts.errorColor : this.opts.colorFg,
    );
    this.svg.classList.toggle(this.opts.errorClass, isError);
  }
}
