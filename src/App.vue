<style>
@import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>
<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import Navbar from "./components/navbar.vue";
import { ref, onMounted } from "vue";
import router from "../src/router/index";
const path = useRoute().path;

console.log(!path.includes("emp"));
const mId = ref("undefined");
function updatemId(newId) {
  mId.value = newId;
}
</script>
<template>
  <a class="navbar-brand" @click="router.push('/')" id="navLogo"></a>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark" style="height: 100px;">
    <div style="float:left;overflow: visible;margin-top:95px" >
      <router-link :to="{name: '/'}"><img src="@\assets\IndexLogo.png"/></router-link>
    </div>
    <div class="container-fluid">
      <div class="collapse navbar-collapse" >
        <ul class="navbar-nav me-auto" id="mynavbar">
          <!-- <li class="nav-item" id="navLogo">
            <router-link class="nav-link" id="fontcolor" to="/"> </router-link>
          </li> -->
          <li class="nav-item " style="overflow: visible;">
            <router-link to="/lostItem" class="nav-link" id="fontcolor"
              >遺失物搜尋</router-link
            >
          </li>
          <li class="nav-item dropdown " style="overflow: visible;">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="shoppingDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              訂票系統
            </a>
            <div class="dropdown-menu" aria-labelledby="shoppingDropdown">
              <router-link to="/searchSchedule" class="nav-link" id="fontcolor"
                >搜尋班次</router-link
              >
              <router-link to="/booking" class="nav-link" id="fontcolor"
                >高鐵訂票</router-link
              >
              <router-link to="/ticketOrder" class="nav-link" id="fontcolor"
                >會員訂票</router-link
              >
            </div>
          </li>
          <!-- <li class="nav-item">
            <router-link to="/goods" class="nav-link">shopping</router-link>
          </li> -->

          <li class="nav-item dropdown" style="overflow: visible;">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="shoppingDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              禮品商店
            </a>
            <div class="dropdown-menu" aria-labelledby="shoppingDropdown">
              <router-link to="/goods" class="dropdown-item" id="fontcolor">
                購物中心
              </router-link>
              <router-link
                to="/shoppingCart"
                class="dropdown-item"
                id="fontcolor"
              >
                我的購物車
              </router-link>
              <router-link to="/watchList" class="dropdown-item" id="fontcolor">
                追蹤清單
              </router-link>
              <router-link
                to="/shoppingHistory"
                class="dropdown-item"
                id="fontcolor"
              >
                訂購紀錄
              </router-link>
            </div>
          </li>
          <li class="nav-item" style="overflow: visible;">
            <router-link to="/login" class="nav-link" id="fontcolor"
              >會員登入</router-link
            >
          </li>
          <li class="nav-item " style="overflow: visible;">
            <router-link to="/register" class="nav-link" id="fontcolor"
              >會員註冊</router-link
            >
          </li>
        </ul>
        <!-- <form class="d-flex">
          <input class="form-control me-2" type="text" placeholder="Search" />
          <button class="btn btn-primary" type="button">Search</button>
        </form> -->
      </div>
    </div>
  </nav>
  <section>
    <router-view
      @updateMemberId="
        (newId) => {
          updatemId(newId);
        }
      "
      :memberId="mId"
    ></router-view>
  </section>
</template>

<style>
.navbar-nav .nav-link.active,
.navbar-nav .nav-link.show {
  color: #00fffb;
}
.nav-link {
  color: rgb(8, 201, 130);
}
#fontcolor {
  color: rgb(8, 201, 130);
}
#fontcolor:hover {
  color: rgb(0, 255, 195);
}
a:visited {
  text-decoration: none;
  color: rgb(0, 0, 0);
}
.navbar-nav {
  --bs-nav-link-hover-color: rgb(0, 255, 195);
}
.dropdown-menu.show {
  background-color: rgb(34, 37, 41);
  color: rgb(123, 123, 123);
}
.dropdown-menu {
  --bs-dropdown-link-hover-color: #ffd500;
  --bs-dropdown-link-hover-bg: rgb(34, 37, 41);
}
.dropdown-item {
  color: rgb(8, 201, 130);
}
.fade-enter-active,
.face-leave-active {
  transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

#navLogo img {
  margin-top: -15px;
  margin-left: -20px;
  float: left;
}

#mynavbar {
  float: left;
}

.navbar-nav {
  flex-grow: 1; /* 讓 navbar-nav 充滿剩餘的空間 */
}
</style>
