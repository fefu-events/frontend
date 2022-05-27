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
      <div class="mx-10 mt-10 font-bold text-lg">
        <span>Добавить участника</span>
      </div>
      <!-- Search input -->
      <Search
        class="mx-5 mt-4"
        :placeholder="'Поиск'"
        @update="(value) => (searchQuery = value)"
      />
      <div class="mb-4 overflow-y-scroll" ref="users">
        <div
          class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
          v-for="user in dataQuery"
          :key="user"
        >
          <MemberBlock
            :user="user"
            :addMode="!userIsAdded(user) && user.id != meID"
            :removeMode="userIsAdded(user) && user.id != meID"
            :addMember="addMember"
            :removeMember="removeMember"
          />
        </div>
      </div>
    </div>

    <!-- Members list view -->
    <div
      class="flex-col h-full"
      :class="membersList && !addUsersList ? 'flex' : 'hidden'"
    >
      <div class="mt-10 mb-5 mx-10 font-bold text-lg">
        <span>Список участников</span>
      </div>
      <!-- Add members -->
      <Button
        v-if="isOwner || isAdmin"
        class="mx-10"
        @click="openQueryList('users')"
      >
        <span> Добавить участника </span>
      </Button>
      <div class="my-4 overflow-y-scroll">
        <div
          class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
          v-for="member in organization.members"
          @click="onClickSelectUser(member.id)"
          :key="member"
        >
          <MemberBlock
            :user="member"
            :removeMode="(isOwner || isAdmin) && member.id != meID"
            :removeMember="removeMember"
            :promoteMode="(isOwner || isAdmin) && member.id != meID"
            :promoteMember="promoteMember"
          />
        </div>
      </div>
    </div>

    <!-- Organization event list view -->
    <div v-if="eventsList" class="flex flex-col h-full">
      <div class="mx-10 mt-10 font-bold text-lg">
        <span>Мероприятия</span>
      </div>
      <!-- Search input -->
      <Search
        class="mx-5 mt-4"
        @update="(value) => (searchQuery = value)"
        :placeholder="'Поиск'"
      />
      <div class="mb-4 overflow-y-scroll" ref="events">
        <div
          class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
          v-for="event in dataQuery"
          :key="event"
          @click="selectEvent(event.id)"
        >
          <EventBlock
            class="px-2"
            :event="event"
            :edit="isOwner || statusPerms"
            :onClickSelectEditEvent="onClickSelectEditEvent"
          />
        </div>
      </div>
    </div>

    <!-- Info view -->
    <div
      class="flex-col h-full mt-6 space-y-6 overflow-hidden"
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
                :maxlength="maxTitleSize"
              />
              <span
                class="py-2 pr-2 text-sm"
                v-text="maxTitleSize - orgTitle.length"
                :class="{
                  'text-danger': maxTitleSize - orgTitle.length < 1,
                }"
              />
            </div>
            <hr
              :class="v$.orgTitle.$error ? 'border-danger' : 'border-black'"
            />
          </div>
          <span
            v-else
            class="self-center text-2xl break-words after:content-['✓']"
            :class="
              organization.is_verified
                ? 'after:mx-2 after:text-primary'
                : 'after:text-transparent'
            "
          >
            {{ organization.title }}
          </span>
        </div>
      </div>
      <!-- Description -->
      <div class="relative mx-5">
        <div v-if="editMode" class="relative w-11/12">
          <textarea
            v-model="orgDescription"
            class="w-full h-24 xl:h-32 px-6 py-2 rounded text-sm resize-none ring-offset-0 focus:ring-0 focus:border-primary"
            placeholder="Описание"
            :maxlength="maxDescSize"
          />
          <span
            class="absolute bottom-2 right-2 text-xs"
            :class="{
              '!text-danger': maxDescSize - orgDescription.length < 1,
            }"
            v-text="maxDescSize - orgDescription.length"
          />
        </div>
        <p v-else class="mx-5">
          {{ organization.description }}
        </p>
        <PencilAltIcon
          v-if="(isOwner || isAdmin) && !editMode"
          class="absolute bottom-0 right-0 w-6 h-6 hover:text-primary cursor-pointer"
          @click="editMode = true"
        />
        <CheckIcon
          v-else-if="(isOwner || isAdmin) && editMode"
          class="absolute bottom-0 right-0 w-6 h-6 hover:text-success cursor-pointer"
          @click="onClickAcceptEdits"
        />
      </div>

      <!-- Control -->
      <div class="flex flex-col mx-10 space-y-4">
        <Button @click="openQueryList('events')">
          <span> Посмотреть мероприятия </span>
        </Button>
        <Button @click="openQueryList('members')">
          <span> Список участников </span>
        </Button>
        <Button v-if="isAdmin" @click="onClickVerify">
          <span>
            {{ organization.is_verified ? "Аннулировать" : "Верифицировать" }}
          </span>
        </Button>
        <Button v-if="isMember" :disabled="isOwner" @click="onClickLeave">
          <span> Выйти из организации </span>
        </Button>
        <Button
          v-if="!isMember && meID"
          :class="{
            'hover:border-danger hover:text-danger':
              organization.am_i_following,
          }"
          :disabled="isOwner"
          @click="onClickSubscribe"
        >
          <span>
            {{ organization.am_i_following ? "Отписаться" : "Подписаться" }}
          </span>
        </Button>
        <Button
          class="hover:border-danger hover:text-danger"
          v-if="isOwner || isAdmin"
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
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import api from "@/service/api";
import { mapState } from "vuex";

