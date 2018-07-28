import { Obj, ObjType } from "./obj";
export { Obj, ObjType } from "./obj";

import { SelfCreateObj } from "./selfcreate";
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
    return new Obj(context, objType, startP, width, height);
}
