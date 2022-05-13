<template>
  <div class="flex flex-col h-full w-[89%] xl:w-80 mx-auto overflow-y-scroll">
    <!-- Back -->
    <div
      class="absolute top-5 right-5 -scale-x-100 hover:text-primary cursor-pointer"
      @click="backMove"
    >
      <ReplyIcon class="w-10 h-10 stroke-1" />
    </div>
    <div class="mt-10 mb-5 mx-5 font-bold text-lg">
      <span>Мои подписки</span>
    </div>
    <div class="overflow-y-scroll mb-4">
      <div
        class="hover:bg-hoverColor px-5 cursor-pointer"
        v-for="user in following"
        :key="user.id"
      >
        <MemberBlock
          :user="user"
          :removeMode="true"
          :subscriptionMode="true"
          :unfollowMember="unfollowMember"
        />
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/service/api";
import { mapState } from "vuex";
import { ReplyIcon } from "@heroicons/vue/outline";
import { MemberBlock } from "@/components/templates";

export default {
  name: "SubscriptionsList",
  components: {
    MemberBlock,
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
