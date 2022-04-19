<template>
  <div
    class="flex flex-col justify-between h-full w-[89%] xl:w-80 mx-auto overflow-y-scroll"
  >
    <!-- Back -->
    <div
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>

    <!-- Add user list -->
    <div v-if="addUserList" class="flex flex-col mx-5">
      <div class="mt-10 font-bold cursor-pointer">
        <span>Мои организации</span>
      </div>

      <!-- Search input -->
      <Search
        class="mt-4"
        @update="(value) => (query = value)"
        :placeholder="'Поиск'"
      />
    </div>

    <div v-else class="flex flex-col my-6">
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
          class="w-full h-24 xl:h-36 px-6 py-2 rounded text-sm resize-none ring-offset-0 focus:ring-0 focus:border-primary"
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
      <!-- Members -->
      <div class="mt-7 mx-5 xl:mx-0">
        <div class="flex flex-row items-center justify-between xl:mx-5">
          <span> Участники </span>
          <Button class="w-28 h-9 my-0 leading-none" @click="openAddUserList">
            <span class="text-sm"> Добавить </span>
          </Button>
        </div>
      </div>
    </div>

    <Button v-if="!addUserList" class="mx-10 mb-10" @click="onClickSubmit">
      <span> Создать организацию </span>
    </Button>
  </div>
</template>

<script>
// import api from "@/service/api";
import { mapState } from "vuex";
import { ReplyIcon } from "@heroicons/vue/outline";
import * as InterfaceComponents from "@/components/interface";
import api from "@/service/api";

export default {
  name: "CreateOrganizationLayout",
  components: {
    Button: InterfaceComponents.Button,
    Search: InterfaceComponents.Search,
    ReplyIcon,
  },

  inject: ["onClickRightsToggle"],

  data() {
    return {
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
  },

  async mounted() {},

  methods: {
    backMove() {
      if (this.addUserList) {
        this.addUserList = false;
        return;
      }
      this.title = "";
      this.description = "";
      this.members = [];
      this.onClickRightsToggle("createOrg");
    },

    openAddUserList() {
      this.addUserList = true;
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
      }
    },
  },

  watch: {},
};
</script>
