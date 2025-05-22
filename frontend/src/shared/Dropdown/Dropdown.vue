<template>
  <div class="dropdown" ref="dropdownRef">
    <button @click="toggleDropdown" class="dropdown-toggle">
      {{ selectedOption || placeholder }}
      <i class="material-icons dropdown-icon">arrow_drop_down</i>
    </button>
    <ul v-if="isOpen" class="dropdown-menu">
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="selectOption(option)"
        class="dropdown-item"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

  export default defineComponent({
    name: 'Dropdown',
    props: {
      options: {
        type: Array as () => string[],
        required: true,
      },
      placeholder: {
        type: String,
        default: 'Select an option',
      },
    },
    emits: ['selectOption'],
    setup(_, { emit }) {
      const isOpen = ref(false);
      const selectedOption = ref<string | null>(null);

      const dropdownRef = ref<HTMLElement | null>(null);

      const toggleDropdown = () => {
        isOpen.value = !isOpen.value;
      };

      const selectOption = (option: string) => {
        selectedOption.value = option;
        isOpen.value = false;
        emit('selectOption', option);
      };

      const closeOnOutsideClick = (event: MouseEvent) => {
        if (
          dropdownRef.value &&
          !dropdownRef.value.contains(event.target as Node)
        ) {
          isOpen.value = false;
        }
      };

      onMounted(() => {
        document.addEventListener('click', closeOnOutsideClick);
      });

      onUnmounted(() => {
        document.removeEventListener('click', closeOnOutsideClick);
      });

      return {
        isOpen,
        selectedOption,
        toggleDropdown,
        selectOption,
        dropdownRef,
      };
    },
  });
</script>

<style scoped>
@import url(./dropdown-styles.css);
</style>
