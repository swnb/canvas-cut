
// 这里也许根本就不需要一个这样的转换去做这样的工作,我们需要的是什么,是移动的规则,


// 将每个点阵的所有数据都进行加处理是否是正确的?


// 位置点阵的信息
type Pos = [number, number];

// 交点，这里是做了扩充，多了一个属性值，这样的代码会结构化一些
interface InsertPoint {
    type: "insertPoint-line" | "insertPoint-Curve";
    points: Pos[];
}

// 直线
interface Straight {
    type: "line";
    points: [Pos, Pos];
}

// 曲线
interface Curve {
    type: "curve";
    r: number;
    points: [Pos, Pos, Pos, Pos]; // 第3个是bezier曲线  第四个是圆心的点
}

// 线的类型
type Lines = (Straight | Curve)[];


type Points = Array<Pos|>;

export const line2Point = (lines: Lines): Points => {

    // lines.forEach()

    return [];
};
