<template>
  <div class="h-[85%] xl:h-full w-full xl:my-6 mt-10" ref="events">
    <div
      class="xl:px-5 hover:bg-hoverColor cursor-pointer"
      v-for="event in events"
      :key="event.id"
    >
      <EventBlock
        class="w-4/5 xl:px-4"
        :event="event"
        @click="onClickSelectEvent(event)"
      />
    </div>
  </div>
</template>

<script>
import api from "@/service/api";
import { mapState } from "vuex";
import * as TemplateComponents from "@/components/template";

export default {
  name: "EventsListLayout",
  components: {
    EventBlock: TemplateComponents.EventBlock,
  },
  props: {
    onClickSelectEvent: Function,
  },

  data() {
    return {
      page: 1,
      events: [],
    };
  },

  computed: {
    ...mapState("filter", {
      filterParams: (state) => state,
    }),

    ...mapState("auth", {
      user: (state) => state.user,
    }),

    skip() {
      return 10 * this.page;
    },
  },

  mounted() {
    setTimeout(() => {
      const eventsList = this.$refs.events;
      eventsList.addEventListener("scroll", () => this.handleScroll());
      this.updateEventList();
    }, 1000);
  },

  methods: {
    async updateEventList() {
      const { data } = await api.event.getAll(0, this.filterParams, this.user);
      this.events = data;
    },

    async handleScroll() {
      const eventsList = this.$refs.events;
      const scrolling = eventsList.scrollTop + eventsList.clientHeight;
      if (
        scrolling >= eventsList.scrollHeight &&
        this.events.length >= this.page * 10
      ) {
        const { data } = await api.event.getAll(
          this.skip,
          this.filterParams,
          this.user
        );
        this.events = this.events.concat(data);
        this.page++;
      }
    },
  },

  beforeUnmount() {
    const eventsList = this.$refs.events;
    eventsList.removeEventListener("scroll", () => this.handleScroll());
  },

  watch: {
    filterParams: {
      handler() {
        this.updateEventList();
      },
      deep: true,
    },
  },
};
</script>
