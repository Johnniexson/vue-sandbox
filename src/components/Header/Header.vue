<template>
  <div class="header">
    <ul class="header__navigation">
      <li class="header__navigation-item">
        <router-link to="/" class="header__navigation-item-link"
          >Home</router-link
        >
      </li>
    </ul>
  </div>
</template>
<style lang="scss">
@import "./Header.scss";
</style>
<script>
export default {
  name: "Header",
};
</script>
