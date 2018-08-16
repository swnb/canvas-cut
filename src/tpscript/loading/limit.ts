export type limit = (n: number) => number;

export default (
	interval: [number, number],
	speed: number,
	increaseOrReduce: boolean = true,
	loop: number | undefined = undefined
): ((n: number) => number) => {
	let flag = increaseOrReduce;

	let cycleNumber = 0;

	return (n: number): number => {
		// 循环的次数已经够了，让他停止
		if (loop && cycleNumber >= loop) {
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
