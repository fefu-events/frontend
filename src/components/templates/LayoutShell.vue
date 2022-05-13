<template>
  <div
    class="right-sidebar"
    :class="{
      'h-9/10 xl:h-[85%] xl:!w-90 outline': renderTerm,
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "LayoutShellComponent",

  props: {
    renderTerm: [Number, Boolean],
  },
};
</script>
