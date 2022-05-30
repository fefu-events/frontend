<template>
  <div class="xl:w-70 mx-auto">
    <div class="grid grid-flow-row grid-cols-6 gap-y-2 py-4">
      <div class="max-w-[40px] rounded-full overflow-hidden">
        <CategoryIcon class="w-10 h-10" :categoryID="event.category?.id" />
      </div>
      <div class="flex items-center col-span-5 text-left text-lg">
        <span> {{ event.title }} </span>
      </div>
      <div
        class="text-gray-500 text-left text-sm self-center"
        :class="edit ? 'col-span-5' : 'col-span-6'"
      >
        <span>{{ normalizedDate }}</span>
      </div>
      <div
        v-if="edit"
        class="w-10 ml-auto hover:text-primary"
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
import { CategoryIcon } from "@/components/icons";
import { PencilAltIcon } from "@heroicons/vue/outline";

export default {
  name: "EventBlockComponent",
  components: {
    CategoryIcon,
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
