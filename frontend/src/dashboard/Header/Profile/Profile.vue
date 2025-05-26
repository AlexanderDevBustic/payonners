<template>
  <div class="profile-container">
    <div class="profile-container-left">
      <CircleAvatarBase64 @image-uploaded="handleImageUploaded" />
    </div>

    <form class="profile-container-form" @submit.prevent="handleSubmit">
      <div class="flex-row">
        <Checkbox class="flex-input" v-model="DoNotDisturb">
          No molestar
        </Checkbox>
        <Checkbox class="flex-input" v-model="Notification">
          Notificacion buzon de voz
        </Checkbox>
      </div>
      <div class="flex-row">
        <Input
          v-model="formData.pinCorreoVoz"
          label="Pin correo de voz"
          icon="voice_chat"
          type="text"
          placeholder="Pin correo de voz"
          :errorMessage="getErrorMessage(v$.formData.pinCorreoVoz)"
          class="flex-input"
        />
        <Input
          v-model="formData.numeroExtension"
          label="Numero de extension"
          icon="tag"
          type="text"
          placeholder="Numero de extension"
          :errorMessage="getErrorMessage(v$.formData.numeroExtension)"
          class="flex-input"
        />
      </div>
      <Input
        v-model="formData.currentPassword"
        label="Contraseña actual"
        icon="lock"
        type="password"
        placeholder="Digita tu contraseña actual"
        :errorMessage="getErrorMessage(v$.formData.currentPassword)"
      />
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
  import { required, minLength, sameAs, helpers } from '@vuelidate/validators';

  import Button from '../../../shared/Button/Button.vue';
  import Input from '../../../shared/Input/Input.vue';
  import Checkbox from '../../../shared/Checkbox/Checkbox.vue';
  import CircleAvatarBase64 from '../../../shared/CircleAvatarBase64/CircleAvatarBase64.vue';

  export default defineComponent({
    name: 'Profile',
    components: { Button, Input, Checkbox, CircleAvatarBase64 },
    setup() {
      const base64Image = ref<string>('');
      const DoNotDisturb = ref<boolean>(false);
      const Notification = ref<boolean>(false);
      const isLoading = ref<boolean>(false);

      const formData = reactive({
        pinCorreoVoz: '',
        numeroExtension: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });

      const rules = {
        formData: {
          pinCorreoVoz: {
            required: helpers.withMessage(
              'El Pin correo de voz es requerido',
              required
            ),
            minLength: helpers.withMessage(
              'El Pin correo de voz debe tener al menos 4 caracteres',
              minLength(4)
            ),
          },
          numeroExtension: {
            required: helpers.withMessage(
              'El Numero de extension es requerido',
              required
            ),
            minLength: helpers.withMessage(
              'El Numero de extension debe tener al menos 3 caracteres',
              minLength(3)
            ),
          },
          currentPassword: {
            required: helpers.withMessage(
              'La contraseña actual es requerida',
              required
            ),
            minLength: helpers.withMessage(
              'La contraseña actual debe tener al menos 6 caracteres',
              minLength(6)
            ),
          },
          newPassword: {
            required: helpers.withMessage(
              'La nueva contraseña es requerida',
              required
            ),
            minLength: helpers.withMessage(
              'La nueva contraseña debe tener al menos 6 caracteres',
              minLength(6)
            ),
          },
          confirmNewPassword: {
            required: helpers.withMessage(
              'Debes confirmar la nueva contraseña',
              required
            ),
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
        const isValid = await v$.value.$validate();
        if (!isValid) return;

        isLoading.value = true;

        try {
          console.log('Datos del formulario:', formData);
          alert('Perfil actualizado con éxito');
          resetFormData();
        } catch (error) {
          console.error('Error al actualizar el perfil:', error);
          alert(
            'Ocurrió un error al actualizar el perfil. Por favor, intenta de nuevo.'
          );
        } finally {
          isLoading.value = false;
        }
      };

      const resetFormData = () => {
        v$.value.$reset();
        DoNotDisturb.value = false;
        Notification.value = false;
        Object.assign(formData, {
          pinCorreoVoz: '',
          numeroExtension: '',
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      };

      return {
        base64Image,
        isLoading,
        formData,
        v$,
        handleImageUploaded,
        handleSubmit,
        getErrorMessage,
        DoNotDisturb,
        Notification,
      };
    },
  });
</script>

<style scoped>
  @import url(./profile-styles.css);
</style>
