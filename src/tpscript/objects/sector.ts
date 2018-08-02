import Draw from "../draw";

import { ObjType } from "./createobj";

type Pos = [number, number];

export class Sector extends Draw {
    // 物体的类型状态标识
    public objType: ObjType = {
        type: "Sector",
        typecode: 1
    };

    // 选中的状态
    public selected: boolean = false;

    // 圆心，核心的数据
    private middlePoint: Pos;
    // 两个交点，这连个交点和圆心组成了这个半圆形状
    private firstInsertPoint: Pos;
    private secondInsertPoint: Pos;

    public r: number = 0;

    // 点阵的信息
    public polygonPoints: [Pos, Pos, Pos] = [
        this.middlePoint,
        this.firstInsertPoint,
        this.secondInsertPoint
    ];

    constructor(
        context: CanvasRenderingContext2D,
        startPos: Pos,
        middlePoint: Pos,
        firstInsertPoint: Pos,
        secodInsertPoint: Pos,
        width: number,
        height: number,
        r: number,
        objType: ObjType
    ) {
        super(context);

        this.objType = objType;

        // 初始化信息
        [this.x, this.y] = startPos;
        [this.width, this.height] = [width, height];
        this.r = r;

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

        return this;
    }

    draw() {
        setTimeout(() => {
            this.drawTest();
        }, 100);
    }
    drawTest() {
        // 不画控制图标

        const preFillStyle = this.context.fillStyle;

        this.context.fillStyle = "whitesmoke";

        console.log("start to draw");
        console.log(
            this.firstInsertPoint[0],
            this.firstInsertPoint[1],
            this.secondInsertPoint[0],
            this.secondInsertPoint[1],
            this.r
        );

        this.context.beginPath();

        this.context.moveTo(this.middlePoint[0], this.middlePoint[1]);
        this.context.lineTo(this.firstInsertPoint[0], this.firstInsertPoint[1]);
        // 画出图像

        this.context.arcTo(
            this.firstInsertPoint[0] + 100,
            this.firstInsertPoint[1] + 100,
            this.secondInsertPoint[0],
            this.secondInsertPoint[1],
            this.r
        );
        this.context.lineTo(
            this.secondInsertPoint[0],
            this.secondInsertPoint[1]
        );
        this.context.closePath();
        this.context.stroke();
        this.context.fill();

        this.context.fillStyle = preFillStyle;
        return this;
    }
}
