import { createDial } from "./util/dial";

type Pointer = { x: number; y: number };

const canvas_size = 400;
const center = canvas_size / 2;
const scale = canvas_size / 360;

const pointer: Pointer = { x: center, y: center };

let pointerSize = 6;
let color = "#000";

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
  drawPointer(pointerSize);
});

const yOut = document.querySelector("#y-out") as HTMLSpanElement;
const dialY = createDial(document.querySelector(".dial-y") as HTMLDivElement, (v) => {
  pointer.y = toCoord(v);
  yOut.textContent = String(Math.round(pointer.y));
  drawLine(pointer.x, pointer.y);
  drawPointer(pointerSize);
});

const canvasPointer = document.getElementById("canvasPointer") as HTMLCanvasElement;
const pointerCtx = canvasPointer?.getContext("2d");
const canvasPaint = document.getElementById("canvasPaint") as HTMLCanvasElement;
const paintCtx = canvasPaint?.getContext("2d");

function drawPointer(size: number) {
  if (!pointerCtx) return;

  pointerCtx.clearRect(0, 0, canvasPointer.width, canvasPointer.height);

  pointerCtx.beginPath();
  pointerCtx.arc(pointer.x, pointer.y, size, 0, Math.PI * 2);
  pointerCtx.lineWidth = 2;
  pointerCtx.strokeStyle = color;
  pointerCtx.stroke();
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
  paintCtx.lineWidth = pointerSize;
  paintCtx.strokeStyle = color;
  paintCtx.moveTo(from.x, from.y);
  paintCtx.lineTo(x, y);
  paintCtx.stroke();

  lastPointer = { x, y };
}

window.addEventListener("load", () => {
  if (!paintCtx) return;

  paintCtx.fillStyle = "#fff";
  paintCtx.fillRect(0, 0, canvasPaint.width, canvasPaint.height);
  drawPointer(pointerSize);
});

document.getElementById("painting")?.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  isPainting = target.checked;
  lastPointer = null;
});

document.getElementById("clear")?.addEventListener("click", () => {
  if (!paintCtx) return;
  paintCtx.fillStyle = "#fff";
  paintCtx.fillRect(0, 0, canvasPaint.width, canvasPaint.height);
});

document.getElementById("pointerSize")?.addEventListener("input", (e) => {
  const target = e.target as HTMLInputElement;
  pointerSize = Number(target.value);
  drawPointer(pointerSize);
  const sizeText = document.getElementById("sizeText") as HTMLLabelElement;
  sizeText.textContent = target.value;
});

document.getElementById("dl")?.addEventListener("click", () => {
  let result = prompt("画像を保存します。\nファイル名を入力してください。\n空白の場合は YYYY-MM-DD_HH-MM で保存されます。");
  if (result == null) return;

  const link = document.createElement("a");
  link.href = canvasPaint.toDataURL("image/png");
  link.download = result.trim() ? result.trim() : makeFileName();
  link.click();
});

function makeFileName(): string {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;
}

document.getElementById("colorPalette")?.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  color = target.value;
  drawPointer(pointerSize);
});
