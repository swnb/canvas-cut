const str = `
this.context.fillText("等边三角形", this.x - len, this.y * 7.2 - 20);
const t4 = getImg("t4");
this.drawImg(
    t4,
    this.x - len - t4.width / 2,
    this.y * 7.2,
    t4.width,
    t4.height
);
this.context.fillText("钝角三角形", this.x - len, this.y * 9.5 - 20);
const t5 = getImg("t5");
this.drawImg(
    t5,
    this.x - len - t5.width / 2,
    this.y * 9.5,
    t5.width,
    t5.height
);
this.context.fillText("直角三角形", this.x - len, this.y * 11.5 - 15);
const t6 = getImg("t6");
this.drawImg(
    t6,
    this.x - len - t6.width / 2,
    this.y * 11.5,
    t6.width,
    t6.height
);
this.context.fillText("锐角三角形", this.x - len, this.y * 13.5);`;
