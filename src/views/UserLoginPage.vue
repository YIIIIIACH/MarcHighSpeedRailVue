<script setup>

import {Base64} from 'js-base64'
import {inject, onMounted, ref} from "vue";
import router from "@/router";
import httpClient from '@/main';
const $cookies = inject('$cookies');
const errorMessage = ref('');

onMounted(() => {
  console.log("start login");
  if ($cookies.isKey('token')) {
    if ($cookies.isKey('info')) {
      console.log("cookie in alive")
      router.push("/profile")
    }
  }
})

const user = ref({
  email: '',
  password: ''
});

async function submitLogin() {
  try {
    let loginPost = {
      email: user.value.email,
      password: user.value.password
    }
    console.log("submitLogin");
    // console.log('Login attempt with:', this.email, this.password);
    const response = await httpClient.post('/member/signin', loginPost);
    // console.log('data ' + JSON.stringify(response.data))
    if (response.data === null) {
      errorMessage.value = "帳號或密碼錯誤";
    } else {
      console.log("login success");
      // 處理成功的響應數據
      errorMessage.value = "登入成功";
      // 創建cookie並將回傳值放進cookie
      $cookies.set('token', response.data.login_token, 60 * 60 * 24 * 3)
      //memberInfo base64後儲存
      $cookies.set('info', Base64.encode(JSON.stringify(response.data)), 60 * 60 * 24 * 3)
      await router.push('/profile');
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "帳號或密碼錯誤"; // 處理錯誤
  }
}


</script>
<template>
  <div class="login-page">
    <div class="login-container">
      <img src="@/assets/taiwan-high-speed-rail-logo.png" alt="Taiwan High Speed Rail Logo" class="logo">
      <div class="login-form">
        <h3>會員登入</h3>
        <input type="email" placeholder="帳號" id="email" v-model="user.email"/>
        <input type="password" placeholder="密碼" id="password" v-model="user.password"/>
        <div class="form-row">
          <!-- 錯誤訊息顯示區域 -->
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
        <button type="button" @click="submitLogin" class="login-btn">登入</button>
        <div class="register-a"><a href="/register">還沒有帳號請點此註冊</a></div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  text-align: center;
  padding: 20px;
  max-width: 400px;
}


.logo {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.login-form input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-form button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #ffb700;
  color: white;
  cursor: pointer;
}

.login-form button:hover {
  background-color: #ffb700;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.register-a {
  margin-top: 30px;
}
</style>
