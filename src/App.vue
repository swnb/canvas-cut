<template>
  <div id="app">
    <canvas-cut msg="Welcome to canvascut,made by TypeScript App"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CanvasCut from "./components/canvascut.vue";

export default Vue.extend({
  name: "app",
  components: {
    CanvasCut
  }
});
</script>

<style lang="scss">
</style>
