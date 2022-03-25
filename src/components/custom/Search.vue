<template>
  <div class="relative my-3">
    <div
      class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
    >
      <SearchIcon class="w-5 h-5" />
    </div>
    <input
      v-model="query"
      type="text"
      id="email-adress-icon"
      class="block w-full pl-10 p-2.5 bg-gray-light border-0 text-sm rounded-lg focus:ring-0"
      placeholder="Поиск"
    />
  </div>
</template>

<script>
import { SearchIcon } from "@heroicons/vue/outline";

export default {
  name: "SearchComponent",
  components: {
    SearchIcon,
  },
  data() {
    return {
      query: "",
    };
  },

  watch: {
    query() {
      this.$emit("update", this.query);
    },
  },
};
</script>
