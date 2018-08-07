import { Circle, Neo, createNeo } from "./objects/createobj";

import { AllObj } from "./canvas";

import util from "./util/util";

import { sliceUpdate } from "./sliceUpdate";

import { Center } from "./communication/commu";

type Pos = [number, number];

export default (allObj: AllObj[], lineA1: Pos, lineA2: Pos): Array<Pos[][]> =>
    allObj.map((obj: AllObj) => {
        // 一个管道的截取操作，这部分要分割圆形，这一部分的代码需要重新更换一下就可以了
        if (obj.objType.type === "Ellipse") {
            const [_, [middleX, middleY]] = obj.polygonPoints as [Pos, Pos];
            // 圆形的r
            const r = (<Circle>obj).r;
            const midPoint: Pos = [middleX, middleY];

            console.log("this is middle points ", middleX, " ", middleY);

            const resultWithInsert = util.getInsCircle(
                lineA1,
                lineA2,
                midPoint,
                r
            );

            // 错误结果直接返回
            if (!resultWithInsert.res) return [];

            // 得到了两个数据点，都是图形的交点
            const [pointOne, pointTwo]: [Pos, Pos] = resultWithInsert.point;

            // 不得已而为之，最后的结果就是这个样子
            return [[pointOne, pointTwo, midPoint]];
        }

        // 王的诞生
        if (obj.objType.type === "Sector") {
            // 生成 终结一起的混血王者 ->neo
            return [];
        }

        // 王的转换
        if (obj.objType.type === "Hybrid") {
            // 这是奇迹，这是神迹，也是最完美的模型，我把它叫做neo
            // neo 它生下来就是全能的，swnb将赋予它所有能力，他能调度自己，和处理自己的状况，进行伪装，这是其他物体不能做到的，只有一种办法可以毁灭它，那就是重构

            const emit = Center.setNewEvent("neo");

            const neos = sliceUpdate(lineA1, lineA2, (<Neo>obj).lines);

            const Neos = neos.map(lines =>
                createNeo(
                    (<Neo>obj).context,
                    [0, 0],
                    (<Neo>obj).width,
                    (<Neo>obj).height,
                    (<Neo>obj).r,
                    (<Neo>obj).circlePoint,
                    lines
                )
            );

            emit(Neos[0]);

            emit(Neos[1]);

            return Array(4);
        }

        // 聚合 将生成一个一个的数据点阵转换成线，考虑用映射该信这段代码
        return (
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
                        lineA2,
                        ele[0],
                        ele[1]
                    );

                    if (result.res) {
                        return result.point;
                    } else {
                        return undefined;
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
    });
