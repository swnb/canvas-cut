import { ControObj } from "./controller";

import { Objs } from "../graphicals/praph";

type Pos = [number, number];

export interface ObjType {
    type: string;
    typecode: number;
}

// 这里的代码要改写，最好使用函数来代替，声称你需要的代码，这样对于代码是很好的
export class Obj extends ControObj {
    public objType: ObjType;

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

    init() {
        //初始化所有的数据解构
        switch (this.objType.type) {
            case "Parallelogram": {
                // this.context.fillStyle = "white";
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
                // this.context.fillStyle = "blue";
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
                // this.context.fillStyle = "yellow";
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
            case "Irregular": {
                // this.context.fillStyle = "green";
                this.polygonPoints = Objs.Irregular(
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
        return this;
    }

    update(xdivi: number, ydivi: number) {
        this.polygonPoints = this.polygonPoints.map(
            (point: Pos): Pos => [point[0] + xdivi, point[1] + ydivi]
        );
        return this;
    }

    draw() {
        // 生成icon
        this.drawIcon();

        // 画多边形
        this.polygonFill(this.polygonPoints);
        this.context.closePath();
        this.context.stroke();
        return this;
    }
}
