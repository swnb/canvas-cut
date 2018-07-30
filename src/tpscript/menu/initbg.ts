type Pos = [number, number];

// 主菜单背景
export const InitBg = (
    context: CanvasRenderingContext2D,
    [x, y]: Pos,
    [width, height]: Pos,
    radius: number
) => {
    // 记录先前的fillstyle,之后还原
    const preFillStyle = context.fillStyle;

    context.fillStyle = "white";
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + radius + width, y);
    context.arcTo(
        x + radius * 2 + width,
        y,
        x + radius * 2 + width,
        y + radius,
        radius
    );
    context.lineTo(x + radius * 2 + width, y + radius + height);
    context.arcTo(
        x + radius * 2 + width,
        y + radius * 2 + height,
        x + radius + width,
        y + radius * 2 + height,
        radius
    );
    context.lineTo(x + radius, y + radius * 2 + height);
    context.arcTo(x, y + radius * 2 + height, x, y + radius + height, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();
    context.fill();

    context.fillStyle = preFillStyle;
};

// 子菜单背景
export const DrawObjbg = (
    context: CanvasRenderingContext2D,
    [x, y]: Pos,
    [width, height]: Pos,
    radius: number,
    h: number
) => {
    // 记录先前的fillstyle,之后还原
    const preFillStyle = context.fillStyle;

    context.fillStyle = "white";
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + radius + width, y);
    context.arcTo(
        x + radius * 2 + width,
        y,
        x + radius * 2 + width,
        y + radius,
        radius
    );
    context.lineTo(x + radius * 2 + width, y + radius + h);
    context.lineTo(x + radius * 2 + width + 40, y + radius + h + 20);
    context.lineTo(x + radius * 2 + width, y + radius + h + 40);
    context.lineTo(x + radius * 2 + width, y + radius + height);
    context.arcTo(
        x + radius * 2 + width,
        y + radius * 2 + height,
        x + radius + width,
        y + radius * 2 + height,
        radius
    );
    context.lineTo(x + radius, y + radius * 2 + height);
    context.arcTo(x, y + radius * 2 + height, x, y + radius + height, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();
    context.fill();

    context.fillStyle = preFillStyle;
};
