import util from "./util/util";

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

export const sliceUpdate = (
    lineA1: Pos,
    lineA2: Pos,
    lines: Lines
): Lines[] => {
    const insertPoints = lines.map(
        (line): InsertPoint | undefined => {
            switch (line.type) {
                case "line": {
                    // 拿到交点
                    const res = util.getIntersection(
                        lineA1,
                        lineA2,
                        line.points[0],
                        line.points[1]
                    );
                    // 如果是没有交点的，返回undefined
                    if (!res.res) {
                        return undefined;
                    } else {
                        // 交点只有一个,这个交点就是线的交点
                        return {
                            type: "insertPoint-line",
                            points: [res.point]
                        } as InsertPoint;
                    }
                }
                case "curve": {
                    const [
                        firstPoints,
                        secondPoints,
                        bezier,
                        midPoint
                    ] = line.points;

                    const r = line.r;

                    // 对点进行处理
                    const resSector = util.getInsCircle(
                        lineA1,
                        lineA2,
                        midPoint,
                        r
                    );

                    // 无交点
                    if (!resSector.res) return undefined;

                    const [pointOne, pointTwo] = resSector.point;

                    const direction = [
                        bezier[0] - midPoint[0],
                        bezier[1] - midPoint[1]
                    ] as [number, number];

                    // 第一个点在线段上么
                    const isOne = util.isPointInsideSector(
                        pointOne,
                        firstPoints,
                        direction
                    );

                    //  第二个点在线段上么
                    const isTwo = util.isPointInsideSector(
                        pointTwo,
                        firstPoints,
                        direction
                    );

                    // 确实存在交点,交点的实际情况
                    if (isOne && isTwo) {
                        return {
                            type: "insertPoint-Curve",
                            points: [pointOne, pointTwo]
                        };
                    } else if (isOne) {
                        return {
                            type: "insertPoint-Curve",
                            points: [pointOne]
                        };
                    } else if (isTwo) {
                        return {
                            type: "insertPoint-Curve",
                            points: [pointTwo]
                        };
                    } else {
                        console.log("没产生实际上和圆形的交点");
                        return undefined;
                    }
                }
            }
        }
    );

    // console.log(insertPoints);

    //大概出现3种情况
    const insertPointsR = insertPoints.filter(ele => ele);
    // 交点必须是2个

    if (insertPointsR.length != 2 && insertPointsR.length != 1) {
        console.log(
            "切出来的长度不是2也不是1，这个情况要上报 长度是 ",
            insertPoints.filter(ele => ele).length
        );
    }

    switch (insertPointsR.length) {
        // 第三种：曲线与曲线的相交
        case 1: {
            return CC(lines, insertPoints);
        }
        case 2: {
            const p1 = insertPointsR[0] as InsertPoint;
            const p2 = insertPointsR[1] as InsertPoint;

            if (p1.type === p2.type) {
                // 第二种：直与直的相交
                console.log("两个类型是相同的 直线和直线", p1.type);
                return SS(lines, insertPoints);
            } else {
                // 第一种：曲与直的相交
                console.log("类型不同 曲线和直线", p1.type, " ", p2.type);
            }
        }
    }
    return [];
};

// 直线和直线的相交
const SS = (
    originLines: Lines,
    insertPoints: (InsertPoint | undefined)[]
): Lines[] => {
    const insertPWidthIndex = insertPoints.reduce(
        (
            preVious: { insertP: InsertPoint; index: number }[],
            insertPoint: InsertPoint | undefined,
            index: number
        ): { insertP: InsertPoint; index: number }[] => {
            // 因为之前判断过了，只会存在两个交点，那么下面就根据这两个交点进行下一步的工作
            if (insertPoint) {
                preVious.push({ index, insertP: insertPoint });
            }
            return preVious;
        },
        []
    );

    if (insertPWidthIndex.length != 2) console.log("这不是一个2切点的图形");

    const first = insertPWidthIndex[0];
    const second = insertPWidthIndex[1];

    // 先前的第一条线段
    const orginFirstLine = originLines[first.index];
    // 先前的第二条线段
    const originSecondLine = originLines[second.index];

    // 第一条线段被裁剪下来的第一条线段
    const cutFirstLine1: Straight = {
        type: "line",
        points: [orginFirstLine.points[0], first.insertP.points[0]]
    };
    // 第一条线段被裁剪下来的第二条线段
    const cutFirstLine2: Straight = {
        type: "line",
        points: [first.insertP.points[0], orginFirstLine.points[1]]
    };

    // 第二条线段被裁剪下来的第一条线段
    const cutSecondLine1: Straight = {
        type: "line",
        points: [originSecondLine.points[0], second.insertP.points[0]]
    };

    // 第二条线段被裁剪下来的第二条线段
    const cutSecondLine2: Straight = {
        type: "line",
        points: [second.insertP.points[0], originSecondLine.points[1]]
    };

    // 闭合路径
    const closeLine: Straight = {
        type: "line",
        points: [first.insertP.points[0], second.insertP.points[0]]
    };

    // 把线条裁剪下来
    const cutline1 = [...originLines].slice(first.index, second.index + 1);
    cutline1.shift();
    cutline1.unshift(cutFirstLine2);
    cutline1.pop();
    cutline1.push(cutSecondLine1);

    // 这是切割出来的第二条可能的值
    const cutline2 = [
        ...originLines.slice(second.index),
        ...originLines.slice(0, first.index + 1)
    ];
    cutline2.shift();
    cutline2.unshift(cutSecondLine2);
    cutline2.pop();
    cutline2.push(cutFirstLine1);

    // 加入闭合路径
    cutline1.push(closeLine);
    cutline2.push(closeLine);

    return [cutline1, cutline2];
};

