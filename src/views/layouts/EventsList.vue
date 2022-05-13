<template>
  <div class="h-[85%] xl:h-full w-full xl:my-6 mt-10" ref="events">
    <div v-if="!isLoaded" class="flex items-center h-full">
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
    </div>
    <div v-else class="h-full">
      <section v-if="events.length > 0">
        <div
          class="xl:px-5 hover:bg-hoverColor cursor-pointer"
          v-for="event in events"
          :key="event.id"
          @click="onClickSelectEvent(event.id)"
        >
          <EventBlock class="w-4/5 xl:px-4" :event="event" />
        </div>
      </section>
      <section v-else class="flex items-center h-full">
        <img
          class="w-3/5 h-3/5 mx-auto"
          src="@/assets/img/svg/emptyList.svg"
          alt=""
        />
      </section>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import api from "@/service/api";
import { mapState, mapGetters } from "vuex";
import * as TemplateComponents from "@/components/templates";

export default {
  name: "EventsList",
  components: {
    EventBlock: TemplateComponents.EventBlock,
  },

  inject: ["onClickSelectEvent"],

  data() {
    return {
      isLoaded: false,
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
    const eventsList = this.$refs.events;
    if (eventsList)
      eventsList.addEventListener("scroll", () => this.handleScroll());
    this.events = await this.loadEventList(0);
  },

  methods: {
    async loadEventList(skip) {
      const data = await api.event
        .getAll(skip, this.filterParams, this.user)
        .then(({ data }) => {
          this.isLoaded = true;
          return data;
        });

      return data;
    },

    async handleScroll() {
      const eventsList = this.$refs.events;
      const scrolling = eventsList.scrollTop + eventsList.clientHeight;
      if (
        scrolling >= eventsList.scrollHeight &&
        this.events.length >= this.page * 10
      ) {
        const data = await this.loadEventList(0);

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
