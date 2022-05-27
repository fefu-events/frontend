<template>
  <img :src="iconByCategoryID" alt="" />
</template>

<script>
import EduIcon from "@/assets/img/svg/category_edu_icon.svg";
import FunIcon from "@/assets/img/svg/category_fun_icon.svg";
import OfficialIcon from "@/assets/img/svg/category_official_icon.svg";
import OthersIcon from "@/assets/img/svg/category_others_icon.svg";
import SportIcon from "@/assets/img/svg/category_sport_icon.svg";

export default {
  name: "CategoryIcon",

  props: {
    categoryID: Number,
  },

  data() {
    return {
      icon: "",
      categories: [
        {
          id: 1,
          icon: OfficialIcon,
        },
        {
          id: 2,
          icon: EduIcon,
        },
        {
          id: 3,
          icon: FunIcon,
        },
        {
          id: 4,
          icon: SportIcon,
        },
        {
          id: 5,
          icon: OthersIcon,
        },
      ],
    };
  },

  computed: {
    iconByCategoryID() {
      for (const category of this.categories) {
        if (category.id == this.categoryID) {
          return category.icon;
        }
      }
      return "";
    },
  },
};
</script>
