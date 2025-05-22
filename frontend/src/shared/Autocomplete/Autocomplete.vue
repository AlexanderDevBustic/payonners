<template>
  <div class="autocomplete" ref="autocompleteContainer">
    <div v-if="mode === 'multiple'" class="selected-items">
      <span
        v-for="(item, index) in selectedItems"
        :key="index"
        class="selected-item"
      >
        {{ getDisplayValue(item) }}
        <span
          class="remove-icon"
          @click.stop="removeSelectedItem(index)"
        >×</span>
      </span>
    </div>
    <Input
      :id="id"
      :modelValue="inputValue"
      :placeholder="placeholder"
      :errorMessage="errorMessage"
      :icon="icon"
      :label="label"
      @update:modelValue="onQueryUpdate"
      @click="showAllSuggestions"
    />
    <ul v-if="showSuggestions" class="suggestions" role="listbox">
      <li v-if="filteredSuggestions.length === 0" class="no-results">
        No hay resultados
      </li>
      <li
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        :id="`suggestion-${index}`"
        role="option"
        :class="{
          active: index === activeIndex,
          selected: isSelected(suggestion),
          'no-checkbox': mode === 'single',
        }"
        @click="handleSuggestionClick(suggestion)"
      >
        <Checkbox
          v-if="mode === 'multiple'"
          :modelValue="isSelected(suggestion)"
          @update:modelValue="toggleSelection(suggestion)"
          class="checkbox-autocomplete"
        >
          {{ getDisplayValue(suggestion) }}
        </Checkbox>
        <span v-if="mode === 'single'">
          {{ getDisplayValue(suggestion) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';
import Input from '../Input/Input.vue';
import Checkbox from '../Checkbox/Checkbox.vue';

export default defineComponent({
  name: 'Autocomplete',
  components: {
    Input,
    Checkbox,
  },
  props: {
    suggestions: {
      type: Array,
      required: true,
    },
    displayKey: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: () =>
        `autocomplete-${Math.random().toString(36).substr(2, 9)}`,
    },
    placeholder: {
      type: String,
      default: 'Type to search...',
    },
    errorMessage: {
      type: String,
      default: undefined,
    },
    label: {
      type: String,
      default: undefined,
    },
    icon: {
      type: String,
      default: undefined,
    },
    mode: {
      type: String,
      default: 'single',
      validator: (value: string) => ['single', 'multiple'].includes(value),
    },
    modelValue: {
      type: [String, Array, Object],
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const query = ref('');
    const activeIndex = ref(-1);
    const showSuggestions = ref(false);
    const selectedItems = ref<any[]>(
      Array.isArray(props.modelValue) ? props.modelValue : []
    );
    const autocompleteContainer = ref<HTMLElement | null>(null);

    const getDisplayValue = (suggestion: any): string => {
      if (typeof suggestion === 'string') {
        return suggestion;
      } else if (props.displayKey && suggestion[props.displayKey]) {
        return suggestion[props.displayKey];
      }
      return '';
    };

    watch(
      () => props.modelValue,
      (newValue) => {
        if (props.mode === 'multiple') {
          selectedItems.value = Array.isArray(newValue) ? newValue : [];
        } else {
          if (typeof newValue === 'object' && newValue !== null) {
            query.value = getDisplayValue(newValue);
          } else {
            query.value = newValue || '';
          }
        }
      },
      { immediate: true }
    );

    const inputValue = computed(() => {
      if (props.mode === 'single') {
        if (
          typeof props.modelValue === 'object' &&
          props.modelValue !== null
        ) {
          return getDisplayValue(props.modelValue);
        }
        return query.value || '';
      } else if (props.mode === 'multiple') {
        return query.value;
      }
      return '';
    });

    const getUniqueIdentifier = (item: any): string => {
      if (typeof item === 'string') {
        return item;
      } else if (props.displayKey && item[props.displayKey]) {
        return item[props.displayKey];
      }
      return '';
    };

    const isSelected = (suggestion: any): boolean => {
      const value = getUniqueIdentifier(suggestion);
      return selectedItems.value.some(
        (item) => getUniqueIdentifier(item) === value
      );
    };

    const filteredSuggestions = computed(() => {
      if (!query.value) {
        return props.suggestions;
      }
      return props.suggestions.filter((suggestion: any) =>
        typeof suggestion === 'string'
          ? suggestion.toLowerCase().includes(query.value.toLowerCase())
          : suggestion[props.displayKey]
              ?.toLowerCase()
              .includes(query.value.toLowerCase())
      );
    });

    const onQueryUpdate = (value: string) => {
      query.value = value;
      showSuggestions.value = true;
    };

    const showAllSuggestions = () => {
      query.value = '';
      showSuggestions.value = true;
    };

    const handleSuggestionClick = (suggestion: any): void => {
      if (props.mode === 'single') {
        query.value = getDisplayValue(suggestion);
        showSuggestions.value = false;
        emit('update:modelValue', suggestion);
      } else if (props.mode === 'multiple') {
        toggleSelection(suggestion);
      }
    };

    const toggleSelection = (suggestion: any) => {
      const value = getUniqueIdentifier(suggestion);
      const index = selectedItems.value.findIndex(
        (item) => getUniqueIdentifier(item) === value
      );
      if (index === -1) {
        selectedItems.value.push(suggestion);
      } else {
        selectedItems.value.splice(index, 1);
      }
      emit('update:modelValue', [...selectedItems.value]);
    };

    const removeSelectedItem = (index: number): void => {
      selectedItems.value.splice(index, 1);
      emit('update:modelValue', [...selectedItems.value]);
      if (selectedItems.value.length === 0) {
        query.value = '';
      }
      if (selectedItems.value.length > 0 || query.value.trim() !== '') {
        showSuggestions.value = true;
      } else {
        showSuggestions.value = false;
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteContainer.value &&
        !autocompleteContainer.value.contains(event.target as Node)
      ) {
        showSuggestions.value = false; // Close suggestions when clicking outside
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      query,
      activeIndex,
      showSuggestions,
      selectedItems,
      filteredSuggestions,
      isSelected,
      getDisplayValue,
      onQueryUpdate,
      handleSuggestionClick,
      toggleSelection,
      removeSelectedItem,
      inputValue,
      showAllSuggestions,
      autocompleteContainer,
    };
  },
});
</script>

<style scoped>
@import url(./autocomplete-styles.css);
</style>