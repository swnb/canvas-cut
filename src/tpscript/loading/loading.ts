import Draw from "../draw";

import limitFn, { limit } from "./limit";

import { word } from "./word";

type Pos = [number, number];

//   *       *       *
// *   *  *     *  *   *
//   *       *       *
export class LoadingPage extends Draw {
	private polygenPoint: Pos[] = [];
	private realPolygenPoint: Pos[] = [];

	private midPos: Pos = [0, 0];

	private timeId: NodeJS.Timer | number = setTimeout(void 0, 0);

	// 限制函数
	private topLimit: limit | null = null;
	private rightLimit: limit | null = null;
	private bottomLimit: limit | null = null;
	private leftLimit: limit | null = null;

	private rotateRange: number = 0;

	public range: number = 25;
	public speed: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = 2;
	public rotateSpeed: number = 0.01;

	public context: CanvasRenderingContext2D;

	public size: number = 40;
	public width: number;
	public height: number;

	constructor(
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	) {
		super(context);
		this.context = context;
		this.width = width;
		this.height = height;
	}

	// tick tick and run
	tick = () => {
		this.update();
	};

	init() {
		this.midPos = [this.width / 2 - 100, this.height / 2];
		// 点阵
		this.polygenPoint = [
			[this.midPos[0], this.midPos[1] - this.size],
			[this.midPos[0] + this.size, this.midPos[1]],
			[this.midPos[0], this.midPos[1] + this.size],
			[this.midPos[0] - this.size, this.midPos[1]]
		];

		// top 根据y值来计算
		this.topLimit = limitFn(
			[
				this.polygenPoint[0][1] - this.range,
				this.polygenPoint[0][1] + this.range
			],
			this.speed / 10,
			false
		);

		// right 根据x值来计算
		this.rightLimit = limitFn(
			[
				this.polygenPoint[1][0] - this.range,
				this.polygenPoint[1][0] + this.range
			],
			this.speed / 10,
			false
		);

		// bottom 根据y值进行计算
		this.bottomLimit = limitFn(
			[
				this.polygenPoint[2][1] - this.range,
				this.polygenPoint[2][1] + this.range
			],
			this.speed / 10,
			true
		);

		// left根据x值进行计算
		this.leftLimit = limitFn(
			[
				this.polygenPoint[3][0] - this.range,
				this.polygenPoint[3][0] + this.range
			],
			this.speed / 10,
			true
		);

		this.timeId = setInterval(this.tick, 1000 / 60);
	}

	update() {
		// stretch
		this.stretch();
		this.rotate();
		this.clear();
		this.draw();
	}

	rotate() {
		this.rotateRange += this.rotateSpeed;
		const deg = 2 * Math.PI + this.rotateRange;
		this.realPolygenPoint = this.polygenPoint.map(
			(pos: Pos): Pos => {
				const line = [pos[0] - this.midPos[0], pos[1] - this.midPos[1]];
				const x = Math.cos(deg) * line[0] - Math.sin(deg) * line[1];
				const y = Math.sin(deg) * line[0] + Math.cos(deg) * line[1];
				return [-x + this.midPos[0], -y + this.midPos[1]];
			}
		);
	}

	stretch() {
		this.polygenPoint = this.polygenPoint.map(
			(pos: Pos, index: number): Pos => {
				switch (index) {
					case 0: {
						// top,y
						pos[1] = (<limit>this.topLimit)(pos[1]);
						return pos;
					}
					case 1: {
						// right,x
						pos[0] = (<limit>this.rightLimit)(pos[0]);
						return pos;
					}
					case 2: {
						// bottom,y
						pos[1] = (<limit>this.bottomLimit)(pos[1]);
						return pos;
					}
					case 3: {
						// left,x
						pos[0] = (<limit>this.leftLimit)(pos[0]);
						return pos;
					}
					default: {
						console.error(
							"这是不可能出现的状况,请向开发人员详细描述使用情景以便维护"
						);
						this.destory();
						return [0, 0];
					}
				}
			}
		);
	}

	clear() {
		this.context.fillStyle = "whitesmoke";
		this.context.rect(0, 0, this.width, this.height);
		this.context.fill();
	}

	draw() {
		// 文字
		this.context.font = "lighter 30px Verdana";
		const gradient = this.context.createLinearGradient(
			this.midPos[0] + this.size * 2,
			0,
			this.width,
			0
		);
		gradient.addColorStop(0, "#aa4b6b");
		gradient.addColorStop(0.5, "#6b6b83");
		gradient.addColorStop(1, "#3b8d99");
		this.context.fillStyle = gradient;
		this.context.fillText(
			word.word,
			this.midPos[0] + this.size * 2,
			this.midPos[1]
		);

		const preStrokeStyle = this.context.strokeStyle;
		this.context.beginPath();
		this.context.lineWidth = 5;
		this.context.lineCap = "round";
		this.context.strokeStyle = "grey";
		this.realPolygenPoint.forEach((pos: Pos, index: number, poses: Pos[]) => {
			this.context.moveTo(pos[0], pos[1]);
			if (index === poses.length - 1) {
				this.context.lineTo(poses[0][0], poses[0][1]);
			} else {
				this.context.lineTo(poses[index + 1][0], poses[index + 1][1]);
			}
			this.context.stroke();
		});
		this.context.closePath();
		this.context.strokeStyle = preStrokeStyle;
	}

	destory() {
		clearInterval(this.timeId as number);
		this.clear();
	}
}
