import { GetPos } from "./praph";

export const Irregular: GetPos = (
    x: number,
    y: number,
    typecode: number,
    width: number,
    height: number
) => {
    switch (typecode) {
        // 不规则图形1
        case 1: {
            return [
                [x + width / 2, y],
                [x + width, y + width / 2],
                [x + width, y + height],
                [x, y + height],
                [x, y + width / 2]
            ]
        }
        // 不规则图形2
        case 2: {
            return [
                [x, y],
                [x + width / 2, y + width / 2],
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