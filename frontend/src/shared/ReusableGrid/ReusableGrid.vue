<template>
  <div class="center" :key="$route.fullPath">
    <div class="scroll-wrapper">
      <div class="grid-container">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="grid-item"
          @click="navigateTo(item)"
        >
          <div class="avatar">
            <span v-if="item.icon" class="icon">
              <i class="material-icons">{{ item.icon }}</i>
            </span>
          </div>
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  export interface Item {
    label: string;
    routeName?: string;
    icon?: string;
  }

  export default defineComponent({
    name: 'ReusableGrid',
    props: {
      items: {
        type: Array as () => Item[],
        required: true,
      },
    },
    setup() {
      const router = useRouter();
      const route = useRoute();

      watch(
        () => route.name,
        () => {
        }
      );

      const goBack = () => {
        router.back();
      };

      const navigateTo = (item: Item) => {
        if (item.routeName) {
          router.push({ name: item.routeName });
        }
      };

      return { goBack, navigateTo, route };
    },
  });
</script>

<style scoped>
  @import url(./reusablegrid-styles.css);
</style>
