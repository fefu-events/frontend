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
          class="w-full border-none bg-transparent focus:outline-none focus:ring-0 py-2 pl-16 pr-10 mx-2 text-sm leading-5 text-gray-900"
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
          class="w-full px-4 mt-1 overflow-auto text-sm rounded-md max-h-60 focus:outline-none sm:text-sm"
        >
          <div
            v-if="filteredPlaces.length === 0 && query !== ''"
            class="cursor-default select-none relative py-2 px-4 text-gray-700"
          >
            Nothing found.
          </div>
          <div class="flex flex-col">
            <label
              v-for="place in filteredPlaces"
              :key="place"
              class="inline-flex items-center my-2 cursor-pointer"
              :for="place.value"
            >
              <input
                class="cursor-default select-none relative py-2 form-checkbox text-primary w-5 h-5 rounded"
                type="checkbox"
                :id="place.value"
                :value="place.value"
                v-model="checkedPlaces"
              />
              <span class="block truncate ml-2">
                {{ place.name }}
              </span>
            </label>
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
    places: Object,
    categoryName: String,
  },
  data() {
    return {
      query: "",
      checkedPlaces: [],
    };
  },

  computed: {
    filteredPlaces() {
      return this.query === ""
        ? this.places
        : this.places.filter((place) =>
            place?.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(this.query.toLowerCase().replace(/\s+/g, ""))
          );
    },
  },

  watch: {
    checkedPlaces() {
      this.$emit("checkedUpdate", this.checkedPlaces);
    },
  },
};
</script>
