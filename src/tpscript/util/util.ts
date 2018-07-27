import { getAngle, getDeg } from "./getdeg";

import { getIntersection } from "./getIntersection";

import { getDirection } from "./getdirection";

import { isInsideArea } from "./insidearea";

const isInsideCircle = (
    x: number,
    y: number,
    pos: [number, number, number]
): boolean =>
    Math.pow(pos[0] - x, 2) + Math.pow(pos[1] - y, 2) <= Math.pow(pos[2], 2)
        ? true
        : false;

// 获取垂直向量的向量
export default {
    // 是否在元素的里面
    isInsideCircle,
    // 是否在一个多边形区域内
    isInsideArea,
    // 获取角度
    getAngle,
    // 得到角度
    getDeg,
    // 得到交点
    getIntersection,
    // 获取垂直的向量，和之前的向量垂直
    getDirection
};
