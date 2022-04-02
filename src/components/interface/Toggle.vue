<template>
  <div class="flex items-center rounded-lg px-4 py-2 cursor-pointer">
    <Switch
      v-model="enabled"
      :class="enabled ? 'bg-primary' : 'bg-gray-dark '"
      class="relative inline-flex flex-shrink-0 h-6 w-12 mr-4 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      <span
        aria-hidden="true"
        :class="enabled ? 'translate-x-6' : 'translate-x-0'"
        class="pointer-events-none inline-block w-5 h-5 rounded-full bg-white transform ring-0 transition ease-in-out duration-200"
      />
    </Switch>
    <slot />
  </div>
</template>

<script>
import { Switch } from "@headlessui/vue";
export default {
  name: "ToggleComponent",
  components: {
    Switch,
  },
  data() {
    return {
      enabled: false,
    };
  },

  watch: {
    enabled() {
      this.$emit("update", this.enabled);
    },
  },
};
</script>
