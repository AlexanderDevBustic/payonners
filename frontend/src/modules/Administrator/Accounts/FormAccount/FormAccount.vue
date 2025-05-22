<template>
  <form @submit.prevent="handleSubmit" class="form-bank-account">
    <Autocomplete
      v-model="formData.accountType"
      label="Tipo de cuenta bancaria"
      icon="credit_card"
      placeholder="Personal o Negocio"
      :suggestions="accountTypeOptions"
      :errorMessage="getErrorMessage(v$.formData.accountType)"
    />

    <Autocomplete
      v-model="formData.country"
      label="País del banco"
      icon="public"
      type="text"
      placeholder="Enter country"
      :suggestions="countries"
      :errorMessage="getErrorMessage(v$.formData.country)"
    />

    <Autocomplete
      v-model="formData.currency"
      label="Selecciona la moneda de la cuenta bancaria"
      icon="attach_money"
      placeholder="COP, USD"
      :suggestions="currencyOptions"
      :errorMessage="getErrorMessage(v$.formData.currency)"
    />

    <Input
      v-model="formData.accountHolder"
      label="Nombre del titular de la cuenta"
      icon="person"
      type="text"
      placeholder="Nombre del titular de la cuenta"
      :errorMessage="getErrorMessage(v$.formData.accountHolder)"
    />

    <Input
      v-model="formData.bankName"
      label="Nombre del banco"
      icon="account_balance"
      type="text"
      placeholder="Nombre del banco"
      :errorMessage="getErrorMessage(v$.formData.bankName)"
    />

    <Input
      v-model="formData.identificationNumber"
      label="Número de cédula de ciudadanía"
      icon="badge"
      type="text"
      placeholder="Número de cédula de ciudadanía"
      :errorMessage="getErrorMessage(v$.formData.identificationNumber)"
    />

    <Input
      v-model="formData.accountNumber"
      label="Número de cuenta"
      icon="credit_card"
      type="text"
      placeholder="Número de cuenta"
      :errorMessage="getErrorMessage(v$.formData.accountNumber)"
    />

    <Autocomplete
      v-model="formData.accountCategory"
      label="Tipo de cuenta"
      icon="category"
      type="text"
      placeholder="Cuenta Corriente o Cuenta Ahorros"
      :suggestions="accountCategoryOptions"
      :errorMessage="getErrorMessage(v$.formData.accountCategory)"
    />

    <Button type="submit" :full-width="true" icon="add"> Crear cuenta </Button>
  </form>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { required, helpers } from '@vuelidate/validators';
  import { fetchCountries } from '../../../../auth/auth-service';
  import { TokenService } from '../../../../auth/auth-jwt-service';
  import useVuelidate from '@vuelidate/core';

  import Input from '../../../../shared/Input/Input.vue';
  import Autocomplete from '../../../../shared/Autocomplete/Autocomplete.vue';
  import Button from '../../../../shared/Button/Button.vue';
  import { BankAccountService } from '../accounts-service';
import Swal from 'sweetalert2';

  export default defineComponent({
    name: 'FormBankAccount',
    components: {
      Input,
      Autocomplete,
      Button,
    },
    emits: ['account-added'],
    setup(_, { emit }) {
      const bankAccountService = new BankAccountService();

      const formData = reactive({
        identificationNumber: '',
        accountHolder: '',
        bankName: '',
        accountNumber: '',
        accountType: '',
        country: '',
        currency: '',
        accountCategory: '',
        userId: TokenService.getClaim('sub'),
      });

      const accountTypeOptions = ref(['Personal', 'Negocio']);
      const currencyOptions = ref(['COP', 'USD']);
      const accountCategoryOptions = ref([
        'Cuenta Corriente',
        'Cuenta Ahorros',
      ]);
      const countries = ref<string[]>([]);

      onMounted(async () => {
        countries.value = await fetchCountries();
      });

      const rules = {
        formData: {
          identificationNumber: {
            required: helpers.withMessage(
              'Identification number is required',
              required
            ),
          },
          accountHolder: {
            required: helpers.withMessage(
              'Account holder name is required',
              required
            ),
          },
          bankName: {
            required: helpers.withMessage('Bank name is required', required),
          },
          accountNumber: {
            required: helpers.withMessage(
              'Account number is required',
              required
            ),
          },
          accountType: {
            required: helpers.withMessage('Account type is required', required),
            isIn: helpers.withMessage(
              'Account type must be "Personal" or "Negocio"',
              (value: string) => ['Personal', 'Negocio'].includes(value)
            ),
          },
          country: {
            required: helpers.withMessage('Country is required', required),
          },
          currency: {
            required: helpers.withMessage('Currency is required', required),
            isIn: helpers.withMessage(
              'Currency must be "COP", "USD", or "EUR"',
              (value: string) => ['COP', 'USD', 'EUR'].includes(value)
            ),
          },
          accountCategory: {
            required: helpers.withMessage(
              'Account category is required',
              required
            ),
            isIn: helpers.withMessage(
              'Account category must be "Cuenta Corriente" or "Cuenta Ahorros"',
              (value: string) =>
                ['Cuenta Corriente', 'Cuenta Ahorros'].includes(value)
            ),
          },
        },
      };

      const v$ = useVuelidate(rules, { formData });

      const isSubmitting = ref(false);

      const handleSubmit = async () => {
        if (await v$.value.$validate()) {
          isSubmitting.value = true;
          try {
            console.log('Form Data:', formData);
            await bankAccountService.createBankAccount(formData);
            emit('account-added');

            Swal.fire({
              icon: 'success',
              title: 'Cuenta agregada correctamente',
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear la cuenta',
              text: 'Hubo un error al crear la cuenta.',
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          } finally {
            isSubmitting.value = false;
          }
        }
      };

      const getErrorMessage = (field: any) => {
        return field.$errors.length > 0 ? field.$errors[0].$message : '';
      };

      return {
        formData,
        v$,
        isSubmitting,
        handleSubmit,
        getErrorMessage,
        accountTypeOptions,
        currencyOptions,
        accountCategoryOptions,
        countries,
      };
    },
  });
</script>

<style scoped></style>
