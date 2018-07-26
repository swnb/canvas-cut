type Pos = [number, number];

// 平行四边形
import { Parallelogram } from "./parallelogram";
import{Triangle} from "./triangle"
import{Echelon} from "./echelon"

// 一些类型

export type GetPos = (
    x: number,
    y: number,
    typecode: number,
    width: number,
    height: number
) => Array<Pos>;

interface Objects {
    Parallelogram: GetPos
    Triangle:GetPos
    Echelon:GetPos
}

export const Objs: Objects = {
    Parallelogram,
    Triangle,
    Echelon
};
