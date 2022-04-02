<template>
  <div class="w-4/5 md:w-70 mx-auto">
    <div
      class="flex my-6 md:mt-0 md:mb-6 flex-row content-between items-center md:flex-col"
    >
      <div class="w-28 md:my-7 rounded-full overflow-hidden">
        <img
          class="self-center justify-self-center"
          src="@/assets/img/svg/logo.svg"
          alt="user avatar"
        />
      </div>
      <span class="text-left text-xl md:text-2xl uppercase">{{ title }}</span>
    </div>
    <hr class="border-black" />
    <div class="mt-6 text-left">
      <div class="my-6">
        <span class="text-primary text-xl md:text-2xl font-bold">
          {{ people }}
        </span>
        собираются пойти
      </div>
      <div class="flex items-center my-4">
        <UserGroupIcon class="w-5 h-5 mr-4" /> {{ org }}
      </div>
      <div class="flex items-center my-4">
        <CalendarIcon class="w-5 h-5 mr-4" /> {{ date }}
      </div>
      <div class="flex items-center my-4">
        <ClockIcon class="w-5 h-5 mr-4" /> {{ timeStart }}
      </div>
      <div class="flex items-center my-4">
        <img src="@/assets/img/svg/icon.svg" class="w-5 h-7 mr-4" />
        {{ place }}
      </div>
      <p>
        {{ description }}
      </p>
    </div>
    <div class="flex flex-wrap mt-5">
      <div
        v-for="tag in tags"
        :key="tag"
        class="px-2 mr-2 mt-2 border border-black rounded"
      >
        <span>#{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { UserGroupIcon, CalendarIcon, ClockIcon } from "@heroicons/vue/outline";

export default {
  name: "EventInfoComponent",
  components: {
    UserGroupIcon,
    CalendarIcon,
    ClockIcon,
  },
  data() {
    return {
      title: "title",
      tags: ["tag1", "tag2", "tag3"],
      org: "Organization",
      date: "11.04.2022 - 11.04.2022",
      timeStart: "11:00",
      place: "Undefined place",
      description: "something about event",
      people: 1000,
    };
  },
};
</script>
