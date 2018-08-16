import { GetPos } from "./praph";

export const Echelon: GetPos = (
	x: number,
	y: number,
	typecode: number,
	width: number,
	height: number
) => {
	switch (typecode) {
		// 等腰梯形
		case 1: {
			return [
				[x + width / 4, y],
				[x + (width * 3) / 4, y],
				[x + width, y + (height * 2) / 3],
				[x, y + (height * 2) / 3]
			];
		}
		// 普通梯形
		case 2: {
			return [
				[x + width / 4, y],
				[x + (width * 3) / 4, y],
				[x + width, y + (height * 2) / 3],
				[x + width / 7, y + (height * 2) / 3]
			];
		}
		// 直角梯形
		case 3: {
			return [
				[x + width / 4, y],
				[x + width, y],
				[x + width, y + (height * 2) / 3],
				[x, y + (height * 2) / 3]
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
