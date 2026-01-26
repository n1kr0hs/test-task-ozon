document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("progress-container");
  if (!container) {
    console.error("Элемент #progress-container не найден");
    return;
  }

  const progress = new Progress(container);

  const valueInput = document.getElementById("value-input");
  if (valueInput) {
    valueInput.addEventListener("input", (e) =>
      progress.setValue(e.target.value),
    );
  }

  const animateToggle = document.getElementById("animate-toggle");
  if (animateToggle) {
    animateToggle.addEventListener("change", (e) =>
      progress.setAnimated(e.target.checked),
    );
  }

  const hideToggle = document.getElementById("hide-toggle");
  if (hideToggle) {
    hideToggle.addEventListener("change", (e) =>
      progress.setHidden(e.target.checked),
    );
  }

  progress.setValue(0);

  window.__progressInstance = progress;
});
