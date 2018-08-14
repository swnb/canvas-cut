import util from "./util/util";

type Pos = [number, number];

export class LoadingPage {
	private context: CanvasRenderingContext2D;

	private width: number;
	private height: number;

	private top: Pos = [this.width / 2, this.height / 4];
	private right: Pos = [(this.width * 3) / 4, this.height / 2];
	private bottom: Pos = [this.width / 2, (this.height * 3) / 4];
	private left: Pos = [this.width / 4, this.height / 2];
	private polygenPoint: Pos[] = [];

	private startPos: Pos = [this.width / 2, this.height / 2 - 10]; // 起点
	private midPos: Pos = [this.width / 2, this.height / 2]; // 圆心点
	private movePos: Pos = [this.width / 2, this.height / 2 - 10];

	constructor(
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	) {
		this.context = context;
		this.width = width;
		this.height = height;
	}

	tick() {}

	init() {
		//  *
		// * *
		//  *

		// this.startPos = [];

		this.draw();
	}

	rotate() {
		// util.affineTransform(this.startPos, this.midPos);
		this.polygenPoint = this.polygenPoint.map(
			(pos: Pos): Pos => {
				return [0, 0];
			}
		);
	}

	stretch() {
		this.polygenPoint.map(
			(pos: Pos): Pos => {
				return [0, 0];
			}
		);
	}

	update() {}
	draw() {
		const [preFillStyle, preStrokeStyle] = [
			this.context.fillStyle,
			this.context.strokeStyle
		];
		this.context.beginPath();
		this.context.moveTo(this.top[0], this.top[1]);
		this.context.lineTo(this.right[0], this.right[1]);
		this.context.lineTo(this.bottom[0], this.bottom[1]);
		this.context.lineTo(this.left[0], this.left[1]);
		this.context.fill();
		this.context.stroke();
		this.context.closePath();
		this.context.fillStyle = preFillStyle;
		this.context.strokeStyle = preStrokeStyle;
	}
}
