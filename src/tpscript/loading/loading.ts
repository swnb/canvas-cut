import util from "../util/util";

import Draw from "../draw";

import limitFn, { limit } from "./limit";

type Pos = [number, number];

//   *       *       *
// *   *  *     *  *   *
//   *       *       *
export class LoadingPage extends Draw {
	private polygenPoint: Pos[] = [];

	private startPos: Pos = [0, 0];
	private midPos: Pos = [0, 0];
	private movePos: Pos = [0, 0];

	private timeId: NodeJS.Timer | number = setTimeout(void 0, 0);

	// 限制函数
	private topLimit: limit | null = null;
	private rightLimit: limit | null = null;
	private bottomLimit: limit | null = null;
	private leftLimit: limit | null = null;

	private range: number = 30;
	private speed: 1 | 2 | 3 | 4 | 5 = 1;

	public context: CanvasRenderingContext2D;

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
		// this.rotate();
		this.stretch();
		this.draw();
	};

	init() {
		// 点阵
		this.polygenPoint = [
			[this.width / 2, this.height / 4],
			[(this.width * 3) / 4, this.height / 2],
			[this.width / 2, (this.height * 3) / 4],
			[this.width / 4, this.height / 2]
		];

		this.startPos = [this.width / 2, this.height / 2 - 10]; // 起点
		this.midPos = [this.width / 2, this.height / 2]; // 圆心点
		this.movePos = [this.width / 2, this.height / 2 - 10]; // 移动点

		// top 根据y值来计算
		this.topLimit = limitFn(
			[this.height / 4 - this.range, this.height / 4 + this.range],
			this.speed / 10,
			true
		);

		// right 根据x值来计算
		this.rightLimit = limitFn(
			[(this.width * 3) / 4 - this.range, (this.width * 3) / 4 + this.range],
			this.speed / 10,
			false
		);

		// bottom 根据y值进行计算
		this.bottomLimit = limitFn(
			[(this.height * 3) / 4 - this.range, (this.height * 3) / 4 + this.range],
			this.speed / 10,
			false
		);

		// left根据x值进行计算
		this.leftLimit = limitFn(
			[this.width / 4 - this.range, this.width / 4 + this.range],
			this.speed / 10,
			true
		);

		this.timeId = setInterval(this.tick, 1000 / 60);
	}

	update() {
		// stretch
		this.stretch();
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

	draw() {
		this.clear();
		this.polygonFill(this.polygenPoint);
	}

	destory() {
		clearInterval(this.timeId as number);
		this.clear();
	}
}
