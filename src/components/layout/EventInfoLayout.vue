<template>
  <div class="flex flex-col h-full w-4/5 xl:w-70 mx-auto">
    <div
      class="grid grid-cols-10 xl:flex mt-10 mb-4 xl:mt-0 xl:mb-5 flex-row content-between items-center xl:flex-col"
    >
      <div
        class="bg-black col-span-2 xl:w-28 xl:my-7 rounded-full overflow-hidden"
      >
        <img
          class="self-center justify-self-center"
          src="@/assets/img/svg/logo.svg"
          alt="user avatar"
        />
      </div>
      <div class="flex flex-col pl-5 xl:pl-0 col-span-8">
        <span class="text-left text-xl xl:text-2xl mb-3 uppercase">
          {{ title }}
        </span>
        <hr class="xl:hidden border-black" />
      </div>
    </div>
    <hr class="hidden xl:block border-black" />
    <div class="overflow-y-scroll">
      <div class="text-left">
        <div class="my-3 xl:my-6">
          <span class="text-primary text-2xl xl:text-2xl font-bold">
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
      <div class="flex flex-wrap mt-5 mb-10">
        <div
          v-for="tag in tags"
          :key="tag"
          class="px-2 mr-2 mt-2 border border-black rounded hover:bg-primary hover:border-primary hover:text-white hover:cursor-pointer"
        >
          <span class="">#{{ tag }}</span>
        </div>
      </div>
      <div class="flex items-center my-4">
        <LinkIcon class="w-5 h-5 mr-4" />
        <a href="https://2gis.ru/moscow/my" class="underline" target="blank">
          https://2gis.ru/moscow/my
        </a>
      </div>
      <div class="mx-5">
        <Button class="w-full mt-10 lg:my-10">
          <span> {{ !visit ? "Возможно пойду" : "Не пойду" }} </span>
        </Button>
        <Button
          class="lg:hidden w-full mt-2 mb-10"
          @click="onClickSelectEvent(event)"
        >
          <span> К списку </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
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
    event: Number,
  },

  inject: ["onClickSelectEvent"],

  data() {
    return {
      visit: false,
      title: "Название ЭТОГО МЕРОПРИятия",
      tags: ["tag1", "tag2", "tag3"],
      org: "Organization",
      date: "11.04.2022 - 11.04.2022",
      timeStart: "11:00",
      place: "Undefined place",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hac mi arcu, cursus senectus quis mauris neque. Cras quam nec, amet, leo elit ullamcorper vel elementum. Vestibulum in semper neque egestas mattis mollis integer malesuada. Cursus scelerisque felis",
      people: 1000,
    };
  },
};
</script>
