export type limit = (n: number) => number;

export default (
	interval: [number, number],
	speed: number,
	increaseOrReduce: boolean = true
): ((n: number) => number) => {
	let flag = increaseOrReduce;

	return (n: number): number => {
		if (flag) {
			// add
			n += speed;
			if (n >= interval[1]) {
				flag = false;
			}
		} else {
			// reduce
			n -= speed;
			if (n <= interval[0]) {
				flag = true;
			}
		}
		return n;
	};
};
