<template>
  <!-- LEFT SIDEBAR -->

  <div class="flex z-500 absolute">
    <!-- Filter bar -->
    <div
      class="left-sidebar"
      :class="{
        'h-9/10 xl:!w-80 xl:h-screen outline': sidebar_toggle,
      }"
    >
      <FilterBar
        class="mx-auto"
        :eventsListState="event_list_toggle"
        :toggleEventsList="onClickEventsListToggle"
      />
    </div>
    <!-- Event list -->
    <div
      class="left-sidebar flex flex-col justify-between items-center xl:-z-10 overflow-y-scroll"
      :class="{
        'h-9/10 xl:!w-80 xl:h-screen outline': event_list_toggle,
        'xl:-left-2': sidebar_toggle,
      }"
    >
      <EventsListBar
        :onClickEventSelect="onClickEventSelect"
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
      class="left-sidebar xl:-z-20"
      :class="{
        'h-9/10 xl:!w-90 xl:h-screen outline': choosen_event,
        'xl:-left-2': sidebar_toggle,
        'xl:-left-4': event_list_toggle,
      }"
    >
      <EventInfoBar :event="choosen_event" />
    </div>
    <!-- Sidebar toggler -->
    <div
      class="hidden xl:block relative top-24 bg-white w-5 h-14 rounded-r-md border-y border-r border-black cursor-pointer z-10"
      :class="{
        '-left-2':
          sidebar_toggle + event_list_toggle + (choosen_event != null) == 2,
        '-left-4': choosen_event && event_list_toggle,
      }"
      @click.stop="onClickSidebarToggle"
    >
      <ChevronRightIcon
        class="w-5 h-14"
        :class="{
          'transform rotate-180': sidebar_toggle,
        }"
      />
    </div>
  </div>

  <!-- RIGHT SIDEBAR -->

  <div class="flex z-500 absolute h-screen xl:right-0">
    <div class="hidden xl:block fixed top-10 right-10 w-max">
      <section v-if="auth">
        <Button
          class="w-15 h-15 mx-5 !my-0 bg-white"
          @click="onClickEventAddToggle"
        >
          <PlusIcon class="w-10 h-10 text mx-auto" />
        </Button>
        <Button
          class="w-15 h-15 mx-5 !my-0 bg-white"
          @click="onClickUserInfoToggle"
        >
          <UserIcon class="w-10 h-10 text mx-auto" />
        </Button>
        <Button class="w-15 h-15 mx-5 !my-0 bg-white">
          <MenuIcon class="w-10 h-10 text mx-auto" />
        </Button>
      </section>
      <section v-else class="flex">
        <Button class="w-32 h-15 mx-5 !my-0 bg-white" @click="signIn">
          <div class="flex items-center justify-evenly">
            <span class="text-lg font-bold">Войти</span>
            <LoginIcon class="w-10 h-10 rotate-180" />
          </div>
        </Button>
        <Button class="w-15 h-15 mx-5 !my-0 bg-white">
          <MenuIcon class="w-10 h-10 text mx-auto" />
        </Button>
      </section>
    </div>
    <!-- Profile navbar -->
    <div
      class="right-sidebar"
      :class="{ 'h-9/10 xl:h-[85%] xl:!w-90 outline': user_toggle.info }"
    >
      <ProfileBar :user="user" :signOut="signOut" />
    </div>
  </div>

  <!-- MOBILE BAR -->
  <div
    class="xl:hidden z-500 fixed bottom-0 flex flex-row h-10 w-screen bg-white border-y border-black items-center mx-auto"
  >
    <div
      class="basis-1/4 hover:text-primary"
      @click.stop="onClickUserInfoToggle"
    >
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
</template>

<script>
import { mapState } from "vuex";
import { Button } from "@/components/interface";
import * as LayoutComponents from "@/components/layout/";
import { UserIcon } from "@heroicons/vue/solid";
import {
  ChevronRightIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  LoginIcon,
} from "@heroicons/vue/outline";

export default {
  name: "LeftSidebarComponent",
  components: {
    FilterBar: LayoutComponents.FilterLayout,
    EventInfoBar: LayoutComponents.EventInfoLayout,
    EventsListBar: LayoutComponents.EventsListLayout,
    ProfileBar: LayoutComponents.ProfileInfoLayout,
    Button,
    ChevronRightIcon,
    MenuIcon,
    PlusIcon,
    SearchIcon,
    LoginIcon,
    UserIcon,
  },
  props: {
    filteredEvents: Array,
  },

  provide() {
    return {
      onClickEventSelect: this.onClickEventSelect,
    };
  },

  async mounted() {
    const response = await this.$msal.silentAuth();
    if (response) {
      await this.$store.dispatch("auth/LOGIN", response);
      this.auth = true;
    }
  },

  computed: {
    ...mapState("auth/", {
      user: (state) => state.user,
    }),
  },

  data() {
    return {
      choosen_event: null,
      sidebar_toggle: false,
      event_list_toggle: false,
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
      ok: false,
      auth: false,
      user_toggle: {
        info: false,
        add_event: false,
      },
    };
  },

  methods: {
    async signIn() {
      const response = await this.$msal.signIn();
      if (response) {
        await this.$store.dispatch("auth/LOGIN", response);
        this.auth = true;
      }
    },

    async signOut() {
      await this.$msal
        .signOut()
        .then(() => {
          this.auth = false;
          this.$store.dispatch("auth/LOGOUT");
        })
        .then(() => {
          for (let toggles in this.user_toggle) {
            this.user_toggle[toggles] = false;
          }
        });
    },

    onClickEventSelect(id) {
      if (this.choosen_event === id) {
        this.choosen_event = null;
        return;
      }
      this.choosen_event = id;
    },

    onClickEventsListToggle() {
      this.event_list_toggle = !this.event_list_toggle;
    },

    onClickSidebarToggle() {
      if (this.sidebar_toggle) {
        this.event_list_toggle = false;
        this.choosen_event = null;
      }
      this.sidebar_toggle = !this.sidebar_toggle;
    },

    onClickEventAddToggle() {
      this.user_toggle.info = !this.user_toggle.info;
    },

    onClickUserInfoToggle() {
      this.user_toggle.info = !this.user_toggle.info;
    },
  },
};
</script>
