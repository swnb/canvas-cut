import { word } from "./word";

export const renderWord = (
	context: CanvasRenderingContext2D,
	startX: number,
	endX: number,
	startY: number
) => {
	context.font = "45px Verdana";
	const gradient = context.createLinearGradient(startX, 0, endX, 0);
	gradient.addColorStop(0, "#aa4b6b");
	gradient.addColorStop(0.5, "#6b6b83");
	gradient.addColorStop(1, "#3b8d99");
	context.fillStyle = gradient;
	context.fillText(word.word, startX, startY);
};
