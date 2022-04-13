<template>
  <div class="rounded-lg">
    <div
      class="flex justify-between w-full py-2 text-sm font-medium text-left text-black rounded-l cursor-pointer select-none"
      @click="open = !open"
    >
      <span class="font-bold">{{ categoryName }}</span>
      <ChevronDownIcon
        :class="open ? 'transform rotate-180' : ''"
        class="w-5 h-5 text-black"
      />
    </div>
    <TransitionRoot
      :show="open"
      enter="transition ease-in duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      @after-leave="query = ''"
    >
      <div class="pt-2 pb-2 text-sm text-left">
        <slot />
      </div>
    </TransitionRoot>
  </div>
</template>

<script>
import { TransitionRoot } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";
export default {
  name: "DisclosureComponent",
  components: {
    TransitionRoot,
    ChevronDownIcon,
  },
  props: {
    categoryName: String,
  },

  data() {
    return {
      open: false,
    };
  },
};
</script>
