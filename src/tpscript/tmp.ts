function getPoint(
    cx: number,
    cy: number,
    r: number,
    stx: number,
    sty: number,
    edx: number,
    edy: number
) {
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

    //判断求出的点是否在圆上
    // const res = Math.pow(x1 - cx, 2) + Math.pow(y1 - cy, 2);
    // const res = Math.pow(x1 - cx, 2) + Math.pow(y1 - cy, 2);

    const p: {
        res: boolean;
        x: number;
        y: number;
    } = {
        res: false,
        x: 0,
        y: 0
    };

    if (
        Math.pow(x1 - cx, 2) + Math.pow(y1 - cy, 2) - Math.pow(r, 2) <
        Number.EPSILON
    ) {
        p.x = x1;
        p.y = y1;
        console.log(x1, y1, x2, y2);
    }
    return p;
}
//测试
let s = getPoint(10, 20, 50, 34, 45, 12, 34);
// 结果:{x: 48.2952871010182, y: 52.1476435505091}
console.log(s);
