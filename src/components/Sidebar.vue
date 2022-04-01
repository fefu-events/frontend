<template>
  <div class="flex z-500">
    <div
      class="sidebar"
      :class="{
        'h-[90%] md:!w-80 md:h-screen !outline outline-1': sidebar_open,
      }"
    >
      <FilterSidebar
        class="mx-auto"
        :eventsListState="eventlist_open"
        :toggleEventsList="onClickEventsListToggle"
      />
    </div>
    <div
      class="sidebar md:-z-10 overflow-y-scroll"
      :class="{
        'h-[90%] md:!w-80 md:h-screen !outline outline-1': eventlist_open,
        'md:-left-2': sidebar_open,
      }"
    >
      <div v-for="i in events" :key="i.title">
        <EventBlock :title="i.title" :date="i.date" />
      </div>
    </div>
    <div
      class="hidden md:block relative top-24 bg-white w-5 h-14 rounded-r-md border-y border-r border-black cursor-pointer -z-20"
      :class="{
        '-left-2': eventlist_open,
      }"
      @click.stop="onClickSidebarToggle"
    >
      <ChevronRightIcon
        class="w-5 h-14"
        :class="{
          'transform rotate-180': sidebar_open,
        }"
      />
    </div>
    <div
      class="md:hidden fixed bottom-0 flex flex-row h-10 w-screen bg-white border-y border-black items-center mx-auto"
    >
      <div class="basis-1/4 hover:text-primary">
        <UserIcon class="w-full h-5" />
      </div>
      <div
        class="basis-1/4 hover:text-primary"
        @click.stop="onClickSidebarToggle"
      >
        <SearchIcon class="w-full h-5" />
      </div>
      <div class="basis-1/4 hover:text-primary">
        <PlusIcon class="w-full h-5" />
      </div>
      <div class="basis-1/4 hover:text-primary">
        <MenuIcon class="w-full h-5" />
      </div>
    </div>
  </div>
</template>

<script>
import * as LayoutComponents from "@/components/layout/";
import * as TemplateComponents from "@/components/template";
import { UserIcon } from "@heroicons/vue/solid";
import {
  ChevronRightIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
} from "@heroicons/vue/outline";

export default {
  name: "AboutView",
  components: {
    FilterSidebar: LayoutComponents.FilterSidebar,
    EventBlock: TemplateComponents.EventBlock,
    ChevronRightIcon,
    MenuIcon,
    PlusIcon,
    SearchIcon,
    UserIcon,
  },
  props: {
    filteredEvents: Array,
  },

  data() {
    return {
      choosen_event: null,
      sidebar_open: false,
      eventlist_open: false,
      eventbar_open: false,
      events: [
        {
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
      ],
    };
  },

  methods: {
    onClickEventChoose(id) {
      if (this.choosen_event === id) {
        this.eventbar_open = false;
        return;
      }
      this.eventbar_open = true;
      this.choosen_event = id;
    },

    onClickEventsListToggle() {
      this.eventlist_open = !this.eventlist_open;
    },

    onClickSidebarToggle() {
      if (this.sidebar_open) {
        this.eventlist_open = false;
      }
      this.sidebar_open = !this.sidebar_open;
    },
  },
};
</script>
