export type limit = (n: number) => number;

export default (
	interval: [number, number],
	speed: number,
	increaseOrReduce: boolean = true,
	loop?: number,
	cb?: () => void
): ((n: number) => number) => {
	let flag = increaseOrReduce;

	let cycleNumber = 0;

	return (n: number): number => {
		// 循环的次数已经够了，不再增加
		if (loop && cycleNumber >= loop) {
			cb ? cb() : void 0;
			return n;
		}

		if (flag) {
			// add
			n += speed;
			if (n >= interval[1]) {
				cycleNumber += 1;
				flag = false;
			}
		} else {
			// reduce
			n -= speed;
			if (n <= interval[0]) {
				cycleNumber += 1;
				flag = true;
			}
		}
		return n;
	};
};
