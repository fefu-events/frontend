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
    <div v-if="isLoaded" class="hidden xl:block fixed top-10 right-10 w-max">
      <section v-if="meID">
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
    <!-- My Profile info layout -->
    <LayoutShell :renderTerm="infoLayouts.me">
      <ProfileInfoLayout v-if="meID" :userID="meID" :signOut="signOut" />
    </LayoutShell>

    <!-- Subscriptions list layout -->
    <LayoutShell :renderTerm="infoLayouts.tags">
      <TagsListLayout v-if="infoLayouts.tags" />
    </LayoutShell>

    <!-- Tags list layout -->
    <LayoutShell :renderTerm="infoLayouts.subscriptions">
      <SubscriptionsListLayout v-if="infoLayouts.subscriptions" />
    </LayoutShell>

    <!-- Organizations list layout -->
    <LayoutShell :renderTerm="infoLayouts.myOrgs">
      <OrganizationsListLayout
        v-if="infoLayouts.myOrgs"
        :key="organizationListLayoutWatcher"
      />
    </LayoutShell>

    <!-- Create organization layout -->
    <LayoutShell :renderTerm="infoLayouts.createOrg">
      <CreateOrganizationLayout
        v-if="infoLayouts.createOrg"
        @rerender="() => ++organizationListLayoutWatcher"
      />
    </LayoutShell>

    <!-- Organization info layout -->
    <LayoutShell :renderTerm="selectedOrganization">
      <OrganizationInfoLayout
        :organizationID="selectedOrganization"
        v-if="selectedOrganization"
        @rerender="() => ++organizationListLayoutWatcher"
      />
    </LayoutShell>

    <!-- Event action layout -->
    <LayoutShell :renderTerm="eventActionLayout || editableEvent">
      <EventActionLayout
        v-if="editableEvent"
        :editableEvent="editableEvent"
        @rerender="() => ++eventActionLayoutWatcher"
      />
      <EventActionLayout
        v-else
        :key="eventActionLayoutWatcher"
        @rerender="() => ++eventActionLayoutWatcher"
      />
    </LayoutShell>
    <!-- Other user profile info layout -->
    <LayoutShell :renderTerm="selectedUser">
      <ProfileInfoLayout
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
import * as LayoutComponents from "@/components/layout/";
import { LayoutShell } from "@/components/template";
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
    TagsListLayout: LayoutComponents.TagsListLayout,
    SubscriptionsListLayout: LayoutComponents.SubscriptionsListLayout,
    OrganizationsListLayout: LayoutComponents.OrganizationsListLayout,
    OrganizationInfoLayout: LayoutComponents.OrganizationInfoLayout,
    CreateOrganizationLayout: LayoutComponents.CreateOrganizationLayout,
    EventActionLayout: LayoutComponents.EventActionLayout,
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
      this.selectedEvent = newValue;
    },

    cachePlaces: {
      handler(newValue) {
        if (newValue?.mapPlace) {
          this.eventListLayout = true;
        }
      },

      deep: true,
    },
  },
};
</script>
