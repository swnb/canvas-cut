import { ControObj } from "../object";

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
        return this;
    }

    draw() {
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
