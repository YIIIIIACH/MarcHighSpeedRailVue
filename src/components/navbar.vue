<script setup>
</script>

<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="javascript:void(0)"
        >Taiwan High Speed Rail</a
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mynavbar"
      >
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
            <router-link to="/searchSchedule" class="nav-link"
              >搜尋高鐵班次</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/booking" class="nav-link">高鐵訂票</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/goods" class="nav-link">shopping</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/emp/login" class="nav-link">employee</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">會員登入</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link">會員註冊</router-link>
          </li>
        </ul>
        <form class="d-flex">
          <input class="form-control me-2" type="text" placeholder="Search" />
          <button class="btn btn-primary" type="button">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>
<style>
.navbar-nav .nav-link.active,
.navbar-nav .nav-link.show {
  color: #00fffb;
}
.nav-link {
  color: rgb(8, 201, 130);
}
a:visited {
  text-decoration: none;
  color: rgb(8, 201, 130);
}
.navbar-nav {
  --bs-nav-link-hover-color: rgb(0, 255, 162);
}
.dropdown-menu.show {
  background-color: rgb(34, 37, 41);
  color: rgb(123, 123, 123);
}
.dropdown-menu {
  --bs-dropdown-link-hover-color: #ffd500;
  --bs-dropdown-link-hover-bg: rgb(34, 37, 41);
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
</style>