import { ReplyIcon, PencilAltIcon, CheckIcon } from "@heroicons/vue/outline";
import * as InterfaceComponents from "@/components/interface";
import { MemberBlock, EventBlock } from "@/components/templates";

export default {
  setup: () => ({ v$: useVuelidate() }),

  name: "OrganizationInfo",
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
      // оставить тогглы переключения, остальные параметры слить
      addUsersList: false,
      eventsList: false,
      membersList: false,

      searchQuery: "",
      pageQuery: 1,
      dataQuery: [],

      debounceRequestFlag: true,
      editMode: false,

      organization: {},
      maxTitleSize: 50,
      orgTitle: "",
      maxDescSize: 255,
      orgDescription: "",
    };
  },

  validations() {
    return {
      orgTitle: {
        required,
      },
    };
  },

  computed: {
    ...mapState("me/", {
      token: (state) => state.accessToken,
      meID: (state) => state.user?.id,
      statusPerms: (state) => state.user?.is_admin || state.user?.is_moderator,
      isAdmin: (state) => state.user?.is_admin,
      userOrgs: (state) => state.user?.organizations,
    }),

    isOwner() {
      return this.organization.owner_id === this.meID;
    },

    isMember() {
      return this.userOrgs?.map((org) => org.id).includes(this.organization.id);
    },

    userIsAdded() {
      return (user) =>
        this.organization.members?.some((member) => member.id == user.id);
    },

    allPanelClosed() {
      return !this.addUsersList && !this.eventsList && !this.membersList;
    },
  },

  async mounted() {
    this.organization = await api.organization
      .getByOrganizationID(this.organizationID, this.token)
      .then(({ data }) => {
        this.orgTitle = data.title;
        this.orgDescription = data.description;
        return data;
      });
  },

  methods: {
    backMove() {
      //init states
      this.searchQuery = "";
      this.dataQuery = [];
      this.pageQuery = 1;

      if (!this.addUsersList && !this.eventsList && !this.membersList) {
        this.onClickSelectOrganization(null);
      }
      if (this.addUsersList) {
        this.addUsersList = false;
        return;
      }

      this.membersList = this.eventsList = false;
    },

    removeHandleScroll(refBlock) {
      refBlock.removeEventListener("scroll", () => this.handleScroll());
    },

    async handleScroll(refList, listType) {
      if (!this.debounceRequestFlag) return;

      const scrolling = refList.scrollTop + refList.clientHeight;
      const limitData = this.dataQuery.length >= this.pageQuery * 10;
      if (scrolling >= refList.scrollHeight && limitData) {
        let data = [];
        this.debounceRequestFlag = false;
        if (listType === "users") {
          data = await this.loadUsersList(this.pageQuery * 10);
        } else if (listType === "events") {
          data = await this.loadEventsList(this.pageQuery * 10);
        }
        this.dataQuery = this.dataQuery.concat(data);
        this.pageQuery++;
      }
    },

    async openQueryList(listType) {
      if (listType === "events") {
        this.eventsList = true;
        this.dataQuery = await this.loadEventsList(0);
      } else if (listType === "users") {
        this.addUsersList = true;
        this.dataQuery = await this.loadUsersList(0);
      } else if (listType === "members") {
        this.membersList = true;
        return;
      }

      const refList = this.$refs[listType];
      if (refList)
        refList.addEventListener(
          "scroll",
          _.debounce(() => this.handleScroll(refList, listType), 100)
        );
    },

    async loadUsersList(skip) {
      return api.user.getAll(skip, this.searchQuery).then(({ data }) => {
        this.debounceRequestFlag = true;
        return data;
      });
    },

    async loadEventsList(skip) {
      return api.event
        .getByOrganizationID(skip, this.organizationID, this.searchQuery)
        .then(({ data }) => {
          this.debounceRequestFlag = true;
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
          this.$emit("rerender");
        });
    },

    async addMember(memberID) {
      await api.organization
        .addMember(this.token, this.organizationID, memberID)
        .then(() => {
          this.$emit("rerender");
        });
    },

    async removeMember(memberID) {
      await api.organization
        .removeMember(this.token, this.organizationID, memberID)
        .then(() => {
          this.$emit("rerender");
        });
    },

    // Control
    async onClickSubscribe() {
      if (!this.organization.am_i_following) {
        await api.subscription.addOrganization(this.token, this.organizationID);
      } else {
        await api.subscription.removeOrganization(
          this.token,
          this.organizationID
        );
      }
      this.organization.am_i_following = !this.organization.am_i_following;
    },

    async onClickVerify() {
      if (this.organization.is_verified) {
        await api.verification.organizationUnverify(
          this.token,
          this.organizationID
        );
      } else {
        await api.verification.organizationVerify(
          this.token,
          this.organizationID
        );
      }
      this.$emit("rerender");
    },

    async onClickAcceptEdits() {
      const result = await this.v$.$validate();
      if (!result) return;

      await api.organization.update(
        this.token,
        { title: this.orgTitle, description: this.orgDescription },
        this.organizationID
      );
      this.$emit("rerender");
      this.editMode = false;
    },

    async onClickLeave() {
      await api.organization
        .removeMember(this.token, this.organizationID, this.meID)
        .then(() => {
          this.onClickSelectOrganization(null);
          this.$emit("rerender");
        });
    },

    async onClickDelete() {
      if (window.confirm("Ты действительно хочешь удалить организацию?"))
        await api.organization
          .delete(this.token, this.organizationID)
          .then(() => {
            this.onClickSelectOrganization(null);
            this.$emit("rerender");
          });
    },
  },

  beforeUnmount() {
    this.$refs.users && this.removeHandleScroll(this.$refs.users);
    this.$refs.events && this.removeHandleScroll(this.$refs.events);
  },

  watch: {
    organizationID() {
      this.$emit("rerender");
    },

    searchQuery: _.debounce(async function () {
      this.pageQuery = 1;
      this.dataQuery = this.eventsList
        ? await this.loadEventsList(0)
        : this.addUsersList
        ? await this.loadEventsList(0)
        : [];
    }, 500),
  },
};
</script>
