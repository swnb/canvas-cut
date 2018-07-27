type Pos = [number, number];

interface Res {
    res: boolean;
    point?: Pos;
}

export const getIntersection = (
    la1: Pos,
    la2: Pos,
    lb1: Pos,
    lb2: Pos
): Res => {
    const result: Res = {
        res: false,
        point: undefined
    };

    if (lb2[0] === lb1[0]) {
        const x = lb1[0];
        const ak = (la2[1] - la1[1]) / (la2[0] - la1[0]);
        const y =
            parseFloat((ak * x).toFixed(3)) +
            (la1[0] * la2[1] - la2[0] * la1[1]) / (la1[0] - la2[0]);

        // console.log(x, y);

        if (
            pointAtLine([x, y], la1, la2, 12) &&
            pointAtLine([x, y], lb1, lb2, 12)
        ) {
            result.res = true;
        }
        result.point = [x, y];
        return result;
    }

    const ak = (la2[1] - la1[1]) / (la2[0] - la1[0]);
    const bk = (lb2[1] - lb1[1]) / (lb2[0] - lb1[0]);

    // 加速他的计算，避免损耗
    if (ak === bk) return result;

    const ab = (la1[0] * la2[1] - la2[0] * la1[1]) / (la1[0] - la2[0]);
    const bb = (lb1[0] * lb2[1] - lb2[0] * lb1[1]) / (lb1[0] - lb2[0]);
    // console.log("a直线方程: y=" + ak + "x + " + ab);
    // console.log("b直线方程: y=" + bk + "x + " + bb);

    // 求解方程
    const x = (bb - ab) / (ak - bk);
    const y = ak * x + ab;

    if (pointAtLine([x, y], la1, la2, 6) && pointAtLine([x, y], lb1, lb2, 6)) {
        result.res = true;
        result.point = [x, y];
        return result;
    } else {
        return result;
    }
};

const pointAtLine = (
    point: Pos,
    startPoint: Pos,
    endPoint: Pos,
    prefix: number
): boolean => {
    const startToPoint = Math.sqrt(
        Math.pow(point[0] - startPoint[0], 2) +
            Math.pow(point[1] - startPoint[1], 2)
    );
    const endToPoint = Math.sqrt(
        Math.pow(point[0] - endPoint[0], 2) +
            Math.pow(point[1] - endPoint[1], 2)
    );
    const startToEnd = Math.sqrt(
        Math.pow(startPoint[0] - endPoint[0], 2) +
            Math.pow(startPoint[1] - endPoint[1], 2)
    );

    // 打印出来误差
    // console.log(Math.abs(startToEnd - endToPoint - startToPoint));

    return Math.abs(startToEnd - endToPoint - startToPoint) < prefix
        ? true
        : false;
};
