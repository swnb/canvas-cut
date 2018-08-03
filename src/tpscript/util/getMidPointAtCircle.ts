import { fixValue } from "./helper";
import { getInsCircle } from "./getIntersectionCircle";

type Pos = [number, number];
// 根据两个点和圆心求出在一个圆形上面的点，这个点最为贝赛尔曲线的交点输出
export const getBezierPoint = (
    midPoint: Pos,
    firstPoint: Pos,
    secondPoint: Pos
): { res: boolean; point: [Pos, Pos] } => {
    // 先根据firstoint和secondPoint求出两者的中心点

    const midPointAtLine: Pos = [
        (firstPoint[0] + secondPoint[0]) / 2,
        (firstPoint[1] + secondPoint[1]) / 2
    ];

    const r = fixValue(
        Math.sqrt(
            Math.pow(firstPoint[0] - midPoint[0], 2) +
                Math.pow(firstPoint[1] - midPoint[1], 2)
        )
    );

    // 交点连线半径的一般
    const powB = fixValue(
        (Math.pow(firstPoint[0] - secondPoint[0], 2) +
            Math.pow(firstPoint[1] - secondPoint[1], 2)) /
            4
    );

    // 获取的短中垂线和圆心的距离，用数学公式推导进行下一步的运算
    const a = fixValue(Math.sqrt(Math.pow(r, 2) - powB));

    // 用方程式求解简化，可以得到这个方程，这个方程就不解释了，a和b其实是一个假象的短距离，需要这个公式的推导过程，联系作者swnb
    const c = fixValue(Math.pow(r, 2) / a) - r;

    // 这里用了些小技巧，将半径提升，计算出交点，这个交点在圆形的外部，做了些延伸，数学模型的建立非常的完美，看不懂很正常
    return getInsCircle(midPoint, midPointAtLine, midPoint, r + c, true);
};
