import { load } from "./imgLoading";

const getImgData = load(() => {
	const imgs = getImgData();
	// 图片不存在报错
	if (!imgs) window.console.error("can't load img,checkout your network");
	// 如何去调用
});
