<template>
  <Datatable
    :data="transacctions"
    :columns="columns"
    :totalItems="transacctions.length"
    :itemsPerPage="transacctions.length"
    :currentPage="1"
    :hideActions="true"
    :hideCreate="true"
    :hidePagination="true"
  >
    <template #cell-createdAt="{ value }">
      <span class="custom-date">
        {{ formatDate(value) }}
      </span>
    </template>
    <template #cell-previousBalance="{ value }">
      {{ value }} COP
    </template>
    <template #cell-newBalance="{ value }">
      {{ value }} COP
    </template>
    <template #cell-amount="{ value }">
      {{ value }} COP
    </template>
  </Datatable>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { TokenService } from '../../../auth/auth-jwt-service';
  import { TransacctionService } from './transacctions-service';
  import type { Transacction } from './transacctions.interfaces';

  import Datatable from '../../../shared/Datatable/Datatable.vue';
  import type { Column } from '../../../shared/Datatable/Datatable.vue';

  export default defineComponent({
    name: 'Transacctions',
    components: {
      Datatable,
    },
    setup() {
      const role = ref<string>(TokenService.getClaim('role'));
      const userId = ref<number>(TokenService.getClaim('sub'));
      const transacctions = ref<Transacction[]>([]);

      const transacctionService = new TransacctionService();

      const columns: Column[] = [
        { key: 'type', label: 'Tipo', sortable: true },
        { key: 'amount', label: 'Monto', sortable: true },
        { key: 'previousBalance', label: 'Saldo Anterior', sortable: true },
        { key: 'newBalance', label: 'Saldo Nuevo', sortable: true },
        { key: 'createdAt', label: 'Fecha', sortable: true },
        { key: 'currency', label: 'Moneda', sortable: true },
      ];

      const fetchTransacctions = async () => {
        if (role.value === 'ADMIN') {
          transacctions.value = await transacctionService.getAllTransacctions();
        } else {
          transacctions.value =
            await transacctionService.getTransacctionsByUserId(userId.value);
        }
      };

      const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      onMounted(async () => {
        await fetchTransacctions();
      });

      return {
        transacctions,
        columns,
        formatDate,
      };
    },
  });
</script>
