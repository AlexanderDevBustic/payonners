<template>
  <div class="checkbox-flex">
    <label class="checkbox-container" @click.stop>
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span class="checkmark">
        <span v-if="modelValue" class="material-icons">done</span>
      </span>
      <slot></slot>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'Checkbox',
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:modelValue'],
  };
</script>

<style scoped>
  @import url(./checkbox-styles.css);
</style>
