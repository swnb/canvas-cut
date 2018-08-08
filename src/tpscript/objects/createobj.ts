import { Obj, ObjType } from "./obj";
import { SelfCreateObj } from "./selfcreate";
import { Circle } from "./circle";
import { Sector, createDiviSector } from "./sector";

import { Neo } from "./neo";

// 直线
interface Straight {
    type: "line";
    points: [Pos, Pos];
}

// 曲线
interface Curve {
    type: "curve";
    r: number;
    points: [Pos, Pos, Pos, Pos]; // 第3个是bezier曲线  第四个是圆心的点
}

// 线的类型
type Lines = (Straight | Curve)[];

type Pos = [number, number];

export function createObjBySelf(
    context: CanvasRenderingContext2D,
    startP: Pos,
    width: number,
    height: number,
    polygonPoints: Pos[]
) {
    return new SelfCreateObj(context, startP, width, height, polygonPoints);
}

export function createObj(
    context: CanvasRenderingContext2D,
    objType: ObjType,
    startP: Pos,
    width: number,
    height: number
) {
    // 如果是圆形的话，截获它
    if (objType.type === "Ellipse") {
        return new Circle(context, startP, width, height, 100, objType).init();
    }

    return new Obj(context, objType, startP, width, height).init();
}

export const createNeo = (
    context: CanvasRenderingContext2D,
    startP: Pos,
    width: number,
    height: number,
    r?: number,
    circlePoint?: Pos,
    lines?: Lines
) => {

    r ? void 0 : (r = 100);

    if (!lines) {
        lines = [
            {
                type: "curve",
                r: r,
                points: [
                    [250, 250],
                    [250 + 140, 250],
                    [250 + 70, 250 - 70],
                    [250 + 70, 250 + 70]
                ] as [Pos, Pos, Pos, Pos]
            },
            {
                type: "line",
                points: [[250 + 140, 250], [250 + 140, 250 + 100]] as [Pos, Pos]
            },
            {
                type: "curve",
                r: r,
                points: [
                    [250 + 140, 250 + 100],
                    [250, 250 + 100],
                    [250 + 70, 250 + 100 + 70],
                    [250 + 70, 250 + 100 - 70]
                ] as [Pos, Pos, Pos, Pos]
            },
            {
                type: "line",
                points: [[250, 250 + 100], [250, 250]]
            }
        ];
    }
    circlePoint ? void 0 : (circlePoint = [250 + 70, 250 + 70]);

    return new Neo(context, startP, width, height, r, circlePoint, lines);
};

// 导出所有的引入
export { SelfCreateObj, Circle, Sector, Neo, createDiviSector, Obj, ObjType };
