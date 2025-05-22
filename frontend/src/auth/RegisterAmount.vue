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
        <p>¿Cuál es el volumen mensual en recibir o cobros globales?</p>
        <p>Por favor, selecciona lo que mejor te describe:</p>
      </div>

      <div class="flex-amounts">
        <div
          v-for="(amount, index) in amounts"
          :key="index"
          :class="[
            'custom-button',
            'custom-button-item',
            { selected: selectedAmount === amount },
          ]"
          @click="selectAmount(amount)"
        >
          {{ amount }}
        </div>
      </div>

      <Button
        v-if="showConfirm"
        icon="login"
        type="submit"
        :fullWidth="true"
        @click="confirmSelection"
      >
        Confirmar
      </Button>
    </div>
  </div>
  <div class="footer-register">
    <p>Millones de clientes en todo el mundo confían en Banco Digital Payonners</p>
    <p>Elegida por los marketplaces líderes</p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router';

  import Button from '../shared/Button/Button.vue';
  import { signUp } from './auth-service';
  import Swal from 'sweetalert2';

  export default defineComponent({
    components: {
      Button,
    },
    setup() {
      const router = useRouter();
      const amounts = ref([
        '0 a 500 USD',
        '500 a 5.000 USD',
        '5.000 a 10.000 USD',
        'Más de 10.000 USD',
      ]);
      const showConfirm = ref<boolean>(false);

      const selectedAmount = ref<string | null>(null);

      const selectAmount = (amount: string) => {
        selectedAmount.value = amount;
        showConfirm.value = true;
      };

      const confirmSelection = async () => {
        if (selectedAmount.value) {
          const formData = localStorage.getItem('USER_FORM');

          try {
            if (formData !== null) {
              const json = JSON.parse(formData);
              await signUp(json);
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Usuario registrado',
                showConfirmButton: false,
                timer: 3000, // Auto-close after 3 seconds
                timerProgressBar: true,
              });
              router.push({ name: 'auth' });
            }
          } catch (error) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'El correo ya existe',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            console.error(error);
          }
        }
      };

      const goToLogin = () => {
        router.push({ name: 'auth' });
      };

      return {
        amounts,
        selectedAmount,
        selectAmount,
        showConfirm,
        confirmSelection,
        goToLogin,
      };
    },
  });
</script>

<style scoped>
  @import url(./auth-styles.css);
</style>
