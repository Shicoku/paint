export function createDial(dial: HTMLDivElement, onChange?: (val: number) => void) {
  let activePointerId: number | null = null;
  let lastRadian = 0;
  let val = 0;

  let getRadian = function (e: PointerEvent) {
    let bounds = dial.parentElement!.getBoundingClientRect();
    let x = bounds.left + dial.offsetWidth / 2;
    let y = bounds.top + dial.offsetHeight / 2;
    return Math.atan2(e.clientY - y, e.clientX - x);
  };

  let updataDraw = function (e: PointerEvent) {
    let radian = getRadian(e);
    let delta = (radian - lastRadian) * (180 / Math.PI);
    if (delta > 180) delta -= 360;
    else if (delta < -180) delta += 360;

    val = Math.min(360, Math.max(-360, val + delta));
    lastRadian = radian;
    dial.style.transform = `rotate(${val}deg)`;
    onChange?.(val);
  };

  dial.addEventListener("pointerdown", function (e) {
    if (activePointerId !== null) return;
    e.preventDefault();
    activePointerId = e.pointerId;
    lastRadian = getRadian(e);
    dial.setPointerCapture(e.pointerId);
  });

  dial.addEventListener("pointermove", function (e) {
    if (e.pointerId !== activePointerId) return;
    updataDraw(e);
  });

  const stopDialing = (e: PointerEvent) => {
    if (e.pointerId === activePointerId) activePointerId = null;
  };
  dial.addEventListener("pointerup", stopDialing);
  dial.addEventListener("pointercancel", stopDialing);
  dial.addEventListener("lostpointercapture", stopDialing);

  return {
    getVal: () => val,
  };
}
