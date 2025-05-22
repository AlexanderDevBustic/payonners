<template>
  <div class="profile-container">
    <div class="profile-container-left">
      <CircleAvatarBase64 @image-uploaded="handleImageUploaded" />
    </div>

    <form class="profile-container-form" @submit.prevent="handleSubmit">
      <Input
        v-model="formData.newPassword"
        label="Nueva contraseña"
        icon="lock"
        type="password"
        placeholder="Digita tu nueva contraseña"
        :errorMessage="getErrorMessage(v$.formData.newPassword)"
      />
      <Input
        v-model="formData.confirmNewPassword"
        label="Confirmar nueva contraseña"
        icon="lock"
        type="password"
        placeholder="Confirma tu nueva contraseña"
        :errorMessage="getErrorMessage(v$.formData.confirmNewPassword)"
      />

      <Button icon="save" type="submit" :fullWidth="true" :disabled="isLoading">
        {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
      </Button>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { getErrorMessage } from '../../../utils/validationUtils';
  import { useVuelidate } from '@vuelidate/core';
  import { minLength, sameAs, helpers } from '@vuelidate/validators';

  import Button from '../../../shared/Button/Button.vue';
  import Input from '../../../shared/Input/Input.vue';
  import CircleAvatarBase64 from '../../../shared/CircleAvatarBase64/CircleAvatarBase64.vue';

  import { TokenService } from '../../../auth/auth-jwt-service';
  import { ProfileService } from './profile-service';
import Swal from 'sweetalert2';

  export default defineComponent({
    name: 'Profile',
    components: { Button, Input, CircleAvatarBase64 },
    setup() {
      const profileService = new ProfileService();

      const base64Image = ref<string>('');
      const isLoading = ref<boolean>(false);

      const formData = reactive({
        newPassword: '',
        confirmNewPassword: '',
      });

      const rules = {
        formData: {
          newPassword: {
            minLength: helpers.withMessage(
              'La nueva contraseña debe tener al menos 6 caracteres',
              minLength(6)
            ),
          },
          confirmNewPassword: {
            sameAs: helpers.withMessage(
              'Las contraseñas no coinciden',
              sameAs(formData.newPassword)
            ),
          },
        },
      };

      const v$ = useVuelidate(rules, { formData });

      const handleImageUploaded = (base64String: string) => {
        base64Image.value = base64String;
        console.log('Imagen subida:', base64String);
      };

      const handleSubmit = async () => {
        v$.value.$touch();

        const isValid = await v$.value.$validate();
        if (!isValid) return;

        isLoading.value = true;

        try {
          const payload: { avatar?: string | null; password?: string } = {};

          if (base64Image.value) {
            payload.avatar = base64Image.value;
          }

          if (formData.newPassword || formData.confirmNewPassword) {
            if (formData.newPassword !== formData.confirmNewPassword) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Las contraseñas no coinciden',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
              return;
            }
            payload.password = formData.newPassword;
          }

          const userId = TokenService.getClaim('sub');
          const updatedUser = await profileService.updateUser(userId, payload);

          console.log('Updated User:', updatedUser);

          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado con éxito',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });

          resetFormData();
        } catch (error) {
          console.error('Error al actualizar el perfil:', error);

          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error al actualizar el perfil',
            text: 'Por favor, intenta de nuevo.',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
        } finally {
          isLoading.value = false;
        }
      };

      const resetFormData = () => {
        v$.value.$reset();
        Object.assign(formData, {
          newPassword: '',
          confirmNewPassword: '',
        });
        base64Image.value = '';
      };

      return {
        base64Image,
        isLoading,
        formData,
        v$,
        handleImageUploaded,
        handleSubmit,
        getErrorMessage,
      };
    },
  });
</script>

<style scoped>
  @import url(./profile-styles.css);
</style>
