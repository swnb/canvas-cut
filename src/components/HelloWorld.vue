<template>
  <div class="geometricCutting-root" >
    <div ref="geometricCutting-element" >
      <canvas class="geometricCutting-canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import drawcanvas from "@/tpscript/canvas";

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
      lineColor: "#ACBFEA",
      lineWidth: 3,
      nodeHeadBgColor: "#AFCFFE"
    };
  },
  methods: {},
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
