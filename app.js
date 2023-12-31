const canvas=document.querySelector("canvas");
const context=canvas.getContext("2d");

const colorOptions=Array.from(document.getElementsByClassName("color-option"));
const color=document.getElementById("color");


const lineWidth=document.getElementById("line-width");
const modeBtn=document.getElementById("mode-btn");
const destroyBtn=document.getElementById("destroy-btn");
const eraserBtn=document.getElementById("erasor-btn");
const saveBtn=document.getElementById("save");
const textInput=document.getElementById("text");
const fileInput=document.getElementById("file");

canvas.width=800;
canvas.height=800;
context.lineWidth=lineWidth.value;
context.lineCap="round";
let isPainting=false;
let isFilling=false;

function onMove(event) {
	if (isPainting && !isFilling) {
		context.lineTo(event.offsetX, event.offsetY);
		context.stroke();
		return;
	}
	context.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
	isPainting=true;
}
function cancelPainting() {
	isPainting=false;
	context.beginPath();
}
function onLineWidthChange(event) {
	console.log("line width changed to "+event.target.value);
	context.lineWidth=event.target.value;
}

function onColorChange(event) {
	console.log("color changed to "+event.target.value);
	changeColor(event.target.value);
}

function onColorClick(event) {
	const colorValue=event.target.dataset.color;
	console.log("color "+colorValue+" clicked");
	changeColor(colorValue);
	color.value=colorValue;
}

function changeColor(colorInput) {
	context.strokeStyle=colorInput;
	context.fillStyle=colorInput;
}

function onModeClick() {
	if (isFilling) {
		isFilling=false;
		modeBtn.innerText="Fill";
	}
	else {
		isFilling=true;
		modeBtn.innerText="Draw";
	}
}

function onCanvasClick() {
	if (isFilling) {
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
}

function onDestroyClick() {
	let temp=context.fillStyle;
	context.fillStyle="white";
	context.fillRect(0, 0, canvas.width, canvas.height);
	color.value=temp;
	changeColor(color.value);
}

function onErasorClick() {
	context.strokeStyle="white";
	isFilling=false;
	modeBtn.innerText="Fill";
}

function onFileChange(event) {
	const file=event.target.files[0];
	const url=URL.createObjectURL(file);
	console.log("file input occurred " + url);
	const image=new Image();
	image.src=url;
	image.onload=function() {
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		fileInput.value=null;
	}
}

function onDoubleClick(event) {
	const text=textInput.value;
	if (text==="") return;
	context.save();
	context.lineWidth=1;
	context.font="48px consolas";
	console.log("DoubleClick occured at " + event.offsetX +" "+ event.offsetY);
	context.fillText(text, event.offsetX, event.offsetY);
	context.restore();
}

function onSaveClick() {
	const url=canvas.toDataURL();
	const a=document.createElement("a");
	a.href=url;
	a.download="myDrawing.png";
	a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onErasorClick);

fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);