<template>
  <div class="xl:w-70 mx-auto">
    <div class="flex flex-row justify-between items-center py-4">
      <div class="flex flex-row items-center">
        <AvatarIcon class="max-w-[40px] h-10 mr-3" />
        <div class="text-left text-lg">
          <span> {{ user?.name }} </span>
        </div>
      </div>
      <div class="flex flex-row">
        <div
          v-if="addMode"
          class="mx-2 hover:text-primary"
          @click.stop="addMember_()"
        >
          <PlusIcon class="w-6 h-6 mx-auto" />
        </div>
        <div
          v-if="removeMode"
          class="mx-2 hover:text-primary"
          @click.stop="removeMember_()"
        >
          <TrashIcon class="w-6 h-6 mx-auto" />
        </div>
        <div
          v-if="promoteMode"
          class="hover:text-primary"
          @click.stop="promoteMember_()"
        >
          <StarIcon class="w-6 h-6 mx-auto" />
        </div>
      </div>
    </div>
    <hr class="border-black" />
  </div>
</template>

<script>
import { AvatarIcon } from "@/components/icons";
import { StarIcon, PlusIcon } from "@heroicons/vue/outline";
import { TrashIcon } from "@heroicons/vue/solid";

export default {
  name: "OrganizationBlockComponent",
  components: {
    AvatarIcon,
    StarIcon,
    PlusIcon,
    TrashIcon,
  },

  props: {
    addMode: {
      type: Boolean,
      default: false,
    },

    createMode: {
      type: Boolean,
      default: false,
    },

    moderMode: {
      type: Boolean,
      default: false,
    },

    promoteMode: {
      type: Boolean,
      default: false,
    },

    removeMode: {
      type: Boolean,
      default: false,
    },

    subscriptionMode: {
      type: Boolean,
      default: false,
    },

    addMember: Function,
    addMemberToArray: Function,
    addModerator: Function,
    promoteMember: Function,
    removeMember: Function,
    removeMemberFromArray: Function,
    removeModerator: Function,
    unfollowMember: Function,
    user: Object,
  },

  computed: {},

  methods: {
    async addMember_() {
      if (this.moderMode) {
        this.addModerator(this.user.id);
        return;
      }
      if (this.createMode) {
        this.addMemberToArray(this.user);
      } else {
        this.addMember(this.user.id);
      }
    },
    async removeMember_() {
      if (this.moderMode) {
        this.removeModerator(this.user.id);
        return;
      }
      if (this.subscriptionMode) {
        this.unfollowMember(this.user.id);
        return;
      }
      if (this.createMode) {
        this.removeMemberFromArray(this.user);
      } else {
        this.removeMember(this.user.id);
      }
    },

    async promoteMember_() {
      this.promoteMember(this.user.id);
    },
  },
};
</script>
