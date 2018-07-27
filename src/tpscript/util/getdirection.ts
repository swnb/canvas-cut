type Pos = [number, number];

const getCosDeg = (linA: Pos, linB: Pos): number => {
    const axb = linA[0] * linB[0] + linA[1] * linB[1];

    const ab =
        Math.sqrt(Math.pow(linA[0], 2) + Math.pow(linA[1], 2)) *
        Math.sqrt(Math.pow(linB[0], 2) + Math.pow(linB[1], 2));
    return parseFloat(axb.toFixed(3)) / parseFloat(ab.toFixed(3));
};

export const getDirection = (
    startPos: Pos,
    endPos: Pos,
    points: Pos[]
): Pos => {
    const [ex, ey] = [endPos[0], endPos[1]];
    const [sx, sy] = [startPos[0], startPos[1]];

    const k = parseFloat(((ey - sy) / (ex - sx)).toFixed(3));
    const proportion = parseFloat((-1 / k).toFixed(3));

    let direction: Pos = [1, proportion];

    const somePoints = points.find(
        (ele: Pos): boolean =>
            (ele[0] === startPos[0] && ele[1] === startPos[1]) ||
            (ele[0] === endPos[0] && ele[1] === endPos[1])
                ? false
                : true
    ) as Pos;

    const middlePoints = [(ex + sx) / 2, (ey + sy) / 2];

    const someLine: Pos = [
        somePoints[0] - middlePoints[0],
        somePoints[1] - middlePoints[1]
    ];

    console.log("some line ", someLine);

    console.log("direction ", direction);

    let ele: Pos;

    console.log(someLine[0] * direction[1] - direction[0] * someLine[1]);

    // 线段的长度
    const long = 20;

    if (getCosDeg(someLine, direction) > 0) {
        console.log("right");
        ele = direction;
    } else {
        ele = [-direction[0], -direction[1]];
        console.log("reverse");
    }

    const x = parseFloat(
        Math.sqrt(Math.pow(long, 2) / (Math.pow(proportion, 2) + 1)).toFixed(3)
    );

    const y = proportion * x;

    return [x * ele[0], y * ele[0]];
};
