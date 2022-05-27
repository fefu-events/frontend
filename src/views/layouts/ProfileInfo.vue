<template>
  <div class="flex flex-col h-full overflow-scroll">
    <!-- Back -->
    <div
      v-if="selectedUser"
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>

    <!-- Person -->
    <div class="flex flex-row items-center mx-5 mt-5 space-x-4">
      <div class="min-w-[64px] h-16 rounded-full bg-gray-300">
        <img src="" alt="" srcset="" />
      </div>
      <span class="text-xl break-words word-space-full">
        {{ user?.name }}
      </span>
    </div>
    <!-- Bookmarks -->
    <div v-if="isMe" class="my-4">
      <ul class="mx-5 space-y-4 text-base">
        <li
          class="flex flex-row space-x-2 font-bold cursor-pointer group"
          @click="openBookmark('tags')"
        >
          <HashtagIcon class="w-5 h-5" />
          <span class="group-hover:text-primary">Мои теги</span>
        </li>
        <li
          class="flex flex-row space-x-2 font-bold cursor-pointer group"
          @click="openBookmark('subscriptions')"
        >
          <UserIcon class="w-5 h-5" />
          <span class="group-hover:text-primary"> Мои подписки </span>
        </li>
        <li
          class="flex flex-row space-x-2 font-bold cursor-pointer group"
          @click="openBookmark('myOrgs')"
        >
          <UserGroupIcon class="w-5 h-5" />
          <span class="group-hover:text-primary">Мои организации</span>
        </li>
        <li
          v-if="isAdmin"
          class="flex flex-row space-x-2 font-bold cursor-pointer group"
          @click="openBookmark('moderators')"
        >
          <ShieldCheckIcon class="w-5 h-5" />
          <span class="group-hover:text-primary">Модераторы</span>
        </li>
      </ul>
    </div>
    <!-- Events -->
    <span
      v-if="events.length > 0"
      class="mx-5 font-medium"
      :class="{ 'mt-10': !isMe }"
    >
      {{ isMe ? "Мои мероприятия:" : "Мероприятия:" }}
    </span>
    <div
      v-if="events.length > 0"
      class="mt-1 mb-6 overflow-y-scroll"
      ref="events"
    >
      <div
        class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
        v-for="event in events"
        :key="event.id"
        @click="selectEvent(event.id)"
      >
        <EventBlock
          :event="event"
          :edit="(isMe && userPerms(event)) || statusPerms"
          :onClickSelectEditEvent="onClickSelectEditEvent"
        />
      </div>
    </div>
    <div v-else class="h-2/5 mt-auto mb-4">
      <img
        class="max-h-full mx-auto"
        src="@/assets/img/svg/emptyList.svg"
        alt=""
      />
    </div>
    <Button v-if="isMe" class="mt-auto mx-10 mb-10" @click="signOut">
      <span> Выйти </span>
    </Button>
    <Button
      v-if="!isMe && meID"
      class="mt-auto mx-10 mb-10"
      :class="{
        'hover:border-danger hover:text-danger': user?.am_i_following,
      }"
      @click="onClickSubscription"
    >
      <span> {{ user?.am_i_following ? "Отписаться" : "Подписаться" }} </span>
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
import * as Icons from "@heroicons/vue/outline";
import { EventBlock } from "@/components/templates";
import { Button } from "@/components/interface";

export default {
  name: "ProfileInfo",
  components: {
    EventBlock,
    Button,
    HashtagIcon: Icons.HashtagIcon,
    ReplyIcon: Icons.ReplyIcon,
    ShieldCheckIcon: Icons.ShieldCheckIcon,
    UserIcon: Icons.UserIcon,
    UserGroupIcon: Icons.UserGroupIcon,
  },

  props: {
    userID: Number,
    signOut: Function,
  },

  inject: [
    "onClickRightsToggle",
    "onClickSelectEvent",
    "onClickSelectUser",
    "onClickSelectEditEvent",
    "selectedUser",
  ],

  data() {
    return {
      page: 1,
      events: [],

      user: null,
    };
  },

  computed: {
    ...mapState("me/", {
      token: (state) => state.accessToken,
      meID: (state) => state.user?.id,
      isAdmin: (state) => state.user?.is_admin,
      statusPerms: (state) => state.user?.is_admin || state.user?.is_moderator,
    }),

    isMe() {
      return this.userID === this.meID;
    },

    userPerms() {
      return (event) =>
        this.user?.organizations
          .map((org) => org.id)
          .includes(event.organization?.id) || event.organization === null;
    },

    skip() {
      return 10 * this.page;
    },
  },

  async mounted() {
    this.user = await api.user
      .getByUserID(this.userID, this.token)
      .then(({ data }) => data);

    this.events = await this.updateEventList();
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

    openBookmark(bookmark) {
      this.onClickRightsToggle(bookmark);
    },

    async updateEventList() {
      return api.event
        .getByUserID(0, this.userID)
        .then((response) => response.data);
    },

    async handleScroll() {
      const eventsList = this.$refs.events;
      const scrolling = eventsList.scrollTop + eventsList.clientHeight;
      if (
        scrolling >= eventsList.scrollHeight &&
        this.events.length >= this.page * 10
      ) {
        const { data } = await api.event.getByUserID(this.skip, this.userID);
        this.events = this.events.concat(data);
        this.page++;
      }
    },

    selectEvent(eventID) {
      this.onClickSelectEvent(eventID);
    },

    async onClickSubscription() {
      if (!this.user.am_i_following) {
        await api.subscription.addUser(this.token, this.userID);
      } else {
        await api.subscription.removeUser(this.token, this.userID);
      }
      this.user.am_i_following = !this.user.am_i_following;
    },
  },
};
</script>
