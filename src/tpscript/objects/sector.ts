import Draw from "../draw";

import { ObjType } from "./createobj";
import util from "../util/util";
import { ControObj } from "./controller";

type Pos = [number, number];

export class Sector extends ControObj {
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

    // 核心，杯赛尔曲线的交点，如何求出交点的值，这个是个核心，也是这个代码的灵魂所在
    private bezier: Pos;

    public r: number = 0;

    // 点阵的信息
    public polygonPoints: [Pos, Pos, Pos, Pos] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];

    // 方向信息
    public sectionDirect: Pos = [10, 10];

    constructor(
        context: CanvasRenderingContext2D,
        startPos: Pos,
        middlePoint: Pos,
        firstInsertPoint: Pos,
        secondInsertPoint: Pos,
        bezier: Pos,
        width: number,
        height: number,
        r: number,
        objType: ObjType
    ) {
        super(context, startPos, width, height);

        this.objType = objType;

        // 初始化信息
        this.r = r;

        // 新生成的中央的点阵
        this.middlePoint = middlePoint;
        // 第一个交点和第二个交点
        this.firstInsertPoint = firstInsertPoint;
        this.secondInsertPoint = secondInsertPoint;

        // 核心贝塞尔曲线,获取曲线的交点
        this.bezier = bezier;

        this.polygonPoints = [
            this.middlePoint,
            this.firstInsertPoint,
            this.secondInsertPoint,
            this.bezier
        ];
    }

    // 重写之前的代码

    init() {
        this.x -= 50;
        this.y -= 50;

        this.sectionDirect = util.getDirection(
            this.firstInsertPoint,
            this.secondInsertPoint,
            [this.bezier]
        );

        return this;
    }

    update(x: number, y: number) {
        console.log("updated at this time");
        const [xdivi, ydivi] = [x - this.x, y - this.y];
        this.polygonPoints = this.polygonPoints.map(
            (point: Pos): Pos => [point[0] + xdivi, point[1] + ydivi]
        ) as [Pos, Pos, Pos, Pos];

        return this;
    }

    updatePoints() {
        [
            this.middlePoint,
            this.firstInsertPoint,
            this.secondInsertPoint,
            this.bezier
        ] = this.polygonPoints;
    }

    draw() {
        // 更新点阵的信息
        this.updatePoints();

        // 画图标志
        this.drawIcon();

        // 画这些对象
        switch (this.objType.typecode) {
            case 1: {
                this.drawSector();
                break;
            }
            case 2: {
                this.drawLargeSector();
                break;
            }
            default: {
                this.drawSector();
                break;
            }
        }
        return this;
    }

    drawSector() {
        // 不画控制图标

        // 保存之前的数据
        const [preStrokeStyle, preLineWidth] = [
            this.context.strokeStyle,
            this.context.lineWidth
        ];
        this.context.strokeStyle = "#05a9c6";
        this.context.lineWidth = 6;

        this.context.beginPath();

        this.context.moveTo(this.firstInsertPoint[0], this.firstInsertPoint[1]);

        // 这里面最大的争议就是杯赛尔曲线的曲折点，这里我给一个公式 c = (r^2 -a^2+b^2)/(2r-2b) a+b =r  => r^2/a-r
        this.context.arcTo(
            this.bezier[0],
            this.bezier[1],
            this.secondInsertPoint[0],
            this.secondInsertPoint[1],
            this.r
        );

        this.context.lineTo(this.firstInsertPoint[0], this.firstInsertPoint[1]);

        this.context.closePath();
        this.context.stroke();
        this.context.fill();

        // 还原数据
        [this.context.strokeStyle, this.context.lineWidth] = [
            preStrokeStyle,
            preLineWidth
        ];

        return this;
    }

    drawLargeSector() {
        // 生成icon
        // this.drawIcon();

        // 保存之前的数据
        const [preStrokeStyle, preLineWidth] = [
            this.context.strokeStyle,
            this.context.lineWidth
        ];
        this.context.strokeStyle = "#05a9c6";
        this.context.lineWidth = 6;

        this.context.beginPath();

        this.context.moveTo(this.firstInsertPoint[0], this.firstInsertPoint[1]);

        // 这里的bezier点不是一般的bezier点，它本身不做处理，由它得到两个新的bezier曲线的曲折点

        const outsideInsertPoint = util.getBezierPoint(
            this.middlePoint,
            this.firstInsertPoint,
            this.bezier
        ).point[1];

        this.context.arcTo(
            outsideInsertPoint[0][0],
            outsideInsertPoint[0][1],
            this.bezier[0],
            this.bezier[1],
            this.r
        );

        // 求下一个bezier曲线的折线的交点
        const outsideInsertPoint1 = util.getBezierPoint(
            this.middlePoint,
            this.bezier,
            this.secondInsertPoint
        ).point[1];

        // 这里面最大的争议就是杯赛尔曲线的曲折点，这里我给一个公式 c = (r^2 -a^2+b^2)/(2r-2b) a+b =r  => （r^2/a）-r
        this.context.arcTo(
            outsideInsertPoint1[0][0],
            outsideInsertPoint1[0][1],
            this.secondInsertPoint[0],
            this.secondInsertPoint[1],
            this.r
        );

        this.context.lineTo(this.firstInsertPoint[0], this.firstInsertPoint[1]);

        this.context.closePath();
        this.context.stroke();
        this.context.fill();

        // 还原数据
        [this.context.strokeStyle, this.context.lineWidth] = [
            preStrokeStyle,
            preLineWidth
        ];

        return this;
    }
}

// 创造两个不同的扇形，根据方向不同，来做不同的分析
export const createDiviSector = (
    context: CanvasRenderingContext2D,
    startPoint: Pos,
    middlePoint: Pos,
    firstInsertPoint: Pos,
    secondInsertPoint: Pos,
    width: number,
    height: number,
    r: number,
    objType: ObjType
): [Sector, Sector] => {
    // 拿到被贝塞尔曲线转折点
    const res = util.getBezierPoint(
        middlePoint,
        firstInsertPoint,
        secondInsertPoint
    );

    if (!res.res) {
        console.log(
            "some wrong is happend,and you should have a look at what is happening"
        );
    }

    // 杯赛尔曲线的内部圆形的交点就是这个第一个点，这个点从进的到远的
    const insideInsertPoint = res.point[0];
    // 第二个是半径大一点的点的点阵信息，也是同样从远处到进一点的地方
    const outsideInsertPoint = res.point[1];

    // 创建一个扇形
    const sectorSmall = new Sector(
        context,
        startPoint,
        middlePoint,
        firstInsertPoint,
        secondInsertPoint,
        outsideInsertPoint[0],
        width,
        height,
        r,
        objType
    ).init();

    // 另外一个大的扇形
    const sectorLarge = new Sector(
        context,
        startPoint,
        middlePoint,
        firstInsertPoint,
        secondInsertPoint,
        insideInsertPoint[1],
        width,
        height,
        r,
        {
            type: "Sector",
            typecode: 2
        }
    ).init();

    return [sectorSmall, sectorLarge];
};
