<template>
  <Combobox>
    <div class="relative">
      <div
        class="relative w-full text-left rounded-lg cursor-default focus:outline-none focus-visible:ring-2 sm:text-sm overflow-hidden"
      >
        <ComboboxInput
          class="w-full border-none bg-transparent focus:outline-none focus:ring-0 py-2 -mx-3 text-sm leading-5"
          :class="{
            'placeholder-black font-bold': categoryName,
          }"
          :placeholder="categoryName"
          autocomplete="off"
          @change="query = $event.target.value"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center"
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
        :unmount="true"
        enter="transition ease-in duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="w-full py-2 overflow-auto text-sm rounded-md max-h-60 focus:outline-none sm:text-sm"
        >
          <div
            v-if="filteredData.length === 0 && query !== ''"
            class="cursor-default select-none relative py-2 text-gray-dark italic"
          >
            Ничего не найдено
          </div>
          <div class="flex flex-col">
            <label
              v-for="row in filteredData"
              :key="row"
              class="inline-flex items-center my-2 cursor-pointer"
              :for="`${row.id}_${row.label}`"
            >
              <input
                class="py-2 w-5 h-5 text-primary cursor-default select-none"
                :class="{
                  'form-checkbox rounded': dataType === 'checkbox',
                  'form-radio': dataType === 'radio',
                }"
                :type="dataType"
                :id="`${row.id}_${row.label}`"
                :value="row.id"
                v-model="checkedData"
              />
              <span class="block truncate ml-2">
                {{ row.label }}
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
    availablePlaces: Object,
    propData: [Array, Number],
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
        ? this.availablePlaces
        : this.availablePlaces.filter((row) =>
            row?.label
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(this.query.toLowerCase().replace(/\s+/g, ""))
          );
    },
  },

  watch: {
    propData() {
      this.checkedData = this.propData;
    },
    checkedData() {
      this.$emit("update", this.checkedData);
    },
  },
};
</script>
