<template>
  <div class="dropdown" @click.stop="toggleDropdown">
    <slot name="trigger"></slot>

    <div
      v-if="isOpen"
      :class="['dropdown-content', positionClass]"
      :style="{ width: contentWidth }"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';

  export default defineComponent({
    name: 'Dropdown',
    props: {
      position: {
        type: String,
        default: 'bottom-right',
        validator: (value: string) =>
          ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(
            value
          ),
      },
      width: {
        type: String,
        default: '200px',
      },
    },
    setup(props) {
      const isOpen = ref(false);

      const toggleDropdown = () => {
        isOpen.value = !isOpen.value;
      };

      const closeDropdown = () => {
        isOpen.value = false;
      };

      document.addEventListener('click', closeDropdown);

      const positionClass = computed(() => {
        return `position-${props.position}`;
      });

      const contentWidth = computed(() => {
        return props.width;
      });

      return {
        isOpen,
        toggleDropdown,
        positionClass,
        contentWidth,
      };
    },
  });
</script>

<style scoped>
  @import url(./custom-menu.css);
</style>
