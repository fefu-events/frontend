<template>
  <div class="h-[85%] xl:h-full xl:my-6 mt-10">
    <div
      class="xl:px-5 hover:bg-hoverColor cursor-pointer"
      v-for="event in filteredEvents"
      :key="event.id"
    >
      <EventBlock
        class="w-4/5 xl:px-4"
        :event="event"
        @click="onClickSelectEvent(event.id)"
      />
    </div>
  </div>
</template>

<script>
import * as TemplateComponents from "@/components/template";

export default {
  name: "EventsListLayout",
  components: {
    EventBlock: TemplateComponents.EventBlock,
  },
  props: {
    filteredEvents: Array,
    onClickSelectEvent: Function,
  },
};
</script>
