<template>
  <button
    class="leading-10 border-x border-y border-black rounded-lg hover:text-primary hover:border-primary disabled:text-gray-dark disabled:border-gray-dark disabled:hover:text-gray-dark disabled:hover:border-gray-dark"
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
