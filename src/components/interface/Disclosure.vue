<template>
  <div class="rounded-lg">
    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="flex justify-between w-full py-2 text-sm font-medium text-left text-black rounded-l cursor-pointer select-none"
      >
        <span class="font-bold">{{ categoryName }}</span>
        <ChevronDownIcon
          :class="open ? 'transform rotate-180' : ''"
          class="w-5 h-5 text-black"
        />
      </DisclosureButton>
      <TransitionRoot
        :show="open"
        :unmount="unmount"
        enter="transition ease-in duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <DisclosurePanel class="pt-2 pb-2 text-sm text-left">
          <slot />
        </DisclosurePanel>
      </TransitionRoot>
    </Disclosure>
  </div>
</template>

<script>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionRoot,
} from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";
export default {
  name: "DisclosureComponent",
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    TransitionRoot,
    ChevronDownIcon,
  },
  props: {
    unmount: {
      type: Boolean,
      default: true,
    },
    categoryName: String,
  },

  data() {
    return {
      open: false,
    };
  },
};
</script>
