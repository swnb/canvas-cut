import { ControObj } from "./controller";

type Pos = [number, number];

interface ObjType {
    type: string;
    typecode: number;
}

export class Circle extends ControObj {
    public objType: ObjType = {
        type: "cirle",
        typecode: 1
    };

    // 点阵信息
    public polygonPoints: Array<Pos> = [];

    public middlePoint: [number, number] = [0, 0];
    public r: number = 0;

    constructor(
        context: CanvasRenderingContext2D,
        startPos: Pos,
        width: number,
        height: number,
        r: number
    ) {
        super(context, startPos, width, height);

        this.r = r;
    }

    init(objType: ObjType) {
        this.objType = objType;
        this.middlePoint = [this.x + this.width / 2, this.y + this.height / 2];
        this.x -= 50;
        this.y -= 50;

        this.polygonPoints = [[this.x, this.y], this.middlePoint];
        return this;
    }

    update(x: number, y: number) {
        const [xdivi, ydivi] = [x - this.x, y - this.y];

        // 更新中心点
        this.middlePoint = [
            this.middlePoint[0] + xdivi,
            this.middlePoint[1] + ydivi
        ];

        // 更新数据点阵的信息
        this.polygonPoints = this.polygonPoints.map(
            (point: Pos): Pos => {
                return [point[0] + xdivi, point[1] + ydivi];
            }
        );

        return this;
    }

    draw() {
        // 画出图标
        this.drawIcon();

        switch (this.objType.typecode) {
            case 1: {
                this.circle(this.middlePoint[0], this.middlePoint[1], this.r);
                break;
            }
            case 2: {
                this.oval(
                    this.middlePoint[0],
                    this.middlePoint[1],
                    this.width,
                    this.height
                );
                break;
            }
            default: {
                this.circle(this.middlePoint[0], this.middlePoint[1], this.r);
            }
        }
        return this;
    }
}
