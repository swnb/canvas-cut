import { ControObj } from "./controller";
import { ObjType } from "./obj";

import util from "../util/util";

// 点阵
type Pos = [number, number];

export class Neo extends ControObj {
    // 物体的类型状态标识
    public objType: ObjType = {
        type: "Hybrid",
        typecode: 0
    };

    // 选中的状态
    public selected: boolean = false;

    // 圆心，核心的数据和两个交点，这连个交点和圆心组成了这个半圆形状
    private sector: {
        circlePoint: Pos;
        r: number;
        firstPoint: Pos;
        secondPoint: Pos;
        // 核心，杯赛尔曲线的交点，如何求出交点的值，这个是个核心，也是这个代码的灵魂所在
        bezier: Pos;
    };

    // 点阵的信息
    public polygonPoints: [Pos, Pos, Pos, Pos] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];

    constructor(
        context: CanvasRenderingContext2D,
        startP: Pos,
        width: number,
        height: number,
        circlePoint: Pos,
        r: number,
        firstPoint: Pos,
        secondPoint: Pos
    ) {
        super(context, startP, width, height);

        this.sector = {
            circlePoint,
            r,
            firstPoint,
            secondPoint,
            bezier: [0, 0]
        };
    }

    init() {
        // 获取bezier曲线的交点
        const beziers = util.getBezierPoint(
            this.sector.circlePoint,
            this.sector.firstPoint,
            this.sector.secondPoint
        );
        // 处理besier曲线
        return this;
    }

    getLinPoint() {}
}
