import Draw from "../draw";

import { getImg } from "../img/imgStore";

type Pos = [number, number];

export abstract class ControObj extends Draw {
	public x: number;
	public y: number;

	public width: number;
	public height: number;

	public mode: "rotate" | "move" | "clip" | "static" = "static";

	public directPos: [number, number, number] = [0, 0, 0];
	public rotatePos: [number, number, number] = [0, 0, 0];

	public selected: boolean = false;

	// 修正参数
	private prefix = 50;
	private iconWidth = 50;

	constructor(
		context: CanvasRenderingContext2D,
		startP: Pos,
		width: number,
		height: number = width
	) {
		super(context);
		this.x = startP[0];
		this.y = startP[1];
		this.width = width;
		this.height = height;
	}
	// 移动的标签
	drawMoveObj(): [number, number, number] {
		const x = this.x - this.prefix;
		const y = this.y - this.prefix;
		const directImg = getImg("direct");
		this.drawImg(
			directImg,
			x + this.iconWidth / 2,
			y - this.iconWidth / 2,
			this.iconWidth
		);
		return [x + this.iconWidth, y, this.iconWidth / 2];
	}
	// 旋转的标签
	drawRotateObj(): [number, number, number] {
		const rotateImg = getImg("rotate");

		const x = this.x + this.width / 2;
		const y = this.y - this.prefix;
		this.drawImg(
			rotateImg,
			x - this.iconWidth / 2,
			y - this.iconWidth / 2,
			this.iconWidth
		);
		return [x, y, this.iconWidth / 2];
	}
	// 生成，并且返回点阵的信息
	drawIcon() {
		if (this.selected) {
			this.rotatePos = this.drawRotateObj();
			this.directPos = this.drawMoveObj();
		}
	}
}
