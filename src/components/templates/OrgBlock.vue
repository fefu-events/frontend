<template>
  <div class="xl:w-70 mx-auto">
    <div class="flex flex-row justify-between items-center py-4">
      <div class="flex flex-row items-center">
        <div class="min-w-[40px] mr-3 rounded-full overflow-hidden">
          <img class="w-10 h-10 bg-gray-dark" />
        </div>
        <div
          class="text-left text-lg"
          :class="{
            'after:mx-2 after:content-[\'✓\'] after:text-primary':
              organization?.is_verified,
          }"
        >
          <span> {{ organization.title }} </span>
        </div>
      </div>
      <div
        v-if="leaveMode"
        class="mx-2 hover:text-primary"
        @click.stop="leaveOrganization_(organization.id)"
      >
        <LogoutIcon class="w-6 h-6 mx-auto" />
      </div>
      <div
        v-if="subscriptionMode"
        class="mx-2 hover:text-primary"
        @click.stop="unfollowOrganization_(organization.id)"
      >
        <TrashIcon class="w-6 h-6 mx-auto" />
      </div>
    </div>
    <hr class="border-black" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { TrashIcon } from "@heroicons/vue/solid";
import { LogoutIcon } from "@heroicons/vue/outline";

export default {
  name: "OrganizationBlockComponent",
  components: {
    TrashIcon,
    LogoutIcon,
  },

  props: {
    leaveMode: {
      type: Boolean,
      default: false,
    },
    subscriptionMode: {
      type: Boolean,
      default: false,
    },

    leaveOrganization: Function,
    unfollowOrganization: Function,
    organization: Object,
  },

  computed: {
    ...mapState("me/", {
      userID: (state) => state.user?.id,
      token: (state) => state.accessToken,
    }),
  },

  methods: {
    leaveOrganization_(organizationID) {
      this.leaveOrganization(organizationID);
    },

    unfollowOrganization_(organizationID) {
      this.unfollowOrganization(organizationID);
    },
  },
};
</script>
