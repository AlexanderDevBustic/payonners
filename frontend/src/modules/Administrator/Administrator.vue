<template>
  <div v-if="!show" class="list-administrator">
    <div class="item" @click="optionSelected('transaction')">
      <img src="../../assets/img/arrows.png" alt="transaction" />
      <p>Transacciones</p>
    </div>
    <div class="item" @click="optionSelected('account')">
      <img src="../../assets/img/bank.png" alt="account" />
      <p>Cuentas bancarias propias</p>
    </div>
  </div>
  <div class="back" v-if="show">
    <span class="material-icons" @click="goBack"> arrow_back </span>
    <p>{{ current }}</p>
  </div>
  <Accounts v-if="show && showAccounts" />
  <Transacctions v-if="show && showTransactions" />
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Accounts from './Accounts/Accounts.vue';
  import Transacctions from './Transacctions/Transacctions.vue';

  export default defineComponent({
    name: 'Administrator',
    components: {
      Accounts,
      Transacctions,
    },
    setup() {
      const show = ref<boolean>(false);
      const showAccounts = ref<boolean>(false);
      const showTransactions = ref<boolean>(false);
      const current = ref<string>("")

      const optionSelected = (option: string) => {
        show.value = true;
        if (option === 'transaction') {
          showTransactions.value = true;
          showAccounts.value = false;
          current.value = "Transacciones"
        } else {
          showTransactions.value = false;
          showAccounts.value = true;
          current.value = "Cuentas bancarias propias"
        }
      };

      const goBack = () => {
        show.value = false
      }

      return {
        show,
        showAccounts,
        showTransactions,
        current,
        optionSelected,
        goBack
      };
    },
  });
</script>

<style scoped>
  @import url(./administrator-styles.css);
</style>
