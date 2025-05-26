<template>
  <div v-show="visible" class="toast" :class="type">
    <span v-if="icon" class="icon">
      <i class="material-icons">{{ icon }}</i>
    </span>
    <span class="message">{{ message }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';

export default defineComponent({
  name: "Toast",
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "info",
    },
    icon: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 5000,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    async show() {
      this.visible = true;
      await nextTick();
      setTimeout(() => {
        this.$el.classList.add('show');
      }, 100);
      setTimeout(() => {
        this.hide();
      }, this.duration);
    },
    hide() {
      this.$el.classList.remove('show');
      setTimeout(() => {
        this.visible = false;
      }, 300);
    },
  },
});
</script>

<style scoped>
@import url(./toast-styles.css);
</style>
