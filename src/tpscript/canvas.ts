import Draw from "./draw";

import { Menu } from "./menu/menu";

// Buttons 是实际的
import { Buttons } from "./buttons/button";

import {
    Obj,
    Circle,
    Sector,
    createObj,
    SelfCreateObj,
    createObjBySelf,
    createSector
} from "./objects/createobj";

import util from "./util/util";

import slice from "./slice";

type Pos = [number, number];

interface ObjType {
    type: string;
    typecode: number;
}

interface MenuType {
    pointAtMenu(pos: Pos): boolean;
    pointAtSubMenu(pos: Pos): boolean;
    draw(): MenuType;
}

class Cut extends Draw {
    static create(context: CanvasRenderingContext2D): Cut {
        return new Cut(context);
    }

    private allObj: Array<Obj | SelfCreateObj | Circle> = [];

    private menu: MenuType;
    private buttons: Buttons;

    public context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        super(context);
        this.context = context;
        this.context.strokeStyle = "whitesmoke";
        this.context.fillStyle = "#84ccc9";

        this.menu = new Menu(this.context, 1175, 50, this.createObj).draw();
        this.buttons = new Buttons(this.context, {
            rmEverything: this.rmEvething
        }).draw();
    }

    init(): Cut {
        // const log = console.log;
        // window.console.log = (poses: Array<Pos>) => {
        //     if (!Array.isArray(poses)) {
        //         return log(poses);
        //     }
        //     log(poses);
        //     poses.forEach(pos => {
        //         this.context.arc(pos[0], pos[1], 10, 0, Math.PI * 2);
        //         this.context.fill();
        //     });
        // };

        this.context.lineWidth = 6;
        this.context.fillStyle = "#F4A322";
        this.redraw();
        return this;
    }

    update() {}

    // 上帝7日造人，swnb7天造物
    createObj = (type: ObjType) => {
        const startPos: Pos = [
            Math.random() * 400 + 100,
            Math.random() * 200 + 100
        ];
        const obj = createObj(this.context, type, startPos, 200, 300);
        this.allObj.push(obj);
    };

    // onMessage(){
    // }

    draw() {
        this.allObj.forEach(ele => {
            ele.draw();
        });

        this.menu.draw();

        this.buttons.draw();
    }

    ontouch(x: number, y: number) {
        // 如果确认了点击的事件，那么就把逻辑交给别人
        if (this.buttons.ifClick(x, y)) return;

        // 查找菜单，点击事件判断,存在终止判断，把逻辑交给其他人
        if (this.menu.pointAtMenu([x, y])) return;

        if (this.menu.pointAtSubMenu([x, y])) return;

        // 从最后开始查找，相当于在页面前面从最前面开始找，找到了就是了
        const ele = [...this.allObj].reverse().find(
            (obj: Obj | SelfCreateObj | Circle): boolean => {
                // 新增加的模式，对于圆形有特殊的表达
                if (obj.objType.type === "Ellipse") {
                    // 判断是否在圆形内部
                    const isInCircle = util.isInsideCircle(x, y, [
                        ...obj.polygonPoints[1],
                        (<Circle>obj).r
                    ] as [number, number, number]);

                    if (isInCircle) {
                        console.log("inside circle");
                        this.setSelect(obj);
                        obj.mode = "move";
                        return true;
                    } else return false;
                }

                // 元素是否被选中，选中就要进行多种判断
                if (obj.selected) {
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
                    }
                }
                // 如果对象不是被已经被选中的对象
                if (
                    util.isInsideArea(
                        [x, y],
                        [obj.x, obj.y],
                        obj.width,
                        obj.height,
                        obj.polygonPoints
                    )
                ) {
                    // 清除所有的obj对象备选状态，对当前的选中对象设置选中的状态
                    this.setSelect(obj);
                    obj.mode = "move";
                    // 更新所有的状态并且重新生成新的状态
                    this.redraw();
                    return true;
                }
                return false;
            }
        );

        //不存在直接返回
        if (!ele) {
            return false;
        }

        // 判断旋转还是移动
        switch (ele.mode) {
            case "move":
                return this.listenerMove(ele, x, y);
            case "rotate":
                return this.listenerRotate(ele);
            default:
                return null;
        }
    }
    // 利用闭包实现一些特殊的功能，去抖动
    listenerMove = (
        ele: Obj | SelfCreateObj | Circle,
        x: number,
        y: number
    ) => {
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

            const [ex, ey] = util.getEventPos(ev);
            //  这个update一定要在前面实现，这个变化的数据不能继续扩张它的影响
            ele.update(ex - x + originX, ey - y + originY);
            ele.x = ex - x + originX;
            ele.y = ey - y + originY;

            this.redraw();
        };
    };
    listenerRotate = (ele: Obj | SelfCreateObj) => {
        // 中心点
        const midPoint: Pos = [ele.x + ele.width / 2, ele.y + ele.height / 2];

        const orginPolygonPoints = util.deepcoyeArray(ele.polygonPoints);

        let timeRecord = Date.now();
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

            this.rect(midPoint[0], midPoint[1], 10, 10);

            const startPoint: Pos = [midPoint[0], midPoint[1] + 10];

            const movePoint: Pos = util.getEventPos(ev);

            this.rect(movePoint[0], movePoint[1], 10, 10);
            this.rect(startPoint[0], startPoint[1], 10, 10);

            ele.polygonPoints = util.affineTransform(
                startPoint,
                midPoint,
                movePoint,
                orginPolygonPoints
            );
            console.log(ele.polygonPoints);
            this.redraw();
        };
    };
    listenerClip = (x: number, y: number) => {
        this.context.beginPath();
        this.context.moveTo(x, y);
        let timeRecord = Date.now();

        return (event: MouseEvent) => {
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
            this.context.beginPath();
            this.context.setLineDash([25, 15]);
            this.context.moveTo(x, y);
            // 事件的坐标
            const [ex, ey] = util.getEventPos(event);
            this.context.lineTo(ex, ey);
            const preStrokeStyle = this.context.strokeStyle;
            this.context.strokeStyle = "red";
            this.context.stroke();
            this.context.setLineDash([]);
            this.context.closePath();
            this.context.strokeStyle = preStrokeStyle;
        };
    };
    listenerClipEnd(x: number, y: number, ex: number, ey: number) {
        this.clear();
        this.drawBg();
        this.draw();
        this.context.beginPath();
        const preStrokeStyle = this.context.strokeStyle;
        this.context.lineWidth = 3;
        this.context.strokeStyle = "red";
        this.context.moveTo(x, y);
        this.context.lineTo(ex, ey);
        this.context.stroke();
        this.context.closePath();
        this.context.strokeStyle = preStrokeStyle;

        this.getInsertPoints([x, y], [ex, ey]);
    }
    // 一个线段和物体相交的整个过程
    getInsertPoints(lineA1: Pos, LineA2: Pos) {
        // 将this.obj的所有物体进行整合，整合之后得到所有的物体的一个集合
        // 这里的问题其实在于是否要全部更新所有存在的对象，我的想法是全部更新，之后考虑部分更新到部分
        this.allObj = slice(this.allObj, lineA1, LineA2).reduce(
            (
                previous: Array<Obj | SelfCreateObj | Circle>,
                element: Array<Pos[]>,
                index: number
            ): Array<Obj | SelfCreateObj | Circle> => {
                const OriginObj = this.allObj[index];

                // 正常情况下切割的物体只会出现element的长度为2

                // 分析可能的出现情况，只针对被切割开得物体进行划分
                switch (element.length) {
                    case 2: {
                        // 直接进行之后的下面的切割工作
                        console.log("slice element");
                        break;
                    }
                    // 这是没有被切割的物体，那么直接返回之前存在的元素
                    case 0: {
                        previous.push(OriginObj);
                        return previous;
                    }
                    //  第三种新增加的元素,圆形的切割问题
                    case 1: {
                        // 看看数据本身再说
                        const [pointOne, pointTwo, midPoint]: [
                            Pos,
                            Pos,
                            Pos
                        ] = element[0] as [Pos, Pos, Pos];

                        const startPoint: Pos = [OriginObj.x, OriginObj.y];

                        const objType: ObjType = {
                            type: "Sector",
                            typecode: 1
                        };

                        const sector = createSector(
                            this.context,
                            startPoint,
                            midPoint,
                            pointOne,
                            pointTwo,
                            2 * (<Circle>OriginObj).r,
                            2 * (<Circle>OriginObj).r,
                            (<Circle>OriginObj).r,
                            objType
                        );
                        
                        console.log("sector.init()");
                        sector.draw();
                        previous.push(OriginObj);
                        return previous;
                    }
                    default: {
                        console.log(
                            "something wrong is happend,the length of slice element is ",
                            element.length
                        );
                    }
                }

                const ele = element.map(ele => {
                    // 方向向量,考虑下这个设计是否合理,最后两个点是它的向量的一个结合点
                    const direct1 = ele.pop() as [number, number];
                    const direct2 = ele.pop() as [number, number];

                    const direct = util.getDirection(
                        direct1,
                        direct2,
                        util.deepcoyeArray(ele)
                    );

                    // 位置点阵的信息
                    const points = util.deepcoyeArray(ele);

                    // 拿到位置信息
                    const [startPoint, [width, height]] = util.getWdithHeight(
                        points
                    );

                    // 得到的新的obj物体，并且先画一次
                    const newObj = createObjBySelf(
                        this.context,
                        startPoint,
                        width,
                        height,
                        util.deepcoyeArray(ele)
                    ).draw();

                    // 让每一个物体都能取重新画，但是调度的任务留给自己，含义是统一管理，避免改动导致bug，所以统一所有的调度任务只能在一个类里面完成
                    newObj.redraw = this.redraw.bind(this);

                    // 设置定时画的功能
                    util.slowMove(newObj, direct, util.deepcoyeArray(ele));

                    return newObj;
                });

                // 返回正常情况下被切割的两个元素
                previous.push(...ele);
                return previous;
            },
            []
        );

        this.redraw();
    }

    setSelect(obj: Obj | SelfCreateObj | Circle) {
        this.allObj.forEach(obj => {
            obj.selected = false;
        });
        obj.selected = true;
    }

    // 清除对象
    rmEvething = (): boolean => {
        //  没啥选中的就删除最后一个，选中就清除这个元素自己
        if (this.allObj.every(obj => !obj.selected)) {
            this.allObj.pop();
        } else {
            this.allObj = this.allObj.filter(obj => !obj.selected);
        }
        return true;
    };
}

export default (context: CanvasRenderingContext2D) =>
    Cut.create(context).init();
