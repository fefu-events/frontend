<template>
  <div class="flex z-500">
    <!-- Filter bar -->
    <div
      class="sidebar"
      :class="{
        'h-9/10 xl:!w-80 xl:h-screen !outline outline-1': sidebar_open,
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
      class="sidebar flex flex-col justify-between items-center xl:-z-10 overflow-y-scroll"
      :class="{
        'h-9/10 xl:!w-80 xl:h-screen !outline outline-1': eventlist_open,
        'xl:-left-2': sidebar_open,
      }"
    >
      <EventsListBar
        :onClickEventChoose="onClickEventChoose"
        :filteredEvents="events"
        class="overflow-scroll"
      />
      <Button
        class="xl:hidden w-4/5 !mt-4 !my-10"
        @click="onClickEventsListToggle"
      >
        <span> Скрыть список </span>
      </Button>
    </div>
    <!-- Event info bar -->
    <div
      class="sidebar xl:-z-20"
      :class="{
        'h-9/10 xl:!w-90 xl:h-screen !outline outline-1': choosen_event,
        'xl:-left-2': sidebar_open,
        'xl:-left-4': eventlist_open,
      }"
    >
      <EventInfoBar :event="choosen_event" />
    </div>
    <!-- Sidebar toggler -->
    <div
      class="hidden xl:block relative top-24 bg-white w-5 h-14 rounded-r-md border-y border-r border-black cursor-pointer z-10"
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
    <AuthButton class="hidden relative bottom-0 right-0" />
    <!-- Mobile navbar -->
    <div
      class="xl:hidden fixed bottom-0 flex flex-row h-10 w-screen border-y border-black items-center mx-auto"
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
import { Button } from "@/components/interface";
import * as LayoutComponents from "@/components/layout/";
import { UserIcon } from "@heroicons/vue/solid";
import {
  ChevronRightIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
} from "@heroicons/vue/outline";

export default {
  name: "LeftSidebarComponent",
  components: {
    FilterBar: LayoutComponents.FilterBar,
    EventInfoBar: LayoutComponents.EventInfoBar,
    EventsListBar: LayoutComponents.EventsListBar,
    AuthButton: LayoutComponents.AuthButton,
    Button,
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
        {
          id: 6,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 7,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 8,
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
