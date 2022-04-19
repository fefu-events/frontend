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
      <div class="mt-10 font-bold cursor-pointer">
        <span>Мои организации</span>
      </div>
      <Button class="mx-5 my-6" @click="createOrganization">
        <span> Создать организацию </span>
      </Button>
    </div>
    <!-- Organization types -->
    <div class="flex flex-row justify-between">
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
  </div>
</template>

<script>
// import api from "@/service/api";
import { mapState } from "vuex";
import { ReplyIcon } from "@heroicons/vue/outline";
import { Button } from "@/components/interface";

export default {
  name: "OrganizationsListLayout",
  components: {
    Button,
    ReplyIcon,
  },

  inject: ["onClickRightsToggle"],

  data() {
    return {
      adminType: true,
      members: [],
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
      this.onClickRightsToggle("org");
    },

    createOrganization() {
      this.onClickRightsToggle("createOrg");
    },
  },

  watch: {},
};
</script>
