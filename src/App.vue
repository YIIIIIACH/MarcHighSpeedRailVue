<style>
@import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>
<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import Navbar from './components/navbar.vue';
import { ref, onMounted } from 'vue'

const path = useRoute().path;

// watch(path,)

console.log(!path.includes('emp'))

const memberId = ref('123abc')

</script>

<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="javascript:void(0)">Taiwan High Speed Rail</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mynavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/lostItem" class="nav-link">lost</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/searchSchedule" class="nav-link">搜尋班次</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/booking" class="nav-link">高鐵訂票</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link to="/goods" class="nav-link">shopping</router-link>
          </li> -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="shoppingDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            shopping
            </a>
            <div class="dropdown-menu" aria-labelledby="shoppingDropdown">
              <router-link to="/goods" class="dropdown-item">購物中心</router-link>
              <router-link :to="{ name: 'shoppingCart', params: {memberId: memberId} }" class="dropdown-item">我的購物車</router-link>
              <!-- <router-link to="/shoppingCart" class="dropdown-item">我的購物車</router-link> -->
              <!-- <router-link to="/goods/goodsTracking" class="dropdown-item">我的追蹤清單</router-link> -->
            </div>
          </li>
          <li class="nav-item">
            <router-link to="/emp/login" class="nav-link">employee</router-link>
          </li>
        </ul>
        <form class="d-flex">
          <input class="form-control me-2" type="text" placeholder="Search">
          <button class="btn btn-primary" type="button">Search</button>
        </form>
      </div>
    </div>
  </nav>

  <section>
    <router-view />
  </section>
</template>

<style>
.nav-link{
  color: white;
}
</style>
