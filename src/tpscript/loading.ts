import util from "./util/util";
import Draw from "./draw";

type Pos = [number, number];

//   *       *       *
// *   *  *     *  *   *
//   *       *       *
export class LoadingPage extends Draw {
	private top: Pos = [this.width / 2, this.height / 4];
	private right: Pos = [(this.width * 3) / 4, this.height / 2];
	private bottom: Pos = [this.width / 2, (this.height * 3) / 4];
	private left: Pos = [this.width / 4, this.height / 2];
	private polygenPoint: Pos[] = [];

	private startPos: Pos = [this.width / 2, this.height / 2 - 10]; // 起点
	private midPos: Pos = [this.width / 2, this.height / 2]; // 圆心点
	private movePos: Pos = [this.width / 2, this.height / 2 - 10];

	private timeId: NodeJS.Timer | number = setTimeout(void 0, 0);

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
		this.timeId = setInterval(this.tick, 1000 / 60);
	}

	update() {
		// update moving pos,移动的指针
	}

	rotate() {
		// util.affineTransform(this.startPos, this.midPos);
		this.polygenPoint = this.polygenPoint.map(
			(pos: Pos): Pos => {
				return [0, 0];
			}
		);
	}

	stretch() {}

	draw() {
		this.polygonFill([this.top, this.right, this.bottom, this.left]);
	}
}
