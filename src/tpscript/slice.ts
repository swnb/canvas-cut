import { Obj, SelfCreateObj } from "./object";

import util from "./util/util";

type Pos = [number, number];

export default (
    allObj: (Obj | SelfCreateObj)[],
    lineA1: Pos,
    LineA2: Pos
): Array<Pos[][]> =>
    allObj.map((obj: Obj | SelfCreateObj) =>
        // 聚合 将生成一个一个的数据点阵转换成线，考虑用映射该信这段代码
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
            // 得到交点的代码，在这个部分 的代码处理的逻辑较少，考虑加入一些判断的语句
            // 让一般情况下的输出是原来的矩阵
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
            // 这是一个图形的聚合，实际上得到的代码是一种通讯介质，用管道的形式将它压缩，输出
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
            // 之后删除这个打印的语句
            // .map(ele => {
            //     console.log("insert number");
            //     console.log(ele);
            //     return ele;
            // })
            // 这个管道的数据在这里应当只有两个,这里 只考虑4边形状，不考虑多边形，那么输出的就只能有两个
            // 这里的代码需要重构，重写下面的代码，问题：无法涵盖你需要的所有东西，并且处理的问题过多，导致混乱
            .filter(
                (
                    _e: { insertIndex: number; pos: Pos },
                    _i: number,
                    array: Array<{ insertIndex: number; pos: Pos }>
                ): boolean => {
                    return array.length === 2 ? true : false;
                }
            )
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
                            pieceOfArray.push(array[0].pos, array[1].pos);

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
                            pieceOfArray.push(array[0].pos, array[1].pos);
                            return pieceOfArray;
                        }
                        default:
                            return [];
                    }
                }
            )
    );
