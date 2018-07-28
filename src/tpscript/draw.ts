// 位置点阵
type Pos = [number, number];

export default abstract class Draw {
    public x: number = 0;
    public y: number = 0;

    public width: number = 0;
    public height: number = 0;

    public context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    private fillStyle = "pink";

    public rect(
        x: number,
        y: number,
        w: number,
        h: number = w,
        stroke?: boolean
    ) {
        this.context.beginPath();
        this.context.rect(x, y, w, h);
        stroke ? this.context.stroke() : this.context.fill();
        this.context.closePath();
    }
    public circle(x: number, y: number, r: number, stroke?: boolean) {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI, true);
        stroke ? this.context.stroke() : this.context.fill();
        this.context.closePath();
    }
    public polygon(pos: Array<Pos>) {
        this.context.beginPath();
        pos.forEach(
            ([posx, posy], index) =>
                index == 0
                    ? this.context.moveTo(posx, posy)
                    : this.context.lineTo(posx, posy)
        );
        this.context.closePath();
        this.context.stroke();
    }
    public polygonFill(pos: Array<Pos>) {
        this.context.beginPath();
        pos.forEach(
            ([posx, posy], index) =>
                index == 0
                    ? this.context.moveTo(posx, posy)
                    : this.context.lineTo(posx, posy)
        );
        this.context.closePath();
        this.context.fill();
        this.context.strokeStyle = "#33CCFF";
        this.context.stroke();
    }
    public rotate(deg: number) {
        this.context.save();
        this.context.translate(
            this.x + this.width / 2,
            this.y + this.height / 2
        );

        this.context.rotate(deg);
        this.context.translate(
            -this.x - this.width / 2,
            -this.y - this.height / 2
        );
    }
    public drawImg(
        Image: HTMLImageElement,
        dX: number,
        dY: number,
        dWidth: number,
        dHeight: number = dWidth
    ) {
        this.context.drawImage(Image, dX, dY, dWidth, dHeight);
    }
    public clear() {
        this.context.clearRect(0, 0, 1280, 800);
    }
    public drawBg() {
        const prefillStyle = this.context.fillStyle;
        this.context.fillStyle = this.fillStyle;
        this.context.beginPath();
        this.context.fillRect(0, 0, 1280, 800);
        this.context.closePath();
        this.context.fillStyle = prefillStyle;
    }
    public draw() { }
    public redraw() {
        this.clear();
        this.drawBg();
        this.draw();
    }
}
