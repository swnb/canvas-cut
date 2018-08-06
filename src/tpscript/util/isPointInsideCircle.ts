type Pos = [number, number];
//  判断一个点在圆弧上
export const isPointInsideCircle = (
    p: Pos,
    firstOrSecondPoint: Pos,
    direction: [number, number]
) => {
    const someVector = [
        p[0] - firstOrSecondPoint[0],
        p[1] - firstOrSecondPoint[1]
    ];

    const axb = someVector[0] * direction[0] + someVector[1] * direction[1];

    //  因为axb的正和负取决cos ，相当于直接判断了cos的正负
    return axb > 0 ? true : false;
};
