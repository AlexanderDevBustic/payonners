<template>
  <span
    class="tooltip-wrapper"
    :class="flowClass"
    :tooltip="text"
  >
    <slot></slot>
  </span>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    name: 'Tooltip',
    props: {
      text: {
        type: String,
        required: true,
      },
      flow: {
        type: String as () => 'up' | 'down' | 'left' | 'right',
        default: 'up',
      },
    },
    setup(props) {
      const flowClass = computed(() =>
        props.flow ? `flow-${props.flow}` : ''
      );

      console.log(props.flow)

      return {
        flowClass,
      };
    },
  });
</script>

<style scoped>
  @import url(./tooltip-styles.css);
</style>
