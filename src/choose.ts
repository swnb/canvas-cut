import Draw from "@/tpscript/draw";

export class Choose extends Draw {
	static create(
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	) {
		return new Choose(context, width, height);
	}

	public width: number;
	public height: number;

	constructor(
		context: CanvasRenderingContext2D,
		width: number,
		height: number
	) {
		super(context);
		this.width = width;
		this.height = height;
	}

	init(): Choose {
		return this;
	}
}
