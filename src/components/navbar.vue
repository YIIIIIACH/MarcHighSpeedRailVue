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
            <router-link class="nav-link" id="fontcolor" to="/"
              >home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/lostItem" class="nav-link" id="fontcolor"
              >遺失物搜尋</router-link
            >
          </li>
          <li class="nav-item dropdown">
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

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="shoppingDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              shopping
            </a>
            <div class="dropdown-menu" aria-labelledby="shoppingDropdown">
              <router-link to="/goods" class="dropdown-item" id="fontcolor"
                >購物中心</router-link
              >
              <router-link
                :to="{ name: 'shoppingCart', params: { memberId: memberId } }"
                class="dropdown-item"
                id="fontcolor"
                >我的購物車</router-link
              >
            </div>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link" id="fontcolor"
              >會員登入</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link" id="fontcolor"
              >會員註冊</router-link
            >
          </li>
        </ul>
        <form class="d-flex">
          <input class="form-control me-2" type="text" placeholder="Search" />
          <button class="btn btn-primary" type="button">Search</button>
        </form>
      </div>
    </div>
  </nav>
  <section>
    <router-view
      @updateMemberId="
        (newId) => {
          updateMemberId(newId);
        }
      "
      :memberId="memberId"
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
</style>
