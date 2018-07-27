import Draw from './draw';

import { getImg } from './imgbase64';

type Pos = [number, number]

export class Menu extends Draw {
    public r: number = 0

    constructor(
        context: CanvasRenderingContext2D,
        width: number,
        height: number,
        r: number
    ) {
        super(context);

        [this.width, this.height, this.r] = [width, height, r]

    }
    init(startPos: Pos) {
        this.context.fillStyle = 'white';
        this.context.fillRect(this.width, this.height, 100, 500);
        const parallelogram = getImg("parallelogram");
        this.drawImg(
            parallelogram,
            this.width,
            this.height,
            this.r,
        );
        const triangle = getImg("triangle");
        this.drawImg(
            triangle,
            this.width,
            this.height * 2,
            this.r,
        );
        const echelon = getImg("echelon");
        this.drawImg(
            echelon,
            this.width,
            this.height * 3,
            this.r,
        );
        const irregular = getImg("irregular");
        this.drawImg(
            irregular,
            this.width,
            this.height * 4,
            this.r,
        );
        const ellipse = getImg("ellipse");
        this.drawImg(
            ellipse,
            this.width,
            this.height * 5,
            this.r,
        );
    }
    drawEchelonObj(startPos: Pos): [number, number, number] {
        // const x = this.x - this.prefix;
        // const y = this.y - this.prefix;
        const e1 = getImg("e1");

        this.drawImg(
            e1,
            this.width - 100,
            this.height,
            this.r,
        );
        const e2 = getImg("e2");
        this.drawImg(
            e2,
            this.width - 100,
            this.height * 2,
            this.r,
        );
        const e3 = getImg("e3");
        this.drawImg(
            e3,
            this.width - 100,
            this.height * 3,
            this.r,
        );
        return [this.width, this.height, this.r]
    }
    drawTriangleObj(startPos: Pos): [number, number, number] {
        const t1 = getImg("t1");
        this.drawImg(
            t1,
            this.width - 100,
            this.height,
            this.r,
        );
        const t2 = getImg("t2");
        this.drawImg(
            t2,
            this.width - 100,
            this.height * 2,
            this.r,
        );
        const t3 = getImg("t3");
        this.drawImg(
            t3,
            this.width - 100,
            this.height * 3,
            this.r,
        );
        const t4 = getImg("t4");
        this.drawImg(
            t4,
            this.width - 100,
            this.height * 4,
            this.r,
        );
        const t5 = getImg("t5");
        this.drawImg(
            t5,
            this.width - 100,
            this.height * 5,
            this.r,
        );
        const t6 = getImg("t6");
        this.drawImg(
            t6,
            this.width - 100,
            this.height * 6,
            this.r,
        );
        return [this.width, this.height, this.r]
    }
    // drawParallelogram(startPos: Pos):


}