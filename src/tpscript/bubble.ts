import Draw from "./draw";

const getRandom = (small: number, large: number) => {
	return Math.random() * (large - small) + small;
};

const colorList1 = [
	"rgba(255,0,0,0.1)",
	"rgba(0,255,0,0.1)",
	"rgba(0,0,255,0.1)"
];
const colorList2 = [
	"rgba(255,255,0,0.5)",
	"rgba(0,255,255,0.5)",
	"rgba(255,0,255,0.5)"
];
const colorList3 = ["rgba(0,0,255,1)", "rgba(255,0,0,1)", "rgba(0,255,0,1)"];

const randomValueFromList = (list: any[]) => {
	const length = list.length;
	return list[Math.round(getRandom(0, length - 1))];
};

class Bubble extends Draw {
	static create(context: CanvasRenderingContext2D, x: number, y: number) {
		return new Bubble(context, x, y);
	}

	private size = getRandom(10, 15);

	private colorList: string[];

	public speed: number = 0.12;

	public toLarge: boolean = false;

	public x: number;
	public y: number;

	constructor(context: CanvasRenderingContext2D, x: number, y: number) {
		super(context);
		this.x = x + getRandom(-100, 100);
		this.y = y + getRandom(-50, 50);
		this.colorList = [
			randomValueFromList(colorList1),
			randomValueFromList(colorList2),
			randomValueFromList(colorList3)
		];
	}

	update() {
		if (this.size > 20) {
			this.speed = this.speed * 1.2;
		}
		if (this.size >= 30) {
			this.toLarge = true;
		}
		this.size += this.speed;
		this.x += this.speed + getRandom(-1, 1);
		this.y += this.speed + getRandom(-0.4, 0.4);
	}

	createStyle() {
		const grd = this.context.createRadialGradient(
			this.x,
			this.y,
			0,
			this.x,
			this.y,
			this.size * 2
		);
		grd.addColorStop(0.1, this.colorList[0]);
		grd.addColorStop(0.7, this.colorList[1]);
		grd.addColorStop(1, this.colorList[2]);
		return grd;
	}
	draw() {
		this.context.beginPath();
		this.context.fillStyle = this.createStyle();
		this.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		this.context.fill();
		this.context.closePath();
	}
}

export class CreateBubble extends Draw {
	static create(
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	) {
		return new CreateBubble(context, width, height);
	}

	private updateLastTime: number = Date.now();

	private timeID: number | NodeJS.Timer = setTimeout(void 0, 0);

	public width: number;

	public height: number;

	public preFillStyle: string | CanvasGradient | CanvasPattern = "";

	public clearRange: number = 0;

	public bubbleList: Bubble[] = [];

	public cb: () => void = () => {};

	constructor(
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	) {
		super(context);
		this.width = width;
		this.height = height;
	}

	tick() {
		this.timeID = setInterval(() => {
			this.update();
			this.draw();
		}, 2000 / 60);
	}

	init(): CreateBubble {
		this.preFillStyle = this.context.fillStyle;
		this.bubbleList.push(Bubble.create(this.context, 0, 0));
		this.tick();
		return this;
	}

	update = () => {
		this.clearRange += 0.005;
		if (Date.now() - this.updateLastTime < 200) {
			return;
		} else {
			this.updateLastTime = Date.now();
		}
		// 到了底部就不再添加
		if (this.clearRange >= 1) return;
		for (let x = 100; x <= this.width - 100; x += 100) {
			this.bubbleList.push(
				Bubble.create(this.context, x, this.height * this.clearRange)
			);
		}
	};

	draw() {
		this.context.beginPath();
		this.context.fillStyle = "whitesmoke";
		this.rect(0, 0, this.width, this.height * this.clearRange);
		this.context.closePath();
		this.context.fill();
		this.bubbleList.forEach(bubble => {
			bubble.update();
			bubble.draw();
		});
		this.clearBubble();
	}

	clearBubble() {
		this.bubbleList = this.bubbleList.filter(bubble => !bubble.toLarge);
		if (this.bubbleList.length === 0) {
			this.destory();
			console.log("this is end");
		}
	}

	destory() {
		clearInterval(this.timeID as number);
		this.context.fillStyle = this.preFillStyle;
		this.cb();
	}
	callback(fn: () => void) {
		this.cb = fn;
	}
}
