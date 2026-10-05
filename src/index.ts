// 読み込み
window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");

  if (!ctx) return;

  const lastPosition = { x: 0, y: 0 }; // マウスの最後の位置を保持するオブジェクト

  let isDrag = false; // ドラッグ中かどうかを判定するフラグ

  // 描画処理
  function draw(x: number, y: number) {
    if (!isDrag) return;
    if (!ctx) return;

    // 線の状態
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";

    // 最後の位置が初期値の場合は、現在の位置に移動する
    if (lastPosition.x === 0 || lastPosition.y === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.moveTo(lastPosition.x, lastPosition.y);
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPosition.x = x;
    lastPosition.y = y;
  }

  function clear() {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }

  function dragStart(e: MouseEvent) {
    if (!ctx) return;

    ctx.beginPath();

    isDrag = true;
  }

  function dragEnd(e: MouseEvent) {
    if (!ctx) return;
    isDrag = false;
    lastPosition.x = 0;
    lastPosition.y = 0;
  }

  function initEventHandler() {
    const clearButton = document.getElementById("clear") as HTMLButtonElement;
    clearButton.addEventListener("click", clear);

    canvas.addEventListener("mousedown", dragStart);
    canvas.addEventListener("mouseup", dragEnd);
    canvas.addEventListener("mouseleave", dragEnd);
    canvas.addEventListener("mousemove", (e) => {
      draw(e.layerX, e.layerY);
    });
  }

  initEventHandler();
});
