<template>
  <div class="login-page">
    <div class="login-container">
      <img src="@/assets/taiwan-high-speed-rail-logo.png" alt="Taiwan High Speed Rail Logo" class="logo">
      <div class="login-form">
        <h3>會員登入</h3>
        <input type="text" placeholder="帳號" v-model="username" class="input-field" />
        <input type="password" placeholder="密碼" v-model="password" class="input-field" />
        <button @click="submitLogin" class="login-btn">登入</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async submitLogin() {
      try {
        console.log(response.data);
        const response = await axios.post('/login', {
          username: this.username,
          password: this.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          this.$router.push('/profile');
        } else {
          // 處理登入失敗

        }
        // 處理響應數據
      } catch (error) {
        console.error(error);
        // 處理錯誤
      }

      console.log('Login attempt with:', this.username, this.password);
      // 重置表單字段
      this.username = '';
      this.password = '';
    }
  }
};
</script>

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
</style>
