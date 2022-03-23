<template>
  <div class="w-full px-4 pt-4">
    <div class="w-full max-w-md p-2 mx-auto bg-white rounded-2xl">
      <Disclosure v-slot="{ open }">
        <DisclosureButton
          class="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-secondar rounded-l"
        >
          <h2>Категория</h2>
          <ChevronUpIcon
            :class="open ? 'transform rotate-180' : ''"
            class="w-5 h-5 text-secondary"
          />
        </DisclosureButton>
        <DisclosurePanel class="px-4 pt-2 pb-2 text-sm text-left">
          <slot> </slot>
        </DisclosurePanel>
        <hr />
      </Disclosure>
    </div>
  </div>
</template>

<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/solid";
export default {
  name: "DisclosureComponent",
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronUpIcon,
  },
};
</script>
