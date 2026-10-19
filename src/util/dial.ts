export function createDial(dial: HTMLDivElement, onChange?: (val: number) => void) {
  // 同時に別のタッチを受けても、このダイヤルを操作中の入力だけを追跡する
  let activePointerId: number | null = null;

  // 前回の指の角度と、ダイヤルの累積角度
  let lastRadian = 0;
  let val = 0;

  // ダイヤル中心から入力位置までの角度を求める
  let getRadian = function (e: PointerEvent) {
    let bounds = dial.parentElement!.getBoundingClientRect();
    let x = bounds.left + dial.offsetWidth / 2;
    let y = bounds.top + dial.offsetHeight / 2;
    return Math.atan2(e.clientY - y, e.clientX - x);
  };

  let updataDraw = function (e: PointerEvent) {
    let radian = getRadian(e);
    let delta = (radian - lastRadian) * (180 / Math.PI);

    // 角度が境界をまたいだとき、逆回転したように見える差分を補正する
    if (delta > 180) delta -= 360;
    else if (delta < -180) delta += 360;

    // 上限・下限を越えて回した分を蓄積せず、端から戻るとすぐ反応させる
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

  // 現在のダイヤル角度を呼び出し元から参照できるようにする
  return {
    getVal: () => val,
  };
}
