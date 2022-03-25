<template>
  <div>
    <DatePicker
      v-model="date"
      :mode="isRange ? 'date' : 'dateTime'"
      :modelConfig="modelConfig"
      :min-date="Date.now()"
      is24hr
      color="orange"
      :masks="masks"
      :is-range="isRange"
      :is-dark="isDark ? true : false"
    />
  </div>
</template>

<style lang="postcss">
.vc-time-date {
  display: none;
}
.vc-day.is-not-in-month * {
  opacity: 1;
  color: #cbd5e0;
}
.vc-is-dark .is-not-in-month * {
  color: #718096;
}

.vc-day.is-not-in-month:not(.is-disabled) * {
  pointer-events: auto;
}
</style>

<script>
import { DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";

export default {
  name: "CalendarComponent",
  components: { DatePicker },
  props: {
    isRange: Boolean,
    isDark: Boolean,
  },
  data() {
    return {
      date: Date.now(),
      modelConfig: {
        type: "string",
        minuteIncrement: 10,
        mask: "YYYY-MM-DD HH:mm",
      },
      masks: {
        title: "MMMM YYYY",
        weekdays: "WWW",
      },
      range: {
        start: null,
        end: null,
      },
    };
  },

  watch: {
    date() {
      let date_ = null;
      if (this.isRange) {
        date_ = {
          start: this.date.start.split(" ")[0],
          end: this.date.end.split(" ")[0],
        };
      }
      this.$emit("update", date_ ? date_ : this.date);
    },
  },
};
</script>
