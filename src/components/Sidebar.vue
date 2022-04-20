<template>
  <!-- LEFT SIDEBAR -->

  <div class="flex z-500 absolute">
    <!-- Filter layout -->
    <div
      class="left-sidebar"
      :class="{
        'h-9/10 xl:!w-80 xl:h-screen outline': searchLayout,
      }"
    >
      <FilterLayout
        class="mx-auto"
        :eventsListState="eventListLayout"
        :toggleEventsList="onClickEventsListToggle"
      />
    </div>
    <!-- Event list layout -->
    <div
      class="left-sidebar flex flex-col justify-between items-center xl:-z-10 overflow-y-scroll"
      :class="{
        'h-9/10 xl:!w-80 xl:h-screen outline': eventListLayout,
        'xl:-left-2': searchLayout,
      }"
    >
      <EventsListLayout v-if="eventListLayout" class="overflow-scroll" />
      <div class="xl:hidden flex flex-col w-4/5 mx-auto">
        <Button class="!mt-4 !my-10 mx-5" @click="onClickEventsListToggle">
          <span> Скрыть список </span>
        </Button>
      </div>
    </div>
    <!-- Event info layout -->
    <div
      class="left-sidebar xl:-z-20"
      :class="{
        'h-9/10 xl:!w-90 xl:h-screen outline': selectedEvent,
        'xl:-left-2': searchLayout,
        'xl:-left-4': eventListLayout,
      }"
    >
      <EventInfoLayout :eventID="selectedEvent" />
    </div>
    <!-- Sidebar toggler -->
    <div
      class="hidden xl:block relative top-24 bg-white w-5 h-14 rounded-r-md border-y border-r border-black cursor-pointer z-10"
      :class="{
        '-left-2':
          searchLayout + eventListLayout + (selectedEvent != null) == 2,
        '-left-4': selectedEvent && eventListLayout,
      }"
      @click.stop="onClickSidebarToggle"
    >
      <ChevronRightIcon
        class="w-5 h-14"
        :class="{
          'transform rotate-180': searchLayout || selectedEvent,
        }"
      />
    </div>
  </div>

  <!-- RIGHT SIDEBAR -->

  <div class="flex z-500 absolute h-screen xl:right-0">
    <!-- Navigation -->
    <div v-if="isLoaded" class="hidden xl:block fixed top-10 right-10 w-max">
      <section v-if="user">
        <Button
          class="w-15 h-15 mx-5 !my-0 bg-white"
          @click="onClickEventActionToggle()"
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
    <!-- Profile info layout -->
    <div
      class="right-sidebar"
      :class="{ 'h-9/10 xl:h-[85%] xl:!w-90 outline': infoLayouts.me }"
    >
      <ProfileInfoLayout
        v-if="selectedUser || user"
        :user="selectedUser || user"
        :signOut="signOut"
      />
    </div>
    <!-- Organizations list layout -->
    <div
      class="right-sidebar"
      :class="{
        'h-9/10 xl:h-[85%] xl:!w-90 outline': infoLayouts.myOrgs,
      }"
    >
      <OrganizationsListLayout v-if="infoLayouts.myOrgs" />
    </div>
    <!-- Create organization layout -->
    <div
      class="right-sidebar"
      :class="{
        'h-9/10 xl:h-[85%] xl:!w-90 outline': infoLayouts.createOrg,
      }"
    >
      <CreateOrganizationLayout v-if="infoLayouts.createOrg" />
    </div>
    <!-- Organization info layout -->
    <div
      class="right-sidebar"
      :class="{
        'h-9/10 xl:h-[85%] xl:!w-90 outline': selectedOrganization,
      }"
    >
      <OrganizationInfoLayout
        :organizationID="selectedOrganization"
        v-if="selectedOrganization"
      />
    </div>
    <!-- Event action layout -->
    <div
      class="right-sidebar"
      :class="{
        'h-9/10 xl:h-[85%] xl:!w-90 outline':
          eventActionLayout || editableEvent,
      }"
    >
      <EventActionLayout v-if="editableEvent" :editableEvent="editableEvent" />
      <EventActionLayout v-else />
    </div>
  </div>

  <!-- MOBILE BAR -->
  <div
    class="xl:hidden z-500 fixed bottom-0 flex flex-row h-10 w-screen bg-white border-y border-black items-center mx-auto"
  >
    <div
      v-if="user"
      class="basis-1/4 hover:text-primary"
      @click.stop="onClickUserInfoToggle"
    >
      <UserIcon class="w-full h-5" />
    </div>
    <div v-else class="basis-1/4 hover:text-primary" @click.stop="signIn">
      <LoginIcon class="w-full h-5 rotate-180" />
    </div>
    <div
      class="basis-1/4 hover:text-primary"
      @click.stop="onClickSidebarToggle"
    >
      <SearchIcon class="w-full h-5" />
    </div>
    <div class="basis-1/4 hover:text-primary" @click="onClickEventActionToggle">
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
  name: "SidebarComponent",
  components: {
    FilterLayout: LayoutComponents.FilterLayout,
    EventInfoLayout: LayoutComponents.EventInfoLayout,
    EventsListLayout: LayoutComponents.EventsListLayout,
    ProfileInfoLayout: LayoutComponents.ProfileInfoLayout,
    OrganizationsListLayout: LayoutComponents.OrganizationsListLayout,
    OrganizationInfoLayout: LayoutComponents.OrganizationInfoLayout,
    CreateOrganizationLayout: LayoutComponents.CreateOrganizationLayout,
    EventActionLayout: LayoutComponents.EventActionLayout,
    Button,
    ChevronRightIcon,
    MenuIcon,
    PlusIcon,
    SearchIcon,
    LoginIcon,
    UserIcon,
  },

  provide() {
    return {
      onClickSelectEvent: this.onClickSelectEvent,
      onClickSelectEditEvent: this.onClickSelectEditEvent,
      onClickEventActionToggle: this.onClickEventActionToggle,

      onClickRightsToggle: this.onClickRightsToggle,
      onClickSelectOrganization: this.onClickSelectOrganization,
    };
  },

  data() {
    return {
      isLoaded: false,
      selectedEvent: null,
      editableEvent: null,
      selectedUser: null,
      selectedOrganization: null,

      searchLayout: false,
      eventListLayout: false,
      eventActionLayout: false,
      infoLayouts: {
        me: false,
        myOrgs: false,
        createOrg: false,
      },
    };
  },

  async mounted() {
    const response = await this.$msal.silentAuth();
    if (response) {
      await this.$store.dispatch("auth/LOGIN", response);
    }
    this.isLoaded = true;
  },

  computed: {
    ...mapState("auth/", {
      user: (state) => state.user,
    }),

    oneOfInfo() {
      let answer = false;
      for (let toggle in this.infoLayouts) {
        if (toggle === "me") continue;
        answer += this.infoLayouts[toggle];
      }
      return answer || this.editableEvent;
    },
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
          this.infoLayouts.me = false;
        });
    },

    // LEFT SIDEBAR ACTIONS

    onClickSidebarToggle() {
      // for close others
      if (window.screen.width < 1280) {
        for (let toggle in this.infoLayouts) {
          this.infoLayouts[toggle] = false;
        }
        this.eventActionLayout = false;
        this.editableEvent = null;
      }

      // main actions
      if (this.searchLayout) {
        this.eventListLayout = false;
        this.selectedEvent = null;
      }
      if (this.selectedEvent) {
        this.selectedEvent = null;
        return;
      }
      this.searchLayout = !this.searchLayout;
    },

    onClickEventsListToggle() {
      this.eventListLayout = !this.eventListLayout;
    },

    onClickSelectEvent(id) {
      if (this.selectedEvent === id) {
        this.selectedEvent = null;
      } else {
        this.selectedEvent = id;
      }
    },

    // RIGHT SIDEBAR ACTIONS

    onClickUserInfoToggle() {
      // for close others
      if (window.screen.width < 1280) {
        this.selectedEvent = null;
        this.eventListLayout = false;
        this.searchLayout = false;
      }
      this.eventActionLayout = false;

      // main actions
      if (this.oneOfInfo) {
        for (let toggle in this.infoLayouts) {
          this.infoLayouts[toggle] = false;
          this.editableEvent = null;
          this.selectedOrganization = null;
          this.infoLayouts.me = true;
        }
      } else {
        this.infoLayouts.me = !this.infoLayouts.me;
      }
    },

    // others right loayouts
    onClickRightsToggle(layout) {
      this.infoLayouts[layout] = !this.infoLayouts[layout];
    },

    onClickSelectEditEvent(id) {
      this.editableEvent = id;
    },

    onClickSelectOrganization(id) {
      this.selectedOrganization = id;
    },

    onClickEventActionToggle() {
      // for close others
      if (window.screen.width < 1280) {
        this.selectedEvent = null;
        this.eventListLayout = false;
        this.searchLayout = false;
      }
      for (let toggle in this.infoLayouts) {
        this.infoLayouts[toggle] = false;
      }

      // main actions
      this.eventActionLayout = !this.eventActionLayout;
      this.editableEvent = null;
    },
  },
};
</script>
