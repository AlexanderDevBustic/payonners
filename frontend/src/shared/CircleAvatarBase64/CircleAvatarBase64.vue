<template>
  <div class="avatar-container">
    <div class="circle-avatar" @click="triggerFileInput">
      <img v-if="imageBase64" :src="imageBase64" alt="Avatar" />
      <span v-else class="placeholder">
        <span class="icon">
          <i class="material-icons">add</i>
        </span>
      </span>
    </div>

    <input
      type="file"
      accept="image/*"
      ref="fileInput"
      @change="handleFileUpload"
      style="display: none"
    />

    <Modal
      :visible="showCropper"
      title="Recortar imagen"
      icon="crop"
      width="800px"
      @update:visible="closeCropper"
    >
      <div v-if="showCropper" class="cropper-container">
        <img ref="cropperImage" :src="cropperImageSrc" alt="Cropped Image" />
      </div>

      <div class="modal-options-crop">
        <Button icon="check" @click="cropImage">Confirmar</Button>
        <Button icon="close" @click="cancelCrop">Cancelar</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, nextTick } from 'vue';
  import Cropper from 'cropperjs';
  import Modal from '../Modal/Modal.vue';
  import Button from '../Button/Button.vue';
  import Swal from 'sweetalert2';

  export default defineComponent({
    name: 'CircleAvatarBase64',
    components: {
      Modal,
      Button,
    },
    props: {
      defaultImage: {
        type: [String, File],
        default: null,
      },
    },
    emits: ['image-uploaded'],
    setup(props, { emit }) {
      const imageBase64 = ref<string | null>(null);
      const fileInput = ref<HTMLInputElement | null>(null);
      const cropperInstance = ref<Cropper | null>(null);
      const showCropper = ref(false);
      const cropperImageSrc = ref<string | undefined>(undefined);

      const MAX_FILE_SIZE = 5 * 1024 * 1024;

      const triggerFileInput = (): void => {
        if (fileInput.value) fileInput.value.click();
      };

      const handleFileUpload = (event: Event): void => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          // Error toast using SweetAlert2
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'La imagen no puede pesar más de 5MB.',
            showConfirmButton: false,
            timer: 3000, // Auto-close after 3 seconds
            timerProgressBar: true,
          });
          if (fileInput.value) fileInput.value.value = '';
          return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          // Error toast using SweetAlert2
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Por favor selecciona una imagen',
            showConfirmButton: false,
            timer: 3000, // Auto-close after 3 seconds
            timerProgressBar: true,
          });
          if (fileInput.value) fileInput.value.value = '';
          return;
        }

        // Read the file
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            cropperImageSrc.value = e.target.result as string;
            showCropper.value = true;
          } else {
            // Error alert using SweetAlert2
            Swal.fire({
              icon: 'error',
              title: 'Error al leer el archivo',
              text: 'Hubo un error al leer el archivo.',
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }
        };

        reader.onerror = () => {
          // Error alert using SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error al leer el archivo',
            text: 'Hubo un error al leer el archivo.',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
        };

        reader.readAsDataURL(file);

        // Clear the file input
        if (fileInput.value) fileInput.value.value = '';
      };

      const cropImage = (): void => {
        if (cropperInstance.value) {
          const croppedCanvas = cropperInstance.value.getCroppedCanvas();

          if (croppedCanvas) {
            imageBase64.value = croppedCanvas.toDataURL('image/jpeg', 0.7);
            emit('image-uploaded', imageBase64.value);
            closeCropper();
          } else {
            // Error alert using SweetAlert2
            Swal.fire({
              icon: 'error',
              title: 'Error al recortar la imagen',
              text: 'Hubo un error al recortar la imagen.',
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }
        }
      };

      const resetImageElement = (): void => {
        showCropper.value = false;
        const imgElement = document.querySelector(
          '.cropper-container img'
        ) as HTMLImageElement;
        if (imgElement) {
          imgElement.removeAttribute('style');
        }
      };

      const cancelCrop = (): void => {
        resetImageElement();
        closeCropper();
      };

      const closeCropper = (): void => {
        if (cropperInstance.value) {
          cropperInstance.value.destroy();
          cropperInstance.value = null;
        }
        resetImageElement();
        showCropper.value = false;
      };

      watch(showCropper, async (newVal) => {
        if (newVal && cropperImageSrc.value) {
          await nextTick();

          const imgElement = document.querySelector(
            '.cropper-container img'
          ) as HTMLImageElement;
          if (imgElement) {
            if (cropperInstance.value) {
              cropperInstance.value.destroy();
            }

            cropperInstance.value = new Cropper(imgElement, {
              aspectRatio: 1,
              viewMode: 1,
              dragMode: 'move',
              autoCropArea: 0.8,
              cropBoxResizable: true,
            });
          } else {
            console.error('Image element not found');
          }
        } else if (cropperInstance.value) {
          cropperInstance.value.destroy();
          cropperInstance.value = null;
        }
      });

      watch(
        () => props.defaultImage,
        async (newDefaultImage) => {
          if (!newDefaultImage) {
            imageBase64.value = null;
            return;
          }

          if (typeof newDefaultImage === 'string') {
            imageBase64.value = newDefaultImage;
          } else if (newDefaultImage instanceof File) {
            const base64 = await convertFileToBase64(newDefaultImage);
            imageBase64.value = base64;
          }
        },
        { immediate: true }
      );

      const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
              resolve(e.target.result as string);
            } else {
              reject(new Error('Failed to read file.'));
            }
          };
          reader.onerror = () => {
            reject(reader.error || new Error('Error reading file.'));
          };
          reader.readAsDataURL(file);
        });
      };

      return {
        imageBase64,
        fileInput,
        showCropper,
        cropperImageSrc,
        triggerFileInput,
        handleFileUpload,
        cropImage,
        cancelCrop,
        closeCropper,
      };
    },
  });
</script>

<style scoped>
  @import url(./circle-avatar-baseb64-styles.css);
</style>
