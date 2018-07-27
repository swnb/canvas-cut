import Draw from "./draw";

import Obj from "./object";

import { createObj } from "./object";

import util from "./util/util";

import slice from "./slice";

type Pos = [number, number];

interface ObjType {
    type: string;
    typecode: number;
}

class Cut extends Draw {
    static create(context: CanvasRenderingContext2D): Cut {
        return new Cut(context);
    }

    private allObj: Array<Obj> = [];

    public context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        super(context);
        this.context = context;
        this.context.strokeStyle = "whitesmoke";
        this.context.fillStyle = "pink";
    }

    init(): Cut {
        const startPos: Pos = [600, 350];
        this.rect(0, 0, 1280, 800, false);
        this.rect(478, 350, 100, 100);

        const type: ObjType = {
            type: "Echelon",
            typecode: 3
        };

        const obj = createObj(this.context, type, startPos, 200, 300).draw();

        this.allObj.push(obj);

        return this;
    }

    update() { }

    draw() {
        this.allObj.forEach(ele => {
            ele.draw();
        });
    }
    ontouch(x: number, y: number) {
        this.circle(x, y, 10);
        console.log("position at ", x, y);

        // 从最后开始查找，从最前面开始找，找到了就是了
        const ele = this.allObj.reverse().find(
            (obj: Obj): boolean => {
                const rotatePos: [number, number, number] = obj.rotatePos;
                const directPos: [number, number, number] = obj.directPos;
                console.log(rotatePos);
                if (util.isInsideCircle(x, y, directPos)) {
                    obj.mode = "move";
                    return true;
                } else if (util.isInsideCircle(x, y, rotatePos)) {
                    obj.mode = "rotate";
                    return true;
                } else return false;
            }
        );

        //不存在直接返回
        if (!ele) return false;

        // 判断旋转还是移动
        switch (ele.mode) {
            case "move":
                return this.listenerMove(ele, x, y);
            case "rotate":
                return this.listenerRotate(ele, x, y);
            default:
                return null;
        }
    }
    // 利用闭包实现一些特殊的功能，去抖动
    listenerMove = (ele: Obj, x: number, y: number) => {
        const [originX, originY] = [ele.x, ele.y];
        let timeRecord = Date.now();
        return (ev: MouseEvent) => {
            // 实现去抖动的功能
            const now = Date.now();
            const divi = now - timeRecord;
            if (divi < 2) {
                return;
            } else {
                timeRecord = now;
            }
            ele.x = ev.offsetX - x + originX;
            ele.y = ev.offsetY - y + originY;
            console.log(ele.x, ele.y);
            ele.clear();
            ele.drawBg();
            ele.draw();
        };
    };
    listenerRotate = (ele: Obj, x: number, y: number) => {
        let [originX, originY] = [
            ele.x + ele.width / 2,
            ele.y + ele.height / 2
        ];

        let [startX, startY] = [x, y];

        const prefixY = 80;
        const prefixX = 15;

        const rotatePosX = ele.rotatePos[0];
        const rotatePosY = ele.rotatePos[1];

        let timeRecord = Date.now();

        let deg = 0;
        return (ev: MouseEvent) => {
            console.log("start rotate");
            // 实现去抖动的功能
            const now = Date.now();
            const divi = now - timeRecord;
            if (divi < 2) {
                return;
            } else {
                timeRecord = now;
            }
            deg += util.getDeg(
                originX,
                originY,
                startX,
                startY,
                ev.offsetX,
                ev.offsetY
            );

            ele.rotate(deg);
            ele.clear();
            ele.drawBg();
            ele.draw();
            ele.context.restore();

            // [startX, startY] = [ev.offsetX, ev.offsetY];
        };
    };
    listenerClip = (x: number, y: number) => {
        this.context.lineWidth = 4;
        this.context.strokeStyle = "#f36";
        this.context.beginPath();
        this.context.moveTo(x, y);
        let timeRecord = Date.now();
        return (ev: MouseEvent) => {
            console.log("start slice");

            // 实现去抖动的功能
            const now = Date.now();
            const divi = now - timeRecord;
            if (divi < 100) {
                return;
            } else {
                timeRecord = now;
            }

            this.clear();
            this.drawBg();
            this.draw();
            this.context.setLineDash([25, 15]);
            this.context.moveTo(x, y);
            this.context.lineTo(ev.offsetX, ev.offsetY);
            this.context.stroke();
            this.context.setLineDash([]);
        };
    };
    listenerClipEnd(x: number, y: number, ex: number, ey: number) {
        this.clear();
        this.drawBg();
        this.draw();
        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.strokeStyle = "red";
        this.context.moveTo(x, y);
        this.context.lineTo(ex, ey);
        this.context.stroke();
        this.context.closePath();
        this.getInsertPoints([x, y], [ex, ey]);
    }
    // 判断是否存在一个线段和它相交
    getInsertPoints(lineA1: Pos, LineA2: Pos) {
        slice(this.allObj, lineA1, LineA2).forEach(element => {
            element.forEach(ele => {
                const direct = ele.pop() as [number, number];
                this.polygonFill(ele);
                setTimeout(() => {
                    this.polygonFill(
                        ele.map(
                            (pos: [number, number]): [number, number] => [
                                pos[0] + direct[0],
                                pos[1] + direct[1]
                            ]
                        )
                    );
                }, 100);
            });
        });
    }
    loop() {
        this.draw();
    }
}

export default (context: CanvasRenderingContext2D) =>
    Cut.create(context).init();
