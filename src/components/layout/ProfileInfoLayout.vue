<template>
  <div class="flex flex-col h-full w-[89%] xl:w-80 mx-auto overflow-scroll">
    <!-- Back -->
    <div
      v-if="selectedUser"
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>

    <!-- Person -->
    <div class="flex flex-row items-center mt-10 mx-5">
      <div class="min-w-[64px] h-16 rounded-full bg-gray-300">
        <img src="" alt="" srcset="" />
      </div>
      <div class="mx-4 md:ml-6 md:mr-0">
        <span class="text-2xl break-words word-space-full">{{
          user?.name
        }}</span>
      </div>
    </div>
    <!-- Bookmarks -->
    <div v-if="isMe" class="mx-5 mt-8">
      <ul>
        <li class="flex flex-row my-5 font-bold cursor-pointer group">
          <HashtagIcon class="w-5 h-5 mx-2" />
          <span class="group-hover:text-primary">Мои теги</span>
        </li>
        <li class="flex flex-row my-5 font-bold cursor-pointer group">
          <UserIcon class="w-5 h-5 mx-2" />
          <span class="group-hover:text-primary"> Мои подписки </span>
        </li>
        <li
          class="flex flex-row my-5 font-bold cursor-pointer group"
          @click="openOrganizationsList"
        >
          <UserGroupIcon class="w-5 h-5 mx-2" />
          <span class="group-hover:text-primary">Мои организации</span>
        </li>
      </ul>
    </div>
    <!-- Events -->
    <span
      class="mx-5 font-medium"
      :class="{
        'my-5': !isMe,
      }"
    >
      {{ isMe ? "Мои мероприятия:" : "Мероприятия:" }}
    </span>
    <div
      v-if="events.length > 0"
      class="mt-1 mb-8 overflow-y-scroll"
      ref="events"
    >
      <div
        class="hover:bg-hoverColor px-5 cursor-pointer"
        v-for="event in events"
        :key="event.id"
        @click="selectEvent(event.id)"
      >
        <EventBlock :event="event" :edit="isMe" />
      </div>
    </div>
    <div v-else class="h-2/5 my-4">
      <img
        class="max-h-full mx-auto"
        src="@/assets/img/svg/emptyList.svg"
        alt=""
      />
    </div>
    <Button v-if="isMe" class="mt-auto mx-10 mb-10" @click="signOut">
      <span> Выйти </span>
    </Button>
    <Button v-else class="mt-auto mx-10 mb-10">
      <span> Подписаться </span>
    </Button>
  </div>
</template>

<style>
.word-space-full {
  word-spacing: 9999px;
}
</style>

<script>
import _ from "lodash";
import api from "@/service/api";
import { mapState } from "vuex";
import {
  HashtagIcon,
  ReplyIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/vue/outline";
import { EventBlock } from "@/components/template";
import { Button } from "@/components/interface";

export default {
  name: "ProfileInfoLayout",
  components: {
    EventBlock,
    Button,
    HashtagIcon,
    ReplyIcon,
    UserIcon,
    UserGroupIcon,
  },

  props: {
    user: Object,
    signOut: Function,
  },

  inject: [
    "onClickRightsToggle",
    "onClickSelectEvent",
    "onClickSelectUser",
    "selectedUser",
  ],

  data() {
    return {
      page: 1,
      events: [],
    };
  },

  computed: {
    ...mapState("client/", {
      forceUpdateEventList: "forceUpdateEventList",
    }),

    ...mapState("auth/", {
      meID: (state) => state.user.id,
    }),

    isMe() {
      return this.user.id === this.meID;
    },

    // userOrganizations() {
    //   return this.user.organizations.map((org) => org.id);
    // },

    skip() {
      return 10 * this.page;
    },
  },

  async mounted() {
    await this.updateEventList();
    const eventsList = this.$refs.events;
    if (eventsList)
      eventsList.addEventListener(
        "scroll",
        _.debounce(() => this.handleScroll(), 100)
      );
  },

  methods: {
    backMove() {
      this.onClickSelectUser(null);
    },

    openOrganizationsList() {
      this.onClickRightsToggle("myOrgs");
    },

    async updateEventList() {
      this.events = await api.event
        .getByUserID(0, this.user?.id)
        .then((response) => response.data);
    },

    async handleScroll() {
      const eventsList = this.$refs.events;
      const scrolling = eventsList.scrollTop + eventsList.clientHeight;
      if (
        scrolling >= eventsList.scrollHeight &&
        this.events.length >= this.page * 10
      ) {
        const { data } = await api.event.getByUserID(this.skip, this.user?.id);
        this.events = this.events.concat(data);
        this.page++;
      }
    },

    selectEvent(eventID) {
      this.onClickSelectEvent(eventID);
    },
  },

  watch: {
    user() {
      this.page = 1;
      this.updateEventList();
    },
    forceUpdateEventList(newValue) {
      if (newValue === true) {
        this.updateEventList();
      }
      this.$store.dispatch("client/SET_FORCE_UPDATE_EVENT_LIST", false);
    },
  },
};
</script>
