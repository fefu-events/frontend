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
      <span>Мои теги</span>
    </div>
    <div class="my-4 mx-5 space-y-4 overflow-y-scroll">
      <div v-for="tag in tags" :key="tag">
        <div class="flex flex-row items-center my-2 space-x-2">
          <TrashIcon
            class="w-5 h-5 cursor-pointer hover:text-danger"
            @click="removeTag(tag)"
          />
          <div class="px-2 border border-black rounded">
            <span>#{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/service/api";
import { mapState } from "vuex";
import { ReplyIcon } from "@heroicons/vue/outline";
import { TrashIcon } from "@heroicons/vue/solid";

export default {
  name: "TagsList",
  components: {
    ReplyIcon,
    TrashIcon,
  },

  inject: ["onClickRightsToggle"],

  computed: {
    ...mapState("me/", {
      token: (state) => state.accessToken,
      tags: (state) => state.user?.tags,
    }),
  },

  methods: {
    backMove() {
      this.onClickRightsToggle("tags");
    },

    async removeTag(tag) {
      const tags = this.tags.filter((tag_) => tag_ !== tag);
      await api.me.update(this.token, tags);
      this.$store.dispatch("me/SET_NEW_TAGS", tags);
    },
  },
};
</script>
