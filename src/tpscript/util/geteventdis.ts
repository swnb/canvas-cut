export const getEventPos = (ev: any): [number, number] => {
	if (ev.offsetX) {
		return [ev.offsetX, ev.offsetY];
	}
	const target = ev.target as HTMLDivElement;
	return [
		ev.touches[0].clientX - target.getBoundingClientRect().left,
		ev.touches[0].clientY - target.getBoundingClientRect().top
	];
};
