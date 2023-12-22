<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      loginError: false // 新增用於追蹤登入錯誤的屬性
    };
  },
  methods: {
    async submitLogin() {
      try {
        console.log("submitLogin");
        const response = await axios.post('/member/signin', {
          email: this.email,
          password: this.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        // console.log('data' + JSON.stringify(response.data))
        if (response.data === null) {
          this.loginError = true; // 如果回傳值為null，設置loginError為true
        } else {
          // 處理成功的響應數據
          this.loginError = false;
          // 創建cookie並將回傳值放進cookie
          this.$cookies.set('token',response.login_token,60 * 60 * 24 * 3)
          this.$router.push('/profile');
        }
      } catch (error) {
        console.error(error);
        this.loginError = true; // 處理錯誤
      }

      console.log('Login attempt with:', this.email, this.password);
      // 重置表單字段
      this.email = '';
      this.password = '';
    }
  },
  props:['memberId'],
  emits: ['updateMemberId'],
};
</script>
<template>
  <div class="login-page">
    <div class="login-container">
      <img src="@/assets/taiwan-high-speed-rail-logo.png" alt="Taiwan High Speed Rail Logo" class="logo">
      <div class="login-form">
        <h3>會員登入</h3>
        <input type="email" placeholder="帳號" v-model="email" class="input-field" />
        <input type="password" placeholder="密碼" v-model="password" class="input-field" />
        <div v-if="loginError" class="error-message">帳號或密碼錯誤</div> <!-- 新增錯誤訊息顯示 -->
        <button @click="submitLogin" class="login-btn">登入</button>
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

</style>
