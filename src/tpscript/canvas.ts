import Draw from "./draw";

import { Menu } from "./menu"

import { Obj, createObj, SelfCreateObj, createObjBySelf } from "./object";

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

    private allObj: Array<Obj | SelfCreateObj> = [];

    public context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        super(context);
        this.context = context;
        this.context.strokeStyle = "whitesmoke";
        this.context.fillStyle = "pink";
    }

    init(): Cut {
        // 创建一个简单的图形

        this.context.lineWidth = 4;

        const startPos: Pos = [200, 200];
        this.rect(0, 0, 1280, 800, false);
        this.rect(478, 350, 100, 100);

        const type: ObjType = {
            type: "Irregular",
            typecode: 2
        };

        const obj = createObj(this.context, type, startPos, 200, 300).draw();

        this.allObj.push(obj);

        // 创建一个新的物体，这个物体生成菜单
        const menu = new Menu(this.context, 1000, 100, 80)

        menu.drawTriangleObj([100, 300])
        menu.init([200, 300])

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

        console.log(this.allObj);
        // 从最后开始查找，从最前面开始找，找到了就是了
        const ele = [...this.allObj].reverse().find(
            (obj: Obj | SelfCreateObj): boolean => {
                const rotatePos: [number, number, number] = obj.rotatePos;
                const directPos: [number, number, number] = obj.directPos;
                // 判断一个点是否在这个区域内部
                if (
                    util.isInsideArea(
                        [x, y],
                        [obj.x, obj.y],
                        obj.width,
                        obj.height,
                        obj.polygonPoints
                    ) ||
                    util.isInsideCircle(x, y, directPos)
                ) {
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
    listenerMove = (ele: Obj | SelfCreateObj, x: number, y: number) => {
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

            //  这个update一定要在前面实现，这个变化的数据不能继续扩张
            ele.update(ev.offsetX - x + originX, ev.offsetY - y + originY);
            ele.x = ev.offsetX - x + originX;
            ele.y = ev.offsetY - y + originY;
            this.redraw();
        };
    };
    listenerRotate = (ele: Obj | SelfCreateObj, x: number, y: number) => {
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
        };
    };
    listenerClip = (x: number, y: number) => {
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
        // 将this.obj的所有物体进行整合，整合之后得到所有的物体的一个集合
        // 这里的问题其实在于是否要全部更新所有存在的对象，我的想法是全部更新，之后考虑部分更新到部分
        this.allObj = slice(this.allObj, lineA1, LineA2).reduce(
            (
                previous: Array<Obj | SelfCreateObj>,
                element: Array<Pos[]>,
                index: number
            ): Array<Obj | SelfCreateObj> => {
                const ele = element.map(ele => {
                    // 方向向量
                    const direct = ele.pop() as [number, number];

                    // 位置点阵的信息
                    const points = util.deepcoyeArray(ele);

                    const maxPointWithSmallestPoint: [Pos, Pos] = points.reduce(
                        (previous: [Pos, Pos], ele): [Pos, Pos] => {
                            if (ele[0] < previous[0][0]) {
                                previous[0][0] = ele[0];
                            }
                            if (ele[1] < previous[0][1]) {
                                previous[0][1] = ele[1];
                            }
                            if (ele[0] > previous[1][0]) {
                                previous[1][0] = ele[0];
                            }
                            if (ele[1] > previous[1][1]) {
                                previous[1][1] = ele[1];
                            }
                            return previous;
                        },
                        [points[0], points[1]] as [Pos, Pos]
                    );

                    const startPoints: Pos = maxPointWithSmallestPoint[0];

                    const [width, height] = [
                        maxPointWithSmallestPoint[1][0] -
                        maxPointWithSmallestPoint[0][0],
                        maxPointWithSmallestPoint[1][1] -
                        maxPointWithSmallestPoint[0][1]
                    ];

                    // 得到的新的obj物体
                    const newObj = createObjBySelf(
                        this.context,
                        startPoints,
                        width,
                        height,
                        util.deepcoyeArray(ele)
                        // ...ele.map(
                        // (pos: [number, number]): [number, number] => [
                        // pos[0] + direct[0],
                        // pos[1] + direct[1]
                        // ]
                        // )
                    ).draw();

                    // 让每一个物体都能取重新画，但是不能让这些物体自己调度自己
                    newObj.redraw = this.redraw.bind(this);

                    util.slowMove(newObj, direct, util.deepcoyeArray(ele));

                    return newObj;
                });

                if (ele.length === 2) {
                    previous.push(
                        // this.allObj[index],
                        ...ele
                    );
                    return previous;
                } else {
                    previous.push(this.allObj[index]);
                    return previous;
                }
            },
            []
        );

        this.redraw();
    }
}

export default (context: CanvasRenderingContext2D) =>
    Cut.create(context).init();
