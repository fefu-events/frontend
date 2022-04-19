<template>
  <div class="flex flex-col h-full w-[89%] xl:w-80 mx-auto">
    <!-- Back -->
    <div
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>

    <!-- Add user list -->
    <div v-if="addUserList" class="flex flex-col h-full mx-5">
      <div class="mt-10 font-bold cursor-pointer">
        <span>Мои организации</span>
      </div>
      <!-- Search input -->
      <Search
        class="mt-4"
        @update="(value) => (userQuery = value)"
        :placeholder="'Поиск'"
      />
      <div class="mb-4 overflow-y-scroll" ref="users">
        <div
          class="hover:bg-hoverColor cursor-pointer"
          v-for="user in filteredAddUsers"
          :key="user"
        >
          <MemberBlock :user="user" :createMode="true" :addMode="true" />
          <MemberBlock :user="user" :createMode="true" :addMode="true" />
          <MemberBlock :user="user" :createMode="true" :addMode="true" />
          <MemberBlock :user="user" :createMode="true" :addMode="true" />
          <MemberBlock :user="user" :createMode="true" :addMode="true" />
        </div>
      </div>
    </div>

    <!-- Create page -->
    <div v-else class="flex flex-col h-full mt-6 overflow-hidden">
      <!-- Avatar -->
      <div class="flex flex-col mx-5 mt-8">
        <div class="w-24 h-24 mx-auto rounded-full text-center bg-gray-dark" />
      </div>
      <!-- Title -->
      <div class="xl:mt-11 mx-5">
        <div class="flex justify-between">
          <input
            class="w-10/12 py-2 bg-transparent focus:outline-none"
            placeholder="Название"
            v-model="organization.title"
            :maxlength="50"
          />
          <span
            class="py-2 pr-2 text-sm"
            v-text="maxTitleSize - organization.title.length"
            :class="{
              'text-danger': maxTitleSize - organization.title.length < 1,
            }"
          />
        </div>
        <hr class="border-black" />
        <!-- <hr
          :class="errors.includes('title') ? 'border-danger' : 'border-black'"
        /> -->
      </div>
      <!-- Description -->
      <div class="relative mt-4 xl:!mt-10 mx-5">
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
      <!-- Add members -->
      <div class="mt-7 mx-5 xl:mx-0">
        <div class="flex flex-row items-center justify-between xl:mx-5">
          <span> Участники </span>
          <Button class="w-28 h-9 my-0 leading-none" @click="openAddUserList">
            <span class="text-sm"> Добавить </span>
          </Button>
        </div>
      </div>
      <!-- Members -->
      <div class="my-5 overflow-y-scroll">
        <div
          class="hover:bg-hoverColor cursor-pointer"
          v-for="member in organization.members"
          :key="member"
        >
          <MemberBlock :user="member" :createMode="true" :removeMode="true" />
        </div>
      </div>

      <div class="flex flex-col mt-auto pb-10">
        <Button class="mx-10 my-0" v-if="!addUserList" @click="onClickSubmit">
          <span> Создать организацию </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
// import api from "@/service/api";
import { mapState } from "vuex";
import { ReplyIcon } from "@heroicons/vue/outline";
import * as InterfaceComponents from "@/components/interface";
import { MemberBlock } from "@/components/template";
import api from "@/service/api";

export default {
  name: "CreateOrganizationLayout",
  components: {
    Button: InterfaceComponents.Button,
    Search: InterfaceComponents.Search,
    MemberBlock,
    ReplyIcon,
  },

  provide() {
    return {
      addMemberToArray: this.addMemberToArray,
      removeMemberFromArray: this.removeMemberFromArray,
    };
  },

  inject: ["onClickRightsToggle"],

  data() {
    return {
      userQuery: "",
      page: 1,
      users: [],
      addUserList: false,
      maxTitleSize: 50,
      maxDescSize: 255,

      organization: {
        title: "",
        description: "",
        members: [],
      },
    };
  },

  computed: {
    ...mapState("auth/", {
      token: (state) => state.accessToken,
    }),

    filteredAddUsers() {
      return this.users;
      // return this.users.filter(
      //   (user) =>
      //     !this.organization.members
      //       .map((member) => member.id)
      //       .includes(user.id)
      // );
    },
  },

  async mounted() {},

  methods: {
    backMove() {
      if (this.addUserList) {
        // remove listener
        const eventsList = this.$refs.users;
        eventsList.removeEventListener("scroll", () => this.handleScroll());

        //init states
        this.userQuery = "";
        this.users = [];
        this.page = 1;
        this.addUserList = false;
        return;
      }
      this.onClickRightsToggle("createOrg");
    },

    async handleScroll() {
      const eventsList = this.$refs.users;
      const scrolling = eventsList.scrollTop + eventsList.clientHeight;
      if (
        scrolling >= eventsList.scrollHeight &&
        this.events.length >= this.page * 10
      ) {
        const { data } = await api.event.getAll(
          this.skip,
          this.filterParams,
          this.user
        );
        this.events = this.events.concat(data);
        this.page++;
      }
    },

    openAddUserList() {
      const eventsList = this.$refs.users;
      if (eventsList)
        eventsList.addEventListener("scroll", () => this.handleScroll());
      this.loadUsersList();
      this.addUserList = true;
    },

    async loadUsersList() {
      this.users = await api.user.getAll().then(({ data }) => data);
    },

    async addMemberToArray(user) {
      this.organization.members.push(user);
    },

    async removeMemberFromArray(user) {
      this.organization.members = this.organization.members.filter(
        (member) => member.id !== user.id
      );
    },

    async onClickSubmit() {
      const response = await api.organization.create(
        this.token,
        this.organization
      );
      if (response.status == 201) {
        this.organization = {
          title: "",
          description: "",
          members: [],
        };
        this.onClickRightsToggle("createOrg");
        this.$store.dispatch("client/SET_FORCE_UPDATE_ORG_LIST", true);
      }
    },
  },
};
</script>
