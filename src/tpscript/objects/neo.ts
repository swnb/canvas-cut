import { ControObj } from "./controller";
import { ObjType } from "./obj";

import util from "../util/util";

// 点阵
type Pos = [number, number];

// 直线
interface Straight {
	type: "line";
	points: [Pos, Pos];
}

// 曲线
interface Curve {
	type: "curve";
	r: number;
	points: [Pos, Pos, Pos, Pos]; // 第3个是bezier曲线  第四个是圆心的点
}

// 线的类型
type Lines = (Straight | Curve)[];

// Neo 最强的王者
export class Neo extends ControObj {
	// 物体的类型状态标识
	public objType: ObjType = {
		type: "Hybrid",
		typecode: 0
	};

	public polygonPoints = [];

	// 选中的状态
	public selected: boolean = false;

	// 一般性质的描述
	public r: number;
	// 圆形的中心
	public circlePoint: Pos;

	// 对于neo来说，只有线的概念，没有点的概念
	public lines: Lines = [];

	public direct: Pos;

	constructor(
		context: CanvasRenderingContext2D,
		startP: Pos,
		width: number,
		height: number,
		r: number,
		circlePoint: Pos,
		lines: Lines
	) {
		super(context, startP, width, height);

		this.r = r;

		this.circlePoint = circlePoint;

		this.lines = util.deepcopyLines(lines);

		// 拿到方向
		this.direct = this.getDirect();

		this.sortLine();

		// 得到位置点阵的信息,更新物体
		[this.width, this.height, this.x, this.y] = this.getWidthHeight();
	}

	getDirect(): Pos {
		const closeLine = this.lines[this.lines.length - 1];
		return util.getDirection(
			[...closeLine.points[0]] as [number, number],
			[...closeLine.points[1]] as [number, number],
			[[...this.lines[0].points[1]] as [number, number]]
		);
	}

	getWidthHeight(): [number, number, number, number] {
		// 分析点阵数据得到实际的最大值和最小值

		const firstPoint = this.lines[0].points;

		let [minX, maxX, minY, maxY] = [
			firstPoint[0][0],
			firstPoint[0][0],
			firstPoint[0][1],
			firstPoint[0][1]
		];

		this.lines.forEach((line: Straight | Curve) => {
			const point = line.points[0];
			if (minX > point[0]) {
				minX = point[0];
			}
			if (maxX < point[0]) {
				maxX = point[0];
			}
			if (minY > point[1]) {
				minY = point[1];
			}
			if (maxY < point[1]) {
				maxY = point[1];
			}
		});

		const width = maxX - minX;

		const height = maxY - minY;

		return [width, height, minX, minY];
	}

	init() {
		return this;
	}

	update(xdivi: number, ydivi: number) {
		this.lines = this.lines.map(
			(line: Straight | Curve): Straight | Curve => {
				line.points = line.points.map(
					(p): [number, number] => [p[0] + xdivi, p[1] + ydivi]
				) as [Pos, Pos, Pos, Pos] | [Pos, Pos];
				return line;
			}
		);

		return this;
	}

	// 考虑对线段做序列化
	sortLine() {
		this.lines = this.lines.map((line, index: number, array) => {
			// 这里是尾部
			if (index === array.length - 1) {
				return line;
			}

			const next = array[index + 1];
			if (
				Math.abs(line.points[1][0] - next.points[0][0]) > 3 ||
				Math.abs(line.points[1][1] - next.points[0][1]) > 3
			) {
				[next.points[0], next.points[1]] = [next.points[1], next.points[0]];
			}
			// 交换首尾
			return line;
		});
	}

	draw() {
		// 画图标
		this.drawIcon();

		this.context.beginPath();

		const preStrokeStyle = this.context.strokeStyle;
		this.context.strokeStyle = "#05a9c6";

		// 浅拷贝数组，不改变原本的属性值
		const lines = [...this.lines];

		const head = lines.shift() as Curve | Straight;

		if (head.type === "line") {
			// 这是一条线段线段
			this.context.moveTo(head.points[0][0], head.points[0][1]);
			this.context.lineTo(head.points[1][0], head.points[1][1]);
		} else if (head.type === "curve") {
			// 这是一条曲线线段
			this.context.moveTo(head.points[0][0], head.points[0][1]);
			// bezier曲线
			this.context.arcTo(
				head.points[2][0],
				head.points[2][1],
				head.points[1][0],
				head.points[1][1],
				this.r
			);
			this.context.lineTo(head.points[1][0], head.points[1][1]);
		}

		// 遍历剩下的数组，找到可以生成的点阵信息
		lines.forEach((line: Curve | Straight) => {
			//连接到后面一个节点
			switch (line.type) {
				case "line": {
					this.context.lineTo(line.points[1][0], line.points[1][1]);
					break;
				}
				case "curve": {
					this.context.arcTo(
						line.points[2][0],
						line.points[2][1],
						line.points[1][0],
						line.points[1][1],
						this.r
					);
					this.context.lineTo(line.points[1][0], line.points[1][1]);
					break;
				}
			}
		});

		// 填充颜色
		this.context.closePath();
		this.context.fill();
		this.context.stroke();

		// 生成的原本属性
		this.context.strokeStyle = preStrokeStyle;
		return this;
	}

	updateRotate(startPoint: Pos, midPoint: Pos, movePoint: Pos, lines: Lines) {
		// 完全的更新点阵的信息
		this.lines = lines.map(
			(line: Curve | Straight): Straight | Curve => {
				const newPoints = util.affineTransform(
					startPoint,
					midPoint,
					movePoint,
					line.points
				) as [Pos, Pos] | [Pos, Pos, Pos, Pos];
				switch (line.type) {
					case "curve":
						return {
							type: "curve",
							r: line.r,
							points: newPoints as [Pos, Pos, Pos, Pos]
						};
					case "line": {
						return {
							type: "line",
							points: newPoints as [Pos, Pos]
						};
					}
				}
			}
		);
	}
}
