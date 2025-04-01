<template>
  <div class="grid-layout" ref="contain">
    <slot name="base"></slot>

    <GridBackground
        v-show="editable"
        :layout="layout"
        :col-width="colWidth"
        :col-height="colHeight"
        :col-num="colNum"
        :row-num="rowNum"
    ></GridBackground>

    <GridItem
        v-for="item in layout"
        :key="item.i"
        :editable="editable"
        :w.sync="item.w"
        :h.sync="item.h"
        :x.sync="item.x"
        :y.sync="item.y"
        :i="item.i"
        :col-width="colWidth"
        :col-height="colHeight"
        :col-num="colNum"
        :row-num="rowNum"
    ></GridItem>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import GridBackground from './GridBackground.vue';
import GridItem from './GridItem.vue';

export default defineComponent({
  name: 'GridLayout',
  components: {
    GridBackground,
    GridItem,
  },
  props: {
    layout: {
      type: Array,
      required: true,
    },
    colNum: {
      type: Number,
      default: 12,
    },
    colWidth: {
      type: Number,
      default: 300,
    },
    colHeight: {
      type: Number,
      default: 300,
    },
    rowNum: {
      type: Number,
      default: 12,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const state = reactive({
      containWidth: props.colWidth,
      containHeight: props.colHeight,
    });

    const colWidth = computed(() => (props.colWidth / props.colNum * 10) / 10)
    const colHeight = computed(() => (props.colHeight / props.rowNum * 10) / 10)

    const compact = () => {
      let compared = [];
      const sortedLayout = sortLayout();
      sortedLayout.forEach(item => {
        compactItem(compared, item);
        compared.push(item);
      });
    };

    const compactItem = (compared, item) => {
      compared.forEach(comparedItem => {
        if (isCollide(comparedItem, item)) {
          item.y = comparedItem.h + comparedItem.y;
        }
      });
    };

    const isCollide = (l1, l2) => {
      if (l1 === l2) return false;
      if (l1.x + l1.w <= l2.x) return false;
      if (l1.x >= l2.x + l2.w) return false;
      if (l1.y + l1.h <= l2.y) return false;
      if (l1.y >= l2.y + l2.h) return false;
      return true;
    };

    const sortLayout = () => {
      return [...props.layout].sort((a, b) => {
        if (a.y > b.y || (a.y === b.y && a.x > b.x)) return 1;
        return -1;
      });
    };

    onMounted(() => {
      state.containWidth = props.colWidth
      state.containHeight = props.colHeight
      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });

    const handleResize = () => {
      state.containWidth = document.querySelector('.grid-layout')?.offsetWidth || 0;
      state.containHeight = document.querySelector('.grid-layout')?.offsetHeight || 0;
    };

    watch(() => props.layout, () => {
      compact();
    });

    return {
      ...state,
      colWidth,
      colHeight,
      compact,
      compactItem,
      isCollide,
      sortLayout,
    };
  },
});
</script>


<style scoped lang="scss">
.grid-layout {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>