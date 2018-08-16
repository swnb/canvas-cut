import { ControObj } from "./controller";

type Pos = [number, number];

export class SelfCreateObj extends ControObj {
	public objType = {
		type: "selfCreateObj",
		typecode: 1
	};

	public polygonPoints: Pos[] = [];

	constructor(
		context: CanvasRenderingContext2D,
		startP: Pos,
		width: number,
		height: number,
		polygonPoints: Pos[]
	) {
		super(context, startP, width, height);
		this.polygonPoints = polygonPoints;
	}
	update(xdivi: number, ydivi: number) {
		this.polygonPoints = this.polygonPoints.map(
			(point: Pos): Pos => [point[0] + xdivi, point[1] + ydivi]
		);
		return this;
	}
	draw() {
		// 生成icon
		this.drawIcon();

		// 开始根据情况进行绘画
		this.polygonFill(this.polygonPoints);
		return this;
	}
}
