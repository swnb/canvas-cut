import { getAbsAB } from "./helper";

type Pos = [number, number];

// 仿射变换,利用矩阵的形式将图形进行变换，生成偏移后的图形
export const affineTransform = (
	startPoint: Pos,
	midPoint: Pos,
	movePoint: Pos,
	poses: Array<Pos>
) => {
	// 初始的向量
	const startLine: Pos = [
		startPoint[0] - midPoint[0],
		startPoint[1] - midPoint[1]
	];

	// 偏移的向量,注意这里的y是反方向
	const moveLine: Pos = [
		movePoint[0] - midPoint[0],
		movePoint[1] - midPoint[1]
	];

	// 点乘
	const ab = startLine[0] * moveLine[0] + startLine[1] * moveLine[1];

	// 叉乘
	const aXb = startLine[0] * moveLine[1] - startLine[1] * moveLine[0];

	// 向量的模
	const abs = getAbsAB(startLine, moveLine, false);

	// 实际生成的cos
	const cosDeg = ab / abs;
	// 生成的sin
	const sinDeg = aXb / abs;

	return poses.map(
		(pos: Pos): Pos => {
			const line = [pos[0] - midPoint[0], pos[1] - midPoint[1]];
			const x = cosDeg * line[0] - sinDeg * line[1];
			const y = sinDeg * line[0] + cosDeg * line[1];
			return [-x + midPoint[0], -y + midPoint[1]];
		}
	);
};
