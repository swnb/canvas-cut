import { GetPos } from "./praph";

export const Echelon: GetPos = (
    x: number,
    y: number,
    typecode: number,
    width: number,
    height: number
) => {
    switch (typecode) {
        case 1: {
            return [
                [x + width/4, y],
                [x + width*3/4,y],
                [x + width,y + height],
                [x,y + height]
                
            ];
        }
        case 2: {
            return [
                [x + width/4, y],
                [x + width,y],
                [x + width,y + height],
                [x,y + height]
            ];
        }
        case 3: {
            return [
                [x + width/4, y],
                [x + width*3/4,y],
                [x+width,y + height],
                [x + width/7,y + height]
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