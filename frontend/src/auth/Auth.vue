<template>
  <div class="auth-bg">
    <form class="form-auth" @submit.prevent="handleSubmit">
      <div class="logo-container">
        <img src="../assets/img/logo.png" alt="logo" />
      </div>
      <Input
        v-model="formData.email"
        label="Correo"
        icon="email"
        type="text"
        placeholder="Digita tu correo"
        :errorMessage="getErrorMessage(v$.formData.email)"
      />
      <Input
        v-model="formData.password"
        label="Contraseña"
        type="password"
        icon="lock"
        placeholder="Digita tu contraseña"
        :errorMessage="getErrorMessage(v$.formData.password)"
      />
      <p class="old-login">
        ¿No tienes una cuenta?
        <a @click="goToRegister">Entra Aca</a>
      </p>
      <Button
        icon="login"
        type="submit"
        :fullWidth="true"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Cargando...' : 'Ingresar' }}
      </Button>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useVuelidate } from '@vuelidate/core';
  import { required, minLength, helpers, email } from '@vuelidate/validators';
  import { getErrorMessage } from '../utils/validationUtils';
  import { login } from './auth-service';

  import { useRouter } from 'vue-router';
  import Button from '../shared/Button/Button.vue';
  import Input from '../shared/Input/Input.vue';
  import { showToast } from '../shared/Toast/toast-service';

  export default defineComponent({
    components: {
      Button,
      Input,
    },
    setup() {
      const router = useRouter();
      const formData = reactive({
        email: '',
        password: '',
      });
      const isLoading = ref(false);

      const goToRegister = () => {
        router.push({ name: 'register' });
      };

      const rules = {
        formData: {
          email: {
            required: helpers.withMessage(
              'El correo es requerido',
              required
            ),
            email: helpers.withMessage('El correo no es válido', email),
          },
          password: {
            required: helpers.withMessage(
              'La contraseña es requerida',
              required
            ),
            minLength: helpers.withMessage(
              'La contraseña debe tener al menos 6 caracteres',
              minLength(6)
            ),
          },
        },
      };

      const v$ = useVuelidate(rules, { formData });

      const handleSubmit = async () => {
        const isValid = await v$.value.$validate();
        if (!isValid) return;

        isLoading.value = true;

        try {
          await login(formData);
          showToast('Usuario ingresado correctamente', 'success')
          router.push({ name: 'dashboard' });
        } catch (error) {
          showToast('El usuario o contraseña no es correcto', 'error');
        } finally {
          isLoading.value = false;
        }
      };

      onMounted(() => {
        localStorage.removeItem("USER_FORM")
      })

      return {
        formData,
        v$,
        handleSubmit,
        getErrorMessage,
        isLoading,
        goToRegister,
      };
    },
  });
</script>

<style scoped>
  @import url(./auth-styles.css);
</style>
