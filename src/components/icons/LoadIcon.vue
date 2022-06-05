<template>
  <div class="flex items-center h-full">
    <svg
      class="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-40"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
      ></circle>
      <path
        class="opacity-80"
        stroke="currentColor"
        stroke-width="2"
        d="M4.85857 5C3.09032 6.80375 2 9.27455 2 12C2 17.5228 6.47715 22 12 22"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "LoadIcon",
};
</script>
