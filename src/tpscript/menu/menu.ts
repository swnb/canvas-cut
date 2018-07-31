import Draw from "../draw";

import { getImg } from "../imgbase64";
import { InitBg, DrawObjbg } from "./initbg";

// 引入子菜单的所有类型和所有的数据
import { SubMenuDataStore, SubMenu, SubMenuDataType } from "./datastore";

type Mode =
    | "Triangle"
    | "Parallelogram"
    | "Echelon"
    | "Irregular"
    | "Ellipse"
    | "none";

export class Menu extends Draw {
    private ListOfObjs: { name: Mode; prefix: number }[] = [
        { name: "Parallelogram", prefix: 10 },
        { name: "Triangle", prefix: -10 },
        { name: "Echelon", prefix: 10 },
        { name: "Irregular", prefix: 10 },
        { name: "Ellipse", prefix: 40 }
    ];

    private ListOfnames: string[] = [
        "平行四边形",
        "三角形",
        "梯形",
        "不规则图形",
        "椭圆"
    ];

    // 主菜单区域
    private areas: {
        mode: Mode;
        x: number;
        y: number;
        width: number;
        height: number;
    }[] = [];

    // 子菜单区域的信息
    // private subMenuArea: {
    //     mode: string;
    //     x: number;
    //     y: number;
    //     width: number;
    //     height: number;
    // }[] = [];

    private subMenuArea: SubMenuDataType[] = [];

    private createObj: (type: { type: string; typecode: number }) => void;

    // 上一个模式和n当前的模式
    public lastMode: Mode = "none";
    public mode: Mode = "none";

    constructor(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        createObj: (type: { type: string; typecode: number }) => void
    ) {
        super(context);
        [this.x, this.y] = [x, y];

        this.createObj = createObj;
    }

    // 生成主菜单
    initMenu() {
        const divi = 135;

        this.ListOfObjs.forEach(
            (obj: { name: Mode; prefix: number }, index: number) => {
                const ImgElement = getImg(obj.name);
                this.drawImg(
                    ImgElement,
                    this.x - ImgElement.width / 2,
                    this.y + index * divi + obj.prefix,
                    ImgElement.width,
                    ImgElement.height
                );
                this.context.font = "20px sans-serif";
                const prefillstyle = this.context.fillStyle;
                this.context.fillStyle = "#595959";
                this.context.textAlign = "center";
                this.context.fillText(
                    this.ListOfnames[index],
                    this.x,
                    this.y + index * divi + obj.prefix + ImgElement.height + 30
                );
                this.context.fillStyle = prefillstyle;

                // 只生成一次就好了
                if (this.areas.length < this.ListOfObjs.length) {
                    this.areas.push({
                        mode: obj.name,
                        x: this.x - ImgElement.width / 2,
                        y: this.y + index * divi + obj.prefix,
                        width: ImgElement.width,
                        height: ImgElement.height
                    });
                }
            }
        );
    }

    chageMode(mode: Mode) {
        this.lastMode = this.mode;
        this.mode = mode;
        this.updateSubMenuList();
    }

    // 生成子菜单
    initSubMenu() {
        // "Triangle" | "Parallelogram" | "Echelon" | "Irregular" | "none"
        switch (this.mode) {
            case "none": {
                break;
            }
            case "Triangle": {
                this.drawTriangleObj();
                break;
            }
            case "Parallelogram": {
                this.drawParallelogramObj();
                break;
            }
            case "Echelon": {
                this.drawEchelonObj();
                break;
            }
            case "Irregular": {
                this.drawIrregularObj();
                break;
            }
        }
    }

    // 更新这些数据
    updateSubMenuList() {
        // 模式没有改变，那么就不更新
        if (this.mode === this.lastMode) {
            return;
        }
        switch (this.mode) {
            case "Parallelogram":
            case "Echelon":
            case "Irregular":
            case "Triangle": {
                this.subMenuArea = SubMenuDataStore[this.mode];
                break;
            }
            case "none":
            default: {
                this.subMenuArea = [];
                break;
            }
        }
    }

    // 判断一个点是否在一个区域的内部
    pointAtMenu([pointX, pointY]: [number, number]) {
        const areaMenu = this.areas.find(
            ({ x, y, width, height }): boolean => {
                return pointX <= x + width &&
                    pointX >= x &&
                    pointY >= y &&
                    pointY <= y + height
                    ? true
                    : false;
            }
        );
        if (areaMenu) {
            this.chageMode(areaMenu.mode);
            return true;
        } else {
            return false;
        }
    }

    pointAtSubMenu([pointX, pointY]: [number, number]) {
        // 更新下数据再说
        this.updateSubMenuList();

        const areaMenu = this.subMenuArea.find(
            ({ x, y, width, height }): boolean => {
                return pointX <= x + width &&
                    pointX >= x &&
                    pointY >= y &&
                    pointY <= y + height
                    ? true
                    : false;
            }
        );

        if (areaMenu) {
            //  需要商榷！！！！！！！！！！！！！！！！！！！！！！完全错误的设计模式
            this.createObj({
                type: areaMenu.type,
                typecode: areaMenu.typecode
            });

            return true;
        } else {
            return false;
        }
    }

    draw(): Menu {
        const x = this.x;
        const y = this.y;
        InitBg(this.context, [x - 75, y - 25], [130, 725], 12);
        this.initMenu();
        this.initSubMenu();
        return this;
    }

    // 下面的这些函数都需要重构

