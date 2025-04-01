<template>
  <div
      class="grid-item"
      :class="{
      editable: editable,
      'grid-item-dragging': isDragging,
      'grid-item-resizing': isResizing
    }"
      :style="itemStyle"
  >
    <div
        class="grid-item-content"
        @mousedown="dragStart"
        @mouseup="dragEnd"
    >
      item-{{ i }}
    </div>

    <span
        class="resizable-handle"
        @mousedown="resizeStart"
        @mouseup="resizeEnd"
    ></span>
  </div>
</template>


<script>
import { getControlPosition, createCoreData } from './util.js';

export default {
  name: 'GridItem',
  inject: ['eventBus'],
  props: {
    i: {
      type: Number,
      required: true,
    },
    w: {
      type: Number,
      default: 1,
    },
    h: {
      type: Number,
      default: 1,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    colWidth: {
      type: Number,
      required: true,
    },
    colHeight: {
      type: Number,
      required: true,
    },
    colNum: {
      type: Number,
      required: true,
    },
    rowNum: {
      type: Number,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      innerX: this.x,
      innerY: this.y,
      innerW: this.w,
      innerH: this.h,
      isDragging: false,
      dragPosition: { top: 0, left: 0 },
      lastX: NaN,
      lastY: NaN,
      isResizing: false,
      resizeInfo: { width: 0, height: 0 },
      lastResizeX: NaN,
      lastResizeY: NaN,
    };
  },
  computed: {
    itemStyle() {
      const style = {
        width: `${this.innerW * this.colWidth}px`,
        height: `${this.innerH * this.colHeight}px`,
        left: `${this.x * this.colWidth}px`,
        top: `${this.y * this.colHeight}px`,
      };

      if (this.isDragging) {
        style.top = `${this.dragPosition.top}px`;
        style.left = `${this.dragPosition.left}px`;
      }

      if (this.isResizing) {
        style.width = `${this.resizeInfo.width}px`;
        style.height = `${this.resizeInfo.height}px`;
      }

      return style;
    },
  },
  methods: {
    dragStart(event) {
      if (!this.editable) return;
      this.isDragging = true;
      const position = getControlPosition(event);
      this.lastX = position.x;
      this.lastY = position.y;

      const parentRect = event.target.offsetParent.offsetParent.getBoundingClientRect();
      const clientRect = event.target.getBoundingClientRect();
      this.dragPosition = {
        left: clientRect.left - parentRect.left,
        top: clientRect.top - parentRect.top,
      };

      document.onmousemove = (event) => this.handleDragMove(event); // Use arrow function
    },

    dragEnd(event) {
      if (!this.editable || !this.isDragging) return;

      this.isDragging = false;
      document.onmousemove = null;

      const parentRect = event.target.offsetParent.offsetParent.getBoundingClientRect();
      const clientRect = event.target.getBoundingClientRect();
      const newPosition = {
        left: clientRect.left - parentRect.left,
        top: clientRect.top - parentRect.top,
      };

      const { x, y } = this.calcXY(newPosition.top, newPosition.left);
      this.innerX = x;
      this.$emit('update:x', x); // Ensure $emit works correctly
      this.innerY = y;
      this.$emit('update:y', y);
      this.eventBus.$emit('compact');
    },

    handleDragMove(event) {
      const position = getControlPosition(event);
      if (!position) return;

      const coreEvent = createCoreData(this.lastX, this.lastY, position.x, position.y);
      this.dragPosition.left += coreEvent.deltaX;
      this.dragPosition.top += coreEvent.deltaY;

      this.lastX = position.x;
      this.lastY = position.y;
    },

    resizeStart(event) {
      if (!this.editable) return;

      this.isResizing = true;
      const position = getControlPosition(event);
      this.lastResizeX = position.x;
      this.lastResizeY = position.y;

      this.resizeInfo = {
        width: this.colWidth * this.innerW,
        height: this.colHeight * this.innerH,
      };

      document.onmousemove = (event) => this.handleResizeMove(event); // Use arrow function
    },

    resizeEnd(event) {
      if (!this.editable || !this.isResizing) return;

      this.isResizing = false;
      document.onmousemove = null;

      const { w, h } = this.calcWH(this.resizeInfo.width, this.resizeInfo.height);
      this.innerW = w;
      this.innerH = h;

      this.$emit('update:w', w); // Ensure $emit works correctly
      this.$emit('update:h', h);
      this.eventBus.$emit('compact');
    },

    handleResizeMove(event) {
      const position = getControlPosition(event);
      if (!position) return;

      const coreEvent = createCoreData(this.lastResizeX, this.lastResizeY, position.x, position.y);
      this.resizeInfo.width += coreEvent.deltaX;
      this.resizeInfo.height += coreEvent.deltaY;

      this.lastResizeX = position.x;
      this.lastResizeY = position.y;

      const { w, h } = this.calcWH(this.resizeInfo.width, this.resizeInfo.height);
      this.$emit('update:w', w); // Ensure $emit works correctly
      this.$emit('update:h', h);
      this.eventBus.$emit('compact');
    },
  }

};
</script>


<style scoped lang="scss">
.editable {
  cursor: move;
  transition: all 0.2s ease-out;
  user-select: none;
}

.grid-item {
  position: absolute;
  background: burlywood;
  border: 1px solid #555;
  text-align: center;
  box-sizing: border-box;
}

.grid-item-content {
  width: 100%;
  height: 100%;
}

.grid-item .resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  padding: 0 3px 3px 0;
  cursor: se-resize;
}

.grid-item-dragging {
  opacity: 0.8;
  z-index: 3;
  transition: none;
}

.grid-item-resizing {
  transition: none;
}
</style>

