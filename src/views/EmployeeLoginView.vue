<script setup>
import { ref } from 'vue'
import httpClient from "@/main";
// console.log(sessionUser)

// const username = ref("");
// const pwd = ref("");
// const result = ref("");
// const loginUser = ref("");

// function postUserInput() {
//   httpClient
//     .post("/api/users/login", {
//       username: username.value,
//       pwd: pwd.value,
//     })
//     .then(function (response) {
//       console.log(response);
//       result.value = response.data;
//       clearInput();
//     })
//     .then(function (res) {
//       getSessionUser();
//       //   httpClient.get("/api/users/map").then(function (res) {
//       //     loginUser.value = res.data.userName;
//       //     console.log("res: " + res);
//       //   });
//     })
//     .catch(function (err) {
//       console.log(err);
//       result.value = err.response.data;
//       clearInput();
//     });
// }

// function clearInput() {
//   username.value = "";
//   pwd.value = "";
// }

// async function getSessionUser() {
//   loginUser.value = sessionUser();

//   sessionUser().then((sessionUser) => {
//     console.log(sessionUser);
//     loginUser.value = sessionUser;
//   });

// }
</script>

<template>
    <div class="row justify-content-center">
    <div class="col-10 col-md-6">
      <div class="card">
        <div class="card-header">登入</div>
        <div class="card-body">
          <div id="user-input">
            <div class="input-group">
              <label for="staticEmail" class="col-sm-1 col-form-label">帳號</label>
              <input class="form-control" name="username" v-model.trim="username" />
            </div>
            <br />
            <div class="input-group">
              <label for="staticEmail" class="col-sm-1 col-form-label">密碼</label>
              <input
                class="form-control"
                name="password"
                v-model.trim="pwd"
                type="password"
              />
            </div>
            <br />
            <button @click="postUserInput" class="btn btn-primary mb-2">送出</button>
          </div>
        </div>
      </div>

      <div id="result">{{ result }}</div>

      <div id="loginUser">{{ loginUser }}</div>
    </div>
  </div>
</template>