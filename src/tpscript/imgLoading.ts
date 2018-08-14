import { imgs } from "./data";

interface ImgMap {
	[propname: string]: HTMLImageElement;
}

const _imgMap: ImgMap = Object.create(null);

// 这个函数只执行一次
export const load = (cb: () => void): (() => ImgMap | boolean) => {
	let lock = true; // 上锁

	let imgLength = Object.keys(imgs).length;

	const imgMap: ImgMap = new Proxy(_imgMap, {
		get: (target: ImgMap, props: string) => target[props],
		set: (target: ImgMap, prop: string, value: HTMLImageElement) => {
			target[prop] = value;
			if (--imgLength === 0) {
				lock = false; // 解锁
				cb();
			}
			return true;
		}
	});

	for (const tag in imgs) {
		const Img = new Image();
		Img.src = imgs[tag];
		Img.onload = () => {
			imgMap[tag] = Img;
		};
	}

	return () => (lock ? false : imgMap);
};
