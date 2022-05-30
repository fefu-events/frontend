<template>
  <div class="flex flex-col h-full">
    <div v-if="!isLoaded" class="flex items-center h-full">
      <svg
        class="animate-spin h-12 w-12 text-primary mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-40"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
        ></circle>
        <path
          class="opacity-80"
          stroke="currentColor"
          stroke-width="2"
          d="M4.85857 5C3.09032 6.80375 2 9.27455 2 12C2 17.5228 6.47715 22 12 22"
        />
      </svg>
    </div>
    <div v-else class="flex flex-col h-full px-5">
      <div
        class="flex pt-10 pb-4 xl:py-0 flex-row content-between items-center xl:flex-col"
      >
        <div class="w-28 xl:my-7 rounded-full overflow-hidden">
          <CategoryIcon
            class="self-center justify-self-center"
            :categoryID="event.category?.id"
          />
        </div>
        <div class="flex flex-col pl-5 xl:pl-0 col-span-7 w-full">
          <span class="text-left text-xl xl:text-2xl mb-3 uppercase">
            {{ event.title }}
          </span>
          <hr class="xl:hidden border-black" />
        </div>
      </div>
      <hr class="hidden xl:block border-black" />
      <div class="h-full flex flex-col overflow-y-scroll">
        <div class="text-left">
          <div class="my-3 xl:my-6">
            <span class="text-primary text-2xl xl:text-2xl font-bold">
              {{ event.participant_count }}
            </span>
            собираются пойти
          </div>
          <div class="flex items-center my-4">
            <div class="self-baseline mr-4 my-1">
              <UserGroupIcon class="w-5 h-5" />
            </div>
            <span
              class="cursor-pointer after:content-['✓']"
              @click="showOrganizatorInfo"
              :class="
                event.organization?.is_verified
                  ? 'after:mx-2 after:text-primary'
                  : 'after:text-transparent'
              "
            >
              {{
                event.organization
                  ? event.organization?.title
                  : event.user?.name
              }}
            </span>
          </div>
          <div class="flex items-center my-4">
            <div class="self-baseline mr-4 my-1">
              <CalendarIcon class="w-5 h-5" />
            </div>
            <span>
              {{ normalizedDate }}
            </span>
          </div>
          <div class="flex items-center my-4">
            <div class="self-baseline mr-4 my-1">
              <ClockIcon class="w-5 h-5" />
            </div>
            <span>
              {{ normalizedTime }}
            </span>
          </div>
          <div class="flex items-center my-4">
            <div class="self-baseline mr-4 my-1">
              <img src="@/assets/img/svg/icon.svg" class="w-5 h-7" />
            </div>
            <div class="flex flex-col">
              <span>
                {{ event.place?.label }}
              </span>
              <span class="break-words">
                {{ event.place_description }}
              </span>
            </div>
          </div>
          <p class="break-words">
            {{ event.description }}
          </p>
        </div>
        <div v-if="event.tags?.length > 0" class="flex flex-wrap mt-5 mb-10">
          <div
            v-for="tag in event.tags"
            :key="tag"
            @click="storeTag(tag)"
            class="px-2 mr-2 mb-2 border border-black rounded hover:bg-primary hover:border-primary hover:text-white hover:cursor-pointer"
            :class="{
              'bg-primary border-primary text-white hover:bg-transparent hover:border-black hover:text-black':
                tags.includes(tag),
            }"
          >
            <span>#{{ tag }}</span>
          </div>
          <div v-if="event.url" class="flex items-center my-4">
            <div class="self-baseline mr-4 my-1">
              <LinkIcon class="w-5 h-5" />
            </div>
            <a :href="event.url" class="underline break-all" target="blank">
              {{ event.url }}
            </a>
          </div>
        </div>
        <div class="mx-5 pt-4 mt-auto mb-10 space-y-4">
          <Button v-if="token" class="w-full" @click="takePart">
            <span>
              {{ event.am_i_participation ? "Не пойду" : "Возможно пойду" }}
            </span>
          </Button>
          <Button
            class="xl:hidden w-full"
            @click="onClickSelectEvent(event.id)"
          >
            <span> Назад </span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/service/api";
import { mapState } from "vuex";
import moment from "moment";
import { Button } from "@/components/interface";
import { CategoryIcon } from "@/components/icons";
import { UserGroupIcon, CalendarIcon, ClockIcon } from "@heroicons/vue/outline";
import { LinkIcon } from "@heroicons/vue/solid";

export default {
  name: "EventInfo",
  components: {
    Button,
    /* eslint-disable vue/no-unused-components */
    CategoryIcon,
    UserGroupIcon,
    CalendarIcon,
    ClockIcon,
    LinkIcon,
  },

  props: {
    eventID: Number,
  },

  inject: [
    "onClickSelectEvent",
    "onClickSelectOrganization",
    "onClickSelectUser",
  ],

  data() {
    return {
      isLoaded: false,
      event: {},
    };
  },

  computed: {
    ...mapState("me", {
      token: (state) => state.accessToken,
      tags: (state) => state.user?.tags || [],
    }),

    normalizedDate() {
      const start = moment(this.event.date_begin).format("DD.MM.YYYY");
      const end = moment(this.event.date_end).format("DD.MM.YYYY");
      return `${start} - ${end}`;
    },

    normalizedTime() {
      return moment(this.event.date_begin).format("HH:mm");
    },
  },

  methods: {
    async storeTag(tag) {
      if (!this.token) return;

      let newTags = this.tags.slice(0);
      if (newTags.includes(tag)) {
        newTags = this.tags.filter((tag_) => tag_ !== tag);
      } else {
        newTags.push(tag);
      }
      await api.me.update(this.token, newTags);
      this.$store.dispatch("me/SET_NEW_TAGS", newTags);
    },

    takePart() {
      if (!this.event.am_i_participation) {
        this.event.participant_count += 1;
        api.participation.part(this.token, this.eventID);
      } else {
        this.event.participant_count -= 1;
        api.participation.nonpart(this.token, this.eventID);
      }
      this.event.am_i_participation = !this.event.am_i_participation;
    },

    showOrganizatorInfo() {
      if (this.event.organization?.id) {
        this.onClickSelectOrganization(this.event.organization.id);
      } else {
        this.onClickSelectUser(this.event.user.id);
      }
    },
  },

  watch: {
    async eventID(newValue) {
      if (newValue == null) {
        return;
      }
      this.isLoaded = false;
      this.event = await api.event
        .getByEventID(this.eventID, this.token)
        .then(({ data }) => {
          this.isLoaded = true;
          return data;
        });
    },
  },
};
</script>
