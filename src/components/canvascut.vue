<template>
  <div class="geometricCutting-root" >
      <canvas  ref="canvas" class="geometricCutting-canvas"></canvas>
      <div  v-if ="choose" class='choose' ref='choose'>
          <div class="mouse" @click="choosemouse">我使用鼠标滑动</div>
          <div class="finger" @click="choosefinger">我使用手指滑动</div>
      </div>
      <div  res="title" v-if ="choose" class="choose-title">
        <div>{{title}}</div>
      </div>
  </div>
</template>

<script>
import Vue from "vue";

import drawcanvas from "../tpscript/canvas.ts";

import { LoadingPage } from "../tpscript/loading/loading.ts";

import { Transition } from "../tpscript/transition/transition.ts";

import { Choose } from "../choose.ts";

import { CreateBubble } from "../tpscript/bubble.ts";
import { setTimeout } from "timers";

export default {
  name: "GeometricCutting",
  data() {
    return {
      params: {
        name: "block-geometricCutting"
      },
      title: "请 帮 助 我 优 化 您 的 体 验",
      ifshowCanvas: false,
      rotate: false,
      choose: true,
      mode: "click",
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
    choosefinger() {
      this.mode = "touch";
      this.showCanvas();
    },
    choosemouse() {
      this.mode = "click";
      this.showCanvas();
    },
    showCanvas() {
      if (this.ifshowCanvas) return;
      this.ifshowCanvas = true;
      this.canvas = this.$refs.canvas;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.$refs.canvas.style.zIndex = 10;
      this.clearWithBubble();
    },
    clearWithBubble() {
      CreateBubble.create(this.canvas.getContext("2d"), this.width, this.height)
        .init()
        .callback(this.loadingPage);
    },
    loadingPage() {
      setTimeout(
        () =>
          LoadingPage.create(
            this.canvas.getContext("2d"),
            this.width,
            this.height
          )
            .init()
            .callback(this.transition),
        300
      );
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
    renderRoom() {
      setTimeout(() => {
        this.drawcanvas = drawcanvas(this.canvas.getContext("2d"));
        switch (this.mode) {
          case "click": {
            this.canvas.onmousedown = this.onmousedown;
            break;
          }
          case "touch": {
            this.canvas.ontouchstart = this.ontouchstart;
            break;
          }
        }
      }, 100);
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
    console.log("start engine swnb");
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
  position: absolute;
}

.choose {
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: space-around;
  width: 1280px;
  height: 800px;
  background-color: whitesmoke;
}

.choose > div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 30px;
  width: 300px;
  height: 40px;
  color: whitesmoke;
  font-weight: 300;
  border-radius: 30px;
}

.mouse {
  background-color: #70a300;
}

.mouse:hover {
  background-color: #ae4b0f;
}

.finger {
  background-color: #dd5f13;
}

.finger:hover {
  background-color: #ae4b0f;
}

@keyframes backgroundmove {
  0% {
    background-position-x: 0%;
  }
  50% {
    background-position-x: 100%;
  }
  100% {
    background-position-x: 0%;
  }
}

.choose-title {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1280px;
  top: 120px;
  left: 0;
  right: 0;
  font-size: 50px;
  padding: 10px;
  font-weight: 400;
  background: linear-gradient(
    45deg,
    darkolivegreen 0%,
    darkgoldenrod 25%,
    darkturquoise 75%,
    darkolivegreen 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 8% 100%;
  background-repeat: repeat-x;
  color: transparent;
  animation: backgroundmove 20s linear infinite;
}
</style>
