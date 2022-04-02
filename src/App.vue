<template>
  <nav class="absolute right-0 z-[500]">
    <router-link to="/">Home</router-link> |
    <router-link to="map">Map</router-link>
  </nav>
  <router-view />
</template>

<style>
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
