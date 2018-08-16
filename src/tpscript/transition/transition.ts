import Draw from "../draw";

export class Transition extends Draw {
	private mode: "transition" | "drawline" = "transition";

	static create(
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	) {
		return new Transition(context, width, height);
	}

	private count: number = 0;

	private timeId: number | NodeJS.Timer = setTimeout(() => {}, 0);

	private cb: () => void = () => {};

	constructor(
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	) {
		super(context);
		this.width = width;
		this.height = height;
	}

	init() {
		this.timeId = setInterval(this.tick, 1000 / 60);
		return this;
	}

	tick = () => {
		this.count += 1;
		this.update();
		switch (this.mode) {
			case "transition": {
				this.render();
				break;
			}
			case "drawline": {
				this.drawLine(this.count);
				break;
			}
		}
	};

	blurry() {
		const preFillStyle = this.context.fillStyle;
		this.context.rect(0, 0, this.width, this.height);
		this.context.fillStyle = "rgba(0,0,0,0.01)";
		this.context.fill();
		this.context.fillStyle = preFillStyle;
	}

	showBg(blur: number) {
		const preFillStyle = this.context.fillStyle;
		this.context.rect(0, 0, this.width, this.height);
		this.context.fillStyle = `rgba(132,204,201,${blur})`;
		this.context.fill();
		this.context.fillStyle = preFillStyle;
	}

	update() {}

	render() {
		if (this.count < 100) {
			this.blurry();
		} else if (this.count >= 100 && this.count < 200) {
			this.showBg(0.01);
		} else if (this.count >= 200 && this.count < 320) {
			this.showBg(this.count * 0.0001);
		} else {
			this.count = 0;
			this.mode = "drawline";
		}
	}

	drawLine(range: number) {
		if (range > 200) {
			this.destory();
		}
		// 相对最大值的比例值
		const proportion = range / 200;

		// 保留先前的状态
		const [preFillStyle, preStrokeStyle, preLineWidth] = [
			this.context.fillStyle,
			this.context.strokeStyle,
			this.context.lineWidth
		];
		// 更换先前的样式
		this.context.fillStyle = "rgba(132,204,201)";
		this.context.strokeStyle = "rgba(48, 46, 46,0.2)";
		this.context.lineWidth = 2;
		this.context.beginPath();
		this.context.fillRect(0, 0, 1280, 800);

		//画行
		Array(1280 / 10)
			.fill(null)
			.forEach((_, index: number) => {
				this.context.beginPath();
				this.context.moveTo(30 * index, 0);
				this.context.lineTo(30 * index, 800 * proportion);
				// 声称线条
				this.context.stroke();
				this.context.closePath();
			});
		// 画竖线
		Array(800 / 10)
			.fill(null)
			.forEach((_, index: number) => {
				this.context.beginPath();
				this.context.moveTo(0, 30 * index);
				this.context.lineTo(1280 * proportion, 30 * index);
				// 声称线条
				this.context.stroke();
				this.context.closePath();
			});
		this.context.closePath();
		// 还原先前的状态
		[
			this.context.fillStyle,
			this.context.strokeStyle,
			this.context.lineWidth
		] = [preFillStyle, preStrokeStyle, preLineWidth];
	}

	callback(fn: () => void) {
		this.cb = fn;
	}

	destory() {
		clearInterval(this.timeId as number);
		this.cb();
	}
}
