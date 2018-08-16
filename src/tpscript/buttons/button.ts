import { getImg } from "../img/imgStore";

// 高级操作，清空所有的元素，切记谨慎的使用
const rmEvething = (context: CanvasRenderingContext2D, rm: () => boolean) => {
	rm();
};
type Area = [number, number, number, number];

// 可能的状态
type Mode = "clear" | "next" | "before" | "others";

interface Button {
	name: Mode;
	area: Area;
}

interface Hook {
	rmEverything: () => boolean;
}

export class Buttons {
	private context: CanvasRenderingContext2D;

	private buttons: Button[] = [];

	private rmEverything: () => boolean;

	constructor(context: CanvasRenderingContext2D, hook: Hook) {
		this.context = context;

		this.rmEverything = hook.rmEverything;
	}

	draw(): Buttons {
		const img = getImg("buttonClear");
		this.context.drawImage(img, 500, 700, img.width, img.height);
		this.buttons.push({
			name: "clear",
			area: [500, 700, img.width, img.height]
		});
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
			case "clear": {
				this.rmEverything();
				break;
			}
		}
		return true;
	}
}
