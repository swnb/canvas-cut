// 获取点阵的元素信息并且提取出来
type Pos = [number, number];

export const getWdithHeight = (points: Pos[]): [Pos, [number, number]] => {
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

    // 初始化的点阵的信息，用来定位控制点的坐标位置,[width,height]
    return [
        startPoints,
        [
            maxPointWithSmallestPoint[1][0] - maxPointWithSmallestPoint[0][0],
            maxPointWithSmallestPoint[1][1] - maxPointWithSmallestPoint[0][1]
        ]
    ];
};
