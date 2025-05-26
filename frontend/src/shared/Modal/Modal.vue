<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay">
      <div class="modal-content" :style="{ width }">
        <header class="modal-header">
          <div>
            <span v-if="icon" class="icon">
              <i class="material-icons">{{ icon }}</i>
            </span>
          </div>
          <div class="modal-title">
            {{ title }}
          </div>
          <button class="close-button" @click="closeModal">
            <i class="material-icons">close</i>
          </button>
        </header>
        <section class="modal-body">
          <slot></slot>
        </section>
        <footer class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import { defineComponent, watch, onMounted, onUnmounted } from 'vue';

  export default defineComponent({
    name: 'Modal',
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: 'Modal Title',
      },
      icon: {
        type: String,
        default: undefined,
      },
      width: {
        type: String,
        default: '500px',
      },
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
      const closeModal = () => {
        emit('update:visible', false);
      };

      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      };

      watch(
        () => props.visible,
        (isVisible) => {
          if (isVisible) {
            document.body.classList.add('no-scroll');
          } else {
            document.body.classList.remove('no-scroll');
          }
        }
      );

      onMounted(() => {
        window.addEventListener('keydown', handleKeydown);
      });

      onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown);
      });

      return {
        closeModal,
      };
    },
  });
</script>

<style scoped>
@import url(./modal-styles.css);
</style>
