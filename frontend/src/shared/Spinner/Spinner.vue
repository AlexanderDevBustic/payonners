<template>
  <div class="spinner" :style="{ width: size, height: size }"></div>
</template>

<script>
  export default {
    name: 'Spinner',
    props: {
      size: {
        type: String,
        default: '15px',
      },
    },
  };
</script>

<style scoped>
  @import url(./spinner-styles.css);
</style>
