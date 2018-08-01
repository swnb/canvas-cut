import { ControObj } from "./controller";

type Pos = [number, number];

interface ObjType {
    type: string;
    typecode: number;
}

export class Circle extends ControObj {
    public objType: ObjType = {
        type: "Ellipse",
        typecode: 1
    };

    public selected: boolean = false;

    // 点阵信息
    public polygonPoints: [Pos, Pos] = [[0, 0], [0, 0]];

    public middlePoint: [number, number] = [0, 0];
    public r: number = 0;

    constructor(
        context: CanvasRenderingContext2D,
        startPos: Pos,
        width: number,
        height: number,
        r: number,
        objType: ObjType
    ) {
        super(context, startPos, width, height);

        this.objType = objType;
        this.r = r;
    }

    init() {
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
        ) as [Pos, Pos];

        return this;
    }

    draw() {
        // 画出图标,圆形还是不画了吧，没啥用吧
        // this.drawIcon();

        switch (this.objType.typecode) {
            case 1:
                {
                    this.circle(
                        this.middlePoint[0],
                        this.middlePoint[1],
                        this.r
                    );
                }
                break;
            case 2:
                {
                    this.oval(
                        this.middlePoint[0],
                        this.middlePoint[1],
                        this.width - 80,
                        this.height - 250
                    );
                }
                break;
            default:
                {
                    this.circle(
                        this.middlePoint[0],
                        this.middlePoint[1],
                        this.r
                    );
                }
                break;
        }
        return this;
    }
}
