import { createDial } from "./util/dial";

type Pointer = { x: number; y: number };

const canvas_size = 400;
const center = canvas_size / 2;
const scale = canvas_size / 360;

const pointer: Pointer = { x: center, y: center };

function clamp(n: number): number {
  return Math.min(canvas_size, Math.max(0, n));
}

function toCoord(angle: number): number {
  return clamp(center + angle * scale);
}

const xOut = document.querySelector("#x-out") as HTMLSpanElement;
const dialX = createDial(document.querySelector(".dial-x") as HTMLDivElement, (v) => {
  pointer.x = toCoord(v);
  xOut.textContent = String(Math.round(pointer.x));
  drawLine(pointer.x, pointer.y);
  drawPointer();
});

const yOut = document.querySelector("#y-out") as HTMLSpanElement;
const dialY = createDial(document.querySelector(".dial-y") as HTMLDivElement, (v) => {
  pointer.y = toCoord(v);
  yOut.textContent = String(Math.round(pointer.y));
  drawLine(pointer.x, pointer.y);
  drawPointer();
});

const canvasPointer = document.getElementById("canvasPointer") as HTMLCanvasElement;
const pointerCtx = canvasPointer?.getContext("2d");
const canvasPaint = document.getElementById("canvasPaint") as HTMLCanvasElement;
const paintCtx = canvasPaint?.getContext("2d");

function drawPointer() {
  if (!pointerCtx) return;

  pointerCtx.clearRect(0, 0, canvasPointer.width, canvasPointer.height);

  pointerCtx.beginPath();
  pointerCtx.arc(pointer.x, pointer.y, 6, 0, Math.PI * 2);
  pointerCtx.fillStyle = "red";
  pointerCtx.fill();
}

let isPainting = false;

let lastPointer: Pointer | null = null;

function drawLine(x: number, y: number) {
  if (!isPainting) return;
  if (!paintCtx) return;

  const from = lastPointer ?? { x, y };

  paintCtx.beginPath();
  paintCtx.lineCap = "round";
  paintCtx.lineJoin = "round";
  paintCtx.lineWidth = 5;
  paintCtx.strokeStyle = "black";
  paintCtx.moveTo(from.x, from.y);
  paintCtx.lineTo(x, y);
  paintCtx.stroke();

  lastPointer = { x, y };
}

window.addEventListener("load", () => drawPointer());

document.getElementById("painting")?.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  isPainting = target.checked;
  lastPointer = null;
});

document.getElementById("clear")?.addEventListener("click", () => {
  paintCtx?.clearRect(0, 0, canvasPaint.width, canvasPaint.height);
});
