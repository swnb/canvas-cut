import { GetPos } from "./praph";

export const Triangle: GetPos = (
    x: number,
    y: number,
    typecode: number,
    width: number,
    height: number
) => {
    switch (typecode) {
        case 1: {
            return [
                [x + width / 2, y],
                [x + width,y + height],
                [x,y + height]
                
            ];
        }
        case 2: {
            return [
                [x + width, y],
                [x + width,y + height],
                [x,y + height]
            ];
        }
        case 3: {
            return [
                [x + width / 2, y],
                [x + width/3,y + height],
                [x,y + height]
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
