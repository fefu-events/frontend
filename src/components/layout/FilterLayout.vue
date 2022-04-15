<template>
  <div class="flex flex-col justify-between h-full w-4/5 xl:w-60">
    <div class="flex flex-col h-[85%] xl:h-full">
      <!-- Search input -->
      <Search
        class="mt-10"
        @update="(value) => (query = value)"
        :placeholder="'Посиделки #пати #уют'"
      />
      <!-- Show list button -->
      <Button class="hidden xl:block w-full" @click="toggleEventsList">
        <span>{{ eventsListState ? "Скрыть список" : "Показать список" }}</span>
      </Button>
      <!-- Filters list -->
      <div class="flex items-center max-w-[240px] px-4 py-2">
        <FilterIcon class="w-5 h-5" />
        <span class="ml-1 text-lg">Фильтры:</span>
      </div>
      <div class="xl:mb-6 overflow-y-scroll overflow-x-hidden">
        <!-- Follow toggle -->
        <Toggle class="px-4" @update="(value) => (followToggle = value)">
          <span class="text-sm font-medium"> Только подписки </span>
        </Toggle>
        <!-- Recommend toggle -->
        <Toggle class="px-4" @update="(value) => (recommendToggle = value)">
          <span class="text-sm font-medium"> Рекомендации </span>
        </Toggle>
        <!-- Category list -->
        <Disclosure categoryName="Категория" class="px-4">
          <div class="flex flex-col">
            <label
              v-for="category in availableCategories"
              :key="category"
              class="inline-flex items-center my-2 cursor-pointer"
              :for="`${category.id}`"
            >
              <input
                class="form-checkbox text-primary w-5 h-5 rounded"
                type="checkbox"
                :id="`${category.id}`"
                :value="category.id"
                v-model="categories"
              />
              <span class="ml-2">{{ category.label }}</span>
            </label>
          </div>
        </Disclosure>
        <hr class="border-black" />
        <!-- Calendar -->
        <Disclosure :unmount="false" categoryName="Дата" class="px-4">
          <div class="flex flex-col">
            <Toggle
              class="px-0 pt-0"
              @update="(value) => (rangeToggle = !value)"
            >
              <span class="text-sm font-medium"> Только начало </span>
            </Toggle>
            <Calendar
              :isRange="rangeToggle"
              @update="(value) => (date = value)"
            />
          </div>
        </Disclosure>
        <hr class="border-black" />
        <!-- Places list -->
        <Autolist
          class="px-4"
          @update="(value) => (places = value)"
          :availablePlaces="availablePlaces"
          dataType="checkbox"
          categoryName="Место"
        />
        <hr class="border-black" />
      </div>
    </div>
    <Button class="xl:hidden mx-5 !mt-4 !my-10" @click="toggleEventsList">
      <span>{{ eventsListState ? "Скрыть список" : "Показать список" }}</span>
    </Button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as InterfaceComponents from "@/components/interface";
import { FilterIcon } from "@heroicons/vue/outline";
import _ from "lodash";

export default {
  name: "FilterLayout",
  components: {
    Autolist: InterfaceComponents.Autolist,
    Button: InterfaceComponents.Button,
    Calendar: InterfaceComponents.Calendar,
    Disclosure: InterfaceComponents.Disclosure,
    Search: InterfaceComponents.Search,
    Toggle: InterfaceComponents.Toggle,
    FilterIcon,
  },

  props: {
    eventsListState: Boolean,
    toggleEventsList: Function,
  },

  data() {
    return {
      query: "",
      followToggle: false,
      recommendToggle: false,
      rangeToggle: true,
      date: null,
      places: [],
      categories: [],
    };
  },

  computed: {
    ...mapState("client/", {
      availablePlaces: (state) => state.places,
      availableCategories: (state) => state.categories,
    }),
  },

  watch: {
    query: _.debounce(function (newValue) {
      this.$store.dispatch("UPDATE_FILTER", { key: "query", value: newValue });
    }, 500),
    followToggle(newValue) {
      this.$store.dispatch("UPDATE_FILTER", {
        key: "followToggle",
        value: newValue,
      });
    },
    recommendToggle(newValue) {
      this.$store.dispatch("UPDATE_FILTER", {
        key: "recommendToggle",
        value: newValue,
      });
    },
    categories(newValue) {
      this.$store.dispatch("UPDATE_FILTER", {
        key: "categories",
        value: newValue,
      });
    },
    date(newValue) {
      this.$store.dispatch("UPDATE_FILTER", { key: "date", value: newValue });
    },
    places(newValue) {
      this.$store.dispatch("UPDATE_FILTER", { key: "places", value: newValue });
    },
  },
};
</script>
