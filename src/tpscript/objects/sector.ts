import Draw from "../draw";

import { ObjType } from "./createobj";
import util from "../util/util";

type Pos = [number, number];

const sortLeftRight = (poses: [Pos, Pos], reference: Pos): [Pos, Pos] => {
    const [one, two] = poses;
    const oner =
        Math.pow(one[0] - reference[0], 2) + Math.pow(one[1] - reference[1], 2);

    const twor =
        Math.pow(two[0] - reference[0], 2) + Math.pow(two[1] - reference[1], 2);

    if (oner > twor) {
        return poses;
    } else {
        // 反方向操作
        return poses.reverse() as [Pos, Pos];
    }
};

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

        this.context.beginPath();

        // this.context.moveTo(this.middlePoint[0], this.middlePoint[1]);
        this.context.moveTo(this.firstInsertPoint[0], this.firstInsertPoint[1]);

        // 画出图像
        const res = util.getBezierPoint(
            this.middlePoint,
            this.firstInsertPoint,
            this.secondInsertPoint
        );

        if (!res.res) {
            return console.log(
                "some wrong is happend,and you should have a look at what is happening"
            );
        }

        const [left, right]: [Pos, Pos] = sortLeftRight(
            res.point,
            this.firstInsertPoint
        );
        setTimeout(() => {
            this.circle(left[0], left[1], 10);
            setTimeout(() => {
                this.circle(right[0], right[1], 10);
            }, 1000);
        }, 100);

        // 这里面最大的争议就是杯赛尔曲线的曲折点，这里我给一个公式 c = (r^2 -a^2+b^2)/(2r-2b) a+b =r  => r^2/a-r

        this.context.arcTo(
            right[0],
            right[1],
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
