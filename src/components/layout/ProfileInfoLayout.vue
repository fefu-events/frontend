<template>
  <div class="flex flex-col justify-between h-full w-4/5 xl:w-80 mx-auto">
    <div class="flex flex-col">
      <!-- Person -->
      <div class="flex flex-row justify-between items-center mt-10 xl:mx-5">
        <div class="w-16 h-16 rounded-full bg-gray-300">
          <img src="" alt="" srcset="" />
        </div>
        <div class="mr-8">
          <span class="block text-2xl">{{ user?.name.split(" ")[0] }}</span>
          <span class="block text-2xl">{{ user?.name.split(" ")[1] }}</span>
        </div>
      </div>
      <!-- Bookmarks -->
      <div class="xl:mx-5 mt-8">
        <ul>
          <li class="flex flex-row my-5 font-bold cursor-pointer group">
            <HashtagIcon class="w-5 h-5 mx-2" />
            <span class="group-hover:text-primary">Мои теги</span>
          </li>
          <li class="flex flex-row my-5 font-bold cursor-pointer group">
            <UserIcon class="w-5 h-5 mx-2" /><span
              class="group-hover:text-primary"
              >Мои подписки</span
            >
          </li>
          <li class="flex flex-row my-5 font-bold cursor-pointer group">
            <UserGroupIcon class="w-5 h-5 mx-2" />
            <span class="group-hover:text-primary">Мои организации</span>
          </li>
        </ul>
      </div>
      <!-- Events -->
      <div>
        <span class="xl:mx-5 font-medium">Мои мероприятия: </span>
        <div class="h-[40vh] my-2 overflow-y-scroll">
          <div
            class="hover:bg-hoverColor xl:px-5 cursor-pointer"
            v-for="event in events"
            :key="event.id"
            @click="onClickSelectEvent(event.id)"
          >
            <EventBlock :event="event" :edit="true" />
          </div>
        </div>
      </div>
    </div>
    <Button class="mx-10 mb-10" @click="signOut">
      <span> Выйти </span>
    </Button>
  </div>
</template>

<script>
import { HashtagIcon, UserIcon, UserGroupIcon } from "@heroicons/vue/outline";
import { EventBlock } from "@/components/template";
import { Button } from "@/components/interface";

export default {
  name: "ProfileInfoLayout",
  components: {
    EventBlock,
    Button,
    HashtagIcon,
    UserIcon,
    UserGroupIcon,
  },

  props: {
    user: Object,
    signOut: Function,
  },

  inject: ["onClickSelectEvent"],

  data() {
    return {
      events: [
        {
          id: 1,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 2,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 3,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 4,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 5,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 6,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 7,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
        {
          id: 8,
          title: "Название какого-то мероприятия",
          date: "01.01.2022 - 03.01.2022",
        },
      ],
    };
  },
};
</script>
