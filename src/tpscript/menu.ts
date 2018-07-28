import Draw from "./draw";

import { getImg } from "./imgbase64";

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
        // this.context.fillStyle = "white";
        // this.context.fillRect(this.x - 10, this.y, 120, 700);

        this.drawImgById();

        //可以选择的物体菜单
        // const parallelogram = getImg("parallelogram");
        // this.drawImg(
        //     parallelogram,
        //     this.x,
        //     this.y,
        //     parallelogram.width,
        //     parallelogram.height
        // );
        // const triangle = getImg("triangle");
        // this.drawImg(
        //     triangle,
        //     this.x,
        //     this.y * 4,
        //     triangle.width,
        //     triangle.height
        // );
        // const echelon = getImg("echelon");
        // this.drawImg(
        //     echelon,
        //     this.x,
        //     this.y * 7,
        //     echelon.width,
        //     echelon.height
        // );
        // const irregular = getImg("irregular");
        // this.drawImg(
        //     irregular,
        //     this.x,
        //     this.y * 10,
        //     irregular.width,
        //     irregular.height
        // );
        // const ellipse = getImg("ellipse");
        // this.drawImg(
        //     ellipse,
        //     this.x,
        //     this.y * 13,
        //     ellipse.width,
        //     ellipse.height
        // );
    }
    drawEchelonObj(): [number, number, number] {
        const e1 = getImg("e1");
        this.drawImg(e1, this.x - 100, this.y, e1.width, e1.height);
        const e2 = getImg("e2");
        this.drawImg(e2, this.x - 100, this.y * 3, e2.width, e2.height);
        const e3 = getImg("e3");
        this.drawImg(e3, this.x - 100, this.y * 5, e3.width, e3.height);
        return [this.x, this.y, this.r];
    }
    drawTriangleObj(): [number, number, number] {
        const t1 = getImg("t1");
        this.drawImg(t1, this.x - 100, this.y, this.r);
        const t2 = getImg("t2");
        this.drawImg(t2, this.x - 100, this.y * 3, this.r);
        const t3 = getImg("t3");
        this.drawImg(t3, this.x - 100, this.y * 5, this.r);
        const t4 = getImg("t4");
        this.drawImg(t4, this.x - 100, this.y * 7, this.r);
        const t5 = getImg("t5");
        this.drawImg(t5, this.x - 100, this.y * 9, this.r);
        const t6 = getImg("t6");
        this.drawImg(t6, this.x - 100, this.y * 11, this.r);
        return [this.x, this.y, this.r];
    }
    drawParallelogramObj(): [number, number, number] {
        const p1 = getImg("p1");
        this.drawImg(p1, this.x - 100, this.y, this.r);
        const p2 = getImg("p2");
        this.drawImg(p2, this.x - 100, this.y * 3, this.r);
        const p3 = getImg("p3");
        this.drawImg(p3, this.x - 100, this.y * 5, this.r);
        const p4 = getImg("p4");
        this.drawImg(p4, this.x - 100, this.y * 7, this.r);
        const p5 = getImg("p5");
        this.drawImg(p5, this.x - 100, this.y * 9, this.r);
        return [this.x, this.y, this.r];
    }
    drawIrregularObj(startPos: Pos): [number, number, number] {
        const I1 = getImg("I1");
        this.drawImg(I1, this.x - 100, this.y, this.r);
        const I2 = getImg("I2");
        this.drawImg(I2, this.x - 100, this.y * 3, this.r);
        return [this.x, this.y, this.r];
    }
}
