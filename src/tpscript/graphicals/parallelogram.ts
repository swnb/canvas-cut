import { GetPos } from "./praph";

export const Parallelogram: GetPos = (
	x: number,
	y: number,
	typecode: number,
	width: number,
	height: number
) => {
	switch (typecode) {
		// 平行四边形
		case 1: {
			return [
				[x + width / 3, y],
				[x + (4 * width) / 3, y],
				[x + width, y + height],
				[x, y + height]
			];
		}
		// 反平行四边形
		case 2: {
			return [
				[x, y],
				[x + width, y],
				[x + (4 * width) / 3, y + height],
				[x + width / 3, y + height]
			];
		}
		// 窄一点的平行四边形
		case 3: {
			return [
				[x + width / 4, y],
				[x + (width * 3) / 4, y],
				[x + width / 4, y + height],
				[x - width / 4, y + height]
			];
		}
		// 长方形
		case 4: {
			return [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
		}
		// 正方形
		case 5: {
			return [[x, y], [x + width, y], [x + width, y + width], [x, y + width]];
		}

		default:
			return [
				[x + width / 3, y],
				[x + (4 * width) / 3, y],
				[x + width, y + height],
				[x, y + height]
			];
	}
};
