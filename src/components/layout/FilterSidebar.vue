<template>
  <div class="flex flex-col h-full w-4/5 md:w-60">
    <!-- Search input -->
    <Search class="mt-9" @update="(value) => (filter.query = value)" />
    <!-- Show list button -->
    <Button class="w-full" @click="toggleEventsList">
      <span>{{ eventsListState ? "Скрыть список" : "Показать список" }}</span>
    </Button>
    <!-- Filters list -->
    <div class="flex items-center max-w-[240px] px-4 py-2">
      <FilterIcon class="w-5 h-5" />
      <span class="ml-1 text-lg">Фильтры:</span>
    </div>
    <div class="overflow-y-scroll overflow-x-hidden">
      <!-- Follow toggle -->
      <Toggle @update="(value) => (filter.followToggle = value)">
        <span class="text-sm font-medium"> Только подписки </span>
      </Toggle>
      <!-- Recommend toggle -->
      <Toggle @update="(value) => (filter.recommendToggle = value)">
        <span class="text-sm font-medium"> Рекомендации </span>
      </Toggle>
      <!-- Category list -->
      <Disclosure categoryName="Категория">
        <div class="flex flex-col">
          <label
            v-for="category in json_data.categories"
            :key="category"
            class="inline-flex items-center my-2 cursor-pointer"
            :for="category.value"
          >
            <input
              class="form-checkbox text-primary w-5 h-5 rounded"
              type="checkbox"
              :id="category.value"
              :value="category.value"
              v-model="filter.checkedCategories"
            />
            <span class="ml-2">{{ category.name }}</span>
          </label>
        </div>
      </Disclosure>
      <hr />
      <!-- Calendar -->
      <Disclosure categoryName="Дата">
        <div class="flex flex-col">
          <Toggle
            class="px-0"
            @update="(value) => ((isRange = !value), (filter.date = null))"
          >
            <span class="text-sm font-medium"> Только начало </span>
          </Toggle>
          <Calendar
            :mode="'date'"
            :isRange="isRange"
            :isDark="false"
            @update="(value) => (filter.date = value)"
            class="self-center"
          />
        </div>
      </Disclosure>
      <hr />
      <!-- Intervals list -->
      <Disclosure categoryName="Временной интервал">
        <div class="flex flex-col">
          <label
            v-for="interval in json_data.intervals"
            :key="interval"
            class="inline-flex items-center my-2 cursor-pointer"
            :for="interval.value"
          >
            <input
              class="form-radio text-primary checked:border-primary w-5 h-5 rounded-xl"
              type="radio"
              :id="interval.value"
              :value="interval.value"
              v-model="filter.checkedIntervals"
            />
            <span class="ml-2">{{ interval.name }}</span>
          </label>
        </div>
      </Disclosure>
      <hr />
      <!-- Places list -->
      <Autolist
        class="text-sm"
        @update="(value) => (filter.checkedPlaces = value)"
        :data="json_data.places"
        dataType="checkbox"
        categoryName="Место: "
      />
      <hr class="mb-8" />
    </div>
  </div>
</template>

<style scoped>
hr {
  border-color: black;
}
</style>

<script>
import * as InterfaceComponents from "@/components/interface";
import { FilterIcon } from "@heroicons/vue/outline";
import json_data from "@/assets/json/data.json";

export default {
  name: "FilterSidebarComponent",
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
      json_data,
      isRange: true,
      filter: {
        query: "",
        followToggle: false,
        recommendToggle: false,
        checkedCategories: [],
        date: null,
        checkedPlaces: [],
        checkedIntervals: null,
      },
    };
  },

  // TODO: создать Vuex store для фильтра и установить watch на каждый из фильтров
  // watch: {
  //   filter: {
  //     handler(newValue) {
  //       console.log(newValue);
  //     },
  //     deep: true,
  //   },
  // },
};
</script>
