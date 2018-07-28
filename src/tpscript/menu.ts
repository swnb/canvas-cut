import Draw from "./draw";

import { getImg } from "./imgbase64";
import { Initbg } from "./initbg";
import { DrawObjbg } from "./drawobjbg";

type Pos = [number, number];

export class Menu extends Draw {
    public r: number = 0;

    private ListOfObjs: { name: string; prefix: number }[] = [
        { name: "parallelogram", prefix: 10 },
        { name: "triangle", prefix: -10 },
        { name: "echelon", prefix: 10 },
        { name: "irregular", prefix: 10 },
        { name: "ellipse", prefix: 40 }
    ];
    private ListOfnames: string[] = [
        "平行四边形",
        "三角形",
        "梯形",
        "不规则图形",
        "椭圆"
    ];

    constructor(context: CanvasRenderingContext2D, x: number, y: number) {
        super(context);
        [this.x, this.y] = [x, y];
    }

    drawImgById() {
        const divi = 135;

        this.ListOfObjs.forEach(
            (obj: { name: string; prefix: number }, index: number) => {
                const ImgElement = getImg(obj.name);
                this.drawImg(
                    ImgElement,
                    this.x - ImgElement.width / 2,
                    this.y + index * divi + obj.prefix,
                    ImgElement.width,
                    ImgElement.height
                );
                this.context.font = "20px sans-serif";
                this.context.fillStyle = "#595959";
                this.context.textAlign = "center";
                this.context.fillText(
                    this.ListOfnames[index],
                    this.x,
                    this.y + index * divi + obj.prefix + ImgElement.height + 30
                );
            }
        );
    }
    init() {
        const x = this.x;
        const y = this.y;
        const Bg = new Initbg(this.context, x - 75, y - 25, 130, 725, 12);
        Bg.initbg([100, 200]);
        this.drawImgById();
    }
    drawTriangleObj(): [number, number, number] {
        const len = 200;
        const x = this.x;
        const y = this.y;
        const Bg = new DrawObjbg(
            this.context,
            x - 275,
            y - 25,
            130,
            650,
            12,
            150
        );
        Bg.drawobjbg([100, 200]);
        this.context.fillStyle = "#595959";
        this.context.font = "15px sans-serif";
        const t1 = getImg("t1");
        this.drawImg(
            t1,
            this.x - len - t1.width / 2,
            this.y,
            t1.width,
            t1.height
        );
        this.context.fillText("等腰直角三角形", this.x - len, this.y * 3 - 20);
        const t2 = getImg("t2");
        this.drawImg(
            t2,
            this.x - len - t2.width / 2,
            this.y * 3,
            t2.width,
            t2.height
        );
        this.context.fillText("等腰三角形", this.x - len, this.y * 4.8 - 20);
        const t3 = getImg("t3");
        this.drawImg(
            t3,
            this.x - len - t3.width / 2,
            this.y * 4.8,
            t3.width,
            t3.height
        );
        this.context.fillText("等边三角形", this.x - len, this.y * 7.2 - 20);
        const t4 = getImg("t4");
        this.drawImg(
            t4,
            this.x - len - t4.width / 2,
            this.y * 7.2,
            t4.width,
            t4.height
        );
        this.context.fillText("钝角三角形", this.x - len, this.y * 9.5 - 20);
        const t5 = getImg("t5");
        this.drawImg(
            t5,
            this.x - len - t5.width / 2,
            this.y * 9.5,
            t5.width,
            t5.height
        );
        this.context.fillText("直角三角形", this.x - len, this.y * 11.5 - 15);
        const t6 = getImg("t6");
        this.drawImg(
            t6,
            this.x - len - t6.width / 2,
            this.y * 11.5,
            t6.width,
            t6.height
        );
        this.context.fillText("锐角三角形", this.x - len, this.y * 13.5);
        return [this.x, this.y, this.r];
    }
    drawParallelogramObj(): [number, number, number] {
        const len = 200;
        const x = this.x;
        const y = this.y;
        const Bg = new DrawObjbg(
            this.context,
            x - 275,
            y - 25,
            130,
            560,
            12,
            50
        );
        Bg.drawobjbg([100, 200]);
        this.context.fillStyle = "#595959";
        this.context.font = "15px sans-serif";
        const p1 = getImg("p1");
        this.drawImg(
            p1,
            this.x - len - p1.width / 2,
            this.y,
            p1.width,
            p1.height
        );
        this.context.fillText("平行四边形A", this.x - len, this.y * 3 - 20);
        const p2 = getImg("p2");
        this.drawImg(
            p2,
            this.x - len - p2.width / 2,
            this.y * 3,
            p2.width,
            p2.height
        );
        this.context.fillText("平行四边形B", this.x - len, this.y * 5 - 20);
        const p3 = getImg("p3");
        this.drawImg(
            p3,
            this.x - len - p3.width / 2,
            this.y * 5,
            p3.width,
            p3.height
        );
        this.context.fillText("平行四边形C", this.x - len, this.y * 8 - 20);
        const p4 = getImg("p4");
        this.drawImg(
            p4,
            this.x - len - p4.width / 2,
            this.y * 8,
            p4.width,
            p4.height
        );
        this.context.fillText("长方形", this.x - len, this.y * 10 - 20);
        const p5 = getImg("p5");
        this.drawImg(
            p5,
            this.x - len - p5.width / 2,
            this.y * 10,
            p5.width,
            p5.height
        );
        this.context.fillText("正方形", this.x - len, this.y * 12 - 10);
        return [this.x, this.y, this.r];
    }
    drawEchelonObj(): [number, number, number] {
        const len = 200;
        const x = this.x;
        const y = this.y;
        const Bg = new DrawObjbg(
            this.context,
            x - 275,
            y + 200,
            130,
            370,
            12,
            100
        );
        Bg.drawobjbg([100, 200]);
        this.context.fillStyle = "#595959";
        this.context.font = "15px sans-serif";
        const e1 = getImg("e1");
        this.drawImg(
            e1,
            this.x - len - e1.width / 2,
            this.y * 5.5,
            e1.width,
            e1.height
        );
        this.context.fillText("等腰梯形", this.x - len, this.y * 8 - 20);
        const e2 = getImg("e2");
        this.drawImg(
            e2,
            this.x - len - e2.width / 2,
            this.y * 8,
            e2.width,
            e2.height
        );
        this.context.fillText("普通梯形", this.x - len, this.y * 10.5 - 20);
        const e3 = getImg("e3");
        this.drawImg(
            e3,
            this.x - len - e3.width / 2,
            this.y * 10.5,
            e3.width,
            e3.height
        );
        this.context.fillText("直角梯形", this.x - len, this.y * 12.5);
        return [this.x, this.y, this.r];
    }
    drawIrregularObj(): [number, number, number] {
        const len = 200;
        const x = this.x;
        const y = this.y;
        const Bg = new DrawObjbg(
            this.context,
            x - 275,
            y + 410,
            130,
            200,
            12,
            50
        );
        Bg.drawobjbg([100, 200]);
        this.context.fillStyle = "#595959";
        this.context.font = "15px sans-serif";
        const I1 = getImg("I1");
        this.drawImg(
            I1,
            this.x - len - I1.width / 2,
            this.y + 425,
            I1.width,
            I1.height
        );
        this.context.fillText("直角梯形", this.x - len, this.y + 515);
        const I2 = getImg("I2");
        this.drawImg(
            I2,
            this.x - len - I2.width / 2,
            this.y + 535,
            I2.width,
            I2.height
        );
        this.context.fillText("直角梯形", this.x - len, this.y + 615);
        return [this.x, this.y, this.r];
    }
}
