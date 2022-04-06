<template>
  <div class="flex z-500">
    <!-- Filter bar -->
    <div
      class="sidebar"
      :class="{
        'h-[90%] md:!w-80 md:h-screen !outline outline-1': sidebar_open,
      }"
    >
      <FilterBar
        class="mx-auto"
        :eventsListState="eventlist_open"
        :toggleEventsList="onClickEventsListToggle"
      />
    </div>
    <!-- Event list -->
    <div
      class="sidebar md:-z-10 overflow-y-scroll"
      :class="{
        'h-[90%] md:!w-80 md:h-screen !outline outline-1': eventlist_open,
        'md:-left-2': sidebar_open,
      }"
    >
      <EventsListBar
        :onClickEventChoose="onClickEventChoose"
        :filteredEvents="events"
      />
    </div>
    <!-- Event info bar -->
    <div
      class="sidebar md:-z-20"
      :class="{
        'h-[90%] md:!w-90 md:h-screen !outline outline-1': choosen_event,
        'md:-left-2': sidebar_open,
        'md:-left-4': eventlist_open,
      }"
    >
      <EventInfoBar />
    </div>
    <!-- Sidebar toggler -->
    <div
      class="hidden md:block relative top-24 bg-white w-5 h-14 rounded-r-md border-y border-r border-black cursor-pointer z-10"
      :class="{
        '-left-2': sidebar_open + eventlist_open + (choosen_event != null) == 2,
        '-left-4': choosen_event && eventlist_open,
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
    <!-- Mobile navbar -->
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
import { UserIcon } from "@heroicons/vue/solid";
import {
  ChevronRightIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
} from "@heroicons/vue/outline";

export default {
  name: "SidebarView",
  components: {
    FilterBar: LayoutComponents.FilterBar,
    EventInfoBar: LayoutComponents.EventInfoBar,
    EventsListBar: LayoutComponents.EventsListBar,
    ChevronRightIcon,
    MenuIcon,
    PlusIcon,
    SearchIcon,
    UserIcon,
  },
  props: {
    filteredEvents: Array,
  },

  provide() {
    return {
      onClickEventChoose: this.onClickEventChoose,
    };
  },

  data() {
    return {
      choosen_event: null,
      sidebar_open: false,
      eventlist_open: false,
      events: [
        {
          id: 1,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 2,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 3,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 4,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 5,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
      ],
    };
  },

  methods: {
    onClickEventChoose(id) {
      if (this.choosen_event === id) {
        this.choosen_event = null;
        return;
      }
      this.choosen_event = id;
    },

    onClickEventsListToggle() {
      this.eventlist_open = !this.eventlist_open;
    },

    onClickSidebarToggle() {
      if (this.sidebar_open) {
        this.eventlist_open = false;
        this.choosen_event = null;
      }
      this.sidebar_open = !this.sidebar_open;
    },
  },
};
</script>
