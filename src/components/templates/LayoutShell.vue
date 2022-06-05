<template>
  <div
    v-if="side == 'right'"
    class="right-sidebar"
    :class="{
      'bottom-10 xl:bottom-0 xl:right-0 outline': renderTerm,
    }"
  >
    <slot />
  </div>
  <div
    v-else
    class="left-sidebar"
    :class="{
      'h-9/10 xl:h-screen xl:!w-80 outline': renderTerm,
      'xl:-left-2': left_x_2,
      'xl:-left-4': left_x_4,
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "LayoutShellComponent",

  props: {
    side: {
      type: String,
      default: "right",
    },
    left_x_2: Boolean,
    left_x_4: Boolean,
    renderTerm: [Number, Boolean],
  },
};
</script>
