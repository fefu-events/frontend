<template>
  <div class="w-4/5 xl:w-70 mx-auto">
    <div class="grid grid-flow-row grid-cols-5 gap-3 py-4">
      <div class="col-span-4 px-4 text-left text-lg">
        <span> {{ event.title }} </span>
      </div>
      <div
        class="flex w-12 rounded-full overflow-hidden justify-self-end self-center"
      >
        <img
          class="self-center justify-self-center"
          src="@/assets/img/svg/logo.svg"
          alt="user avatar"
        />
      </div>
      <div class="col-span-5 px-4 text-left">
        <span>{{ event.date }}</span>
      </div>
    </div>
    <hr class="border-black" />
  </div>
</template>

<script>
export default {
  name: "EventBlockComponent",
  props: {
    event: Object,
  },
};
</script>
