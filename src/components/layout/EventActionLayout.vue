<template>
  <div class="flex flex-col justify-between h-full w-4/5 xl:w-80 mx-auto">
    <div class="flex flex-col overflow-y-scroll my-6">
      <!-- Title -->
      <div class="xl:mt-4 xl:mx-5">
        <div class="flex justify-between">
          <input
            class="w-full py-2 mr-4 focus:outline-none"
            placeholder="Название"
            v-model="title"
            :maxlength="50"
          />
          <span
            class="py-2 pr-2 text-sm"
            v-text="maxTitleSize - title.length"
            :class="{
              'text-danger': maxTitleSize - title.length < 1,
            }"
          />
        </div>
        <hr class="border-black" />
      </div>
      <!-- Calendar -->
      <div class="mt-4 xl:mx-5">
        <Disclosure class="px-4" categoryName="Дата">
          <Calendar :isRange="true" />
        </Disclosure>
        <hr class="border-black" />
      </div>
      <!-- Place -->
      <div class="mt-4 xl:mx-5">
        <Autolist
          class="px-4"
          @update="(value) => (selectedPlace = value)"
          :data="availablePlaces"
          :dataType="'radio'"
          :categoryName="selectedPlaceLabel || 'Место'"
        />
        <hr class="border-black" />
      </div>
      <!-- Category -->
      <div class="mt-4 xl:mx-5">
        <Disclosure
          class="px-4"
          :categoryName="selectedCategoryLabel || 'Категория'"
        >
          <div class="flex flex-col">
            <label
              v-for="category in availableCategories"
              :key="category"
              class="inline-flex items-center my-2 cursor-pointer"
              :for="`${category.id}_${category.label}_create`"
            >
              <input
                class="form-radio text-primary w-5 h-5"
                type="radio"
                :id="`${category.id}_${category.label}_create`"
                :value="category.id"
                v-model="selectedCategory"
              />
              <span class="ml-2">{{ category.label }}</span>
            </label>
          </div>
        </Disclosure>
        <hr class="border-black" />
      </div>
      <!-- Description -->
      <div class="relative mt-4 xl:!mt-8 xl:mx-5">
        <textarea
          v-model="description"
          class="w-full h-36 px-6 py-2 rounded text-sm resize-none ring-offset-0 focus:ring-0 focus:border-primary"
          :maxlength="maxDescSize"
          placeholder="Описание"
        />
        <span
          class="absolute bottom-2 right-2 text-xs"
          :class="{
            'text-danger': maxDescSize - description.length < 1,
          }"
          v-text="maxDescSize - description.length"
        />
      </div>
      <!-- Tags -->
      <div class="mt-4 xl:!mt-8 xl:mx-5">
        <textarea
          v-model="tags"
          class="w-full h-36 px-6 py-2 rounded text-sm resize-none ring-offset-0 focus:ring-0 focus:border-primary"
          placeholder="Ввеите теги через пробел"
        />
      </div>
      <!-- Link -->
      <div class="mt-4 xl:mx-5">
        <input
          v-model="link"
          class="w-full py-2 px-4 text-sm focus:outline-none placeholder:italic"
          placeholder="https://fefuevent.ru"
        />
        <hr class="border-black" />
      </div>
      <!-- Organization -->
      <div v-if="editableEvent" class="mt-4 xl:!mt-8 xl:mx-5">
        <Toggle class="px-4" @update="(value) => (org = value)">
          <span class="text-sm font-medium"> От имени организации </span>
        </Toggle>
        <div v-if="org" class="mt-2">
          <Disclosure
            class="px-4"
            :categoryName="selectedOrgLabel || 'Выбрать организацию'"
          >
            <div v-if="availableOrganizations" class="flex flex-col">
              <label
                v-for="organization in availableOrganizations"
                :key="organization"
                class="inline-flex items-center my-2 cursor-pointer"
                :for="`${organization.id}_${organization.label}`"
              >
                <input
                  class="form-radio text-primary w-5 h-5"
                  type="radio"
                  :id="`${organization.id}_${organization.label}`"
                  :value="organization.id"
                  v-model="selectedOrganization"
                />
                <span class="ml-2">{{ organization.label }}</span>
              </label>
            </div>
          </Disclosure>
          <hr class="border-black" />
        </div>
      </div>
    </div>
    <div v-if="editableEvent" class="flex flex-col">
      <Button
        class="mx-10 hover:text-danger hover:border-danger"
        @click="onClickDelete(event.id)"
      >
        <span> Удалить мероприятие </span>
      </Button>
      <Button
        class="mx-10 mb-10 hover:text-success hover:border-success"
        @click="onClickAccept(event.id)"
      >
        <span> Подтверить изменения </span>
      </Button>
    </div>
    <div v-else class="flex flex-col">
      <Button class="mx-10 mb-10" @click="onClickSubmit">
        <span> Создать </span>
      </Button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  Autolist,
  Button,
  Calendar,
  Disclosure,
  Toggle,
} from "@/components/interface";

export default {
  name: "EventActionLayout",
  components: {
    Autolist,
    Button,
    Calendar,
    Disclosure,
    Toggle,
  },

  props: {
    editableEvent: Number,
  },

  inject: ["onClickEventActionToggle", "onClickSelectEditEvent"],

  data() {
    return {
      maxTitleSize: 50,
      maxDescSize: 255,
      title: "",
      description: "",
      tags: "",
      link: "",
      org: false,
      selectedPlace: null,
      selectedCategory: null,
      selectedOrganization: null,
      availableOrganizations: [
        { id: 1, label: "Организация 1" },
        { id: 2, label: "Организация 2" },
      ],
      event: {
        id: 1,
        title: "Название какого-то мероприятия",
        date: "01.01.2022 - 03.01.2022",
      },
    };
  },

  computed: {
    ...mapState("client/", {
      availablePlaces: (state) => state.places,
      availableCategories: (state) => state.categories,
    }),

    selectedPlaceLabel() {
      for (const place of this.availablePlaces) {
        if (place.id == this.selectedPlace) {
          return place.label;
        }
      }
      return "";
    },

    selectedCategoryLabel() {
      for (const category of this.availableCategories) {
        if (category.id == this.selectedCategory) {
          return category.label;
        }
      }
      return "";
    },

    selectedOrgLabel() {
      for (const category of this.availableOrganizations) {
        if (category.id == this.selectedOrganization) {
          return category.label;
        }
      }
      return "";
    },
  },

  methods: {
    onClickSubmit() {
      this.onClickEventActionToggle();
    },

    onClickDelete() {
      this.onClickSelectEditEvent(null);
    },

    onClickAccept() {
      this.onClickSelectEditEvent(null);
    },
  },
};
</script>

<style></style>
