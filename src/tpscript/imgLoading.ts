import { imgSrcMap } from "./data";
import { Center } from "./communication/commu";

interface ImgMap {
	[propname: string]: HTMLImageElement;
}

const _imgMap: ImgMap = Object.create(null);

const emit = Center.setNewEvent("imgOnload");

// 这个函数只执行一次
export const load = (): void => {
	let imgLength = Object.keys(imgSrcMap).length;

	const imgMap: ImgMap = new Proxy(_imgMap, {
		get: (target: ImgMap, props: string) => target[props],
		set: (target: ImgMap, prop: string, value: HTMLImageElement) => {
			target[prop] = value;
			if (--imgLength === 0) {
				emit(imgMap);
			}
			return true;
		}
	});

	for (const src in imgSrcMap) {
		const Img = new Image();
		Img.src = imgSrcMap[src];
		Img.onload = () => {
			imgMap[src] = Img;
		};
	}
};
