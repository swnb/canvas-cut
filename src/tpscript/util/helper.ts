type Pos = [number, number];

export const fixValue = (num: number): number => parseFloat(num.toFixed(3));

export const getAbsAB = (LinA: Pos, LinB: Pos, fix: boolean = true) => {
    const AbsLinA = Math.sqrt(Math.pow(LinA[0], 2) + Math.pow(LinA[1], 2));
    const AbsLinB = Math.sqrt(Math.pow(LinB[0], 2) + Math.pow(LinB[1], 2));

    // 不修正直接返回
    if (!fix) return AbsLinA * AbsLinB;

    return fixValue(fixValue(AbsLinA) * fixValue(AbsLinB));
};
