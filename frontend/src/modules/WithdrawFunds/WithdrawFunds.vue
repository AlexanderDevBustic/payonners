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
  import { WithdrawFundsService } from './withdraw-funds-service';
import Swal from 'sweetalert2';

  export default defineComponent({
    name: 'WithdrawFunds',
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

      onMounted(async () => {
        try {
          const fetchedUsers = await fetchUsers();
          users.value = fetchedUsers;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      });

      const withdrawFundsService = new WithdrawFundsService();

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
          // Validate transfer amount
          if (!transferAmount.value || Number(transferAmount.value) <= 0) {
            // Error toast using SweetAlert2
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'El monto debe ser mayor a cero.',
              showConfirmButton: false,
              timer: 3000, // Auto-close after 3 seconds
              timerProgressBar: true,
            });
            return;
          }

          // Validate source account selection
          if (!selectedSourceAccount.value) {
            // Error toast using SweetAlert2
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Debe seleccionar una cuenta de origen.',
              showConfirmButton: false,
              timer: 3000, // Auto-close after 3 seconds
              timerProgressBar: true,
            });
            return;
          }

          // Validate destination user selection
          if (!selectedDestinationUser.value) {
            // Error toast using SweetAlert2
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Debe seleccionar un usuario destino.',
              showConfirmButton: false,
              timer: 3000, // Auto-close after 3 seconds
              timerProgressBar: true,
            });
            return;
          }

          // Prepare the request body
          const selectedCurrency = selectedSourceAccount.value.value;

          const body = {
            amount: Number(transferAmount.value),
            currency: selectedCurrency,
            accountId: 0,
          };

          // Perform the funds withdrawal
          await withdrawFundsService.withdrawFunds(
            body,
            selectedDestinationUser.value.id
          );

          // Success message using SweetAlert2
          const message = `Fondos quitados a la cuenta: ${selectedDestinationUser.value.email} ${body.amount} ${body.currency}.`;
          Swal.fire({
            icon: 'success',
            title: 'Transferencia exitosa',
            text: message,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
          });

          console.log(body);

          // Clear the form
          clearForm();
        } catch (error) {
          // Error alert using SweetAlert2
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
