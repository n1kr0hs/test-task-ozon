class Progress {
  constructor(container, options = {}) {
    if (!container) throw new Error("Progress: нужен контейнер!!!");

    this.opts = {
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
      onValueChange: null,
      ...options,
    };

    this.container = container;
    this.value = this.opts.initialValue;
    this.animated = false;
    this.hidden = false;

    this._createSVGElements();
    this._calculateCircumference();
    this.update();
  }

  _createSVGElements() {
    const ns = "http://www.w3.org/2000/svg";
    const {
      radius,
      strokeWidthBg,
      colorBg,
      strokeWidthFg,
      colorFg,
      strokeLinecap,
    } = this.opts;

    this.svg = document.createElementNS(ns, "svg");
    this.svg.setAttribute("viewBox", "0 0 100 100");

    this.bg = document.createElementNS(ns, "circle");
    this.bg.classList.add("circle-bg");
    this._setCommonCircleAttrs(this.bg);
    this.bg.setAttribute("stroke-width", strokeWidthBg);
    this.bg.setAttribute("stroke", colorBg);
    this.bg.setAttribute("fill", "none");

    this.progress = document.createElementNS(ns, "circle");
    this.progress.classList.add("circle-progress");
    this._setCommonCircleAttrs(this.progress);
    this.progress.setAttribute("stroke-width", strokeWidthFg);
    this.progress.setAttribute("stroke", colorFg);
    this.progress.setAttribute("stroke-linecap", strokeLinecap);
    this.progress.setAttribute("fill", "none");
    this.progress.style.transition =
      "stroke-dashoffset 0.6s ease-out, stroke 0.4s ease";
    this.progress.style.transform = "rotate(-90deg)";
    this.progress.style.transformOrigin = "50% 50%";

    this.svg.append(this.bg, this.progress);
    this.container.appendChild(this.svg);
  }

  _setCommonCircleAttrs(circle) {
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", this.opts.radius);
  }

  _calculateCircumference() {
    this.circumference = 2 * Math.PI * this.opts.radius;
    this.progress.style.strokeDasharray = String(this.circumference);
    this.progress.style.strokeDashoffset = String(this.circumference);
  }

  setValue(val) {
    this.value = Math.max(0, Number(val) || 0);
    this.update();
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
    this.progress.style.strokeDashoffset = String(offset);

    this.progress.setAttribute(
      "stroke",
      isError ? this.opts.errorColor : this.opts.colorFg,
    );
    this.svg.classList.toggle(this.opts.errorClass, isError);

    if (typeof this.opts.onValueChange === "function") {
      this.opts.onValueChange(this.value);
    }
  }
}
