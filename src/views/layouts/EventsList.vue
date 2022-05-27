<template>
  <div class="flex flex-col h-full w-[89%] xl:w-80 mx-auto">
    <div
      class="flex flex-col h-[85%] xl:h-full my-2 overflow-y-scroll"
      ref="events"
    >
      <section v-if="!isLoaded" class="flex items-center h-full">
        <svg
          class="animate-spin h-12 w-12 text-primary mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-40"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
          ></circle>
          <path
            class="opacity-80"
            stroke="currentColor"
            stroke-width="2"
            d="M4.85857 5C3.09032 6.80375 2 9.27455 2 12C2 17.5228 6.47715 22 12 22"
          />
        </svg>
      </section>
      <section v-if="isLoaded && events.length > 0">
        <div
          class="hover:bg-hoverColor cursor-pointer"
          v-for="event in events"
          :key="event.id"
          @click="onClickSelectEvent(event.id)"
        >
          <EventBlock :event="event" />
        </div>
      </section>
      <section
        v-if="isLoaded && events.length == 0"
        class="flex items-center h-full"
      >
        <img
          class="w-3/5 h-3/5 mx-auto"
          src="@/assets/img/svg/emptyList.svg"
          alt=""
        />
      </section>
    </div>
    <Button
      class="xl:hidden mt-auto mx-10 mb-10"
      @click="onClickEventsListToggle"
    >
      <span> Скрыть список </span>
    </Button>
  </div>
</template>

<script>
import _ from "lodash";
import api from "@/service/api";
import { mapState, mapGetters } from "vuex";
import * as TemplateComponents from "@/components/templates";
import { Button } from "@/components/interface";

export default {
  name: "EventsList",
  components: {
    Button,
    EventBlock: TemplateComponents.EventBlock,
  },

  inject: ["onClickSelectEvent"],

  props: {
    onClickEventsListToggle: Function,
  },

  data() {
    return {
      isLoaded: false,
      debounceRequestFlag: true,

      page: 1,
      events: [],
    };
  },

  computed: {
    ...mapGetters("filter", {
      filterParams: "filterParams",
    }),

    ...mapState("client", {
      availablePlaces: (state) => state.places,
    }),

    ...mapState("me", {
      user: (state) => state.user,
    }),

    skip() {
      return 10 * this.page;
    },
  },

  async mounted() {
    this.events = await this.loadEventList(0);
    const eventsList = this.$refs.events;
    if (eventsList)
      eventsList.addEventListener("scroll", () => this.handleScroll());
  },

  methods: {
    async loadEventList(skip) {
      return api.event
        .getAll(skip, this.filterParams, this.user)
        .then(({ data }) => {
          this.isLoaded = true;
          return data;
        });
    },

    async handleScroll() {
      if (!this.debounceRequestFlag) return;

      const eventsList = this.$refs.events;
      const scrolling = eventsList.scrollTop + eventsList.clientHeight;
      const limitData = this.events.length >= this.page * 10;
      if (scrolling >= eventsList.scrollHeight && limitData) {
        this.debounceRequestFlag = false;

        const data = await this.loadEventList(this.page * 10);
        this.events = this.events.concat(data);
        this.page++;
      }
    },
  },

  beforeUnmount() {
    const eventsList = this.$refs.events;
    eventsList.removeEventListener(
      "scroll",
      _.debounce(() => this.handleScroll(), 100)
    );
  },

  watch: {
    filterParams: {
      async handler() {
        this.isLoaded = false;
        this.page = 1;
        this.events = await this.loadEventList(0);
      },
      deep: true,
    },
  },
};
</script>
