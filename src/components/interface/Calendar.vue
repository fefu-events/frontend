<template>
  <div>
    <DatePicker
      v-model="date"
      mode="dateTime"
      :modelConfig="modelConfig"
      :min-date="Date.now()"
      color="orange"
      :masks="masks"
      is24hr
      :is-range="isRange"
      :isDark="isDark"
    >
      <template v-slot="{ inputValue, inputEvents }">
        <div class="flex flex-col justify-start">
          <div class="relative flex-grow my-2">
            <CalendarIcon
              class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
            />
            <input
              class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full focus:outline-none focus:border-primary"
              placeholder="От"
              :value="date ? (isRange ? inputValue?.start : inputValue) : ''"
              v-on="isRange ? inputEvents?.start : inputEvents"
              readonly
            />
          </div>
          <div v-if="isRange" class="relative flex-grow my-2">
            <CalendarIcon
              class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
            />
            <input
              class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full focus:outline-none focus:border-primary"
              placeholder="До"
              :value="date ? (isRange ? inputValue?.end : inputValue) : ''"
              v-on="isRange ? inputEvents?.end : inputEvents"
              readonly
            />
          </div>
        </div>
      </template>
    </DatePicker>
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
import { CalendarIcon } from "@heroicons/vue/outline";

import "v-calendar/dist/style.css";

export default {
  name: "CalendarComponent",
  components: { DatePicker, CalendarIcon },
  props: {
    propdate: Object,
    isRange: Boolean,
  },
  data() {
    return {
      date: this.propdate || null,
      isDark: false,
      modelConfig: {
        type: "string",
        mask: "iso",
        minuteIncrement: 10,
      },
      masks: {
        title: "MMMM YYYY",
        weekdays: "WWW",
      },
    };
  },

  mounted() {
    this.isDark =
      localStorage.theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  },

  watch: {
    date() {
      this.$emit("update", this.date);
    },
    isRange() {
      this.date = null;
    },
  },
};
</script>
