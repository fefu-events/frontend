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

    <!-- Organization event list view -->
    <div v-else-if="eventsList" class="flex flex-col h-full mx-5">
      <div class="mt-10 font-bold text-lg cursor-pointer">
        <span>Мероприятия</span>
      </div>
      <!-- Search input -->
      <!-- <Search
        class="mt-4"
        @update="(value) => (userQuery = value)"
        :placeholder="'Поиск'"
      /> -->
      <div class="mb-4 overflow-y-scroll" ref="events">
        <div
          class="hover:bg-hoverColor cursor-pointer"
          v-for="event in events"
          :key="event"
          @click="selectEvent(event.id)"
        >
          <EventBlock class="px-2" :event="event" :edit="isAdmin" />
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
          <div v-if="editMode" class="flex flex-col">
            <div class="flex justify-between">
              <input
                class="w-10/12 py-2 bg-transparent focus:outline-none"
                placeholder="Название"
                v-model="orgTitle"
                :maxlength="50"
              />
              <span
                class="py-2 pr-2 text-sm"
                v-text="maxTitleSize - orgTitle.length"
                :class="{
                  'text-danger': maxTitleSize - orgTitle.length < 1,
                }"
              />
            </div>
            <hr class="border-black" />
          </div>
          <span v-else class="self-center text-2xl break-words">{{
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
      <!-- Control -->
      <div class="flex flex-row justify-evenly items-center">
        <Button class="w-60 h-10 mx-2 my-5 leading-none" @click="openEventList">
          <span> Посмотреть мероприятия </span>
        </Button>
        <PencilAltIcon
          v-if="isAdmin && !editMode"
          class="w-7 h-7 hover:text-primary cursor-pointer"
          @click="editMode = true"
        />
        <CheckIcon
          v-else-if="isAdmin && editMode"
          class="w-8 h-8 hover:text-primary cursor-pointer"
          @click="onClickAcceptEdits"
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
      <div class="mx-5 mt-5 mb-2 overflow-y-scroll">
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
      <!-- Leave and Delete -->
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
import { ReplyIcon, PencilAltIcon, CheckIcon } from "@heroicons/vue/outline";
import * as InterfaceComponents from "@/components/interface";
import { MemberBlock, EventBlock } from "@/components/template";

export default {
  name: "OrganizationInfoLayout",
  components: {
    Button: InterfaceComponents.Button,
    Search: InterfaceComponents.Search,
    EventBlock,
    MemberBlock,
    CheckIcon,
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

  inject: ["onClickSelectOrganization", "onClickSelectEvent"],

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
    this.initOrganization();
  },

  methods: {
    async initOrganization() {
      this.organization = await api.organization
        .getByID(this.organizationID)
        .then(({ data }) => data);
      this.orgTitle = this.organization.title;
      this.orgDescription = this.organization.description;
    },

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

    async handleScroll(listType) {
      const list = this.$refs[listType];
      const scrolling = list.scrollTop + list.clientHeight;
      if (
        scrolling >= list.scrollHeight &&
        this.listType.length >= this[`${listType}_page`] * 10
      ) {
        let data = [];
        if (listType === "users") {
          data = await api.user
            .getAll(this.skip, this.userQuery)
            .then(({ data }) => data);
        } else {
          data = await api.user
            .getByOrganizationID(this.skip, this.organizationID)
            .then(({ data }) => data);
        }
        this[listType] = this[listType].concat(data);
        this[`${listType}_page`]++;
      }
    },

    openAddUserList() {
      this.addUserList = true;
      const usersList = this.$refs.users;
      if (usersList)
        usersList.addEventListener("scroll", () => this.handleScroll());
      this.updateUsersList();
    },

    async updateUsersList() {
      this.users = await api.user
        .getAll(0, this.userQuery)
        .then(({ data }) => data);
    },

    openEventList() {
      this.eventsList = true;
      const eventsList = this.$refs.events;
      if (eventsList)
        eventsList.addEventListener("scroll", () => this.handleScroll());
      this.updateEventsList();
    },

    async updateEventsList() {
      this.events = await api.event
        .getByOrganizationID(0, this.organizationID)
        .then(({ data }) => data);
    },

    selectEvent(eventID) {
      this.onClickSelectEvent(eventID);
    },

    async onClickAcceptEdits() {
      await api.organization.update(
        this.token,
        { title: this.orgTitle, description: this.orgDescription },
        this.organizationID
      );
      this.initOrganization();
      this.editMode = false;
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
