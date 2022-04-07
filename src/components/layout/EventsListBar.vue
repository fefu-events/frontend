<template>
  <div class="h-[85%] xl:h-full xl:my-6">
    <div
      class="hover:bg-hoverColor cursor-pointer"
      v-for="event in filteredEvents"
      :key="event.id"
    >
      <EventBlock :event="event" @click="onClickEventChoose(event.id)" />
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
