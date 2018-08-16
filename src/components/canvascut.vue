<template>
  <div class="geometricCutting-root" >
    <div ref="geometricCutting-element" >
      <canvas ref="canvas" class="geometricCutting-canvas"></canvas>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import drawcanvas from "../tpscript/canvas.ts";

import { LoadingPage } from "../tpscript/loading/loading.ts";

import { Transition } from "../tpscript/transition/transition.ts";

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
    renderRoom() {
      setTimeout(() => {
        this.drawcanvas = drawcanvas(this.canvas.getContext("2d"));
        this.canvas.ontouchstart = this.ontouchstart;
        this.canvas.onmousedown = this.onmousedown;
      }, 100);
    },
    transition() {
      setTimeout(
        () =>
          Transition.create(
            this.canvas.getContext("2d"),
            this.width,
            this.height
          )
            .init()
            .callback(this.renderRoom),
        100
      );
    },
    //touchstart, touchmove, touchend
    // mousedown, mousemove, mouseup
    ontouchstart(event) {
      const [x, y] = [
        event.touches[0].clientX - event.target.getBoundingClientRect().left,
        event.touches[0].clientY - event.target.getBoundingClientRect().top
      ];

      const listener = this.drawcanvas.ontouch(x, y);
      if (listener) {
        // 开始移动
        this.canvas.ontouchmove = listener;
        this.canvas.ontouchend = function() {
          this.ontouchmove = null;
        };
      } else {
        this.canvas.ontouchmove = this.drawcanvas.listenerClip(x, y);
        this.$refs.canvas.ontouchend = event => {
          // console.log(event);
          this.canvas.ontouchmove = null;
          const [ex, ey] = [
            event.changedTouches[0].clientX -
              event.target.getBoundingClientRect().left,
            event.changedTouches[0].clientY -
              event.target.getBoundingClientRect().top
          ];
          this.drawcanvas.listenerClipEnd(x, y, ex, ey);
        };
      }
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
    this.canvas = this.$refs.canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    LoadingPage.create(this.canvas.getContext("2d"), this.width, this.height)
      .init()
      .callback(this.transition);
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
