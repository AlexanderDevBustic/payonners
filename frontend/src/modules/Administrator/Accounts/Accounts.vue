<template>
  <div class="add">
    <Button
      :icon="showForm ? 'arrow_back' : 'add'"
      type="button"
      @click="showAddForm"
    >
      {{ showForm ? 'Volver a cuentas' : 'Añadir cuenta propia' }}
    </Button>
  </div>

  <FormAccount v-if="showForm" @account-added="handleAccountAdded" />

  <div v-if="!showForm" class="accounts-grid">
    <div v-for="account in bankAccounts" :key="account.id" class="account-card">
      <h3>{{ account.accountHolder }}</h3>
      <p>
        <strong>Número de identificación:</strong>
        {{ account.identificationNumber }}
      </p>
      <p><strong>Banco:</strong> {{ account.bankName }}</p>
      <p><strong>Número de cuenta:</strong> {{ account.accountNumber }}</p>
      <p><strong>Tipo de cuenta:</strong> {{ account.accountType }}</p>
      <p><strong>País:</strong> {{ account.country }}</p>
      <p><strong>Moneda:</strong> {{ account.currency }}</p>
      <p><strong>Categoría de cuenta:</strong> {{ account.accountCategory }}</p>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Button from '../../../shared/Button/Button.vue';
import Input from '../../../shared/Input/Input.vue';
import FormAccount from './FormAccount/FormAccount.vue';
import Modal from '../../../shared/Modal/Modal.vue';
import { TokenService } from '../../../auth/auth-jwt-service';
import { BankAccountService } from './accounts-service';
import type { BankAccountResponseDto } from './accounts.interfaces';

export default defineComponent({
  name: 'Accounts',
  components: {
    Button,
    Input,
    FormAccount,
    Modal,
  },
  setup() {
    const showForm = ref<boolean>(false);
    const role = ref<string>(TokenService.getClaim('role'));
    const userId = ref<number>(TokenService.getClaim('sub'));
    const bankAccounts = ref<BankAccountResponseDto[]>([]);

    const bankAccountService = new BankAccountService();

    const fetchBankAccounts = async () => {
      if (role.value === 'ADMIN') {
        bankAccounts.value = await bankAccountService.getAllBankAccounts();
      } else {
        bankAccounts.value = await bankAccountService.getBankAccountsByUserId(userId.value);
      }
    };

    onMounted(async () => {
      await fetchBankAccounts();
    });

    const handleAccountAdded = async () => {
      showForm.value = false;
      await fetchBankAccounts();
    };

    const showAddForm = () => {
      showForm.value = !showForm.value;
    };

    return {
      showForm,
      showAddForm,
      handleAccountAdded,
      role,
      bankAccounts,
    };
  },
});
</script>

<style scoped>
  @import url(./accounts-style.css);
</style>
