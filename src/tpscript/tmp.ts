` DrawObjbg(this.context, [x - 275, y + 410], [130, 200], 12, 50);

const prefillstyle = this.context.fillStyle;
this.context.fillStyle = "#595959";
this.context.font = "15px sans-serif";
const I1 = getImg("I1");
this.drawImg(
    I1,
    this.x - len - I1.width / 2,
    this.y + 425,
    I1.width,
    I1.height
);
this.context.fillText("直角梯形", this.x - len, this.y + 515);
const I2 = getImg("I2");
this.drawImg(
    I2,
    this.x - len - I2.width / 2,
    this.y + 535,
    I2.width,
    I2.height
);
this.context.fillText("直角梯形", this.x - len, this.y + 615);`;
