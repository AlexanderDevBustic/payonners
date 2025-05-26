<template>
  <div class="data-table">
    <Button v-if="!hideCreate" class="create-button" @click="$emit('create')">Create</Button>
    <div class="search-bar">
      <Input v-model="searchQuery" placeholder="Search..." icon="search" />
      <Dropdown
        v-if="!hidePagination"
        :options="itemsPerPageOptions"
        :placeholder="'Mostrar: ' + itemsPerPage"
        @selectOption="updateItemsPerPage"
      />
    </div>
    <div class="table-container">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                @click="sortData(column.key)"
                :class="{
                  sortable: column.sortable,
                  active: sortKey === column.key,
                }"
              >
                {{ column.label }}
                <span v-if="column.sortable && sortKey === column.key">
                  <i class="material-icons icon-sort">{{
                    sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'
                  }}</i>
                </span>
              </th>
              <th v-if="!hideActions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in sortedData" :key="index">
              <td v-for="column in columns" :key="column.key">
                <slot
                  :name="`cell-${column.key}`"
                  :value="row[column.key]"
                  :row="row"
                >
                  {{ row[column.key] }}
                </slot>
              </td>
              <td v-if="!hideActions" class="actions-cell">
                <slot name="actions" :row="row">
                  <!-- Default action buttons -->
                  <Button icon="edit" @click="$emit('edit', row)" />
                  <Button icon="visibility" @click="$emit('view', row)" />
                  <Button icon="delete" @click="$emit('delete', row)" />
                </slot>
              </td>
            </tr>
            <tr v-if="sortedData.length === 0">
              <td :colspan="columns.length + 1" class="empty-state">
                No hay data por mostrar
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Paginator
      v-if="!hidePagination"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      @update:currentPage="onPageChange"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import Paginator from '../Paginator/Paginator.vue';
  import Input from '../Input/Input.vue';
  import Button from '../Button/Button.vue';
  import Dropdown from '../Dropdown/Dropdown.vue';

  export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
  }

  interface Row {
    [key: string]: any;
  }

  export default defineComponent({
    name: 'DataTable',
    components: { Paginator, Input, Button, Dropdown },
    props: {
      data: {
        type: Array as () => Row[],
        required: true,
      },
      columns: {
        type: Array as () => Column[],
        required: true,
      },
      totalItems: {
        type: Number,
        required: true,
      },
      itemsPerPage: {
        type: Number,
        required: true,
      },
      currentPage: {
        type: Number,
        required: true,
      },
      hidePagination: {
        type: Boolean,
        default: false,
      },
      hideActions: {
        type: Boolean,
        default: false,
      },
      hideCreate: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['create', 'edit', 'view', 'delete', 'update:page'],
    setup(props, { emit }) {
      const searchQuery = ref('');
      const sortKey = ref<string | null>(null);
      const sortOrder = ref<'asc' | 'desc'>('asc');
      const itemsPerPageOptions = ['10', '25', '50', '100', '200'];

      const filteredData = computed(() => {
        if (!searchQuery.value) return props.data;
        return props.data.filter((row: Row) =>
          Object.values(row).some((value: any) =>
            String(value)
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
          )
        );
      });

      const sortedData = computed(() => {
        if (!sortKey.value) return filteredData.value;
        return [...filteredData.value].sort((a: Row, b: Row) => {
          const valA = a[sortKey.value!];
          const valB = b[sortKey.value!];
          if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
          if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
          return 0;
        });
      });

      const sortData = (key: string) => {
        const column = props.columns.find((col) => col.key === key);
        if (!column || !column.sortable) return;

        if (sortKey.value === key) {
          sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
        } else {
          sortKey.value = key;
          sortOrder.value = 'asc';
        }
      };

      const onPageChange = (newPage: number) => {
        emit('update:page', newPage, props.itemsPerPage);
      };

      const updateItemsPerPage = (option: string) => {
        const newItemsPerPage = Number(option);
        emit('update:page', 1, newItemsPerPage);
      };

      return {
        searchQuery,
        sortKey,
        sortOrder,
        itemsPerPageOptions,
        sortedData,
        sortData,
        onPageChange,
        updateItemsPerPage,
      };
    },
  });
</script>

<style scoped>
  @import url(./datatable-styles.css);
</style>
