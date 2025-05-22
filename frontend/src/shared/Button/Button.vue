<template>
  <button
    class="btn"
    :class="{
      'btn--icon': icon,
      'btn--rounded': rounded,
      'btn--disabled': disabled,
      'btn--fullWidth': fullWidth
    }"
    :disabled="disabled"
    @click="$emit('click')"
    :type="type"
  >
    <span v-if="icon" class="btn__icon">
      <i :class="`material-icons`">{{ icon }}</i>
    </span>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Button',
  props: {
    icon: {
      type: String,
      default: null,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    type: {
      type: String as () => 'button' | 'submit' | 'reset',
      default: 'button',
    },
  },
  emits: ['click'],
});
</script>

<style scoped>
@import url(./button-styles.css);
</style>