import Draw from "../draw";

import limitFn, { limit } from "./limit";

import { Center } from "../communication/commu";
import { renderWord } from "./renderWord";
import { load, injectionImg2Store } from "../img/imgStore";

type Pos = [number, number];

//   *       *       *
// *   *  *     *  *   *
//   *       *       *
export class LoadingPage extends Draw {
	static create(
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	) {
		return new LoadingPage(context, width, height);
	}

	// 开始下一个状态
	private readyToRender: boolean = false;

	private polygenPoint: Pos[] = [];
	private realPolygenPoint: Pos[] = [];

	private midPos: Pos = [0, 0];

	private timeId: NodeJS.Timer | number = setTimeout(void 0, 0);

	private cb: () => void = () => {};

	// 限制函数
	private topLimit: limit | null = null;
	private rightLimit: limit | null = null;
	private bottomLimit: limit | null = null;
	private leftLimit: limit | null = null;

	private rotateRange: number = 0;

	public range: number = 15;
	public speed: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = 5;
	public rotateSpeed: number = 0.01;

	public context: CanvasRenderingContext2D;

	public size: number = 40;
	public width: number;
	public height: number;

	public isImgReady: boolean = false;

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

	init(): LoadingPage {
		this.midPos = [this.width / 2 - 2 * 100, this.height / 2];
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

		// left 根据x值进行计算
		this.leftLimit = limitFn(
			[
				this.polygenPoint[3][0] - this.range,
				this.polygenPoint[3][0] + this.range
			],
			this.speed / 10,
			true
		);

		this.timeId = setInterval(this.tick, 1000 / 60);

		// 开始初始化字体
		setTimeout(() => {
			this.renderWord = () =>
				renderWord(
					this.context,
					this.midPos[0] + this.size * 2,
					this.midPos[0] + this.size * 2 + 30 * 8.2,
					this.midPos[1] + 10
				);
		}, 500);

		Center.setNewRegister("sliceWord", this.sliceWord);

		Center.setNewRegister("imgOnload", this.end);

		load();

		return this;
	}

	update() {
		this.clear();
		this.renderWord();
		this.stretch();
		this.rotate();
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

	sliceWord = () => {
		let dest1 = 0;
		let dest2 = 0;

		const dest1Limit: limit = limitFn([-70, 0], 0.5, false, 2, () => {
			this.next();
		});
		const dest2limit: limit = limitFn([0, 70], 0.5, true, 2, () => {
			this.next();
		});

		const startX = this.midPos[0] + this.size * 2;
		const startY = this.midPos[1] + 10;

		const dest2Top = -36;
		const dest2Bottom = 8;

		const width = 49 * 8.2;

		const newRenderWord = () => {
			dest1 = dest1Limit(dest1);
			dest2 = dest2limit(dest2);
			this.context.save();
			this.context.beginPath();
			this.context.moveTo(startX, startY + dest1 + dest2Top);
			this.context.lineTo(startX + width, startY + dest1 + dest2Top);
			this.context.lineTo(startX + width, startY + dest1 + dest2Bottom);
			this.context.closePath();
			this.context.clip();
			renderWord(this.context, startX, startX + width, startY + dest1);
			this.context.restore();
			this.context.save();
			this.context.beginPath();
			this.context.moveTo(startX, startY + dest2 + dest2Top);
			this.context.lineTo(startX, startY + dest2 + dest2Bottom);
			this.context.lineTo(startX + width, startY + dest2 + dest2Bottom);
			this.context.closePath();
			this.context.clip();
			renderWord(this.context, startX, startX + width, startY + dest2);
			this.context.restore();
		};

		setTimeout(() => {
			this.renderWord = newRenderWord;
		}, 800);
	};

	renderWord() {}

	destory() {
		clearInterval(this.timeId as number);
	}

	end = (imgMap: { [propname: string]: HTMLImageElement }) => {
		console.info("图片加载完成了");
		this.isImgReady = true;
		// 注入imgMap
		injectionImg2Store(imgMap);
	};

	next() {
		if (this.isImgReady && !this.readyToRender) {
			this.readyToRender = true;
			console.info("进入图形切割面板");
			setTimeout(() => {
				this.destory();
				this.cb();
			}, 1000);
		}
	}
	callback(fn: () => void) {
		this.cb = fn;
	}
}
