import { fixValue } from "./helper";
import { getInsCircle } from "./getIntersectionCircle";

type Pos = [number, number];

const sortSmallToLarge = (poses: [Pos, Pos], reference: Pos): [Pos, Pos] => {
    const [one, two] = poses;

    const oner =
        Math.pow(one[0] - reference[0], 2) + Math.pow(one[1] - reference[1], 2);

    const twor =
        Math.pow(two[0] - reference[0], 2) + Math.pow(two[1] - reference[1], 2);

    if (oner > twor) {
        // 反向排序,这里是为了结构化清晰写的复制，javascript在数组上的处理是完全错误的设计，不应该改变原本的数组
        poses = poses.reverse() as [Pos, Pos];
    }
    return poses;
};

// 根据两个点和圆心求出在一个圆形上面的点，这个点最为贝赛尔曲线的交点输出
export const getBezierPoint = (
    midPoint: Pos,
    firstPoint: Pos,
    secondPoint: Pos
): { res: boolean; point: [[Pos, Pos], [Pos, Pos]] } => {
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

    // 交点连线半径的一半
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
    const outsideInsertPoints = getInsCircle(
        midPoint,
        midPointAtLine,
        midPoint,
        r + c,
        true
    );

    // 上面的点阵就是外圈圆形和它的交点，线面求解的就是和内部圆形的交点
    const insideInsertPoints = getInsCircle(
        midPoint,
        midPointAtLine,
        midPoint,
        r,
        true
    );

    if (insideInsertPoints.res && outsideInsertPoints.res) {
        // 返回计算的所有数据，让调用者自己来选择要做什么
        return {
            res: true,
            point: [
                sortSmallToLarge(insideInsertPoints.point, firstPoint),
                sortSmallToLarge(outsideInsertPoints.point, firstPoint)
            ]
        };
    } else {
        // 返回正常的错误数据
        return {
            res: false,
            point: [[[0, 0], [0, 0]], [[0, 0], [0, 0]]]
        };
    }
};
