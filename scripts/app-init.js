document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("progress-container");
  if (!container) {
    console.error("Элемент #progress-container не найден");
    return;
  }

  const progress = new Progress(container, {
    initialValue: 60,
  });

  progress.setAnimated(true);

  const valueInput = document.getElementById("value-input");
  const animateToggle = document.getElementById("animate-toggle");
  const hideToggle = document.getElementById("hide-toggle");

  if (valueInput) valueInput.value = progress.value;

  if (animateToggle) animateToggle.checked = true;

  valueInput?.addEventListener("input", (e) => {
    progress.setValue(e.target.value);
  });

  animateToggle?.addEventListener("change", (e) => {
    progress.setAnimated(e.target.checked);
  });

  hideToggle?.addEventListener("change", (e) => {
    progress.setHidden(e.target.checked);
  });

  progress.svg.addEventListener("progress:change", (e) => {
    if (valueInput) valueInput.value = e.detail.value;
  });
});
