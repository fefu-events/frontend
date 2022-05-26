<template>
  <div class="flex flex-col h-full overflow-y-scroll">
    <!-- Back -->
    <div
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>
    <!-- Create -->
    <div class="flex flex-col mx-5">
      <div class="mt-10 font-bold text-lg">
        <span>Мои организации</span>
      </div>
      <Button class="mx-5 my-6" @click="openCreateOrganizationPage">
        <span> Создать организацию </span>
      </Button>
    </div>
    <!-- Organization types -->
    <div class="flex flex-row justify-between mx-5 space-x-2">
      <div
        class="w-1/2 text-center group cursor-pointer"
        v-for="type in organizationTypes"
        :key="type.name"
        @click="adminType = type.isAdminType"
      >
        <span>{{ type.name }}</span>
        <hr
          class="group-hover:border-primary"
          :class="
            adminType === type.isAdminType ? 'border-primary' : 'border-black'
          "
        />
      </div>
    </div>
    <div class="overflow-y-scroll my-4">
      <div
        class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
        v-for="org in filteredOrganizations"
        :key="org.id"
        @click="onClickSelectOrganization(org.id)"
      >
        <OrgBlock :organization="org" :admin="adminType" />
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/service/api";
import { mapState } from "vuex";
import { ReplyIcon } from "@heroicons/vue/outline";
import { Button } from "@/components/interface";
import { OrgBlock } from "@/components/templates";

export default {
  name: "OrganizationsList",
  components: {
    Button,
    OrgBlock,
    ReplyIcon,
  },

  inject: ["onClickRightsToggle", "onClickSelectOrganization"],

  data() {
    return {
      organizationTypes: [
        {
          name: "Участник",
          isAdminType: false,
        },
        {
          name: "Администратор",
          isAdminType: true,
        },
      ],
      organizations: [],
      adminType: false,
      members: [],
    };
  },

  computed: {
    ...mapState("me/", {
      token: (state) => state.accessToken,
      userID: (state) => state.user?.id,
    }),

    filteredOrganizations() {
      return this.organizations.filter((org) =>
        this.adminType
          ? org.owner_id === this.userID
          : org.owner_id !== this.userID
      );
    },
  },

  async mounted() {
    this.organizations = await api.user
      .getByUserID(this.userID)
      .then(({ data }) => data.organizations);
  },

  methods: {
    backMove() {
      this.onClickRightsToggle("myOrgs");
    },

    openCreateOrganizationPage() {
      this.onClickRightsToggle("createOrg");
    },
  },
};
</script>
