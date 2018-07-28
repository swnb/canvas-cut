import Draw from "./draw";

import { getImg } from "./imgbase64";
import { Initbg } from './initbg';
import { DrawObjbg } from "./drawobjbg";

type Pos = [number, number];

export class Menu extends Draw {
    public r: number = 0;

    private ListOfObjs: string[] = [
        "parallelogram",
        "triangle",
        "echelon",
        "irregular",
        "ellipse"
    ];

    constructor(context: CanvasRenderingContext2D, x: number, y: number) {

        super(context);
        [this.x, this.y] = [x, y];
    }

    drawImgById() {
        const divi = 120;

        this.ListOfObjs.forEach((objType: string, index: number) => {
            const ImgElement = getImg(objType);
            this.drawImg(
                ImgElement,
                this.x - ImgElement.width / 2,
                this.y + index * divi,
                ImgElement.width,
                ImgElement.height
            );
        });
    }
    init() {
        const x = this.x;
        const y = this.y;
        const Bg = new Initbg(this.context, x - 75, y - 25, 130, 725, 12);
        Bg.initbg([100, 200]);
        this.drawImgById();

    }
    drawEchelonObj(): [number, number, number] {
        const len = 250;
        const x = this.x;
        const y = this.y;
        const Bg = new DrawObjbg(this.context, x - 275, y - 25, 130, 300, 12, 240);
        Bg.drawobjbg([100, 200]);
        const e1 = getImg("e1");
        this.drawImg(e1, this.x - len, this.y, e1.width, e1.height);
        const e2 = getImg("e2");
        this.drawImg(e2, this.x - len, this.y * 3, e2.width, e2.height);
        const e3 = getImg("e3");
        this.drawImg(e3, this.x - len, this.y * 5, e3.width, e3.height);
        return [this.x, this.y, this.r];
    }
    drawTriangleObj(): [number, number, number] {
        const len = 250;
        const x = this.x;
        const y = this.y;
        const Bg = new DrawObjbg(this.context, x - 275, y - 25, 130, 600, 12, 180);
        Bg.drawobjbg([100, 200]);
        const t1 = getImg("t1");
        this.drawImg(t1, this.x - len, this.y, t1.width, t1.height);
        const t2 = getImg("t2");
        this.drawImg(t2, this.x - len, this.y * 3, t2.width, t2.height);
        const t3 = getImg("t3");
        this.drawImg(t3, this.x - len, this.y * 5, t3.width, t3.height);
        const t4 = getImg("t4");
        this.drawImg(t4, this.x - len, this.y * 7, t4.width, t4.height);
        const t5 = getImg("t5");
        this.drawImg(t5, this.x - len, this.y * 9, t5.width, t5.height);
        const t6 = getImg("t6");
        this.drawImg(t6, this.x - len, this.y * 11, t6.width, t6.height);
        return [this.x, this.y, this.r];
    }
    drawParallelogramObj(): [number, number, number] {
        const len = 250;
        const x = this.x;
        const y = this.y;
        const Bg = new DrawObjbg(this.context, x - 275, y - 25, 130, 550, 12, 50);
        Bg.drawobjbg([100, 200]);
        const p1 = getImg("p1");
        this.drawImg(p1, this.x - len, this.y, p1.width, p1.height);
        const p2 = getImg("p2");
        this.drawImg(p2, this.x - len, this.y * 3, p2.width, p2.height);
        const p3 = getImg("p3");
        this.drawImg(p3, this.x - len, this.y * 5, p3.width, p3.height);
        const p4 = getImg("p4");
        this.drawImg(p4, this.x - len, this.y * 7, p4.width, p4.height);
        const p5 = getImg("p5");
        this.drawImg(p5, this.x - len, this.y * 9, p5.width, p5.height);
        return [this.x, this.y, this.r];
    }
    drawIrregularObj(): [number, number, number] {
        const len = 250;
        const x = this.x;
        const y = this.y;
        const Bg = new DrawObjbg(this.context, x - 275, y + 300, 130, 200, 12, 50);
        Bg.drawobjbg([100, 200]);
        const I1 = getImg("I1");
        this.drawImg(I1, this.x - len, this.y + 325, I1.width, I1.height);
        const I2 = getImg("I2");
        this.drawImg(I2, this.x - len, this.y + 425, I2.width, I2.height);
        return [this.x, this.y, this.r];
    }
}
