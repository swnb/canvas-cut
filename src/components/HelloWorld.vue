<template>
  <div class="geometricCutting-root" >
    <div ref="geometricCutting-element" >
      <canvas ref="canvas" class="geometricCutting-canvas" @mousedown="onmousedown"></canvas>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import drawcanvas from "../tpscript/canvas.ts";

export default {
  name: "GeometricCutting",
  data() {
    return {
      params: {
        name: "block-geometricCutting"
      },
      width: 1280,
      height: 800,
      canvas: null,
      ctx: null,
      pathRecord: [],
      lineColor: "#ACBFEA",
      lineWidth: 3,
      drawcanvas: null
    };
  },
  methods: {
    setParams(params) {
      Object.entries(params).forEach(([key, val]) => {
        this.params[key] = val;
      });
    },
    onmousedown(event) {
      const [x, y] = [event.offsetX, event.offsetY];

      const listener = this.drawcanvas.ontouch(x, y);
      if (listener) {
        // 开始移动
        this.canvas.onmousemove = listener;
        this.canvas.onmouseup = function() {
          this.onmousemove = null;
        };
      } else {
        this.canvas.onmousemove = this.drawcanvas.listenerClip(x, y);
        this.$refs.canvas.onmouseup = event => {
          this.canvas.onmousemove = null;
          const [ex, ey] = [event.offsetX, event.offsetY];
          this.drawcanvas.listenerClipEnd(x, y, ex, ey);
        };
      }
    }
  },
  beforeMount() {
    const ele = [...document.querySelectorAll("img")].find(ele =>
      ele.src.endsWith("static/images/btn-submit.png")
    );
    ele ? (ele.style.display = "none") : void 0;
  },
  mounted() {
    setTimeout(() => {
      this.canvas = this.$refs.canvas;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.drawcanvas = drawcanvas(this.canvas.getContext("2d"));
    }, 100);
  },
  destroyed() {
    const ele = [...document.querySelectorAll("img")].find(ele =>
      ele.src.endsWith("static/images/btn-submit.png")
    );
    ele ? (ele.style.display = "") : void 0;
  }
};
</script>

<style scoped>
.geometricCutting-root {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.geometricCutting-canvas {
  position: relative;
}
</style>
