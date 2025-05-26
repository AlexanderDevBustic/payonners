<template>
  <div class="input-container">
    <label v-if="label" :for="id">{{ label }}</label>
    <div class="input-wrapper">
      <span v-if="icon" class="icon">
        <i class="material-icons">{{ icon }}</i>
      </span>
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
        :class="['input-field', { error: !!errorMessage, 'has-icon': icon != undefined }]"
        :readonly="readonly"
        ref="nativeInput"
        :autocomplete="'on'"
      />
      <span
        v-if="type === 'password'"
        class="eye-icon-wrapper"
        @click="togglePasswordVisibility"
      >
        <i class="material-icons eye-icon">{{ isPasswordVisible ? 'visibility_off' : 'visibility' }}</i>
      </span>
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'Input',
  props: {
    label: {
      type: String,
      default: undefined,
    },
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substr(2, 9)}`,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    errorMessage: {
      type: String,
      default: undefined,
    },
    icon: {
      type: String,
      default: undefined,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const nativeInput = ref<HTMLInputElement | null>(null);
    const isPasswordVisible = ref(false);
    const inputType = computed(() => (props.type === 'password' && isPasswordVisible.value ? 'text' : props.type));

    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    };

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value;
    };

    return {
      nativeInput,
      onInput,
      togglePasswordVisibility,
      inputType,
      isPasswordVisible,
    };
  },
});
</script>

<style scoped>
@import url(./input-styles.css);
</style>