import Obj from "./object";

import util from "./util/util";

type Pos = [number, number];

export default (allObj: Obj[], lineA1: Pos, LineA2: Pos): Array<Pos[][]> =>
    allObj.map(obj =>
        // 聚合 生成一个一个的点阵
        obj.polygonPoints
            .reduce(
                (
                    previousEles: Array<[Pos, Pos]>,
                    ele: Pos,
                    index: number,
                    array: Array<Pos>
                ): Array<[Pos, Pos]> => {
                    if (index == array.length - 1) {
                        previousEles.push([ele, array[0]]);
                    } else {
                        previousEles.push([ele, array[index + 1]]);
                    }

                    return previousEles;
                },
                [] as Array<[Pos, Pos]>
            )
            .map((ele: [Pos, Pos]) => {
                const result = util.getIntersection(
                    lineA1,
                    LineA2,
                    ele[0],
                    ele[1]
                );

                if (result.res) {
                    return result.point;
                }
            })
            .reduce(
                (
                    previousPoints: Array<{
                        insertIndex: number;
                        pos: Pos;
                    }>,
                    ele: Pos | undefined,
                    index: number
                ): Array<{ insertIndex: number; pos: Pos }> => {
                    // ele 不是空的，表示他是一个点,那么传入点阵的信息
                    if (ele) {
                        const insertPoint = {
                            insertIndex: index,
                            pos: ele
                        };
                        previousPoints.push(insertPoint);
                    }
                    return previousPoints;
                },
                []
            )
            .map(ele => {
                console.log("insert number");
                console.log(ele);
                return ele;
            })
            // 这个管道的数据在这里应当只有两个,这里 只考虑4边形状，不考虑多边形，那么输出的就只能有两个
            // 这里的代码需要重构，重写下面的代码，问题：无法涵盖你需要的所有东西，并且处理的问题过多，导致混乱
            .map(
                (
                    ele: { insertIndex: number; pos: Pos },
                    index: number,
                    array: Array<{ insertIndex: number; pos: Pos }>
                ): Pos[] => {
                    //只有一分为2的情况,第一种和第2种
                    const { insertIndex, pos } = ele;
                    switch (index) {
                        case 0: {
                            const pieceOfArray: Pos[] = [];
                            pieceOfArray.push(pos);
                            pieceOfArray.push(
                                ...obj.polygonPoints.slice(
                                    insertIndex + 1,
                                    array[1].insertIndex + 1
                                )
                            );
                            pieceOfArray.push(array[1].pos);

                            // 确定偏移的方向
                            const directs = util.getDirection(
                                array[0].pos,
                                array[1].pos
                            );

                            pieceOfArray.push(directs[1]);

                            return pieceOfArray;
                        }
                        case 1: {
                            const pieceOfArray: Pos[] = [];
                            pieceOfArray.push(
                                ...obj.polygonPoints.slice(
                                    0,
                                    array[0].insertIndex + 1
                                )
                            );
                            pieceOfArray.push(array[0].pos);
                            pieceOfArray.push(pos);
                            pieceOfArray.push(
                                ...obj.polygonPoints.slice(
                                    insertIndex + 1,
                                    obj.polygonPoints.length
                                )
                            );

                            // 确定偏移的方向
                            const directs = util.getDirection(
                                array[0].pos,
                                array[1].pos
                            );

                            pieceOfArray.push(directs[0]);
                            return pieceOfArray;
                        }
                        default:
                            return [];
                    }
                }
            )
            .filter(arr => arr.length > 0)
    );
