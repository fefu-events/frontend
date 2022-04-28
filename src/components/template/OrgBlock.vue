<template>
  <div class="xl:w-70 mx-auto">
    <div class="flex flex-row justify-between items-center py-4">
      <div class="flex flex-row items-center">
        <div class="min-w-[40px] mr-3 rounded-full overflow-hidden">
          <img class="w-10 h-10 bg-gray-dark" />
        </div>
        <div class="text-left text-lg">
          <span> {{ organization.title }} </span>
        </div>
      </div>
      <div
        v-if="!admin"
        class="hover:text-primary"
        @click.stop="leaveOrganization(organization.id)"
      >
        <LogoutIcon class="w-6 h-6 mx-auto" />
      </div>
    </div>
    <hr class="border-black" />
  </div>
</template>

<script>
import api from "@/service/api";
import { mapState } from "vuex";
import { LogoutIcon } from "@heroicons/vue/outline";

export default {
  name: "OrganizationBlockComponent",
  components: {
    LogoutIcon,
  },

  props: {
    admin: Boolean,
    organization: Object,
  },

  inject: ["updateOrganizations"],

  computed: {
    ...mapState("me/", {
      userID: (state) => state.user?.id,
      token: (state) => state.accessToken,
    }),
  },

  methods: {
    async leaveOrganization(organizationID) {
      const response = await api.organization.removeMember(
        this.token,
        organizationID,
        this.userID
      );
      if (response.status === 200) {
        this.updateOrganizations();
      }
    },
  },
};
</script>
