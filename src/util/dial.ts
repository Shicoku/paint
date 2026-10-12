export function createDial(dial: HTMLDivElement, onChange?: (val: number) => void) {
  let isDialing = false;
  let lastRadian = 0;
  let val = 0;

  let getRadian = function (e: MouseEvent) {
    let bounds = dial.parentElement!.getBoundingClientRect();
    let x = bounds.left + dial.offsetWidth / 2;
    let y = bounds.top + dial.offsetHeight / 2;
    return Math.atan2(e.clientY - y, e.clientX - x);
  };

  let updataDraw = function (e: MouseEvent) {
    let radian = getRadian(e);
    let delta = (radian - lastRadian) * (180 / Math.PI);
    if (delta > 180) delta -= 360;
    else if (delta < -180) delta += 360;

    val += delta;
    lastRadian = radian;
    dial.style.transform = `rotate(${val}deg)`;
    onChange?.(val);
  };

  dial.addEventListener("mousedown", function (e) {
    isDialing = true;
    lastRadian = getRadian(e);
  });

  window.addEventListener("mousemove", function (e) {
    if (!isDialing) return;
    updataDraw(e);
  });

  window.addEventListener("mouseup", function (e) {
    isDialing = false;
  });

  return {
    getVal: () => val,
  };
}
