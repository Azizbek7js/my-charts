<template>
  <div class="grid-background">
    <div
        v-for="(item, index) in items"
        :key="index"
        :style="itemStyle"
        class="grid-background-item"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'GridBackground',
  props: {
    layout: {
      type: Array,
      default: () => []
    },
    colWidth: {
      type: Number,
      required: true
    },
    colHeight: {
      type: Number,
      required: true
    },
    colNum: {
      type: Number,
      default: 12
    },
    rowNum: {
      type: Number,
      default: 12
    }
  },
  computed: {
    items() {
      return new Array(this.colNum * this.rowNum);
    },
    itemStyle() {
      return {
        width: `${this.colWidth}px`,
        height: `${this.colHeight}px`
      };
    }
  },
  watch: {
    colWidth() {
      // Optional: Handle updates when colWidth changes
    },
    colHeight() {
      // Optional: Handle updates when colHeight changes
    }
  }
}
</script>

<style scoped lang="scss">
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-left: 1px solid pink;
  border-top: 1px solid pink;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--col-width), 1fr));
  grid-template-rows: repeat(auto-fill, minmax(var(--col-height), 1fr));
}

.grid-background-item {
  border-right: 1px solid pink;
  border-bottom: 1px solid pink;
  box-sizing: border-box;
}
</style>
