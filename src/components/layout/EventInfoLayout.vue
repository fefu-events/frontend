<template>
  <div class="flex flex-col h-full w-4/5 xl:w-70 mx-auto">
    <div
      class="grid grid-cols-10 xl:flex pt-10 pb-4 xl:py-0 flex-row content-between items-center xl:flex-col"
    >
      <div
        class="bg-black col-span-3 xl:w-28 xl:my-7 rounded-full overflow-hidden"
      >
        <img
          class="self-center justify-self-center"
          src="@/assets/img/svg/logo.svg"
          alt="user avatar"
        />
      </div>
      <div class="flex flex-col pl-5 xl:pl-0 col-span-7 xl:w-full">
        <span class="text-left text-xl xl:text-2xl mb-3 uppercase">
          {{ event?.title }}
        </span>
        <hr class="xl:hidden border-black" />
      </div>
    </div>
    <hr class="hidden xl:block border-black" />
    <div class="h-full flex flex-col justify-between overflow-y-scroll">
      <div>
        <div class="text-left">
          <div class="my-3 xl:my-6">
            <span class="text-primary text-2xl xl:text-2xl font-bold">
              {{ event?.participant_count }}
            </span>
            собираются пойти
          </div>
          <div class="flex items-center my-4">
            <div class="self-baseline mr-4 my-1">
              <UserGroupIcon class="w-5 h-5" />
            </div>
            <span>
              {{
                event?.organization
                  ? event?.organization.name
                  : event?.user.name
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
                {{ event?.place.label }}
              </span>
              <span>
                {{ event?.place_description }}
              </span>
            </div>
          </div>
          <p>
            {{ event?.description }}
          </p>
        </div>
        <div class="flex flex-wrap mt-5 mb-10">
          <div
            v-for="tag in event?.tags"
            :key="tag"
            class="px-2 mr-2 mt-2 border border-black rounded hover:bg-primary hover:border-primary hover:text-white hover:cursor-pointer"
          >
            <span class="">#{{ tag }}</span>
          </div>
        </div>
        <div class="flex items-center my-4">
          <div class="self-baseline mr-4 my-1">
            <LinkIcon class="w-5 h-5" />
          </div>
          <a :href="url" class="underline break-all" target="blank">
            {{ url }}
          </a>
        </div>
      </div>
      <div class="mx-5">
        <Button class="w-full mt-10 xl:my-10">
          <span> {{ !visit ? "Возможно пойду" : "Не пойду" }} </span>
        </Button>
        <Button
          class="xl:hidden w-full mt-2 mb-10"
          @click="onClickSelectEvent(event)"
        >
          <span> К списку </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { Button } from "@/components/interface";
import { UserGroupIcon, CalendarIcon, ClockIcon } from "@heroicons/vue/outline";
import { LinkIcon } from "@heroicons/vue/solid";

export default {
  name: "EventInfoLayout",
  components: {
    Button,
    UserGroupIcon,
    CalendarIcon,
    ClockIcon,
    LinkIcon,
  },

  props: {
    event: Object,
  },

  inject: ["onClickSelectEvent"],

  data() {
    return {
      visit: false,
      people: 1000,
      url: "https://2gis.ru/moscow/my",
    };
  },

  computed: {
    normalizedDate() {
      const start = moment(this.event?.date_begin).format("DD.MM.YYYY");
      const end = moment(this.event?.date_end).format("DD.MM.YYYY");
      return `${start} - ${end}`;
    },
    normalizedTime() {
      const time = moment(this.event?.date_begin).format("HH:mm");
      return time;
    },
  },
};
</script>
