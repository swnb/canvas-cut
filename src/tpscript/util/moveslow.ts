type Pos = [number, number];

interface Drawer {
    polygonPoints: Array<Pos>;
    draw(): void;
    redraw(): void;
}

// 慢慢移动
export const slowMove = (drawer: Drawer, direct: Pos) => {
    setTimeout(() => {
        let count = 0;
        const limit = 20;
        const speed = 1;

        const timerId = setInterval(() => {
            drawer.polygonPoints = drawer.polygonPoints.map(
                (pos: [number, number]): [number, number] => [
                    pos[0] + direct[0] / 20,
                    pos[1] + direct[1] / 20
                ]
            );
            // 调用宿主的重写方法，但其实子类是不能这么操作的，考虑重写
            drawer.redraw();
            count += speed;
            if (count >= limit) {
                clearInterval(timerId);
            }
        }, 17);
    }, 10);
};
