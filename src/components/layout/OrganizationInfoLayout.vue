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
    <div class="flex-col h-full" :class="addUsersList ? 'flex' : 'hidden'">
      <div class="mx-5 mt-10 font-bold text-lg">
        <span>Добавить участника</span>
      </div>
      <!-- Search input -->
      <Search
        class="mx-5 mt-4"
        @update="(value) => (eventQuery = value)"
        :placeholder="'Поиск'"
      />
      <div class="mb-4 overflow-y-scroll" ref="users">
        <div
          class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
          v-for="user in filteredAddUsers"
          :key="user"
        >
          <MemberBlock :user="user" :addMode="true" :addMember="addMember" />
        </div>
      </div>
    </div>

    <!-- Members list view -->
    <div
      class="flex-col h-full"
      :class="membersList && !addUsersList ? 'flex' : 'hidden'"
    >
      <div class="mx-5 mt-10 font-bold text-lg">
        <span>Список участников</span>
      </div>
      <!-- Add members -->
      <Button v-if="isAdmin" class="mx-10 my-7" @click="openAddUserList">
        <span> Добавить участника </span>
      </Button>
      <div class="mb-2 overflow-y-scroll">
        <div
          class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
          v-for="member in organization?.members"
          @click="onClickSelectUser(member)"
          :key="member"
        >
          <MemberBlock
            :user="member"
            :removeMode="isAdmin && member.id != userID"
            :removeMember="removeMember"
            :promoteMode="isAdmin && member.id != userID"
            :promoteMember="promoteMember"
          />
        </div>
      </div>
    </div>

    <!-- Organization event list view -->
    <div class="flex-col h-full" :class="eventsList ? 'flex' : 'hidden'">
      <div class="mx-5 mt-10 font-bold text-lg">
        <span>Мероприятия</span>
      </div>
      <!-- Search input -->
      <Search
        class="mx-5 mt-4"
        @update="(value) => (eventQuery = value)"
        :placeholder="'Поиск'"
      />
      <div class="mb-4 overflow-y-scroll" ref="events">
        <div
          class="px-5 xl:px-5 hover:bg-hoverColor cursor-pointer"
          v-for="event in filteredEvents"
          :key="event"
          @click="selectEvent(event.id)"
        >
          <EventBlock
            class="px-2"
            :event="event"
            :edit="isAdmin"
            :onClickSelectEditEvent="onClickSelectEditEvent"
          />
        </div>
      </div>
    </div>

    <!-- Info view -->
    <div
      class="flex-col h-full mt-6 overflow-hidden"
      :class="allPanelClosed ? 'flex' : 'hidden'"
    >
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
      <div class="relative mt-4 xl:!mt-8 mx-5">
        <div v-if="editMode" class="relative w-11/12 group">
          <textarea
            v-model="orgDescription"
            class="w-full h-24 xl:h-32 px-6 py-2 rounded text-sm resize-none ring-offset-0 focus:ring-0 group-focus-within:border-primary"
            :maxlength="maxDescSize"
            placeholder="Описание"
          />
          <span
            class="absolute bottom-2 right-2 text-xs group-focus-within:text-primary"
            :class="{
              'text-danger': maxDescSize - orgDescription.length < 1,
            }"
            v-text="maxDescSize - orgDescription.length"
          />
        </div>
        <p v-else class="mx-5">
          {{ organization?.description }}
        </p>
        <PencilAltIcon
          v-if="isAdmin && !editMode"
          class="absolute bottom-0 -right-5 w-7 h-7 hover:text-primary cursor-pointer"
          @click="editMode = true"
        />
        <CheckIcon
          v-else-if="isAdmin && editMode"
          class="absolute bottom-0 -right-5 w-7 h-7 hover:text-primary cursor-pointer"
          @click="onClickAcceptEdits"
        />
      </div>

      <!-- Control -->
      <div class="flex flex-col my-10">
        <Button class="mx-10 mb-3" @click="openEventList">
          <span> Посмотреть мероприятия </span>
        </Button>
        <Button class="mx-10 my-0" @click="openMembersList">
          <span> Список участников </span>
        </Button>
        <Button
          v-if="isMember"
          class="mx-10 my-3"
          :disabled="isAdmin"
          @click="onClickLeave"
        >
          <span> Выйти из организации </span>
        </Button>
        <Button
          v-if="!isMember"
          class="mx-10 mt-3"
          :disabled="isAdmin"
          @click="onClickLeave"
        >
          <span> Подписаться </span>
        </Button>
        <Button
          class="mx-10 my-0 hover:border-danger hover:text-danger"
          v-if="isAdmin"
          @click="onClickDelete"
        >
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

  inject: [
    "onClickSelectOrganization",
    "onClickSelectEvent",
    "onClickSelectEditEvent",
    "onClickSelectUser",
  ],

  data() {
    return {
      addUsersList: false,
      userQuery: "",
      users: [],
      users_page: 1,

      eventsList: false,
      eventQuery: "",
      events: [],
      events_page: 1,

      membersList: false,

      toggleRequest: true,
      editMode: false,

      organization: null,
      maxTitleSize: 50,
      orgTitle: "",
      maxDescSize: 255,
      orgDescription: "",
    };
  },

  computed: {
    ...mapState("auth/", {
      token: (state) => state.accessToken,
      userID: (state) => state.user.id,
      userOrgs: (state) => state.user.organizations,
    }),

    filteredAddUsers() {
      return this.users.filter(
        (user) =>
          !this.organization.members
            .map((member) => member.id)
            .includes(user.id)
      );
    },

    filteredEvents() {
      return this.events.filter((event) =>
        event.title.toLowerCase().includes(this.eventQuery)
      );
    },

    isAdmin() {
      return this.organization?.owner_id === this.userID;
    },

    isMember() {
      return this.userOrgs.map((org) => org.id).includes(this.organization?.id);
    },

    allPanelClosed() {
      return !this.addUsersList && !this.eventsList && !this.membersList;
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
      if (!this.addUsersList && !this.eventsList && !this.membersList) {
        this.onClickSelectOrganization(null);
      }
      if (this.addUsersList) {
        this.addUsersList = false;
        return;
      }

      //init states
      this.userQuery = this.eventQuery = "";
      this.users = this.events = [];
      this.users_page = this.events_page = 1;
      this.membersList = this.eventsList = false;
    },

    removeHandleScroll(refBlock) {
      refBlock.removeEventListener("scroll", () => this.handleScroll());
    },

    async handleScroll(listType) {
      if (!this.toggleRequest) return;

      const refList = this.$refs[listType];
      const scrolling = refList.scrollTop + refList.clientHeight;
      const limitData = this[listType].length >= this[`${listType}_page`] * 10;

      if (scrolling >= refList.scrollHeight && limitData) {
        let data = [];
        this.toggleRequest = false;
        if (listType === "users") {
          data = await this.loadEventsList(this.users_page * 10);
        } else {
          data = await this.loadEventsList(this.events_page * 10);
        }
        this[listType] = this[listType].concat(data);
        this[`${listType}_page`]++;
      }
    },

    // Members List
    openMembersList() {
      this.membersList = true;
    },

    // Add Users List
    async openAddUserList() {
      this.addUsersList = true;
      const refUsersList = this.$refs.users;
      if (refUsersList)
        refUsersList.addEventListener(
          "scroll",
          _.debounce(() => this.handleScroll("users"), 100)
        );
      this.users = await this.loadUsersList(0);
    },

    // Events List
    async openEventList() {
      this.eventsList = true;
      const refEventsList = this.$refs.events;
      if (refEventsList)
        refEventsList.addEventListener(
          "scroll",
          _.debounce(() => this.handleScroll("events"), 100)
        );
      this.events = await this.loadEventsList(0);
    },

    async loadUsersList(skip) {
      return await api.user.getAll(skip, this.userQuery).then(({ data }) => {
        this.toggleRequest = true;
        return data;
      });
    },

    async loadEventsList(skip) {
      return await api.event
        .getByOrganizationID(skip, this.organizationID, this.eventQuery)
        .then(({ data }) => {
          this.toggleRequest = true;
          return data;
        });
    },

    selectEvent(eventID) {
      this.onClickSelectEvent(eventID);
    },

    // Members Action
    async promoteMember(memberID) {
      await api.organization
        .promoteMember(this.token, memberID, this.organizationID)
        .then(() => {
          this.initOrganization();
        });
    },

    async addMember(memberID) {
      await api.organization
        .addMember(this.token, this.organizationID, memberID)
        .then(() => {
          this.initOrganization();
        });
    },

    async removeMember(memberID) {
      await api.organization
        .removeMember(this.token, this.organizationID, memberID)
        .then(() => {
          this.initOrganization();
        });
    },

    // Control
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

  beforeUnmount() {
    if (this.addUsersList) {
      this.removeHandleScroll(this.$refs.users);
    } else if (this.eventsList) {
      this.removeHandleScroll(this.$refs.events);
    }
  },

  watch: {
    organizationID() {
      this.initOrganization();
      for (const list of ["members", "events", "addUser"])
        this[`${list}List`] = false;
    },

    userQuery: _.debounce(function () {
      this.users_page = 1;
      this.loadUsersList(0);
    }, 500),

    eventQuery: _.debounce(function () {
      this.events_page = 1;
      this.loadEventsList(0);
    }, 500),
  },
};
</script>
