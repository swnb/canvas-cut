import { getImg } from "../img/imgStore";
import { Center } from "../communication/commu";

type Area = [number, number, number, number];

// 可能的状态
type Mode = "clearAllObj" | "clearObj" | "next" | "before" | "others";

interface Button {
	name: Mode;
	area: Area;
}
export class Buttons {
	static create(context: CanvasRenderingContext2D) {
		return new Buttons(context);
	}

	private clearAllObj = Center.setNewEvent("clearAllObj");

	private clearObj = Center.setNewEvent("clearObj");

	private context: CanvasRenderingContext2D;

	private buttons: Button[] = [];

	clearImg: HTMLImageElement = new Image();
	clearOneImg: HTMLImageElement = new Image();

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
	}

	init(): Buttons {
		const clearImg = getImg("clear");
		this.clearImg = clearImg;
		this.context.drawImage(clearImg, 500, 700, clearImg.width, clearImg.height);
		this.buttons.push({
			name: "clearAllObj",
			area: [500, 700, clearImg.width, clearImg.height]
		});

		const clearOneImg = getImg("delete");
		this.clearOneImg = clearOneImg;
		this.context.drawImage(
			clearOneImg,
			600,
			700,
			clearOneImg.width,
			clearOneImg.height
		);
		this.buttons.push({
			name: "clearObj",
			area: [600, 700, clearOneImg.width, clearOneImg.height]
		});

		return this;
	}

	draw(): Buttons {
		this.context.drawImage(
			this.clearImg,
			500,
			700,
			this.clearImg.width,
			this.clearImg.height
		);
		this.context.drawImage(
			this.clearOneImg,
			600,
			700,
			this.clearOneImg.width,
			this.clearOneImg.height
		);
		return this;
	}

	ifClick(x: number, y: number) {
		const button = this.buttons.find((button: Button) => {
			const [ax, ay, awidth, aheight] = button.area;
			return ax < x && x < ax + awidth && ay < y && y < ay + aheight
				? true
				: false;
		});
		// 发布这个事件
		return button ? this.dispatch(button.name) : void 0;
	}

	private dispatch(mode: Mode): boolean {
		switch (mode) {
			case "clearAllObj": {
				this.clearAllObj(null);
				break;
			}
			case "clearObj": {
				this.clearObj(null);
				break;
			}
		}
		return true;
	}
}
