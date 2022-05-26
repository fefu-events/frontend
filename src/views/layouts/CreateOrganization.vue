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
    <div v-if="addUsersList" class="flex flex-col h-full">
      <div class="mx-10 mt-10 font-bold text-lg cursor-pointer">
        <span>Добавить участника</span>
      </div>
      <!-- Search input -->
      <Search
        class="mx-5 mt-4"
        :placeholder="'Поиск'"
        @update="(value) => (userQuery = value)"
      />
      <div class="mb-4 overflow-y-scroll" ref="users">
        <div
          class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
          v-for="user in users"
          :key="user"
        >
          <MemberBlock
            :user="user"
            :createMode="true"
            :addMode="!userIsAdded(user) && user.id != meID"
            :removeMode="userIsAdded(user) && user.id != meID"
            :addMemberToArray="addMemberToArray"
            :removeMemberFromArray="removeMemberFromArray"
          />
        </div>
      </div>
    </div>

    <!-- Create view -->
    <div
      v-if="!addUsersList"
      class="flex flex-col h-full mt-5 space-y-4 overflow-hidden"
    >
      <!-- Avatar -->
      <div class="flex flex-col mx-auto">
        <div class="w-24 h-24 mx-auto rounded-full text-center bg-gray-dark" />
      </div>
      <!-- Title -->
      <div class="mx-5">
        <div class="flex justify-between">
          <input
            class="w-10/12 py-2 bg-transparent focus:outline-none"
            placeholder="Название"
            v-model="organization.title"
            :maxlength="maxTitleSize"
          />
          <span
            class="py-2 pr-2 text-sm"
            v-text="maxTitleSize - organization.title.length"
            :class="{
              'text-danger': maxTitleSize - organization.title.length < 1,
            }"
          />
        </div>
        <hr
          :class="
            v$.organization.title.$error ? 'border-danger' : 'border-black'
          "
        />
      </div>
      <!-- Description -->
      <div class="relative mx-5">
        <textarea
          v-model="organization.description"
          class="w-full h-24 xl:h-32 px-6 py-2 rounded text-sm resize-none ring-offset-0 focus:ring-0 focus:border-primary"
          :maxlength="maxDescSize"
          placeholder="Описание"
        />
        <span
          class="absolute bottom-2 right-2 text-xs"
          :class="{
            'text-danger': maxDescSize - organization.description.length < 1,
          }"
          v-text="maxDescSize - organization.description.length"
        />
      </div>
      <!-- Add members button -->
      <div class="mx-5">
        <div class="flex flex-row items-center justify-between">
          <span class="text-lg"> Участники </span>
          <Button class="w-28 h-9 leading-none" @click="openAddUserList">
            <span class="text-sm"> Добавить </span>
          </Button>
        </div>
      </div>
      <!-- Members -->
      <div
        v-if="organization.members.length > 0"
        class="mx-5 !mb-5 overflow-y-scroll"
      >
        <div
          class="hover:bg-hoverColor cursor-pointer"
          v-for="member in organization.members"
          :key="member"
        >
          <MemberBlock
            class="px-2"
            :user="member"
            :createMode="true"
            :removeMode="true"
            :removeMemberFromArray="removeMemberFromArray"
          />
        </div>
      </div>

      <div class="flex flex-col !mt-auto !mb-10">
        <Button class="mx-10" @click="onClickSubmit">
          <span> Создать организацию </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { mapState } from "vuex";
import api from "@/service/api";

import { ReplyIcon } from "@heroicons/vue/outline";
import * as InterfaceComponents from "@/components/interface";
import { MemberBlock } from "@/components/templates";

export default {
  setup: () => ({ v$: useVuelidate() }),

  name: "CreateOrganization",
  components: {
    Button: InterfaceComponents.Button,
    Search: InterfaceComponents.Search,
    MemberBlock,
    ReplyIcon,
  },

  inject: ["onClickRightsToggle"],

  data() {
    return {
      userQuery: "",
      page: 1,
      users: [],
      addUsersList: false,
      maxTitleSize: 50,
      maxDescSize: 255,

      debounceToggle: true,
      errors: [],

      organization: {
        title: "",
        description: "",
        members: [],
      },
    };
  },

  validations() {
    return {
      organization: {
        title: {
          required,
        },
      },
    };
  },

  computed: {
    ...mapState("me/", {
      token: (state) => state.accessToken,
      meID: (state) => state.user?.id,
    }),

    userIsAdded() {
      return (user) =>
        this.organization.members.some((member) => member.id == user.id);
    },
  },

  async mounted() {},

  methods: {
    backMove() {
      if (this.addUsersList) {
        // remove listener
        const refUsersList = this.$refs.users;
        refUsersList.removeEventListener("scroll", () => this.handleScroll());

        //init states
        this.userQuery = "";
        this.users = [];
        this.page = 1;
        this.addUsersList = false;
        return;
      }
      this.onClickRightsToggle("createOrg");
    },

    async updateUsersList() {
      return api.user.getAll(0, this.userQuery).then(({ data }) => data);
    },

    async handleScroll() {
      if (!this.debounceToggle) return;

      const refUsersList = this.$refs.users;
      const scrolling = refUsersList.scrollTop + refUsersList.clientHeight;
      const limitData = this.users.length >= this.page * 10;
      if (scrolling >= refUsersList.scrollHeight && limitData) {
        this.debounceToggle = false;
        const data = await api.user
          .getAll(this.page * 10, this.userQuery)
          .then(({ data }) => {
            this.debounceToggle = true;
            return data;
          });
        this.users = this.users.concat(data);
        this.page++;
      }
    },

    async openAddUserList() {
      this.addUsersList = true;
      this.users = await this.updateUsersList();

      if (this.$refs.users)
        this.$refs.users.addEventListener("scroll", () => this.handleScroll());
    },

    async addMemberToArray(userID) {
      this.organization.members.push(userID);
    },

    async removeMemberFromArray(userID) {
      this.organization.members = this.organization.members.filter(
        (memberID) => memberID !== userID
      );
    },

    async onClickSubmit() {
      const result = await this.v$.$validate();
      if (!result) return;

      const response = await api.organization.create(
        this.token,
        this.organization
      );
      if (response.status == 201) {
        this.onClickRightsToggle("createOrg");
        this.$emit("rerender");
      }
    },
  },

  watch: {
    userQuery: _.debounce(async function () {
      this.users = await this.updateUsersList();
    }, 500),
  },
};
</script>
