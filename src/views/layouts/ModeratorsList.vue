<template>
  <div class="flex flex-col h-full">
    <!-- Back -->
    <div
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>

    <!-- Add user list view -->
    <div class="flex-col h-full" :class="addUsersList ? 'flex' : 'hidden'">
      <div class="mx-10 mt-10 font-bold text-lg">
        <span>Добавить модера</span>
      </div>
      <!-- Search input -->
      <Search
        class="mx-5 mt-4"
        @update="(value) => (userQuery = value)"
        :placeholder="'Поиск'"
      />
      <div class="mb-4 overflow-y-scroll" ref="users">
        <div
          class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
          v-for="user in users"
          :key="user"
        >
          <MemberBlock
            :user="user"
            :addMode="!userIsAdded(user) && user.id != meID"
            :removeMode="userIsAdded(user) && user.id != meID"
            :moderMode="true"
            :addModerator="addModerator"
            :removeModerator="removeModerator"
          />
        </div>
      </div>
    </div>

    <!-- Members list view -->
    <div class="flex-col h-full" :class="!addUsersList ? 'flex' : 'hidden'">
      <div class="mt-10 mb-5 mx-10 font-bold text-lg">
        <span>Модераторы</span>
      </div>
      <!-- Add moderators button -->
      <Button class="mx-10" @click="openAddUserList">
        <span> Добавить модератора </span>
      </Button>

      <!-- Moderators-->
      <div class="my-4 overflow-y-scroll">
        <div
          class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
          v-for="moderator in moderators"
          @click="onClickSelectUser(moderator.id)"
          :key="moderator"
        >
          <MemberBlock
            :user="moderator"
            :removeMode="true"
            :moderMode="true"
            :removeModerator="removeModerator"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

import api from "@/service/api";
import { mapState } from "vuex";

import * as InterfaceComponents from "@/components/interface";
import { MemberBlock } from "@/components/templates";
import { ReplyIcon } from "@heroicons/vue/outline";

export default {
  name: "ModeratorsList",
  components: {
    Button: InterfaceComponents.Button,
    Search: InterfaceComponents.Search,
    MemberBlock,
    ReplyIcon,
  },

  data() {
    return {
      debounceToggle: true,
      users: [],
      userQuery: "",
      addUserListPage: 1,
      addUsersList: false,

      moderators: [],
    };
  },

  inject: ["onClickRightsToggle", "onClickSelectUser"],

  async mounted() {
    this.moderators = await api.user.getModerators().then(({ data }) => data);
  },

  computed: {
    ...mapState("me/", {
      meID: (state) => state.user?.id,
    }),

    userIsAdded() {
      return (user) =>
        this.moderators?.some((moderator) => moderator.id == user.id);
    },
  },

  methods: {
    backMove() {
      if (this.addUsersList) {
        this.addUsersList = false;
        return;
      }
      this.onClickRightsToggle("moderators");
    },

    async updateUsersList() {
      this.users = await api.user
        .getAll(0, this.userQuery)
        .then(({ data }) => data);
    },

    async handleScroll() {
      if (!this.debounceToggle) return;

      const refList = this.$refs.users;
      const scrolling = refList.scrollTop + refList.clientHeight;
      const limitData = this.users.length >= this.addUserListPage * 10;
      if (scrolling >= refList.scrollHeight && limitData) {
        this.debounceToggle = false;
        const data = await api.user
          .getAll(this.addUserListPage * 10, this.userQuery)
          .then(({ data }) => {
            this.debounceToggle = true;
            return data;
          });

        this.users = this.users.concat(data);
        this.addUserListPage++;
      }
    },

    async openAddUserList() {
      this.addUsersList = true;
      const refUsersList = this.$refs.users;
      if (refUsersList)
        refUsersList.addEventListener(
          "scroll",
          _.debounce(() => this.handleScroll(), 100)
        );
      this.updateUsersList();
    },

    addModerator(userID) {
      console.log(`Moder ${userID} added`);
    },

    removeModerator(userID) {
      console.log(`Moder ${userID} removed`);
    },
  },

  beforeUnmount() {
    this.$refs.users.removeEventListener("scroll", () => this.handleScroll());
  },

  watch: {
    userQuery: _.debounce(async function () {
      this.users_page = 1;
      this.users = await this.loadUsersList(0);
    }, 500),
  },
};
</script>
