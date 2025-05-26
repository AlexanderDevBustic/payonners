<template>
  <nav class="navbar-register">
    <div class="navbar-image">
      <img src="../assets/img/logo.png" alt="logo" />
    </div>
    <div class="navbar-login" @click="goToLogin">Inicia sesión</div>
  </nav>
  <div class="content-register">
    <form @submit.prevent="handleSubmit">
      <div class="form-flex-register">
        <Input
          v-model="formData.firstName"
          label="Nombres"
          icon="person"
          type="text"
          placeholder="Nombres"
          :errorMessage="getErrorMessage(v$.formData.firstName)"
          class="form-row"
        />
        <Input
          v-model="formData.lastName"
          label="Apellidos"
          icon="person"
          type="text"
          placeholder="Apellidos"
          :errorMessage="getErrorMessage(v$.formData.lastName)"
          class="form-row"
        />
      </div>

      <Input
        v-model="formData.identification"
        label="Identificación"
        icon="badge"
        type="text"
        placeholder="Identificación"
        :errorMessage="getErrorMessage(v$.formData.identification)"
      />

      <div class="form-flex-register">
        <Input
          v-model="formData.email"
          label="Correo Electrónico"
          icon="email"
          type="email"
          placeholder="Correo Electrónico"
          :errorMessage="getErrorMessage(v$.formData.email)"
          class="form-row"
        />
        <Input
          v-model="formData.password"
          label="Contraseña"
          icon="lock"
          type="password"
          placeholder="Contraseña"
          :errorMessage="getErrorMessage(v$.formData.password)"
          class="form-row"
        />
      </div>

      <div class="form-flex-register">
        <Input
          v-model="formData.state"
          label="Estado"
          icon="public"
          type="text"
          placeholder="Estado"
          :errorMessage="getErrorMessage(v$.formData.state)"
          class="form-row"
        />
        <Input
          v-model="formData.country"
          label="País"
          icon="location_on"
          type="text"
          placeholder="País"
          :errorMessage="getErrorMessage(v$.formData.country)"
          class="form-row"
        />
      </div>

      <Input
        v-model="formData.address"
        label="Dirección"
        icon="home"
        type="text"
        placeholder="Dirección"
        :errorMessage="getErrorMessage(v$.formData.address)"
      />

      <div class="form-flex-register">
        <Autocomplete
          v-model="selectedPrefix"
          :suggestions="prefixSuggestions"
          displayKey="prefix"
          placeholder=""
          mode="single"
          label="Prefijo"
          class="autocomplete-input"
        />
        <Input
          v-model="formData.phoneNumber"
          label="Número de Teléfono"
          icon="phone"
          type="text"
          placeholder="Número de Teléfono"
          :errorMessage="getErrorMessage(v$.formData.phoneNumber)"
          class="phone-number-input"
        />
      </div>

      <Button
        icon="login"
        type="submit"
        :fullWidth="true"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Cargando...' : 'Registrarse' }}
      </Button>
    </form>
  </div>
  <div class="footer-register">
    <p>Millones de clientes en todo el mundo confían en Payoneer</p>
    <p>Elegida por los marketplaces líderes</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, type Ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  minLength,
  helpers,
  email,
} from '@vuelidate/validators';
import { getErrorMessage } from '../utils/validationUtils';
import { useRouter } from 'vue-router';
import Button from '../shared/Button/Button.vue';
import Input from '../shared/Input/Input.vue';
import Autocomplete from '../shared/Autocomplete/Autocomplete.vue';
import { showToast } from '../shared/Toast/toast-service';
import { fetchCountryPrefixes } from './auth-service';
import type { CountryPrefix } from './auth.interfaces';

export default defineComponent({
  components: {
    Button,
    Input,
    Autocomplete,
  },
  setup() {
    const router = useRouter();
    const formData = reactive({
      firstName: '',
      lastName: '',
      identification: '',
      email: '',
      password: '',
      country: '',
      state: '',
      address: '',
      phoneNumber: '',
    });

    const selectedPrefix = ref<CountryPrefix | {}>({});
    const prefixSuggestions: Ref<CountryPrefix[]> = ref([]);

    onMounted(() => {
      localStorage.removeItem("USER_FORM")
    })

    onMounted(async () => {
      try {
        const prefixes = await fetchCountryPrefixes();
        prefixSuggestions.value = prefixes;
      } catch (err) {
        console.error(err);
      }
    });

    const isLoading = ref(false);

    const goToLogin = () => {
      router.push({ name: 'auth' });
    };

    const isValidPhoneNumberWithPrefix = helpers.withMessage(
      'El número de teléfono es requerido y debe tener un prefijo seleccionado',
      (_) => {
        return (
          selectedPrefix.value && Object.keys(selectedPrefix.value).length > 0
        );
      }
    );

    const isNumericOnly = helpers.withMessage(
      'El número de teléfono solo puede contener números',
      (value: string) => {
        return /^\d+$/.test(value);
      }
    );

    const rules = {
      formData: {
        firstName: {
          required: helpers.withMessage('El nombre es requerido', required),
          minLength: helpers.withMessage(
            'El nombre debe tener al menos 3 caracteres',
            minLength(3)
          ),
        },
        lastName: {
          required: helpers.withMessage(
            'Los apellidos son requeridos',
            required
          ),
          minLength: helpers.withMessage(
            'Los apellidos deben tener al menos 3 caracteres',
            minLength(3)
          ),
        },
        identification: {
          required: helpers.withMessage(
            'La identificación es requerida',
            required
          ),
        },
        email: {
          required: helpers.withMessage(
            'El correo electrónico es requerido',
            required
          ),
          email: helpers.withMessage(
            'Por favor ingrese un correo electrónico válido',
            email
          ),
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
        country: {
          required: helpers.withMessage('El país es requerido', required),
        },
        state: {
          required: helpers.withMessage('El estado es requerido', required),
        },
        address: {
          required: helpers.withMessage(
            'La dirección es requerida',
            required
          ),
        },
        phoneNumber: {
          required: helpers.withMessage(
            'El número de teléfono es requerido',
            required
          ),
          isValidPhoneNumberWithPrefix,
          isNumericOnly
        },
      },
    };

    const v$ = useVuelidate(rules, { formData });

    const handleSubmit = async () => {
      const isValid = await v$.value.$validate();
      if (!isValid) return;

      isLoading.value = true;

      try {
        localStorage.setItem("USER_FORM", JSON.stringify(formData))
        router.push({ name: 'register-payment' });
      } catch (error) {
        showToast('Error al registrar el usuario', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      v$,
      handleSubmit,
      getErrorMessage,
      isLoading,
      goToLogin,
      selectedPrefix,
      prefixSuggestions,
    };
  },
});
</script>

<style scoped>
  @import url(./auth-styles.css);
</style>
