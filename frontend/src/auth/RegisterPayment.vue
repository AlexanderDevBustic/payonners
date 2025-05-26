<template>
  <nav class="navbar-register">
    <div class="navbar-image">
      <img src="../assets/img/logo.png" alt="logo" />
    </div>
    <div class="navbar-login" @click="goToLogin">Inicia sesión</div>
  </nav>
  <div class="content-register">
    <div>
      <div class="flex-justify">
        <p>Encontremos la cuenta adecuada para tus necesidades</p>
        <p>Por favor, selecciona lo que mejor te describe</p>
      </div>
      <div class="flex-buttons">
        <div class="custom-button" @click="goToAmount">
          Recibir o enviar
        </div>
        <div class="custom-button" @click="goToAmount">
          Cobrar y enviar
        </div>
      </div>
    </div>
  </div>
  <div class="footer-register">
    <p>Millones de clientes en todo el mundo confían en Payoneer</p>
    <p>Elegida por los marketplaces líderes</p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { getErrorMessage } from '../utils/validationUtils';
  import { useRouter } from 'vue-router';
  import Button from '../shared/Button/Button.vue';
  import Input from '../shared/Input/Input.vue';
  import Autocomplete from '../shared/Autocomplete/Autocomplete.vue';

  export default defineComponent({
    components: {
      Button,
      Input,
      Autocomplete,
    },
    setup() {
      const router = useRouter();

      const goToLogin = () => {
        router.push({ name: 'auth' });
      };

      const goToAmount = () => {
        router.push({ name: 'register-amount' });
      };

      return {
        getErrorMessage,
        goToLogin,
        goToAmount
      };
    },
  });
</script>

<style scoped>
  @import url(./auth-styles.css);
</style>
