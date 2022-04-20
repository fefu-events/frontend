<template>
  <div class="flex flex-col h-full w-[89%] xl:w-80 mx-auto">
    <!-- Back -->
    <div
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>

    <!-- Add user list view -->
    <div v-if="addUserList" class="flex flex-col h-full mx-5">
      <div class="mt-10 font-bold text-lg cursor-pointer">
        <span>Добавить участника</span>
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
        </div>
      </div>
    </div>

    <!-- Info view -->
    <div v-else class="flex flex-col h-full mt-6 overflow-hidden">
      <!-- Organization avatar and title -->
      <div class="flex flex-row items-center mt-10 mx-5">
        <div class="min-w-[64px] h-16 rounded-full bg-gray-300">
          <img src="" alt="" srcset="" />
        </div>
        <div class="flex-1 mx-4 md:ml-6 md:mr-0">
          <span class="self-center text-2xl break-words">{{
            organization?.title
          }}</span>
        </div>
      </div>
      <!-- Description -->
      <div class="mt-4 xl:!mt-10 mx-5">
        <div v-if="editMode" class="relative">
          <textarea
            v-model="orgDescription"
            class="w-full h-24 xl:h-32 px-6 py-2 rounded text-sm resize-none ring-offset-0 focus:ring-0 focus:border-primary"
            :maxlength="maxDescSize"
            placeholder="Описание"
          />
          <span
            class="absolute bottom-2 right-2 text-xs"
            :class="{
              'text-danger': maxDescSize - orgDescription.length < 1,
            }"
            v-text="maxDescSize - orgDescription.length"
          />
        </div>
        <p v-else class="mx-5">
          {{ organization?.description }}
        </p>
      </div>
      <div class="flex flex-row justify-evenly items-center">
        <Button class="w-60 h-10 mx-2 my-5 leading-none" @click="openEventList">
          <span class="text-sm"> Посмотреть мероприятия </span>
        </Button>
        <PencilAltIcon
          v-if="isAdmin"
          class="w-8 h-8 hover:text-primary cursor-pointer"
        />
      </div>
      <!-- Add members -->
      <div class="mx-5 xl:mx-0">
        <div class="flex flex-row items-center justify-between xl:mx-5">
          <span class="text-lg"> Участники </span>
          <Button
            v-if="isAdmin"
            class="w-28 h-9 my-0 leading-none"
            @click="openAddUserList"
          >
            <span class="text-sm"> Добавить </span>
          </Button>
        </div>
      </div>
      <!-- Members -->
      <div class="mx-5 my-5 overflow-y-scroll">
        <div
          class="hover:bg-hoverColor cursor-pointer"
          v-for="member in organization?.members"
          :key="member"
        >
          <MemberBlock
            class="px-2"
            :user="member"
            :removeMode="isAdmin"
            :promoteMode="isAdmin"
          />
        </div>
      </div>

      <div v-if="!addUserList" class="flex flex-col mt-auto mb-10">
        <Button class="mx-10 my-3" :disabled="isAdmin" @click="onClickLeave">
          <span> Выйти из организации </span>
        </Button>
        <Button class="mx-10 my-0" v-if="isAdmin" @click="onClickDelete">
          <span> Удалить организацию </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import api from "@/service/api";
import { mapState } from "vuex";
import { ReplyIcon } from "@heroicons/vue/outline";
import { PencilAltIcon } from "@heroicons/vue/outline";
import * as InterfaceComponents from "@/components/interface";
import { MemberBlock } from "@/components/template";

export default {
  name: "OrganizationInfoLayout",
  components: {
    Button: InterfaceComponents.Button,
    Search: InterfaceComponents.Search,
    MemberBlock,
    PencilAltIcon,
    ReplyIcon,
  },

  props: {
    organizationID: Number,
  },

  provide() {
    return {
      addMemberToArray: this.addMemberToArray,
      removeMemberFromArray: this.removeMemberFromArray,
    };
  },

  inject: ["onClickSelectOrganization"],

  data() {
    return {
      addUserList: false,
      userQuery: "",
      users: [],
      users_page: 1,

      eventsList: false,
      eventQuery: "",
      events: [],
      events_page: 1,

      maxTitleSize: 50,
      orgTitle: "",
      maxDescSize: 255,
      orgDescription: "",

      editMode: false,
      organization: null,
    };
  },

  computed: {
    ...mapState("auth/", {
      token: (state) => state.accessToken,
      userID: (state) => state.user.id,
    }),

    filteredAddUsers() {
      return this.users.filter(
        (user) =>
          !this.organization.members
            .map((member) => member.id)
            .includes(user.id)
      );
    },

    isAdmin() {
      return this.organization?.owner_id === this.userID;
    },
  },

  async mounted() {
    this.organization = await api.organization
      .getByID(this.organizationID)
      .then(({ data }) => data);
    this.orgTitle = this.organization.title;
    this.orgDescription = this.organization.description;
  },

  methods: {
    backMove() {
      if (this.addUserList) {
        // remove listener
        const eventsList = this.$refs.users;
        eventsList.removeEventListener("scroll", () => this.handleScroll());

        //init states
        this.userQuery = "";
        this.users = [];
        this.users_page = 1;
        this.addUserList = false;
        return;
      }
      this.onClickSelectOrganization(null);
    },

    async updateUsersList() {
      this.users = await api.user
        .getAll(0, this.userQuery)
        .then(({ data }) => data);
    },

    async handleScroll() {
      const usersList = this.$refs.users;
      const scrolling = usersList.scrollTop + usersList.clientHeight;
      if (
        scrolling >= usersList.scrollHeight &&
        this.users.length >= this.users_page * 10
      ) {
        const { data } = await api.user.getAll(this.skip, this.userQuery);
        this.users = this.users.concat(data);
        this.users_page++;
      }
    },

    openAddUserList() {
      this.addUserList = true;
      const usersList = this.$refs.users;
      if (usersList)
        usersList.addEventListener("scroll", () => this.handleScroll());
      this.updateUsersList();
    },

    openEventList() {
      const usersList = this.$refs.users;
      if (usersList)
        usersList.addEventListener("scroll", () => this.handleScroll());
      this.updateUsersList();
      this.eventsList = true;
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

    async onClickLeave() {
      const response = await api.organization.removeMember(
        this.token,
        this.organizationID,
        this.userID
      );
      if (response.status === 200) {
        this.onClickSelectOrganization(null);
        this.$store.dispatch("client/SET_FORCE_UPDATE_ORG_LIST", true);
      }
    },

    async onClickDelete() {
      await api.organization
        .delete(this.token, this.organizationID)
        .then(() => {
          this.onClickSelectOrganization(null);
          this.$store.dispatch("client/SET_FORCE_UPDATE_ORG_LIST", true);
        });
    },
  },

  watch: {
    userQuery: _.debounce(function () {
      this.updateUsersList();
    }, 500),
  },
};
</script>
