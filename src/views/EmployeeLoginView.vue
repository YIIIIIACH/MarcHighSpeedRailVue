<script setup>
import { ref } from 'vue'
import httpClient from "@/main";
import { useRouter } from "vue-router";


const account = ref("");
const psw = ref("");
const result = ref("");
const loginUser = ref("");

const router = useRouter();


function postUserInput() {
  console.log(account.value)
  console.log(psw.value)
  httpClient
    .post("/employee/login", null, {
      // acc:account.value,
      // psw:psw.value
      params: {
        // empAccount:"789",
        empAccount: account.value,
        psw: psw.value
      }
    })
    .then(function (response) {
      console.log(response);
      result.value = response.data;
      clearInput();
    })
    .then(function (res) {
      httpClient.get("/employee/dto").then(function (res) {
        loginUser.value = res.data.empName;
        console.log("res: " + res);
        sessionStorage.setItem("empLoggedIn", "true")
        router.push("/emp/index");
      });
    })
    .catch(function (err) {
      console.log(err);
      result.value = err.response.data;
      clearInput();
    });
}

function clearInput() {
  account.value = "";
  psw.value = "";
}

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
              <input class="form-control" name="account" v-model.trim="account" />
            </div>
            <br />
            <div class="input-group">
              <label for="staticEmail" class="col-sm-1 col-form-label">密碼</label>
              <input class="form-control" name="password" v-model.trim="psw" type="password" />
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