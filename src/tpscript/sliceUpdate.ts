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

                    // 两个交点
                    if (isOne && isTwo) {
                        return {
                            type: "insertPoint-Curve",
                            points: [pointOne, pointTwo]
                        };
                        // 一个交点
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
                        //不存在交点
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
        return Array(10);
    }

    switch (insertPointsR.length) {
        // 第三种：曲线与曲线的相交
        case 1: {
            return CC(lines, insertPoints);
        }
        case 2: {
            const p1 = insertPointsR[0] as InsertPoint;
            const p2 = insertPointsR[1] as InsertPoint;

            if (p1.type === p2.type && p1.type === "insertPoint-line") {
                // 第二种：直与直的相交
                console.log("两个类型是相同的 直线和直线", p1.type);
                return SS(lines, insertPoints);
            } else if (p1.type === p2.type && p1.type === "insertPoint-Curve") {
                // 这是第4种 曲线与曲线不在一线上的情况
                return CCD(lines, insertPoints);
            } else {
                // 第一种：曲与直的相交
                console.log("类型不同 曲线和直线", p1.type, " ", p2.type);
                return SC(lines, insertPoints);
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

// 曲线和直线的相交
const SC = (
    originLines: Lines,
    insertPoints: (InsertPoint | undefined)[]
): Lines[] => {
    // 先拿到插入点的位置信息
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

    // 根据信息进行下面的工作

    const firstInsert = insertPWidthIndex[0];
    const secondInsert = insertPWidthIndex[1];

    console.log(firstInsert);

    switch (firstInsert.insertP.type) {
        case "insertPoint-line": {
            if (secondInsert.insertP.type !== "insertPoint-Curve") {
                console.log("前面的判断除了问题，这是直线和直线相交");
            }
            // 第一个交点是直线，第二个交点是曲线
            console.log("这里是直线和曲线的相交");
            // 先拿到切割出来的线段,中央
            const cutLine1 = [...originLines].slice(
                firstInsert.index,
                secondInsert.index + 1
            );

            // 拿出头部
            const head = cutLine1.shift() as Straight;

            // 生成新的头部
            const newHead: Straight = {
                type: "line",
                points: [
                    [...firstInsert.insertP.points[0]] as Pos,
                    [...head.points[1]] as Pos
                ]
            };
            // 放回头部
            cutLine1.unshift(newHead);
            // 拿出尾部
            const tail = cutLine1.pop() as Curve;

            const originSeocndLine = originLines[secondInsert.index] as Curve;

            // 原本的半径
            const r = originSeocndLine.r;

            // 圆心的点
            const midPoint = [...originSeocndLine.points[3]] as Pos;

            // 计算第一个线段的bezier 曲线 的 外圈 的 交点
            const firstOutsideInsertPoint = util.getBezierPoint(
                midPoint,
                //初始的第二条线段的交点的起点
                [...tail.points[0]] as Pos,
                [...secondInsert.insertP.points[0]] as Pos
            ).point[1];

            // 第一个bezier曲线的节点
            const firstBezier = firstOutsideInsertPoint[0];

            const firstCurve: Curve = {
                type: "curve",
                r: r,
                points: [
                    [...tail.points[0]] as Pos,
                    [...secondInsert.insertP.points[0]] as Pos,
                    firstBezier,
                    midPoint
                ]
            };

            const closeLine: Straight = {
                type: "line",
                points: [
                    secondInsert.insertP.points[0],
                    firstInsert.insertP.points[0]
                ]
            };

            // 第一个切割出来的线段
            cutLine1.push(firstCurve, closeLine);
            // 计算第二个线段的bezier 曲线 的 外圈 的 交点
            const secondOutsideInsertPoint = util.getBezierPoint(
                midPoint,
                secondInsert.insertP.points[0],
                //初始的第二条相交线段的终点
                originSeocndLine.points[1]
            ).point[1];

            // 第2个bezier曲线的节点
            const secondBezier = secondOutsideInsertPoint[0];

            const cutline2 = [
                ...originLines.slice(secondInsert.index),
                ...originLines.slice(0, firstInsert.index + 1)
            ];

            // 拿出头部信息
            cutline2.shift() as Curve;

            const newHead2: Curve = {
                type: "curve",
                r: r,
                points: [
                    // 首要的交点
                    [...secondInsert.insertP.points[0]] as Pos,
                    // 原先线段的第二个交点
                    [...originSeocndLine.points[1]] as Pos,
                    // bezier曲线的交点
                    [...secondBezier] as Pos,
                    // 圆形的中心点
                    [...midPoint] as Pos
                ]
            };

            cutline2.unshift(newHead2);
            // 拿出尾部的信息
            const tail2 = cutline2.pop() as Straight;

            const newTail2: Straight = {
                type: "line",
                points: [
                    [...tail2.points[0]] as Pos,
                    [...firstInsert.insertP.points[0]] as Pos
                ]
            };

            cutline2.push(newTail2, closeLine);

            return [cutLine1, cutline2];
        }
        case "insertPoint-Curve": {
            if (secondInsert.insertP.type !== "insertPoint-line") {
                console.log("前面的判断出现了问题，这是直线和直线相交");
            }

            // 第一个交点是曲线，第二个交点是直线
            console.log("这里是直线和曲线的相交");

            const originFirstLine = originLines[firstInsert.index] as Curve;

            // 原本的半径
            const r = originFirstLine.r;

            // 圆心的点
            const midPoint = [...originFirstLine.points[3]] as Pos;

            const closeLine: Straight = {
                type: "line",
                points: [
                    secondInsert.insertP.points[0],
                    firstInsert.insertP.points[0]
                ]
            };

            // 先拿到切割出来的线段,相对整个序列来说是中间的
            const cutLine1 = [...originLines].slice(
                firstInsert.index,
                secondInsert.index + 1
            );

            // 拿出头部
            const head = cutLine1.shift() as Straight;
            // 拿出尾部
            const tail = cutLine1.pop() as Curve;
            // 计算第一个线段的bezier 曲线 的 外圈 的 交点
            const firstOutsideInsertPoint = util.getBezierPoint(
                midPoint,
                //初始的第一条线段的起点
                [...firstInsert.insertP.points[0]] as Pos,
                [...head.points[1]] as Pos
            ).point[1];

            // 第一个bezier曲线的节点
            const firstBezier = firstOutsideInsertPoint[0];
            // 生成新的头部
            const newHead: Curve = {
                type: "curve",
                r: r,
                points: [
                    [...firstInsert.insertP.points[0]] as Pos,
                    [...head.points[1]] as Pos,
                    firstBezier,
                    midPoint
                ]
            };
            // 放回第一个交叉的头部
            cutLine1.unshift(newHead);

            // 内联的尾部
            const newTail: Straight = {
                type: "line",
                points: [
                    [...tail.points[0]] as Pos,
                    [...secondInsert.insertP.points[0]] as Pos
                ]
            };

            cutLine1.push(newTail, closeLine);

            // 这里开始下面的线段
            const cutline2 = [
                ...originLines.slice(secondInsert.index),
                ...originLines.slice(0, firstInsert.index + 1)
            ];

            // 移除头部信息
            const head1 = cutline2.shift() as Straight;

            // 移除尾部的信息
            const tail1 = cutline2.pop() as Curve;

            const newHead1: Straight = {
                type: "line",
                points: [
                    [...secondInsert.insertP.points[0]] as Pos,
                    [...head1.points[1]] as Pos
                ]
            };

            cutline2.unshift(newHead1);

            const secondOutsideInsertPoint = util.getBezierPoint(
                midPoint,
                //初始的第一条线段的起点
                [...tail1.points[0]] as Pos,
                [...firstInsert.insertP.points[0]] as Pos
            ).point[1];

            // 第一个bezier曲线的节点
            const secondBezier = secondOutsideInsertPoint[0];

            //  新的尾部
            const newTail1: Curve = {
                type: "curve",
                r: r,
                points: [
                    [...tail1.points[0]] as Pos,
                    [...firstInsert.insertP.points[0]] as Pos,
                    [...secondBezier] as Pos,
                    [...midPoint] as Pos
                ]
            };

            cutline2.push(newTail1, closeLine);

            return [cutLine1, cutline2];
        }
    }

    return [];
};

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
                    [...midPoint] as Pos,
                    [...originStartP] as Pos,
                    [...firstP] as Pos
                ).point[1];

                // 第一个bezier曲线的节点
                const firstBezier = firstOutsideInsertPoint[0];

                // 计算第二个bezier曲线 的 外圈 的 外交点
                const secondBezier = util.getBezierPoint(
                    [...midPoint] as Pos,
                    [...firstP] as Pos,
                    [...secondP] as Pos
                ).point[1][0];

                // 计算第三个线段的bezier 的 外圈 的 节点
                const thirdBezier = util.getBezierPoint(
                    [...midPoint] as Pos,
                    [...secondP] as Pos,
                    [...originEndP] as Pos
                ).point[1][0];

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

// 最终逻辑,是曲线和曲在不同的线段上的逻辑,这部分的逻辑要进行修改
const CCD = (
    originLines: Lines,
    insertPoints: (InsertPoint | undefined)[]
): Lines[] => {
    // 曲线和曲线在不同的线段上的连线
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

    // 第一个交点
    const firstInsertP = insertPWidthIndex[0];

    // 第一条线段的原型
    const originFirstLine = originLines[firstInsertP.index] as Curve;

    // 记录第一个交点左边的bezier的交点
    const firstLeftBezier = util.getBezierPoint(
        originFirstLine.points[3],
        [...originFirstLine.points[0]] as Pos,
        [...firstInsertP.insertP.points[0]] as Pos
    ).point[1][0];

    const firstLeft: Curve = {
        type: "curve",
        r: originFirstLine.r,
        points: [
            [...originFirstLine.points[0]] as Pos,
            [...firstInsertP.insertP.points[0]] as Pos,
            firstLeftBezier,
            [...originFirstLine.points[3]] as Pos
        ]
    };

    // 记录第一个交点右边的bezier 的交点
    const firstRightBezier = util.getBezierPoint(
        originFirstLine.points[3],
        [...firstInsertP.insertP.points[0]] as Pos,
        [...originFirstLine.points[1]] as Pos
    ).point[1][0];

    const firstRight: Curve = {
        type: "curve",
        r: originFirstLine.r,
        points: [
            [...firstInsertP.insertP.points[0]] as Pos,
            [...originFirstLine.points[1]] as Pos,
            firstRightBezier,
            originFirstLine.points[3]
        ]
    };

    // 第二个交点
    const secondInsertP = insertPWidthIndex[1];

    // 原型
    const originSecondLine = originLines[secondInsertP.index] as Curve;

    // 记录第一个交点左边的bezier的交点
    const secondLeftBezier = util.getBezierPoint(
        originSecondLine.points[3],
        [...originSecondLine.points[0]] as Pos,
        [...secondInsertP.insertP.points[0]] as Pos
    ).point[1][0];

    const secondLeft: Curve = {
        type: "curve",
        r: originSecondLine.r,
        points: [
            [...originSecondLine.points[0]] as Pos,
            [...secondInsertP.insertP.points[0]] as Pos,
            secondLeftBezier,
            [...originSecondLine.points[3]] as Pos
        ]
    };

    const secondRightBezier = util.getBezierPoint(
        originSecondLine.points[3],
        [...secondInsertP.insertP.points[0]] as Pos,
        [...originSecondLine.points[1]] as Pos
    ).point[1][0];

    const secondRight: Curve = {
        type: "curve",
        r: originSecondLine.r,
        points: [
            [...secondInsertP.insertP.points[0]] as Pos,
            [...originSecondLine.points[1]] as Pos,
            secondRightBezier,
            originSecondLine.points[3]
        ]
    };

    const cutLine1 = [...originLines].slice(
        firstInsertP.index + 1,
        secondInsertP.index
    );

    const cutLine2 = [
        ...originLines.slice(secondInsertP.index + 1),
        ...originLines.slice(0, firstInsertP.index)
    ];

    cutLine1.unshift(firstRight);
    cutLine1.push(secondLeft);

    cutLine2.unshift(secondRight);
    cutLine2.push(firstLeft);

    const closeLine: Straight = {
        type: "line",
        points: [
            [...firstInsertP.insertP.points[0]] as Pos,
            [...secondInsertP.insertP.points[0]] as Pos
        ]
    };

    cutLine1.push(closeLine);
    cutLine2.push(closeLine);

    return [cutLine1, cutLine2];
};
