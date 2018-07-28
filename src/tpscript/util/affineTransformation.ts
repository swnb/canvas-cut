import { getAbsAB, fixValue } from "./helper";

type Pos = [number, number];

// 仿射变换
const affineTransform = (
    startPoint: Pos,
    midPoint: Pos,
    movePoint: Pos,
    poses: Pos
) => {
    // 初始的向量
    const startLine: Pos = [
        startPoint[0] - midPoint[0],
        startPoint[1] - midPoint[1]
    ];

    // 偏移的向量
    const moveLine: Pos = [
        movePoint[0] - midPoint[0],
        movePoint[1] - midPoint[1]
    ];

    // 点乘
    const ab = startLine[0] * moveLine[0] + startLine[1] * moveLine[1];

    // 叉乘
    const aXb = startLine[0] * moveLine[1] + startLine[1] * moveLine[0];

    // 向量的模
    const abs = getAbsAB(startLine, moveLine, false);

    // 实际生成的cos
    const cosDeg = fixValue(ab / abs);
    // 生成的sin
    const sinDeg = fixValue(aXb / abs);

    console.log(cosDeg, sinDeg);
};
