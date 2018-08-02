import { Circle } from "./circle";

type Pos = [number, number];

export class Sector extends Circle {
    // 两个交点，这连个交点和圆心组成了这个半圆形状
    private firstInsertPoint: Pos;
    private secondInsertPoint: Pos;

    constructor(
        context: CanvasRenderingContext2D,
        startPos: Pos,
        middlePoint: Pos,
        firstInsertPoint: Pos,
        secodInsertPoint: Pos,
        width: number,
        height: number,
        r: number,
        objType: {
            type: string;
            typecode: number;
        }
    ) {
        super(context, startPos, width, height, r, objType);

        // 新生成的中央的点阵
        this.middlePoint = middlePoint;

        // 第一个交点和第二个交点
        this.firstInsertPoint = firstInsertPoint;
        this.secondInsertPoint = secodInsertPoint;
    }

    // 重写之前的代码

    init() {
        this.x -= 50;
        this.y -= 50;

        this.polygonPoints = [
            [this.x, this.y],
            this.middlePoint,
            this.firstInsertPoint,
            this.secondInsertPoint
        ];

        return this;
    }
}
