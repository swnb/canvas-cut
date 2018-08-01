import { Obj, ObjType } from "./obj";
export { Obj, ObjType } from "./obj";

import { SelfCreateObj } from "./selfcreate";
import { Circle } from "./circle";
export { SelfCreateObj } from "./selfcreate";

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
