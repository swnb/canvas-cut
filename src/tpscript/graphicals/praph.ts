type Pos = [number, number];

// 平行四边形，三角形，梯形
import { Parallelogram } from "./parallelogram";
import { Triangle } from "./triangle";
import { Echelon } from "./echelon";
import { Irregular } from "./irregular";

// 一些类型

export type GetPos = (
	x: number,
	y: number,
	typecode: number,
	width: number,
	height: number
) => Array<Pos>;

interface Objects {
	Parallelogram: GetPos;
	Triangle: GetPos;
	Echelon: GetPos;
	Irregular: GetPos;
}

export const Objs: Objects = {
	Parallelogram,
	Triangle,
	Echelon,
	Irregular
};
