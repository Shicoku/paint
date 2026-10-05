const dial = document.querySelector(".dial") as HTMLDivElement;

let isDragging = false;

let updateDraw = function (e: MouseEvent) {
  let bounds = dial.parentElement!.getBoundingClientRect();
  let x = bounds.left + dial.offsetWidth / 2;
  let y = bounds.top + dial.offsetHeight / 2;
  let radian = Math.atan2(e.clientY - y, e.clientX - x);

  dial.style.transform = `rotate(${radian * (180 / Math.PI)}deg)`;
};

dial.addEventListener("mousedown", function (e) {
  isDragging = true;
  updateDraw(e);
});

window.addEventListener("mousemove", function (e) {
  if (!isDragging) return;
  updateDraw(e);
});

window.addEventListener("mouseup", function () {
  isDragging = false;
});
