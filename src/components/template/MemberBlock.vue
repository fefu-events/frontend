<template>
  <div class="xl:w-70 mx-auto">
    <div class="flex flex-row justify-between items-center py-4">
      <div class="flex flex-row items-center">
        <div class="min-w-[40px] mr-3 rounded-full overflow-hidden">
          <img class="w-10 h-10 bg-gray-dark" />
        </div>
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
import { StarIcon, PlusIcon } from "@heroicons/vue/outline";
import { TrashIcon } from "@heroicons/vue/solid";

export default {
  name: "OrganizationBlockComponent",
  components: {
    StarIcon,
    PlusIcon,
    TrashIcon,
  },

  props: {
    addMode: {
      type: Boolean,
      default: false,
    },
    removeMode: {
      type: Boolean,
      default: false,
    },
    createMode: {
      type: Boolean,
      default: false,
    },
    promoteMode: {
      type: Boolean,
      default: false,
    },
    addMemberToArray: Function,
    removeMemberFromArray: Function,
    promoteMember: Function,
    addMember: Function,
    removeMember: Function,
    user: Object,
  },

  computed: {},

  methods: {
    async addMember_() {
      if (this.createMode) {
        this.addMemberToArray(this.user);
      } else {
        this.addMember(this.user.id);
      }
    },
    async removeMember_() {
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
