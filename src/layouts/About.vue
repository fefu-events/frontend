<template>
  <div class="flex flex-col h-full mx-10 xl:mx-5">
    <div class="flex flex-row items-center space-x-4 mt-10 font-bold text-lg">
      <AppIcon :gradient="true" class="w-6" />
      <span
        class="text-3xl text-transparent bg-clip-text bg-gradient-to-b from-start to-end whitespace-nowrap"
      >
        FEFU Events
      </span>
    </div>
    <div class="my-10 space-y-4 overflow-y-scroll">
      <ul class="space-y-4">
        <li class="cursor-pointer group" @click="downloadRules">
          <RulesIcon class="inline-block w-6" />
          <span class="group-hover:text-primary align-middle font-bold">
            Правила сервиса
          </span>
        </li>
        <li class="cursor-pointer group">
          <a href="https://t.me/fefu_events" target="_blank">
            <MailIcon class="inline-block w-6" />
            <span class="group-hover:text-primary align-middle font-bold">
              Обратная связь
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import rulesDoc from "@/assets/docs/rules.pdf";
import { AppIcon, RulesIcon } from "@/components/icons";
import { MailIcon } from "@heroicons/vue/outline";

export default {
  name: "AboutUs",
  components: {
    AppIcon,
    RulesIcon,
    MailIcon,
  },

  methods: {
    downloadRules() {
      const el = document.createElement("a");
      el.href = rulesDoc;
      el.download = `Пользовательское соглашение`;
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    },
  },
};
</script>
