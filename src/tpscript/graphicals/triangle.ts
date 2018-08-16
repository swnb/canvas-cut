import { GetPos } from "./praph";

export const Triangle: GetPos = (
	x: number,
	y: number,
	typecode: number,
	width: number,
	height: number
) => {
	switch (typecode) {
		// 等腰直角三角形
		case 1: {
			return [
				[x + width / 2, y],
				[x + width, y + width / 2],
				[x, y + width / 2]
			];
		}
		// 等腰三角形
		case 2: {
			return [[x + width / 2, y], [x + width, y + height], [x, y + height]];
		}
		// 等边三角形
		case 3: {
			return [
				[x + width / 2, y],
				[x + width, y + (Math.sqrt(3) * width) / 2],
				[x, y + (Math.sqrt(3) * width) / 2]
			];
		}
		// 钝角三角形
		case 4: {
			return [[x + width, y], [x + width / 2, y + height], [x, y + height]];
		}
		// 直角三角形
		case 5: {
			return [[x + width, y], [x + width, y + height], [x, y + height]];
		}
		// 锐角三角形
		case 6: {
			return [
				[x + width / 2, y],
				[x + (width * 3) / 4, y + height],
				[x, y + height]
			];
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
