// 获取角度，需要重新写
export const getAngle = (
	centerX: number,
	centerY: number,
	evX: number,
	evY: number
) => {
	// 获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
	const x = Math.abs(centerX - evX);
	const y = Math.abs(centerY - evY);
	const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	const cos = y / z;
	// let radina = parseFloat(Math.acos(cos).toFixed(3)); //用反三角函数求弧度
	let radina = Math.floor(Math.acos(cos));

	if (evX > centerX && evY > centerY) {
		//鼠标在第四象限
		radina = Math.PI - radina;
	}

	if (evX == centerX && evY > centerY) {
		//鼠标在y轴负方向上
		radina = Math.PI;
	}

	if (evX > centerX && evY == centerY) {
		//鼠标在x轴正方向上
		radina = Math.PI / 2;
	}

	if (evX < centerX && evY > centerY) {
		//鼠标在第三象限
		radina = Math.PI + radina;
	}

	if (evX < centerX && evY == centerY) {
		//鼠标在x轴负方向
		radina = (Math.PI * 3) / 2;
	}

	if (evX < centerX && evY < centerY) {
		//鼠标在第二象限
		radina = 2 * Math.PI - radina;
	}

	console.log(radina);
	return radina;
};

// 获取角度的第二个版本
export const getDeg = (
	centerX: number,
	centerY: number,
	x: number,
	y: number,
	ex: number,
	ey: number
) => {
	const [x1, y1] = [x - centerX, y - centerY];
	const [x2, y2] = [ex - centerX, ey - centerY];

	const getSide = (a: number, b: number): number =>
		Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

	const multiplicate =
		(x1 * x2 + y1 * y2) / (getSide(x1, y1) * getSide(x2, y2));

	return parseFloat(Math.acos(multiplicate).toFixed(3));
};
