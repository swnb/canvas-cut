type Pos = [number, number];

interface Drawer {
    polygonPoints: Array<Pos>;
    draw(): void;
    redraw(): void;
}

export const slowMove = (drawer: Drawer, direct: Pos, points: Array<Pos>) => {
    setTimeout(() => {
        let count = 0;
        const limit = 20;
        const speed = 1;

        const timerId = setInterval(() => {
            console.log("speed 0.1");
            drawer.polygonPoints = drawer.polygonPoints.map(
                (pos: [number, number]): [number, number] => [
                    pos[0] + direct[0] / 20,
                    pos[1] + direct[1] / 20
                ]
            );
            // console.log("speed 0.1");
            console.log(drawer);
            drawer.redraw();
            count += speed;
            if (count >= limit) {
                clearInterval(timerId);
            }
        }, 17);
    }, 10);
};
