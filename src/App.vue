<style>
@import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>
<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import Navbar from './components/navbar.vue';

const path = useRoute().path;

// watch(path,)

console.log(!path.includes('emp'))


</script>

<template>
  <Navbar />

  <section>
    <router-view />
  </section>
</template>
