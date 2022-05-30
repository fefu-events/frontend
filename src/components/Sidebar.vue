<template>
  <!-- LEFT SIDEBAR -->

  <div class="flex z-500 absolute">
    <!-- Filter layout -->
    <LayoutShell class="z-20" :side="'left'" :renderTerm="searchLayout">
      <EventsFilter
        :eventsListState="eventListLayout"
        :toggleEventsList="onClickEventsListToggle"
      />
    </LayoutShell>
    <!-- Event list layout -->
    <LayoutShell
      class="z-10"
      :side="'left'"
      :renderTerm="eventListLayout"
      :left_x_2="searchLayout"
    >
      <EventsList
        v-if="eventListLayout"
        :onClickEventsListToggle="onClickEventsListToggle"
      />
    </LayoutShell>
    <!-- Event info layout -->
    <LayoutShell
      class="z-0"
      :side="'left'"
      :renderTerm="selectedEvent"
      :left_x_2="searchLayout || eventListLayout"
      :left_x_4="searchLayout && eventListLayout"
    >
      <EventInfo :eventID="selectedEvent" />
    </LayoutShell>
    <!-- Sidebar toggler -->
    <div
      class="hidden xl:block relative top-24 bg-white w-5 h-14 rounded-r-md border-y border-r border-black cursor-pointer z-30"
      :class="{
        '-left-2': countOpenedLeftBars == 2,
        '-left-4': countOpenedLeftBars > 2,
      }"
      @click.stop="onClickSidebarToggle"
    >
      <ChevronRightIcon
        class="w-5 h-14"
        :class="{
          'transform rotate-180':
            searchLayout || selectedEvent || eventListLayout,
        }"
      />
    </div>
  </div>

  <!-- RIGHT SIDEBAR -->

  <div
    class="flex z-500 absolute h-screen xl:right-0"
    :class="{
      'hidden xl:flex': selectedEvent && !selectedUser && !selectedOrganization,
    }"
  >
    <!-- Navigation -->
    <div v-if="isLoaded" class="hidden xl:block fixed top-5 right-5 w-max">
      <section v-if="meID">
        <Button
          class="w-12 h-12 mx-5 bg-white"
          @click="onClickEventActionToggle()"
        >
          <PlusIcon class="w-8 h-8 text mx-auto" />
        </Button>
        <Button class="w-12 h-12 mx-5 bg-white" @click="onClickUserInfoToggle">
          <UserIcon class="w-8 h-8 text mx-auto" />
        </Button>
        <Button class="w-12 h-12 mx-5 bg-white">
          <MenuIcon class="w-8 h-8 text mx-auto" />
        </Button>
      </section>
      <section v-else class="flex">
        <Button nav class="w-32 h-12 mx-5 bg-white" @click="signIn">
          <div class="flex items-center justify-evenly">
            <span class="text-lg font-bold">Войти</span>
            <LoginIcon class="w-8 h-8 rotate-180" />
          </div>
        </Button>
        <Button class="w-12 h-12 mx-5 bg-white">
          <MenuIcon class="w-8 h-8 text mx-auto" />
        </Button>
      </section>
    </div>
    <!-- My Profile info layout -->
    <LayoutShell :renderTerm="infoLayouts.me">
      <ProfileInfo v-if="meID" :userID="meID" :signOut="signOut" />
    </LayoutShell>

    <!-- Tags list layout -->
    <LayoutShell :renderTerm="infoLayouts.tags">
      <TagsList v-if="infoLayouts.tags" />
    </LayoutShell>

    <!-- Subscriptions list layout -->
    <LayoutShell :renderTerm="infoLayouts.subscriptions">
      <SubscriptionsList v-if="infoLayouts.subscriptions" />
    </LayoutShell>

    <LayoutShell :renderTerm="infoLayouts.moderators">
      <ModeratorsList v-if="infoLayouts.moderators" />
    </LayoutShell>

    <!-- Organizations list layout -->
    <LayoutShell :renderTerm="infoLayouts.myOrgs">
      <OrganizationsList
        v-if="infoLayouts.myOrgs"
        :key="organizationListLayoutWatcher"
      />
    </LayoutShell>

    <!-- Create organization layout -->
    <LayoutShell :renderTerm="infoLayouts.createOrg">
      <CreateOrganization
        v-if="infoLayouts.createOrg"
        @rerender="() => ++organizationListLayoutWatcher"
      />
    </LayoutShell>

    <!-- Organization info layout -->
    <LayoutShell :renderTerm="selectedOrganization">
      <OrganizationInfo
        v-if="selectedOrganization"
        :key="organizationListLayoutWatcher"
        :organizationID="selectedOrganization"
        @rerender="() => ++organizationListLayoutWatcher"
      />
    </LayoutShell>

    <!-- Event action layout -->
    <LayoutShell :renderTerm="eventActionLayout || editableEvent">
      <EventAction
        v-if="editableEvent"
        :editableEvent="editableEvent"
        @rerender="() => ++eventActionLayoutWatcher"
      />
      <EventAction
        v-else
        :key="eventActionLayoutWatcher"
        @rerender="() => ++eventActionLayoutWatcher"
      />
    </LayoutShell>
    <!-- Other user profile info layout -->
    <LayoutShell :renderTerm="selectedUser">
      <ProfileInfo
        v-if="selectedUser"
        :key="selectedUser"
        :userID="selectedUser"
        :signOut="signOut"
      />
    </LayoutShell>
  </div>

  <!-- MOBILE BAR -->
  <div
    class="xl:hidden z-500 fixed bottom-0 flex flex-row h-10 w-screen bg-white border-y border-black items-center mx-auto"
  >
    <div
      v-if="meID"
      class="flex-1 hover:text-primary"
      @click.stop="onClickUserInfoToggle"
    >
      <UserIcon class="w-full h-5" />
    </div>
    <div v-else class="flex-1 hover:text-primary" @click.stop="signIn">
      <LoginIcon class="w-full h-5 rotate-180" />
    </div>
    <div class="flex-1 hover:text-primary" @click.stop="onClickSidebarToggle">
      <SearchIcon class="w-full h-5" />
    </div>
    <div
      v-if="meID"
      class="flex-1 hover:text-primary"
      @click="onClickEventActionToggle"
    >
      <PlusIcon class="w-full h-5" />
    </div>
    <div class="flex-1 hover:text-primary">
      <MenuIcon class="w-full h-5" />
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { mapState } from "vuex";
import { Button } from "@/components/interface";
import * as LayoutComponents from "@/layouts";
import { LayoutShell } from "@/components/templates";
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
    CreateOrganization: LayoutComponents.CreateOrganization,
    EventAction: LayoutComponents.EventAction,
    EventInfo: LayoutComponents.EventInfo,
    EventsList: LayoutComponents.EventsList,
    EventsFilter: LayoutComponents.EventsFilter,
    ModeratorsList: LayoutComponents.ModeratorsList,
    OrganizationInfo: LayoutComponents.OrganizationInfo,
    OrganizationsList: LayoutComponents.OrganizationsList,
    ProfileInfo: LayoutComponents.ProfileInfo,
    SubscriptionsList: LayoutComponents.SubscriptionsList,
    TagsList: LayoutComponents.TagsList,
    LayoutShell,
    Button,
    ChevronRightIcon,
    MenuIcon,
    PlusIcon,
    SearchIcon,
    LoginIcon,
    UserIcon,
  },

  props: {
    singleEvent: Number,
  },

  provide() {
    return {
      onClickSelectEvent: this.onClickSelectEvent,
      onClickSelectEditEvent: this.onClickSelectEditEvent,
      onClickEventActionToggle: this.onClickEventActionToggle,

      onClickRightsToggle: this.onClickRightsToggle,
      onClickSelectUser: this.onClickSelectUser,
      onClickSelectOrganization: this.onClickSelectOrganization,

      selectedUser: computed(() => this.selectedUser),
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
        tags: false,
        subscriptions: false,
        moderators: false,
      },

      // rerender keys
      eventActionLayoutWatcher: 1,
      organizationListLayoutWatcher: 1,
    };
  },

  async mounted() {
    const response = await this.$msal.silentAuth();
    if (response) {
      await this.$store.dispatch("me/LOGIN", response);
    }
    this.isLoaded = true;
  },

  computed: {
    ...mapState("me/", {
      meID: (state) => state.user?.id,
    }),

    ...mapState("filter/", {
      cachePlaces: (state) => state.cachePlaces,
    }),

    countOpenedLeftBars() {
      return (
        Number(this.searchLayout) +
        Number(this.eventListLayout) +
        Number(this.selectedEvent != null)
      );
    },

    oneOfInfo() {
      let answer = false;
      for (let toggle in this.infoLayouts) {
        if (toggle === "me") continue;
        answer += this.infoLayouts[toggle];
      }
      return answer || this.editableEvent || this.selectedOrganization;
    },
  },

  methods: {
    async signIn() {
      const response = await this.$msal.signIn();
      if (response) {
        await this.$store.dispatch("me/LOGIN", response);
        this.auth = true;
      }
    },

    async signOut() {
      await this.$msal
        .signOut()
        .then(() => {
          this.auth = false;
          this.$store.dispatch("me/LOGOUT");
        })
        .then(() => {
          this.infoLayouts.me = false;
        });
    },

    // Select objects

    onClickSelectEvent(id) {
      if (this.selectedEvent === id) {
        this.selectedEvent = null;
      } else {
        this.selectedEvent = id;
      }
    },

    onClickSelectEditEvent(id) {
      this.editableEvent = id;
    },

    onClickSelectOrganization(id) {
      this.selectedUser = null;
      this.selectedOrganization = id;
    },

    onClickSelectUser(userID) {
      this.selectedUser = userID;
    },

    // LEFT SIDEBAR ACTIONS

    onClickSidebarToggle() {
      // for close others
      if (window.screen.width < 1280) {
        for (let toggle in this.infoLayouts) {
          this.infoLayouts[toggle] = false;
        }
        this.selectedOrganization = null;
        this.selectedUser = null;
        this.eventActionLayout = false;
        this.editableEvent = null;
      }

      // main actions
      if (this.selectedEvent) {
        this.selectedEvent = null;
        return;
      }

      if (this.eventListLayout) {
        if (this.cachePlaces?.mapPlace) {
          this.$store.dispatch("filter/SET_MAP_PLACE", null);
        }
        this.eventListLayout = false;
        return;
      }

      if (this.searchLayout) {
        this.eventListLayout = false;
        this.selectedEvent = null;
      }

      this.searchLayout = !this.searchLayout;
    },

    onClickEventsListToggle() {
      if (this.cachePlaces?.mapPlace && this.eventListLayout) {
        this.$store.dispatch("filter/SET_MAP_PLACE", null);
      }
      this.eventListLayout = !this.eventListLayout;
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
      if (this.selectedUser && this.selectedUser == this.meID) {
        this.selectedUser = null;
        return;
      } else {
        this.selectedUser = null;
      }
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

    onClickEventActionToggle() {
      // for close others
      if (window.screen.width < 1280) {
        this.selectedOrganization = null;
        this.selectedUser = null;
        this.selectedEvent = null;
        this.eventListLayout = false;
        this.searchLayout = false;
      }
      for (let toggle in this.infoLayouts) {
        this.infoLayouts[toggle] = false;
      }

      // main actions
      this.editableEvent = null;
      this.selectedUser = null;
      this.selectedOrganization = null;

      this.eventActionLayout = !this.eventActionLayout;
    },

    // others right loayouts
    onClickRightsToggle(layout) {
      this.infoLayouts[layout] = !this.infoLayouts[layout];
    },
  },

  watch: {
    singleEvent(newValue) {
      this.eventListLayout = false;
      this.selectedEvent = newValue;
    },

    cachePlaces: {
      handler(newValue) {
        this.selectedEvent = null;
        if (newValue?.mapPlace) {
          this.eventListLayout = true;
        } else {
          this.eventListLayout = false;
        }
      },

      deep: true,
    },
  },
};
</script>