// 曲线和曲线的相交
const SC = () => {};

// 曲与曲的相交
const CC = (
    originLines: Lines,
    insertPoints: (InsertPoint | undefined)[]
): Lines[] =>
    insertPoints.reduce(
        (
            preVious: Lines[],
            insertPoint: InsertPoint | undefined,
            index: number
        ): Lines[] => {
            // 只可能存在一个交点，这个交点就是曲线上的两个交点
            if (insertPoint) {
                // 原本的线段
                const originLine = originLines[index];

                // 做一层验证，确认这个交点是不是存在
                if (originLine.type != "curve") {
                    console.log("似乎不是曲线和曲线的交点 ");
                    return preVious;
                } else if (insertPoint.points.length != 2) {
                    console.log("似乎还不是两个曲线上的交点，请检查下吧");
                    return preVious;
                }
                // 现在确认是在曲线上的交点。并且只有两个交点

                // 初始化的起点
                const originStartP = [...originLine.points[0]] as Pos;
                // 第一个交点
                const firstP = insertPoint.points[0];
                // 第2个交点
                const secondP = insertPoint.points[1];
                // 初始化的终点
                const originEndP = [...originLine.points[1]] as Pos;
                // 半径
                const r = originLine.r;
                // 圆心的点
                const midPoint = [...originLine.points[3]] as Pos;

                // 计算第一个线段的bezier 曲线 的 外圈 的 交点
                const firstOutsideInsertPoint = util.getBezierPoint(
                    midPoint,
                    originStartP,
                    firstP
                ).point[1];

                // 第一个bezier曲线的节点
                const firstBezier = firstOutsideInsertPoint[0];

                // 计算第二个bezier曲线 的 外圈 的 外交点
                const secondOutsideInsertPoint = util.getBezierPoint(
                    midPoint,
                    firstP,
                    secondP
                ).point[1];

                // 计算第二个线段的bezier 的 节点
                const secondBezier = secondOutsideInsertPoint[0];

                // 计算第三个线段的bezier 的 外圈 的 节点
                const thirdOutsideInsertPoint = util.getBezierPoint(
                    midPoint,
                    secondP,
                    originEndP
                ).point[1];

                // 计算第3个bezier的节点
                const thirdBezier = thirdOutsideInsertPoint[0];

                // 将一个线段分成三段
                const firstLine: Curve = {
                    type: "curve",
                    r: r,
                    points: [
                        [...originStartP] as Pos,
                        [...firstP] as Pos,
                        [...firstBezier] as Pos,
                        [...midPoint] as Pos
                    ]
                };

                const secondLine: Curve = {
                    type: "curve",
                    r: r,
                    points: [
                        [...firstP] as Pos,
                        [...secondP] as Pos,
                        [...secondBezier] as Pos,
                        [...midPoint] as Pos
                    ]
                };

                const thirdLine: Curve = {
                    type: "curve",
                    r: r,
                    points: [
                        [...secondP] as Pos,
                        [...originEndP] as Pos,
                        [...thirdBezier] as Pos,
                        [...midPoint] as Pos
                    ]
                };

                const closeLine: Straight = {
                    type: "line",
                    points: [[...firstP] as Pos, [...secondP] as Pos]
                };

                // 被切割的图形
                const cutGraph = [closeLine, secondLine];

                // 原本的所有线段进行分割
                originLines.splice(index, 1, firstLine, closeLine, thirdLine);

                preVious.push(originLines, cutGraph);
            }
            return preVious;
        },
        []
    );
