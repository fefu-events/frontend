<template>
  <div
    class="flex flex-col justify-between h-full w-[89%] xl:w-80 mx-auto overflow-y-scroll"
  >
    <div class="flex flex-col">
      <!-- Person -->
      <div class="flex flex-row xl:justify-between items-center mt-10 mx-5">
        <div class="w-16 h-16 rounded-full bg-gray-300">
          <img src="" alt="" srcset="" />
        </div>
        <div class="mx-4 md:mx-6 xl:mr-8 xl:ml-0">
          <span class="block text-2xl">{{ user?.name.split(" ")[0] }}</span>
          <span class="block text-2xl">{{ user?.name.split(" ")[1] }}</span>
        </div>
      </div>
      <!-- Bookmarks -->
      <div class="mx-5 mt-8">
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
        <span class="mx-5 font-medium">Мои мероприятия: </span>
        <div
          v-if="events.length > 0"
          class="h-[40vh] my-1 overflow-y-scroll"
          ref="events"
        >
          <div
            class="hover:bg-hoverColor px-5 cursor-pointer"
            v-for="event in events"
            :key="event.id"
          >
            <EventBlock :event="event" :edit="true" />
          </div>
        </div>
        <div v-else class="my-4">
          <img
            class="w-3/5 h-3/5 mx-auto"
            src="@/assets/img/svg/emptyList.svg"
            alt=""
          />
        </div>
      </div>
    </div>
    <Button class="mx-10 mb-10" @click="signOut">
      <span> Выйти </span>
    </Button>
  </div>
</template>

<script>
import api from "@/service/api";
import { mapState } from "vuex";
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

  data() {
    return {
      page: 1,
      events: [],
    };
  },

  computed: {
    ...mapState("client/", {
      forceUpdate: "forceUpdateList",
    }),

    skip() {
      return 10 * this.page;
    },
  },

  async mounted() {
    await this.updateEventList();
    const eventsList = this.$refs.events;
    if (eventsList)
      eventsList.addEventListener("scroll", () => this.handleScroll());
  },

  methods: {
    async updateEventList() {
      this.events = await api.event
        .getByUserID(0, this.user?.id)
        .then((response) => response.data);
    },

    async handleScroll() {
      const eventsList = this.$refs.events;
      const scrolling = eventsList.scrollTop + eventsList.clientHeight;
      if (
        scrolling >= eventsList.scrollHeight &&
        this.events.length >= this.page * 10
      ) {
        const { data } = await api.event.getByUserID(this.skip, this.user?.id);
        this.events = this.events.concat(data);
        this.page++;
      }
    },
  },

  watch: {
    forceUpdate(newValue) {
      if (newValue === true) {
        this.updateEventList();
      }
      this.$store.dispatch("client/SET_FORCE_UPDATE_LIST", false);
    },
  },
};
</script>
