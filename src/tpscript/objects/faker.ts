import { ControObj } from "./controller";
import { getImg } from "../imgbase64";
import { ObjType } from "./createobj";

// 点阵的信息
type Pos = [number, number];

export class Faker extends ControObj {
    private fakerCanvas: HTMLCanvasElement;

    private fakerContext: CanvasRenderingContext2D;

    private fakerCircle: HTMLImageElement;

    constructor(
        context: CanvasRenderingContext2D,
        startPos: Pos,
        // middlePoint: Pos,
        // firstInsertPoint: Pos,
        // secondInsertPoint: Pos,
        // bezier: Pos,
        // r: number,
        // objType: ObjType
        width: number,
        height: number
    ) {
        super(context, startPos, width, height);

        // 伪装者
        this.fakerCanvas = window.document.createElement("canvas");

        // 伪装的画布
        this.fakerContext = this.fakerCanvas.getContext(
            "2d"
        ) as CanvasRenderingContext2D;

        // 拿到图片的dom的信息
        this.fakerCircle = getImg("faker");

        // 创建实际的映射信息
        this.createCanvasImgElement();
    }

    createCanvasImgElement() {
        // 处理图片的尺寸
        [this.fakerCanvas.width, this.fakerCanvas.height] = [
            this.fakerCircle.width,
            this.fakerCircle.height
        ];

        // 虚拟的伪装图像，伪装h者初步生成
        this.fakerContext.drawImage(
            this.fakerCircle,
            0,
            0,
            this.fakerCircle.width,
            this.fakerCircle.height
        );
    }

    draw() {
        //  把这个图形画出来
        this.context.drawImage(
            this.fakerCircle,
            0,
            0,
            this.fakerCircle.width,
            this.fakerCircle.height
        );
    }
}
