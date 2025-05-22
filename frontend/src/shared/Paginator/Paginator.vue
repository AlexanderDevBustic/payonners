<template>
  <div class="paginator">
    <Button
      :disabled="currentPage === 1"
      @click="goToPage(1)"
      rounded
      type="button"
    >
      <i class="material-icons">first_page</i>
    </Button>
    <Button
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
      rounded
      type="button"
    >
      <i class="material-icons">chevron_left</i>
    </Button>
    <div class="paginator__pages">
      <span
        v-if="shouldShowFirstEllipsis"
        key="ellipsis-start"
        disabled
        rounded
      >
        ...
      </span>

      <Button
        v-for="page in displayedPages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: currentPage === page }"
        rounded
        type="button"
      >
        {{ page }}
      </Button>

      <span v-if="shouldShowLastEllipsis" key="ellipsis-end" disabled rounded>
        ...
      </span>
    </div>
    <Button
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
      rounded
      type="button"
    >
      <i class="material-icons">chevron_right</i>
    </Button>

    <Button
      :disabled="currentPage === totalPages"
      @click="goToPage(totalPages)"
      rounded
      type="button"
    >
      <i class="material-icons">last_page</i>
    </Button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import Button from '../Button/Button.vue';

  export default defineComponent({
    name: 'Paginator',
    components: {
      Button,
    },
    props: {
      totalItems: {
        type: Number,
        required: true,
      },
      itemsPerPage: {
        type: Number,
        required: true,
      },
      currentPage: {
        type: Number,
        required: true,
      },
    },
    emits: ['update:currentPage'],
    setup(props, { emit }) {
      const totalPages = computed(() =>
        Math.ceil(props.totalItems / props.itemsPerPage)
      );

      const displayedPages = computed(() => {
        const maxDisplayedPages = 5;
        let startPage = Math.max(
          1,
          props.currentPage - Math.floor(maxDisplayedPages / 2)
        );
        let endPage = Math.min(
          totalPages.value,
          startPage + maxDisplayedPages - 1
        );

        if (endPage - startPage + 1 < maxDisplayedPages) {
          startPage = Math.max(1, endPage - maxDisplayedPages + 1);
        }

        return Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        );
      });

      const shouldShowFirstEllipsis = computed(() => {
        return displayedPages.value[0] > 1;
      });

      const shouldShowLastEllipsis = computed(() => {
        return (
          displayedPages.value[displayedPages.value.length - 1] <
          totalPages.value
        );
      });

      const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
          emit('update:currentPage', page);
        }
      };

      return {
        totalPages,
        displayedPages,
        shouldShowFirstEllipsis,
        shouldShowLastEllipsis,
        goToPage,
      };
    },
  });
</script>

<style scoped>
  @import url(./paginator-styles.css);
</style>
