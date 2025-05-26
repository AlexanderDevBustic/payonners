<template>
  <div class="calendar-container">
    <div class="calendar-wrapper" aria-label="Calendario de eventos">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import FullCalendar, {
    EventApi,
    type DayCellContentArg,
    type CalendarOptions
  } from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import listPlugin from '@fullcalendar/list';
  import interactionPlugin from '@fullcalendar/interaction';
  import esLocale from '@fullcalendar/core/locales/es';

  export interface Event {
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    status?: 'En curso' | 'Pendiente' | 'Vencido' | 'Ocupado' | 'Realizado';
  }

  export interface EventDetail {
    title: string;
    start: string;
    end?: string;
    status: string;
  }

  export default defineComponent({
    name: 'Calendar',
    components: {
      FullCalendar,
    },
    props: {
      initialView: {
        type: String,
        default: 'dayGridMonth',
      },
      events: {
        type: Array,
        default: () => [],
      },
      headerToolbar: {
        type: Object,
        default: () => ({
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }),
      },
    },
    emits: ['dayClick', 'eventClick'],
    setup(props, { emit }) {
      const handleDateClick = (info: { dateStr: string }) => {
        const clickedDate = new Date(info.dateStr + 'T00:00:00');
        const options: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        };
        const formattedDate = clickedDate.toLocaleDateString('es-ES', options);
        emit('dayClick', formattedDate);
      };

      const handleEventClick = (info: { event: EventApi }) => {
        const eventDetails = {
          title: info.event.title,
          start: info.event.start?.toISOString(),
          end: info.event.end?.toISOString(),
          status: info.event.extendedProps.status,
        };
        emit('eventClick', eventDetails);
      };

      const calendarOptions = ref<CalendarOptions>({
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        initialView: props.initialView,
        headerToolbar: props.headerToolbar,
        events: props.events as Event[],
        dateClick: handleDateClick,
        eventClick: handleEventClick,
        locale: esLocale,
        height: window.innerHeight * 0.7 + 'px',
        timeZone: 'local',
        dayCellClassNames: (arg: DayCellContentArg): string[] => {
          if (arg.isToday) return ['today'];
          return [];
        },
        eventClassNames: (arg: { event: EventApi }): string[] => {
          const eventStatus = arg.event.extendedProps.status as
            | 'En curso'
            | 'Pendiente'
            | 'Vencido'
            | 'Ocupado'
            | 'Realizado'
            | undefined;
          if (eventStatus === 'En curso') return ['in-progress'];
          if (eventStatus === 'Pendiente') return ['pending'];
          if (eventStatus === 'Vencido') return ['expired'];
          if (eventStatus === 'Ocupado') return ['occupied'];
          if (eventStatus === 'Realizado') return ['completed'];
          return [];
        },
        eventContent: (arg: { event: EventApi }): { html: string } => {
          const eventStatus = arg.event.extendedProps.status as
            | 'En curso'
            | 'Pendiente'
            | 'Vencido'
            | 'Ocupado'
            | 'Realizado'
            | undefined;
          let statusClass = '';
          if (eventStatus === 'En curso') statusClass = 'in-progress';
          if (eventStatus === 'Pendiente') statusClass = 'pending';
          if (eventStatus === 'Vencido') statusClass = 'expired';
          if (eventStatus === 'Ocupado') statusClass = 'occupied';
          if (eventStatus === 'Realizado') statusClass = 'completed';

          return {
            html: `
              <div class="event-container ${statusClass}">
                <span>${arg.event.title}</span>
              </div>
            `,
          };
        },
      });

      watch(
        () => props.initialView,
        (newView) => {
          calendarOptions.value.initialView = newView;
        }
      );

      watch(
        () => props.events,
        (newEvents) => {
          if (!Array.isArray(newEvents)) {
            console.warn('Invalid events data provided to Calendar component.');
            return;
          }
          calendarOptions.value.events = newEvents as Event[];
        }
      );

      return {
        calendarOptions,
      };
    },
  });
</script>

<style scoped>
  @import url(../../../node_modules/@fullcalendar/common/main.min.css);
  @import url(../../../node_modules/@fullcalendar/daygrid/main.min.css);
  @import url(./calendar-styles.css);
</style>
