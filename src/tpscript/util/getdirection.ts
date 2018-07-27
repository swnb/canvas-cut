type Pos = [number, number];

export const getDirection = (
    startPos: Pos,
    endPos: Pos,
    points: Pos[]
): Pos => {
    const [ey, ex] = [endPos[0], endPos[1]];
    const [sy, sx] = [startPos[0], startPos[1]];

    const k = parseFloat(((ey - sy) / (ex - sx)).toFixed(3));

    // console.log(ey - sy, ex - sx);
    // console.log(k);

    const proportion = parseFloat((-1 / k).toFixed(3));

    // let direction: [Pos, Pos] = [[1, proportion], [-1, -proportion]];
    let direction: Pos = [1, proportion];

    const long = 20;

    const somePoints = points.find(
        (ele: Pos): boolean =>
            (ele[0] === startPos[0] && ele[1] === startPos[1]) ||
            (ele[0] === endPos[0] && ele[1] === endPos[1])
                ? false
                : true
    ) as Pos;

    // x1*y2-x2*y1

    let ele: Pos;

    console.log(somePoints, direction);

    console.log(somePoints[0] * direction[1] - direction[0] * somePoints[1]);

    if (somePoints[0] * direction[1] - direction[0] * somePoints[1] > 0) {
        console.log("right");
        ele = direction;
    } else {
        ele = [-direction[0], -direction[1]];
        console.log("reverse");
    }

    // console.log(proportion);
    const x = parseFloat(
        Math.sqrt(Math.pow(long, 2) / (Math.pow(proportion, 2) + 1)).toFixed(3)
    );

    // console.log(x);

    const y = proportion * x;

    // console.log(y);

    // console.log(x * ele[0], y * ele[0]);

    return [x * ele[0], y * ele[0]];

    //修正
    // direction = direction.map(
    //     (ele: Pos): Pos => {
    //         const proportion = parseFloat((ele[1] / ele[0]).toFixed(3));
    //         // console.log(proportion);
    //         const x = parseFloat(
    //             Math.sqrt(
    //                 Math.pow(long, 2) / (Math.pow(proportion, 2) + 1)
    //             ).toFixed(3)
    //         );

    //         // console.log(x);

    //         const y = proportion * x;

    //         // console.log(y);

    //         // console.log(x * ele[0], y * ele[0]);

    //         return [x * ele[0], y * ele[0]];
    //     }
    // ) as [Pos, Pos];

    // return direction;
};
