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
      <div
        v-if="addMode"
        class="mx-4 hover:text-primary"
        @click.stop="addMember()"
      >
        <PlusIcon class="w-6 h-6 mx-auto" />
      </div>
      <div
        v-else-if="removeMode"
        class="mx-4 hover:text-primary"
        @click.stop="removeMember()"
      >
        <TrashIcon class="w-6 h-6 mx-auto" />
      </div>
      <div class="flex flex-row mx-4" v-else-if="admin">
        <div
          class="hover:text-primary"
          @click.stop="leaveOrganization(organization.id)"
        >
          <TrashIcon class="w-6 h-6 mx-auto" />
        </div>
        <div
          class="hover:text-primary"
          @click.stop="leaveOrganization(organization.id)"
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
    removeMode: {
      type: Boolean,
      default: false,
    },
    createMode: {
      type: Boolean,
      default: false,
    },
    addMode: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    user: Object,
  },

  inject: ["addMemberToArray", "removeMemberFromArray"],

  computed: {},

  methods: {
    async addMember() {
      if (this.createMode) {
        this.addMemberToArray(this.user);
        return;
      }
    },
    async removeMember() {
      if (this.createMode) {
        this.removeMemberFromArray(this.user);
        return;
      }
    },
    // async promoteMember(userID) {},
    // async demoteMember(userID) {},
  },
};
</script>
