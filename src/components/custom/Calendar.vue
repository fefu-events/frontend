<template>
  <div>
    <DatePicker
      v-model="date"
      :mode="mode"
      :modelConfig="modelConfig"
      :min-date="Date.now()"
      color="orange"
      :masks="masks"
      is24hr
      :is-range="isRange"
      :is-dark="isDark"
      class="!hidden md:!inline-flex my-2"
    />
    <DatePicker
      v-model="date"
      :mode="mode"
      :modelConfig="modelConfig"
      :min-date="Date.now()"
      color="orange"
      :masks="masks"
      is24hr
      :is-range="isRange"
      :is-dark="isDark"
    >
      <template v-slot="{ togglePopover }">
        <div class="flex w-full mx-auto my-2 items-center md:hidden">
          <button
            class="p-2 bg-white border border-gray-200 border-r-0 hover:bg-white text-primary rounded-l focus:bg-primary focus:text-white focus:border-primary focus:outline-none"
            @click="togglePopover()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-4 h-4 fill-current"
            >
              <path
                d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
              ></path>
            </svg>
          </button>
          <input
            :value="normalizedDate.label"
            class="bg-white text-gray-700 w-full leading-6 py-1 px-2 appearance-none border rounded-r focus:outline-none focus:border-primary"
            readonly
          />
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
import "v-calendar/dist/style.css";

export default {
  name: "CalendarComponent",
  components: { DatePicker },
  props: {
    isRange: Boolean,
    isDark: Boolean,
    mode: String,
  },
  data() {
    return {
      date: null,
      modelConfig: {
        type: "string",
        minuteIncrement: 10,
        mask: "DD.MM.YYYY HH:mm",
      },
      masks: {
        title: "MMMM YYYY",
        weekdays: "WWW",
      },
    };
  },

  computed: {
    normalizedDate() {
      let value_date = this.date;
      if (this.mode == "date" && this.date)
        if (this.isRange) {
          value_date = {
            start: this.date.start?.split(" ")[0],
            end: this.date.end?.split(" ")[0],
          };
        } else {
          value_date = this.date?.split(" ")[0];
        }

      let label_date = value_date?.start
        ? `${value_date.start} / ${value_date.end}`
        : value_date;

      return { value: value_date, label: label_date };
    },
  },

  watch: {
    date() {
      this.$emit("update", this.normalizedDate.value);
    },
    isRange() {
      this.date = null;
    },
  },
};
</script>
