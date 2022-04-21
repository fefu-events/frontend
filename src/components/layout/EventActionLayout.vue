<template>
  <div class="flex flex-col justify-between h-full w-4/5 xl:w-80 mx-auto">
    <div id="form" class="flex flex-col overflow-y-scroll my-6">
      <!-- Title -->
      <div class="xl:mt-4 xl:mx-5">
        <div class="flex justify-between">
          <input
            class="w-10/12 py-2 bg-transparent focus:outline-none"
            placeholder="Название"
            v-model="event.title"
            :maxlength="50"
          />
          <span
            class="py-2 pr-2 text-sm"
            v-text="maxTitleSize - event.title.length"
            :class="{
              'text-danger': maxTitleSize - event.title.length < 1,
            }"
          />
        </div>
        <hr
          :class="errors.includes('title') ? 'border-danger' : 'border-black'"
        />
      </div>
      <!-- Calendar -->
      <div class="mt-4 xl:mx-5">
        <Disclosure :unmount="true" class="px-4" categoryName="Дата">
          <Calendar
            :propDate="event.date"
            :isRange="true"
            @update="(value) => (event.date = value)"
          />
        </Disclosure>
        <hr
          :class="errors.includes('date') ? 'border-danger' : 'border-black'"
        />
      </div>
      <!-- Place -->
      <div class="mt-4 xl:mx-5">
        <Autolist
          class="px-4"
          @update="(value) => (event.selectedPlace = value)"
          :propData="event.selectedPlace"
          :availablePlaces="availablePlaces"
          :dataType="'radio'"
          :categoryName="selectedPlaceLabel || 'Место'"
        />
        <hr
          :class="errors.includes('place') ? 'border-danger' : 'border-black'"
        />
      </div>
      <!-- Place description -->
      <div class="mt-4 xl:mx-5">
        <input
          class="w-full py-2 px-4 text-sm bg-transparent focus:outline-none"
          placeholder="Уточнение места"
          v-model="event.placeDescription"
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
                v-model="event.selectedCategory"
              />
              <span class="ml-2">{{ category.label }}</span>
            </label>
          </div>
        </Disclosure>
        <hr
          :class="
            errors.includes('category') ? 'border-danger' : 'border-black'
          "
        />
      </div>
      <!-- Description -->
      <div class="relative mt-4 xl:!mt-8 xl:mx-5">
        <textarea
          v-model="event.description"
          class="w-full h-36 px-6 py-2 rounded text-sm resize-none ring-offset-0 focus:ring-0 focus:border-primary"
          :maxlength="maxDescSize"
          placeholder="Описание"
        />
        <span
          class="absolute bottom-2 right-2 text-xs"
          :class="{
            'text-danger': maxDescSize - event.description.length < 1,
          }"
          v-text="maxDescSize - event.description.length"
        />
      </div>
      <!-- Tags -->
      <div class="mt-4 xl:!mt-8 xl:mx-5">
        <textarea
          v-model="event.tags"
          class="w-full h-36 px-6 py-2 rounded text-sm resize-none ring-offset-0 focus:ring-0 focus:border-primary"
          placeholder="Введите теги через пробел"
        />
      </div>
      <!-- Link -->
      <div class="mt-4 xl:mx-5">
        <input
          v-model="event.link"
          class="w-full py-2 px-4 text-sm focus:outline-none placeholder:italic"
          placeholder="https://fefuevent.ru"
        />
        <hr class="border-black" />
      </div>
      <!-- Organization -->
      <div v-if="!editableEvent" class="mt-4 xl:!mt-8 xl:mx-5">
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
                :for="`${organization.id}_${organization.title}`"
              >
                <input
                  class="form-radio text-primary w-5 h-5"
                  type="radio"
                  :id="`${organization.id}_${organization.title}`"
                  :value="organization.id"
                  v-model="event.selectedOrganization"
                />
                <span class="ml-2">{{ organization.title }}</span>
              </label>
            </div>
          </Disclosure>
          <hr class="border-black" />
        </div>
      </div>
    </div>
    <!-- Buttons -->
    <div v-if="editableEvent" class="flex flex-col mx-5 xl:mx-10">
      <Button
        class="hover:text-danger hover:border-danger"
        @click="onClickDelete(event.id)"
      >
        <span> Удалить мероприятие </span>
      </Button>
      <Button
        class="mb-10 hover:text-success hover:border-success"
        @click="onClickUpdate(event.id)"
      >
        <span> Подтверить изменения </span>
      </Button>
    </div>
    <div v-else class="flex flex-col mx-5 xl:mx-10">
      <Button class="mb-10" @click="onClickSubmit">
        <span> Создать </span>
      </Button>
    </div>
  </div>