    // 三角形
    drawTriangleObj() {
        const len = 200;
        const x = this.x;
        const y = this.y;
        DrawObjbg(this.context, [x - 275, y - 25], [130, 650], 12, 150);

        const prefillstyle = this.context.fillStyle;
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

        this.context.fillStyle = prefillstyle;

        // 如果没有的话就添加它的位置点阵进入这些数据里面，也就是只生成一次
        if (!SubMenuDataStore["Triangle"]) {
            console.log("it doesn't init");
            SubMenuDataStore["Triangle"] = [];
            SubMenuDataStore["Triangle"].push(
                {
                    type: "Triangle",
                    typecode: 1,
                    x: this.x - len - t1.width / 2,
                    y: this.y,
                    width: t1.width,
                    height: t1.height
                },
                {
                    type: "Triangle",
                    typecode: 2,
                    x: this.x - len - t2.width / 2,
                    y: this.y * 3,
                    width: t2.width,
                    height: t2.height
                },
                {
                    type: "Triangle",
                    typecode: 3,
                    x: this.x - len - t3.width / 2,
                    y: this.y * 4.8,
                    width: t3.width,
                    height: t3.height
                },
                {
                    type: "Triangle",
                    typecode: 4,
                    x: this.x - len - t4.width / 2,
                    y: this.y * 7.2,
                    width: t4.width,
                    height: t4.height
                },
                {
                    type: "Triangle",
                    typecode: 5,
                    x: this.x - len - t5.width / 2,
                    y: this.y * 9.5,
                    width: t5.width,
                    height: t5.height
                },
                {
                    type: "Triangle",
                    typecode: 6,
                    x: this.x - len - t6.width / 2,
                    y: this.y * 11.5,
                    width: t6.width,
                    height: t6.height
                }
            );
        }
    }
    drawParallelogramObj() {
        const len = 200;
        const x = this.x;
        const y = this.y;
        DrawObjbg(this.context, [x - 275, y - 25], [130, 560], 12, 50);

        const prefillstyle = this.context.fillStyle;
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

        this.context.fillStyle = prefillstyle;

        // 如果没有的话就添加它的位置点阵进入这些数据里面，也就是只生成一次
        if (!SubMenuDataStore["Parallelogram"]) {
            console.log("it doesn't init");
            SubMenuDataStore["Parallelogram"] = [];
            SubMenuDataStore["Parallelogram"].push(
                {
                    type: "Parallelogram",
                    typecode: 1,
                    x: this.x - len - p1.width / 2,
                    y: this.y,
                    width: p1.width,
                    height: p1.height
                },
                {
                    type: "Parallelogram",
                    typecode: 2,
                    x: this.x - len - p2.width / 2,
                    y: this.y * 3,
                    width: p2.width,
                    height: p2.height
                },
                {
                    type: "Parallelogram",
                    typecode: 3,
                    x: this.x - len - p3.width / 2,
                    y: this.y * 5,
                    width: p3.width,
                    height: p3.height
                },
                {
                    type: "Parallelogram",
                    typecode: 4,
                    x: this.x - len - p4.width / 2,
                    y: this.y * 8,
                    width: p4.width,
                    height: p4.height
                },
                {
                    type: "Parallelogram",
                    typecode: 5,
                    x: this.x - len - p5.width / 2,
                    y: this.y * 10,
                    width: p5.width,
                    height: p5.height
                }
            );
        }
    }
    drawEchelonObj() {
        const len = 200;
        const x = this.x;
        const y = this.y;
        DrawObjbg(this.context, [x - 275, y + 200], [130, 370], 12, 100);

        const prefillstyle = this.context.fillStyle;
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

        this.context.fillStyle = prefillstyle;

        // 如果没有的话就添加它的位置点阵进入这些数据里面，也就是只生成一次
        if (!SubMenuDataStore["Echelon"]) {
            console.log("it doesn't init");
            SubMenuDataStore["Echelon"] = [];
            SubMenuDataStore["Echelon"].push(
                {
                    type: "Echelon",
                    typecode: 1,
                    x: this.x - len - e1.width / 2,
                    y: this.y * 5.5,
                    width: e1.width,
                    height: e1.height
                },
                {
                    type: "Echelon",
                    typecode: 2,
                    x: this.x - len - e2.width / 2,
                    y: this.y * 8,
                    width: e2.width,
                    height: e2.height
                },
                {
                    type: "Echelon",
                    typecode: 3,
                    x: this.x - len - e3.width / 2,
                    y: this.y * 10.5,
                    width: e3.width,
                    height: e3.height
                }
            );
        }
    }
    drawIrregularObj() {
        const len = 200;
        const x = this.x;
        const y = this.y;
        DrawObjbg(this.context, [x - 275, y + 410], [130, 200], 12, 50);

        const prefillstyle = this.context.fillStyle;
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

        this.context.fillStyle = prefillstyle;

        if (!SubMenuDataStore["Irregular"]) {
            console.log("it doesn't init");
            SubMenuDataStore["Irregular"] = [];
            SubMenuDataStore["Irregular"].push(
                {
                    type: "Irregular",
                    typecode: 1,
                    x: this.x - len - I1.width / 2,
                    y: this.y + 425,
                    width: I1.width,
                    height: I1.height
                },
                {
                    type: "Irregular",
                    typecode: 2,
                    x: this.x - len - I2.width / 2,
                    y: this.y + 535,
                    width: I2.width,
                    height: I2.height
                }
            );
        }
    }
}
