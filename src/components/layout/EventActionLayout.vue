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
        <hr :class="v$.event.title.$error ? 'border-danger' : 'border-black'" />
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
        <hr :class="v$.event.date.$error ? 'border-danger' : 'border-black'" />
      </div>
      <!-- Place -->
      <div class="mt-4 xl:mx-5">
        <Autolist
          class="px-4"
          :categoryName="selectedPlaceLabel || 'Место'"
          :availablePlaces="availablePlaces"
          v-slot="{ filteredData }"
        >
          <div class="flex flex-col">
            <label
              v-for="place in filteredData"
              :key="place"
              class="inline-flex items-center my-2 cursor-pointer"
              :for="`${place.id}_${place.label}`"
            >
              <input
                class="form-radio py-2 w-5 h-5 text-primary"
                type="radio"
                :id="`${place.id}_${place.label}`"
                :value="place.id"
                v-model="event.selectedPlace"
              />
              <span class="block truncate ml-2">
                {{ place.label }}
              </span>
            </label>
          </div>
        </Autolist>
        <hr
          :class="
            v$.event.selectedPlace.$error ? 'border-danger' : 'border-black'
          "
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
            v$.event.selectedCategory.$error ? 'border-danger' : 'border-black'
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
          class="w-full py-2 px-4 text-sm bg-transparent focus:outline-none placeholder:italic"
          placeholder="https://fefuevent.ru"
        />
        <hr :class="v$.event.link.$error ? 'border-danger' : 'border-black'" />
      </div>
      <!-- Organization -->
      <div v-if="!editableEvent" class="mt-4 xl:!mt-8 xl:mx-5">
        <Toggle class="px-4" @update="(value) => (org = value)">
          <span class="text-sm font-medium"> От имени организации </span>
        </Toggle>
        <div v-if="org" class="mt-2">
          <Disclosure
            class="px-4"
            :categoryName="selectedOrganizationLabel || 'Выбрать организацию'"
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
import useVuelidate from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";
import { mapState } from "vuex";
import {
  Autolist,
  Button,
  Calendar,
  Disclosure,
  Toggle,
} from "@/components/interface";

export default {
  setup: () => ({ v$: useVuelidate() }),

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

  validations() {
    return {
      event: {
        title: {
          required,
        },
        date: {
          start: {
            required,
            minValue: (value) => value > new Date().toISOString(),
          },
          end: {
            required,
            minValue: (value) => value > new Date().toISOString(),
          },
        },
        selectedPlace: {
          $lazy: true,
          required,
        },

        selectedCategory: {
          required,
        },

        link: {
          url,
        },
      },
    };
  },

  computed: {
    ...mapState("client/", {
      availablePlaces: (state) => state.places,
      availableCategories: (state) => state.categories,
    }),

    ...mapState("me/", {
      accessToken: (state) => state.accessToken,
      userID: (state) => state.user?.id,
      availableOrganizations: (state) => state.user.organizations,
    }),

    selectedPlaceLabel() {
      return (
        this.availablePlaces.find(
          (place) => place.id == this.event.selectedPlace
        )?.label || null
      );
    },

    selectedCategoryLabel() {
      return (
        this.availableCategories.find(
          (category) => category.id == this.event.selectedCategory
        )?.label || null
      );
    },

    selectedOrganizationLabel() {
      return (
        this.availableOrganizations.find(
          (organization) => organization.id == this.event.selectedOrganization
        )?.title || null
      );
    },

    normalizeTags() {
      return this.event.tags
        .split(" ")
        .map((tag) => (tag.includes("#") ? tag.slice(1) : tag))
        .join(" ");
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
    async validate() {
      const result = await this.v$.$validate();
      if (!result) {
        const form = document.getElementById("form");
        form.scroll({ top: 0, left: 0, behavior: "smooth" });
      }
      return result;
    },

    async onClickSubmit() {
      const result = await this.validate();
      if (!result) return;

      this.event.tags = this.normalizeTags;
      const response = await api.event.create(this.accessToken, this.event);
      if (response.status === 201) {
        this.$emit("rerender");
        this.onClickEventActionToggle();
        this.$store.dispatch("client/SET_FORCE_UPDATE_EVENT_LIST", true);
      }
    },

    async onClickDelete() {
      if (!window.confirm("Ты действительно хочешь удалить мероприятие?"))
        return;
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
      const result = await this.validate();
      if (!result) return;

      this.event.tags = this.normalizeTags;
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
          "me/SET_NEW_ORGANIZATIONS",
          this.accessToken
        );
      } else {
        this.event.selectedOrganization = null;
      }
    },
  },
};
</script>