</template>

<script>
import api from "@/service/api";
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
      errors: [],
      org: false,
      event: {
        title: "",
        date: null,
        selectedPlace: null,
        placeDescription: "",
        selectedCategory: null,
        description: "",
        tags: "",
        link: "",
        selectedOrganization: null,
      },
    };
  },

  computed: {
    ...mapState("client/", {
      availablePlaces: (state) => state.places,
      availableCategories: (state) => state.categories,
    }),

    ...mapState("auth/", {
      accessToken: (state) => state.accessToken,
      userID: (state) => state.user.id,
      availableOrganizations: (state) => state.user.organizations,
    }),

    selectedPlaceLabel() {
      for (const place of this.availablePlaces) {
        if (place.id == this.event.selectedPlace) {
          return place.label;
        }
      }
      return "";
    },

    selectedCategoryLabel() {
      for (const category of this.availableCategories) {
        if (category.id == this.event.selectedCategory) {
          return category.label;
        }
      }
      return "";
    },

    selectedOrgLabel() {
      for (const category of this.availableOrganizations) {
        if (category.id == this.event.selectedOrganization) {
          return category.label;
        }
      }
      return "";
    },

    validateEventForm() {
      let errors = [];
      // Title validate
      if (this.event.title === "") {
        errors.push("title");
      }
      // Date validate
      if (this.event.date !== null) {
        const { start, end } = this.event.date;
        const now = new Date().toISOString();
        if (start < now || end < now) {
          errors.push("date");
        }
      } else {
        errors.push("date");
      }
      // Place validate
      if (this.event.selectedPlace === null) {
        errors.push("place");
      }
      // Category validate
      if (this.event.selectedCategory === null) {
        errors.push("category");
      }
      // Scroll on error
      if (this.errors.length > 0) {
        const form = document.getElementById("form");
        form.scroll({ top: 0, left: 0, behavior: "smooth" });
      }
      return errors;
    },
  },

  async mounted() {
    if (this.editableEvent) {
      this.event = await api.event
        .getByEventID(this.editableEvent)
        .then(({ data }) => {
          const eventObj = {
            title: data.title || "",
            date: { start: data.date_begin, end: data.date_end },
            selectedPlace: data.place.id,
            placeDescription: data.place_description || "",
            selectedCategory: data.category.id,
            description: data.description || "",
            tags: data.tags.join(" "),
            link: data.url || "",
          };

          return eventObj;
        });
    }
  },

  methods: {
    async onClickSubmit() {
      this.errors = this.validateEventForm;
      if (this.errors.length > 0) return;
      const response = await api.event.create(this.accessToken, this.event);
      if (response.status === 201) {
        this.event = {
          title: "",
          date: null,
          selectedPlace: null,
          placeDescription: "",
          selectedCategory: null,
          description: "",
          tags: "",
          link: "",
          selectedOrganization: null,
        };
        this.onClickEventActionToggle();
        this.$store.dispatch("client/SET_FORCE_UPDATE_EVENT_LIST", true);
      }
    },

    async onClickDelete() {
      const response = await api.event.delete(
        this.accessToken,
        this.editableEvent
      );
      if (response.status === 200) {
        this.onClickSelectEditEvent(null);
        this.$store.dispatch("client/SET_FORCE_UPDATE_EVENT_LIST", true);
      }
    },

    async onClickUpdate() {
      this.errors = this.validateEventForm;
      if (this.errors.length > 0) return;
      const response = await api.event.update(
        this.accessToken,
        this.event,
        this.editableEvent
      );
      if (response.status === 200) {
        this.onClickSelectEditEvent(null);
        this.$store.dispatch("client/SET_FORCE_UPDATE_EVENT_LIST", true);
      }
    },
  },

  watch: {
    async org(newValue) {
      if (newValue) {
        await this.$store.dispatch(
          "auth/SET_NEW_ORGANIZATIONS",
          this.accessToken
        );
      }
    },
  },
};
</script>
