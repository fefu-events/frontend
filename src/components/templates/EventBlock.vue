<template>
  <div class="xl:w-70 mx-auto">
    <div class="grid grid-flow-row grid-cols-5 gap-3 py-4">
      <div class="flex items-center col-span-4 text-left text-lg">
        <span> {{ event.title }} </span>
      </div>
      <div class="max-w-[40px] rounded-full overflow-hidden">
        <img
          class="self-center justify-self-center w-10 h-10 m-auto"
          src="@/assets/img/svg/logo.svg"
        />
      </div>
      <div class="col-span-5 text-left" :class="{ '!col-span-4': edit }">
        <span>{{ normalizedDate }}</span>
      </div>
      <div
        v-if="edit"
        class="hover:text-primary"
        @click.stop="onClickEdit(event.id)"
      >
        <PencilAltIcon class="w-6 h-6 mx-auto" />
      </div>
    </div>
    <hr class="border-black" />
  </div>
</template>

<script>
import moment from "moment";
import { PencilAltIcon } from "@heroicons/vue/outline";

export default {
  name: "EventBlockComponent",
  components: {
    PencilAltIcon,
  },

  props: {
    event: Object,
    edit: {
      type: Boolean,
      default: false,
    },
    onClickSelectEditEvent: Function,
  },

  computed: {
    normalizedDate() {
      const start = moment(this.event.date_begin).format("DD.MM.YYYY");
      const end = moment(this.event.date_end).format("DD.MM.YYYY");
      return `${start} - ${end}`;
    },
  },

  methods: {
    onClickEdit(eventID) {
      this.onClickSelectEditEvent(eventID);
    },
  },
};
</script>
