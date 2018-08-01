import { pointAtLine } from "./getIntersection";

type Pos = [number, number];

function getPoint(
    [cx, cy]: Pos,
    r: number,
    [stx, sty]: Pos,
    [edx, edy]: Pos
): { res: boolean; first: Pos; second: Pos } {
    // 求直线
    const k = (edy - sty) / (edx - stx);
    const b = edy - k * edx;

    //列方程
    let x1: number, y1: number, x2: number, y2: number;
    let c = cx * cx + (b - cy) * (b - cy) - r * r;
    let a = 1 + k * k;
    let b1 = 2 * cx - 2 * k * (b - cy);

    let tmp = Math.sqrt(b1 * b1 - 4 * a * c);
    x1 = (b1 + tmp) / (2 * a);
    y1 = k * x1 + b;
    x2 = (b1 - tmp) / (2 * a);
    y2 = k * x2 + b;

    const p: {
        res: boolean;
        first: Pos;
        second: Pos;
    } = {
        res: false,
        first: [0, 0],
        second: [0, 0]
    };

    // 任何一个点是NaN那么都要返回一个false
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        return p;
    }

    // 修正参数
    // console.log(Math.pow(x1 - cx, 2) + Math.pow(y1 - cy, 2) - Math.pow(r, 2));

    // 当有结果的时候返回正确的结果
    if (Math.pow(x1 - cx, 2) + Math.pow(y1 - cy, 2) - Math.pow(r, 2) < 7) {
        p.res = true;
        p.first = [x1, y1];
        p.second = [x2, y2];
    }
    return p;
}

export const getInsCircle = (
    line1: Pos,
    line2: Pos,
    midPoint: Pos,
    r: number
): { res: boolean; point: [Pos, Pos] } => {
    // 得到可能的值，等下对值进行验证，得到的验证是否正确
    const maybe = getPoint(midPoint, r, line1, line2);

    // 得到了输出到结果，并且对结果进行验证
    if (
        maybe.res &&
        pointAtLine(maybe.first, line1, line2, 6) &&
        pointAtLine(maybe.second, line1, line2, 6)
    ) {
        console.log(
            `line is inside the circle ${pointAtLine(
                maybe.first,
                line1,
                line2,
                6
            )}

            ${pointAtLine(maybe.second, line1, line2, 6)}`
        );

        return { res: true, point: [maybe.first, maybe.second] };
    } else {
        console.log("line is not inside the circle");

        return { res: false, point: [[0, 0], [0, 0]] };
    }
};
