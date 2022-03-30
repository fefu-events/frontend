<template>
  <Combobox>
    <div class="relative">
      <div
        class="relative w-full text-left rounded-lg cursor-default focus:outline-none focus-visible:ring-2 sm:text-sm overflow-hidden"
      >
        <span
          class="absolute inset-y-0 left-0 flex items-center font-bold leading-5 pl-4"
        >
          {{ categoryName }}
        </span>
        <ComboboxInput
          class="w-full border-none bg-transparent focus:outline-none focus:ring-0 py-2 pl-16 pr-10 md:mx-2 text-sm leading-5 text-gray-900"
          autocomplete="off"
          @change="query = $event.target.value"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center pr-4"
          v-slot="{ open }"
        >
          <ChevronDownIcon
            class="w-5 h-5"
            aria-hidden="true"
            :class="open ? 'transform rotate-180' : ''"
          />
        </ComboboxButton>
      </div>
      <TransitionRoot
        enter="transition ease-in duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="w-full px-4 py-2 overflow-auto text-sm rounded-md max-h-60 focus:outline-none sm:text-sm"
        >
          <div
            v-if="filteredData.length === 0 && query !== ''"
            class="cursor-default select-none relative py-2 px-4 text-gray-dark italic"
          >
            Ничего не найдено
          </div>
          <div class="flex flex-col">
            <label
              v-for="unit in filteredData"
              :key="unit"
              class="inline-flex items-center my-2 cursor-pointer"
              :for="unit.value"
            >
              <input
                class="py-2 w-5 h-5 text-primary cursor-default select-none"
                :class="{
                  'form-checkbox rounded': dataType === 'checkbox',
                  'form-radio': dataType === 'radio',
                }"
                :type="dataType"
                :id="unit.value"
                :value="unit.value"
                v-model="checkedData"
              />
              <span class="block truncate ml-2">
                {{ unit.name }}
              </span>
            </label>
            <slot />
          </div>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script>
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  TransitionRoot,
} from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";

export default {
  name: "AutolistComponent",
  components: {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    TransitionRoot,
    ChevronDownIcon,
  },
  props: {
    data: Object,
    dataType: String,
    categoryName: String,
  },
  data() {
    return {
      query: "",
      checkedData: [],
    };
  },

  computed: {
    filteredData() {
      return this.query === ""
        ? this.data
        : this.data.filter((unit) =>
            unit?.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(this.query.toLowerCase().replace(/\s+/g, ""))
          );
    },
  },

  watch: {
    checkedData() {
      this.$emit("update", this.checkedData);
    },
  },
};
</script>
