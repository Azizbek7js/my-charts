<script setup>
import Dashboard from "@/components/Dashboard.vue";
</script>

<template>
  <Dashboard />
</template>

<style scoped lang="scss">
header {
  line-height: 1.5;
}


@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
