<template>
  <div class="datetime-input-container">
    <Input
      :id="id"
      :label="label"
      :placeholder="placeholder"
      :modelValue="formattedDateTime"
      :errorMessage="errorMessage"
      :icon="icon"
      :readonly="true"
      @click.stop="togglePicker"
      ref="inputField"
    />
    <div v-if="isPickerVisible" class="picker-container" ref="pickerContainer">
      <div class="month-navigation">
        <Button icon="chevron_left" @click="prevMonth" />
        <span>{{ currentMonthName }} {{ currentYear }}</span>
        <Button icon="chevron_right" @click="nextMonth" />
      </div>
      <div class="weekday-headers">
        <div v-for="day in weekdayHeaders" :key="day">{{ day }}</div>
      </div>
      <div class="day-picker">
        <div
          v-for="(day, index) in days"
          :key="index"
          :class="[
            'day',
            { inactive: !day.isCurrentMonth },
            { active: isToday(day), selected: isSelectedDay(day) },
          ]"
          @click="selectDay(day)"
        >
          {{ day.date }}
        </div>
      </div>
      <div v-if="format" class="time-picker">
        <div class="time-input">
          <Button @click="decrementHour" :disabled="isHourMin">-</Button>
          <Input class="input-time" type="text" v-model="displayedHour" @input="validateHour" />
          <Button @click="incrementHour">+</Button>
        </div>
        <span>:</span>
        <div class="time-input">
          <Button @click="decrementMinute" :disabled="selectedMinute === '00'"
            >-</Button
          >
          <Input class="input-time" type="text" v-model="selectedMinute" @input="validateMinute" />
          <Button @click="incrementMinute">+</Button>
        </div>
        <div v-if="format === '12h'" class="am-pm-toggle">
          <Button :class="{ active: isAM }" @click="toggleAMPM('AM')"
            >AM</Button
          >
          <Button :class="{ active: !isAM }" @click="toggleAMPM('PM')"
            >PM</Button
          >
        </div>
      </div>
    </div>
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
  import Button from '../Button/Button.vue';

  type InputInstance = InstanceType<typeof Input>;

  export default defineComponent({
    name: 'InputDatetime',
    components: {
      Input,
      Button,
    },
    props: {
      id: {
        type: String,
        default: () => `datetime-${Math.random().toString(36).substr(2, 9)}`,
      },
      label: {
        type: String,
        default: undefined,
      },
      placeholder: {
        type: String,
        default: 'Selecciona',
      },
      modelValue: {
        type: [String, Date],
        default: null,
      },
      errorMessage: {
        type: String,
        default: undefined,
      },
      icon: {
        type: String,
        default: 'calendar_today',
      },
      format: {
        type: String,
        default: undefined,
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const isPickerVisible = ref(false);
      const currentDate = ref(new Date());
      const selectedDate = ref<Date | null>(null);
      const displayedHour = ref('12');
      const selectedMinute = ref('00');
      const isAM = ref(true);
      const pickerContainer = ref<HTMLElement | null>(null);
      const inputField = ref<InputInstance | null>(null);

      watch(
        () => props.modelValue,
        (newValue) => {
          if (newValue) {
            const date = new Date(newValue);
            if (isNaN(date.getTime())) return;

            selectedDate.value = date;
            let hours = date.getHours();
            const minutes = date.getMinutes();

            if (props.format === '12h') {
              isAM.value = hours < 12;
              hours = hours % 12 || 12;
            }

            displayedHour.value = String(hours).padStart(2, '0');
            selectedMinute.value = String(minutes).padStart(2, '0');
          } else {
            selectedDate.value = null;
            displayedHour.value = '12';
            selectedMinute.value = '00';
            isAM.value = true;
          }
        },
        { immediate: true }
      );

      const updateDateTime = () => {
        let date: Date;
        if (selectedDate.value) {
          date = new Date(selectedDate.value);
        } else {
          date = new Date();
          date.setHours(0, 0, 0, 0);
        }

        let hour = parseInt(displayedHour.value, 10);
        const minute = parseInt(selectedMinute.value, 10);

        if (props.format === '12h') {
          hour = isAM.value ? hour % 12 : (hour % 12) + 12;
        }

        date.setHours(hour, minute);

        emit('update:modelValue', formatDateTime(date));
      };

      const formattedDateTime = computed(() => {
        if (!selectedDate.value) return '';
        const date = new Date(selectedDate.value);
        let hour = parseInt(displayedHour.value, 10);
        const minute = parseInt(selectedMinute.value, 10);

        if (props.format === '12h') {
          hour = isAM.value ? hour % 12 : (hour % 12) + 12;
        }

        date.setHours(hour, minute);
        return formatDateTime(date);
      });

      const formatDateTime = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day}`;

        if (!props.format) {
          return formattedDate;
        }

        const hour = date.getHours();
        const minute = date.getMinutes();
        const formattedTime = `${String(hour % 24).padStart(2, '0')}:${String(
          minute
        ).padStart(2, '0')}`;

        if (props.format === '12h') {
          const isAM = hour < 12;
          const displayHour = hour % 12 || 12;
          const period = isAM ? 'AM' : 'PM';
          return `${formattedDate} ${String(displayHour).padStart(
            2,
            '0'
          )}:${String(minute).padStart(2, '0')} ${period}`;
        }

        if (props.format === '24h') {
          return `${formattedDate} ${formattedTime}`;
        }

        return formattedDate;
      };

      const currentMonthName = computed(() => {
        return currentDate.value.toLocaleString('default', { month: 'long' });
      });

      const currentYear = computed(() => {
        return currentDate.value.getFullYear();
      });

      const weekdayHeaders = computed(() => {
        return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      });

      const days = computed(() => {
        const year = currentDate.value.getFullYear();
        const month = currentDate.value.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const daysInMonth = lastDayOfMonth.getDate();
        const startDayOfWeek = firstDayOfMonth.getDay();

        const daysArray = [];

        for (let i = 0; i < startDayOfWeek; i++) {
          daysArray.push({ date: '', isCurrentMonth: false });
        }

        for (let i = 1; i <= daysInMonth; i++) {
          daysArray.push({ date: i.toString(), isCurrentMonth: true });
        }

        return daysArray;
      });

      const togglePicker = () => {
        isPickerVisible.value = !isPickerVisible.value;
      };

      const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerContainer.value &&
        !pickerContainer.value.contains(event.target as Node) &&
        (!inputField.value?.nativeInput || !(inputField.value.nativeInput as HTMLElement).contains(event.target as Node))
      ) {
        isPickerVisible.value = false; // Close the picker
      }
    };

      onMounted(() => {
        document.addEventListener('click', handleClickOutside);
      });

      onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
      });

      const prevMonth = () => {
        currentDate.value = new Date(
          currentDate.value.getFullYear(),
          currentDate.value.getMonth() - 1,
          1
        );
      };

      const nextMonth = () => {
        currentDate.value = new Date(
          currentDate.value.getFullYear(),
          currentDate.value.getMonth() + 1,
          1
        );
      };

      const selectDay = (day: { date: string; isCurrentMonth: boolean }) => {
        if (!day.isCurrentMonth) return;

        const year = currentDate.value.getFullYear();
        const month = currentDate.value.getMonth();
        const dateNum = parseInt(day.date, 10);

        selectedDate.value = new Date(year, month, dateNum);
        updateDateTime();
      };

      const isToday = (day: { date: string; isCurrentMonth: boolean }) => {
        if (!day.isCurrentMonth) return false;

        const today = new Date();
        const year = currentDate.value.getFullYear();
        const month = currentDate.value.getMonth();
        const date = parseInt(day.date, 10);

        return (
          today.getFullYear() === year &&
          today.getMonth() === month &&
          today.getDate() === date
        );
      };

      const isSelectedDay = (day: {
        date: string;
        isCurrentMonth: boolean;
      }) => {
        if (!day.isCurrentMonth || !selectedDate.value) return false;

        const year = currentDate.value.getFullYear();
        const month = currentDate.value.getMonth();
        const date = parseInt(day.date, 10);

        return (
          selectedDate.value.getFullYear() === year &&
          selectedDate.value.getMonth() === month &&
          selectedDate.value.getDate() === date
        );
      };

      const decrementHour = () => {
        let hour = parseInt(displayedHour.value, 10);
        if (props.format === '12h') {
          hour = hour === 1 ? 12 : hour - 1;
        } else {
          hour = hour === 0 ? 23 : hour - 1;
        }
        displayedHour.value = String(hour).padStart(2, '0');
        updateDateTime();
      };

      const incrementHour = () => {
        let hour = parseInt(displayedHour.value, 10);
        if (props.format === '12h') {
          hour = hour === 12 ? 1 : hour + 1;
        } else {
          hour = hour === 23 ? 0 : hour + 1;
        }
        displayedHour.value = String(hour).padStart(2, '0');
        updateDateTime();
      };

      const decrementMinute = () => {
        let minute = parseInt(selectedMinute.value, 10);
        minute = minute === 0 ? 59 : minute - 1;
        selectedMinute.value = String(minute).padStart(2, '0');
        updateDateTime();
      };

      const incrementMinute = () => {
        let minute = parseInt(selectedMinute.value, 10);
        minute = minute === 59 ? 0 : minute + 1;
        selectedMinute.value = String(minute).padStart(2, '0');
        updateDateTime();
      };

      const validateHour = (event: Event) => {
        const target = event.target as HTMLInputElement;
        let value = parseInt(target.value, 10);

        if (isNaN(value)) {
          value = props.format === '12h' ? 12 : 0;
        } else if (props.format === '12h') {
          value = Math.max(1, Math.min(12, value));
        } else {
          value = Math.max(0, Math.min(23, value));
        }

        displayedHour.value = String(value).padStart(2, '0');
        updateDateTime();
      };

      const validateMinute = (event: Event) => {
        const target = event.target as HTMLInputElement;
        let value = parseInt(target.value, 10);

        if (isNaN(value)) {
          value = 0;
        } else {
          value = Math.max(0, Math.min(59, value));
        }

        selectedMinute.value = String(value).padStart(2, '0');
        updateDateTime();
      };

      const toggleAMPM = (period: 'AM' | 'PM') => {
        if (props.format === '12h') {
          isAM.value = period === 'AM';
          updateDateTime();
        }
      };

      const isHourMin = computed(() => {
        const hour = parseInt(displayedHour.value, 10);
        return props.format === '12h' ? hour === 1 : hour === 0;
      });

      return {
        isPickerVisible,
        pickerContainer,
        inputField,
        currentDate,
        selectedDate,
        displayedHour,
        selectedMinute,
        isAM,
        formattedDateTime,
        currentMonthName,
        currentYear,
        weekdayHeaders,
        days,
        togglePicker,
        prevMonth,
        nextMonth,
        selectDay,
        isToday,
        isSelectedDay,
        decrementHour,
        incrementHour,
        decrementMinute,
        incrementMinute,
        validateHour,
        validateMinute,
        toggleAMPM,
        isHourMin,
      };
    },
  });
</script>

<style scoped>
  @import url('./inputdatetime-styles.css');
</style>
