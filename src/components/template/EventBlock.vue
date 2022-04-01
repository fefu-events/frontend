<template>
  <div class="hover:bg-hoverColor cursor-pointer">
    <div class="w-4/5 md:w-72 mx-auto">
      <div class="grid grid-flow-row grid-cols-5 gap-3 py-4">
        <div class="col-span-4 px-4 text-left text-lg">
          <span> {{ title }} </span>
        </div>
        <div
          class="col-span-1 w-10 h-10 rounded-full overflow-hidden justify-self-end self-center"
        >
          <img src="@/assets/img/svg/logo.svg" alt="" class="" />
        </div>
        <div class="col-span-5 px-4 text-left">
          <span>{{ date }}</span>
        </div>
      </div>
      <hr class="border-black" />
    </div>
  </div>
</template>

<script>
export default {
  name: "EventBlockComponent",
  props: {
    title: String,
    icon: String,
    date: String,
  },
};
</script>
