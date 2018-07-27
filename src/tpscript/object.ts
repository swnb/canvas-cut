import Draw from "./draw";

import { getImg } from "./imgbase64";

import { Objs } from "./graphicals/praph";

type Pos = [number, number];

class ControObj extends Draw {
    public x: number;
    public y: number;

    public width: number;
    public height: number;

    public mode: "rotate" | "move" | "clip" | "static" = "static";

    public directPos: [number, number, number] = [0, 0, 0];
    public rotatePos: [number, number, number] = [0, 0, 0];

    // 修正参数
    private prefix = 30;
    private iconWidth = 50;

    constructor(
        context: CanvasRenderingContext2D,
        startP: Pos,
        width: number,
        height: number = width
    ) {
        super(context);
        this.x = startP[0];
        this.y = startP[1];
        this.width = width;
        this.height = height;
    }
    // 移动的标签
    drawMoveObj(): [number, number, number] {
        const x = this.x - this.prefix;
        const y = this.y - this.prefix;
        const directImg = getImg("direct");
        this.drawImg(
            directImg,
            x + this.iconWidth / 2,
            y - this.iconWidth / 2,
            this.iconWidth
        );
        return [x + this.iconWidth, y, this.iconWidth / 2];
    }
    // 旋转的标签
    drawRotateObj(): [number, number, number] {
        const rotateImg = getImg("rotate");
        // const x = this.x + this.width + this.prefix;
        const x = this.x + this.width / 2;
        const y = this.y - this.prefix;
        this.drawImg(
            rotateImg,
            x - this.iconWidth / 2,
            y - this.iconWidth / 2,
            this.iconWidth
        );
        return [x, y, this.iconWidth / 2];
    }
    // 生成，并且返回点阵的信息
    drawIcon() {
        this.rotatePos = this.drawRotateObj();
        this.directPos = this.drawMoveObj();
    }
}

interface ObjType {
    type: string;
    typecode: number;
}

// 这里的代码要改写，最好使用函数来代替，声称你需要的代码，这样对于代码是很好的
export class Obj extends ControObj {
    private objType: ObjType;

    // 点阵的信息，用于对于，只能生成一次
    public polygonPoints: Array<Pos> = [];

    constructor(
        context: CanvasRenderingContext2D,
        objType: ObjType,
        startP: Pos,
        width: number,
        height: number
    ) {
        super(context, startP, width, height);
        this.objType = objType;
    }
    update(xdivi: number, ydivi: number) {}
    draw() {
        // 生成icon
        this.drawIcon();

        //画图形
        switch (this.objType.type) {
            case "Parallelogram": {
                this.context.fillStyle = "white";
                this.polygonPoints = Objs.Parallelogram(
                    this.x,
                    this.y,
                    this.objType.typecode,
                    this.width,
                    this.height
                );
                this.polygonFill(this.polygonPoints);
                break;
            }
            case "Triangle": {
                this.context.fillStyle = "blue";
                this.polygonPoints = Objs.Triangle(
                    this.x,
                    this.y,
                    this.objType.typecode,
                    this.width,
                    this.height
                );
                this.polygonFill(this.polygonPoints);
                break;
            }
            case "Echelon": {
                this.context.fillStyle = "yellow";
                this.polygonPoints = Objs.Echelon(
                    this.x,
                    this.y,
                    this.objType.typecode,
                    this.width,
                    this.height
                );
                this.polygonFill(this.polygonPoints);
                break;
            }
        }

        // 画出中心的一个矩形，待删除
        this.context.closePath();
        this.context.stroke();
        return this;
    }
}

export class SelfCreateObj extends ControObj {
    public polygonPoints: Pos[] = [];
    constructor(
        context: CanvasRenderingContext2D,
        startP: Pos,
        width: number,
        height: number,
        polygonPoints: Pos[]
    ) {
        super(context, startP, width, height);
        this.polygonPoints = polygonPoints;
    }
    update(x: number, y: number) {
        const [xdivi, ydivi] = [x - this.x, y - this.y];
        this.polygonPoints = this.polygonPoints.map(
            (point: Pos): Pos => [point[0] + xdivi, point[1] + ydivi]
        );
        return this;
    }
    draw() {
        // 生成icon
        this.drawIcon();

        // 开始根据情况进行绘画
        this.polygonFill(this.polygonPoints);
        return this;
    }
}

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
