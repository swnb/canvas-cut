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

export const deepcoyeArray = (array: any[]): any[] =>
	array.every(ele => !Array.isArray(ele))
		? [...array]
		: array.map((ele: any) => (Array.isArray(ele) ? deepcoyeArray(ele) : ele));

export const deepcopyLines = (lines: Lines) =>
	lines.map(line => {
		switch (line.type) {
			case "curve": {
				const newLine: Curve = {
					type: "curve",
					r: line.r,
					points: deepcoyeArray(line.points) as [Pos, Pos, Pos, Pos]
				};
				return newLine;
			}
			case "line": {
				const newLine: Straight = {
					type: "line",
					points: deepcoyeArray(line.points) as [Pos, Pos]
				};
				return newLine;
			}
		}
	});
