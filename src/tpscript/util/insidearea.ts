type Pos = [number, number];

// 对于数据点阵来进行运算和深度的加速
const isInsidePolygon = (point: Pos, poses: Pos[]): boolean => {
    return poses
        .reduce(
            (
                previous: Array<[Pos, Pos]>,
                pos: Pos,
                index: number,
                array: Pos[]
            ): Array<[Pos, Pos]> => {
                if (index === array.length - 1) {
                    previous.push([pos, array[0]]);
                } else {
                    previous.push([pos, array[index + 1]]);
                }
                return previous;
            },
            [] as Array<[Pos, Pos]>
        )
        .every(
            (ele: [Pos, Pos]): boolean => {
                const origin = ele[0];
                const line = [ele[1][0] - origin[0], ele[1][1] - origin[1]];
                const lineP = [point[0] - origin[0], point[1] - origin[1]];
                const lineXLineP = line[0] * lineP[1] - line[1] * lineP[0];
                lineXLineP === 0 ? console.log("000") : void 0;
                return lineXLineP > 0 ? true : false;
            }
        );
};

// 是否在四边形状的内部，不在退出
export const isInsideArea = (
    point: Pos,
    startPos: Pos,
    width: number,
    height: number,
    pos: Pos[]
) => {
    // 在区域的内部
    if (
        startPos[0] < point[0] &&
        point[0] <= startPos[0] + width &&
        startPos[1] < point[1] &&
        point[1] < startPos[1] + height
    ) {
        return isInsidePolygon(point, pos);
    } else {
        // 不再区域内部的话
        return false;
    }
};
