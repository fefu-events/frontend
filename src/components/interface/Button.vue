<template>
  <button
    class="leading-10 my-3 border-x border-y border-black rounded-lg hover:text-primary hover:border-primary"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: "ButtonComponent",
  components: {},
};
</script>
