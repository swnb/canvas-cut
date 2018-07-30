import Draw from "../draw";

type Pos = [number, number];

export class DrawObjbg extends Draw {
    public r: number = 0;
    public h: number = 0;

    constructor(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        r: number,
        h: number
    ) {
        super(context);

        [this.x, this.y, this.width, this.height, this.r, this.h] = [
            x,
            y,
            width,
            height,
            r,
            h
        ];
    }

    drawobjbg(startPos: Pos) {
        this.context.fillStyle = "white";
        this.context.beginPath();
        this.context.moveTo(this.x + this.r, this.y);
        this.context.lineTo(this.x + this.r + this.width, this.y);
        this.context.arcTo(
            this.x + this.r * 2 + this.width,
            this.y,
            this.x + this.r * 2 + this.width,
            this.y + this.r,
            this.r
        );
        this.context.lineTo(
            this.x + this.r * 2 + this.width,
            this.y + this.r + this.h
        );
        this.context.lineTo(
            this.x + this.r * 2 + this.width + 40,
            this.y + this.r + this.h + 20
        );
        this.context.lineTo(
            this.x + this.r * 2 + this.width,
            this.y + this.r + this.h + 40
        );
        this.context.lineTo(
            this.x + this.r * 2 + this.width,
            this.y + this.r + this.height
        );
        this.context.arcTo(
            this.x + this.r * 2 + this.width,
            this.y + this.r * 2 + this.height,
            this.x + this.r + this.width,
            this.y + this.r * 2 + this.height,
            this.r
        );
        this.context.lineTo(this.x + this.r, this.y + this.r * 2 + this.height);
        this.context.arcTo(
            this.x,
            this.y + this.r * 2 + this.height,
            this.x,
            this.y + this.r + this.height,
            this.r
        );
        this.context.lineTo(this.x, this.y + this.r);
        this.context.arcTo(this.x, this.y, this.x + this.r, this.y, this.r);
        this.context.closePath();
        this.context.fill();
    }
}
