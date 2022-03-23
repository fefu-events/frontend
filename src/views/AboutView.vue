<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Disclosure>
      <div class="flex flex-col">
        <label
          class="inline-flex items-center w-min my-2 cursor-pointer"
          for="education"
        >
          <input
            class="form-checkbox w-5 h-5 rounded focus:ring-offset-0"
            type="checkbox"
            id="education"
            value="Education"
            v-model="checkedCategories"
          />
          <span class="ml-2">Образование</span>
        </label>
        <label
          class="inline-flex items-center w-min my-2 cursor-pointer"
          for="fun"
        >
          <input
            class="form-checkbox w-5 h-5 rounded focus:ring-offset-0"
            type="checkbox"
            id="fun"
            value="Fun"
            v-model="checkedCategories"
          />
          <span class="ml-2">Развлечения</span>
        </label>
        <label
          class="inline-flex items-center w-min my-2 cursor-pointer"
          for="sport"
        >
          <input
            class="form-checkbox w-5 h-5 rounded focus:ring-offset-0"
            type="checkbox"
            id="sport"
            value="Sport"
            v-model="checkedCategories"
          />
          <span class="ml-2">Спорт</span>
        </label>
        <label
          class="inline-flex items-center w-min my-2 cursor-pointer"
          for="official"
        >
          <input
            class="form-checkbox w-5 h-5 rounded focus:ring-offset-0"
            type="checkbox"
            id="official"
            value="Official"
            v-model="checkedCategories"
          />
          <span class="ml-2">Официальные</span>
        </label>
        <label
          class="inline-flex items-center w-min my-2 cursor-pointer"
          for="others"
        >
          <input
            class="form-checkbox w-5 h-5 rounded focus:ring-offset-0"
            type="checkbox"
            id="others"
            value="Others"
            v-model="checkedCategories"
          />
          <span class="ml-2">Другое</span>
        </label>
      </div>
    </Disclosure>
    <Combobox />
  </div>
</template>

<script>
import Disclosure from "@/components/Disclosure.vue";
import Combobox from "@/components/Combobox.vue";

export default {
  name: "AboutView",
  components: {
    Disclosure,
    Combobox,
  },
  data() {
    return {
      checkedCategories: [],
    };
  },
};
</script>
