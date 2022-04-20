<template>
  <div class="flex flex-col h-full w-[89%] xl:w-80 mx-auto overflow-y-scroll">
    <!-- Back -->
    <div
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>
    <!-- Create -->
    <div class="flex flex-col mx-5">
      <div class="mt-10 font-bold text-lg cursor-pointer">
        <span>Мои организации</span>
      </div>
      <Button class="mx-5 my-6" @click="openCreateOrganizationPage">
        <span> Создать организацию </span>
      </Button>
    </div>
    <!-- Organization types -->
    <div class="flex flex-row justify-between mb-4">
      <div
        class="w-[140px] text-center group cursor-pointer"
        @click="adminType = false"
      >
        <span>Участник</span>
        <hr
          class="group-hover:border-primary"
          :class="adminType ? 'border-black' : 'border-primary'"
        />
      </div>
      <div
        class="w-[140px] text-center group cursor-pointer"
        @click="adminType = true"
      >
        <span>Администратор</span>
        <hr
          class="group-hover:border-primary"
          :class="adminType ? 'border-primary' : 'border-black'"
        />
      </div>
    </div>
    <div class="overflow-y-scroll mb-4">
      <div
        class="hover:bg-hoverColor px-5 cursor-pointer"
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
import { OrgBlock } from "@/components/template";

export default {
  name: "OrganizationsListLayout",
  components: {
    Button,
    OrgBlock,
    ReplyIcon,
  },

  inject: ["onClickRightsToggle", "onClickSelectOrganization"],

  provide() {
    return {
      updateOrganizations: this.updateOrganizations,
    };
  },

  data() {
    return {
      organizations: [],
      adminType: false,
      members: [],
    };
  },

  computed: {
    ...mapState("auth/", {
      token: (state) => state.accessToken,
      userID: (state) => state.user.id,
    }),

    ...mapState("client/", {
      forceUpdateOrganizationList: "forceUpdateOrganizationList",
    }),

    filteredOrganizations() {
      let organizations = [];
      if (this.adminType) {
        organizations = this.organizations.filter(
          (org) => org.owner_id === this.userID
        );
      } else {
        organizations = this.organizations.filter(
          (org) => org.owner_id !== this.userID
        );
      }
      return organizations;
    },
  },

  async mounted() {
    await this.updateOrganizations();
  },

  methods: {
    backMove() {
      this.onClickRightsToggle("myOrgs");
    },

    async updateOrganizations() {
      this.organizations = await api.user
        .getByUserID(this.userID)
        .then(({ data }) => {
          return data.organizations;
        });
    },

    openCreateOrganizationPage() {
      this.onClickRightsToggle("createOrg");
    },
  },

  watch: {
    forceUpdateOrganizationList(newValue) {
      if (newValue === true) {
        this.updateOrganizations();
      }
      this.$store.dispatch("client/SET_FORCE_UPDATE_ORG_LIST", false);
    },
  },
};
</script>
