<template>
  <Autocomplete
    id="source-account"
    label="Moneda"
    :suggestions="sourceAccounts"
    :displayKey="'name'"
    placeholder="Buscar cuenta de origen..."
    mode="single"
    v-model="selectedSourceAccount"
  />

  <!-- Second Autocomplete for Users -->
  <Autocomplete
    id="destination-user"
    label="Usuario Destino"
    :suggestions="users"
    :displayKey="'email'"
    placeholder="Buscar usuario destino..."
    mode="single"
    v-model="selectedDestinationUser"
  />

  <Input
    label="Monto"
    id="amount"
    type="number"
    placeholder="0.00"
    v-model="transferAmount"
  />

  <Button type="button" :full-width="true" icon="check" @click="onSubmit">
    Confirmar
  </Button>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import Input from '../../shared/Input/Input.vue';
  import Autocomplete from '../../shared/Autocomplete/Autocomplete.vue';
  import Button from '../../shared/Button/Button.vue';
  import { fetchUsers } from '../../auth/auth-service';
  import { AddFundsService } from './add-funds-service';
import Swal from 'sweetalert2';

  export default defineComponent({
    name: 'AddFunds',
    components: {
      Input,
      Autocomplete,
      Button,
    },
    setup() {
      const transferAmount = ref<string>('');
      const users = ref<any[]>([]);
      const selectedSourceAccount = ref<any>(null);
      const selectedDestinationUser = ref<any>(null);

      const addFundsService = new AddFundsService();

      onMounted(async () => {
        try {
          const fetchedUsers = await fetchUsers();
          users.value = fetchedUsers;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      });

      const sourceAccounts = ref([
        { id: 1, name: 'USD', value: 'USD' },
        { id: 2, name: 'COP', value: 'COP' },
      ]);

      const clearForm = () => {
        transferAmount.value = '';
        selectedSourceAccount.value = sourceAccounts.value[0];
        selectedDestinationUser.value = null;
      };

      const onSubmit = async () => {
        try {
          if (!transferAmount.value || Number(transferAmount.value) <= 0) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'El monto debe ser mayor a cero.',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            return;
          }

          if (!selectedSourceAccount.value) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Debe seleccionar una cuenta de origen.',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            return;
          }

          if (!selectedDestinationUser.value) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Debe seleccionar un usuario destino.',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            return;
          }

          const selectedCurrency = selectedSourceAccount.value.value;

          const body = {
            amount: Number(transferAmount.value),
            currency: selectedCurrency,
          };

          await addFundsService.addFunds(
            body,
            selectedDestinationUser.value.id
          );

          const message = `Fondos transferidos a la cuenta: ${selectedDestinationUser.value.email} ${body.amount} ${body.currency}.`;
          Swal.fire({
            icon: 'success',
            title: 'Transferencia exitosa',
            text: message,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });
          clearForm();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en la transferencia',
            text: 'Hubo un problema al realizar la transferencia.',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });

          console.error('Error during transfer:', error);
        }
      };

      return {
        sourceAccounts,
        users,
        selectedSourceAccount,
        selectedDestinationUser,
        transferAmount,
        onSubmit,
      };
    },
  });
</script>

<style scoped>
  /* @import url(./withdraw-styles.css); */
</style>
