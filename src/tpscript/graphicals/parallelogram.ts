import { GetPos } from "./praph";

export const Parallelogram: GetPos = (
    x: number,
    y: number,
    typecode: number,
    width: number,
    height: number
) => {
    switch (typecode) {
        case 1: {
            return [
                [x + width / 3, y],
                [x + (4 * width) / 3, y],
                [x + width, y + height],
                [x, y + height]
            ];
        }
        case 2: {
            return [
                [x, y],
                [x + width, y],
                [x + (4 * width) / 3, y + height],
                [x + width / 3, y + height]
            ];
        }
        case 3: {
            return [
                [x, y],
                [x + width, y],
                [x + width, y + height],
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
