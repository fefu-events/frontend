<template>
  <div class="rounded-full overflow-hidden">
    <img :src="defaultAvatar" alt="" />
  </div>
</template>

<script>
import DefaultAvatar from "@/assets/img/svg/defaut_avatar.svg";

export default {
  name: "AvatarIcon",

  data() {
    return {
      defaultAvatar: DefaultAvatar,
    };
  },
};
</script>
