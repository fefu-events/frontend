<template>
  <div class="flex flex-col h-full">
    <!-- Back -->
    <div
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>
    <div class="mt-10 mx-10 font-bold text-lg">
      <span>Мои подписки</span>
    </div>
    <div class="my-4 overflow-y-scroll">
      <div
        class="px-5 xl:px-0 hover:bg-hoverColor cursor-pointer"
        v-for="follow in following"
        :key="follow"
      >
        <MemberBlock
          v-if="follow.user"
          :user="follow.user"
          :removeMode="true"
          :subscriptionMode="true"
          :unfollowMember="unfollowMember"
        />
        <OrgBlock
          v-else
          :organization="follow.organization"
          :subscriptionMode="true"
          :unfollowOrganization="unfollowOrganization"
        />
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/service/api";
import { mapState } from "vuex";
import { ReplyIcon } from "@heroicons/vue/outline";
import { MemberBlock, OrgBlock } from "@/components/templates";

export default {
  name: "SubscriptionsList",
  components: {
    MemberBlock,
    OrgBlock,
    ReplyIcon,
  },

  inject: ["onClickRightsToggle"],

  data() {
    return {
      following: [],
    };
  },

  computed: {
    ...mapState("me/", {
      token: (state) => state.accessToken,
      userID: (state) => state.user?.id,
    }),
  },

  async mounted() {
    await this.updateFollowing();
  },

  methods: {
    backMove() {
      this.onClickRightsToggle("subscriptions");
    },

    async unfollowOrganization(organizationID) {
      await api.subscription.removeOrganization(this.token, organizationID);
      await this.updateFollowing();
    },

    async unfollowMember(userID) {
      await api.subscription.removeUser(this.token, userID);
      await this.updateFollowing();
    },

    async updateFollowing() {
      this.following = await api.subscription
        .getFollowingByUserID(this.userID)
        .then(({ data }) => data);
    },
  },
};
</script>
