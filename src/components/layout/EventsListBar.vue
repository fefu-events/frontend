<template>
  <div class="my-4">
    <div
      class="hover:bg-hoverColor cursor-pointer"
      v-for="event in filteredEvents"
      :key="event.id"
    >
      <EventBlock :event_data="event" @click="onClickEventChoose(event.id)" />
    </div>
  </div>
</template>

<script>
import * as TemplateComponents from "@/components/template";

export default {
  name: "EventsListComponents",
  components: {
    EventBlock: TemplateComponents.EventBlock,
  },
  props: {
    filteredEvents: Array,
    onClickEventChoose: Function,
  },
};
</script>
