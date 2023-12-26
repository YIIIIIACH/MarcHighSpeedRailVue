<script setup>
import {ref, onMounted, inject} from 'vue'
import {Base64} from 'js-base64'
import {useRouter, useRoute} from 'vue-router'
import httpClient from '@/main'
const $cookies = inject('$cookies');

const router = useRouter()
const route = useRoute()
// 響應式引用
const user = ref({
  password:'',
  password2:'',
  name: '',
  email: '',
  phone: ''
})
const errorMessage = ref('');


onMounted(async () => {
  console.log("77777");
  if ($cookies.isKey('info')) {
    let getInfo = $cookies.get("info");
    if (getInfo !== "") {
      let memberInfo = JSON.parse(Base64.decode(getInfo));
      console.log(Base64.decode(getInfo));
      try {
        const response = await httpClient.post('/member/tokenlogin', {login_token: memberInfo.login_token});
        console.log('Response:' + JSON.stringify(response.data));
        if (response.data !== null) {
          await router.push("/profile")
        }
      }catch (error){
        console.log("error")
      }
    }
  }

});

async function submitInfo() {
  try {
    if (user.value.name===""){
      errorMessage.value='名稱不得為空'
      return;
    }
    if (user.value.password!==user.value.password2){
      errorMessage.value='密碼不相同'
      return;
    }
    if (user.value.password===""){
      errorMessage.value='密碼不得為空'
      return;
    }
    if (user.value.email===""){
      errorMessage.value='信箱不得為空'
      return;
    }
    if (user.value.phone===""){
      errorMessage.value='電話不得為空'
      return;
    }
    let registerPost = {
      member_password: user.value.password,
      member_name: user.value.name,
      member_email: user.value.email,
      member_phone:user.value.phone
    }
    const response = await httpClient.post('/member/register', registerPost);
    console.log('Response:'+ JSON.stringify(response.data));

    if (response.data !== null) {
      errorMessage.value = '註冊成功';
      await router.push('/login');
    }else {
      errorMessage.value='註冊失敗'
    }
  } catch (error) {
    console.log('Error:' + error);
    errorMessage.value = '錯誤'; // 更新錯誤訊息
  }
}

</script>

<template>
  <div class="user-profile">
    <h3>個人資訊</h3>
    <form>
      <div class="form-row">
        <label for="name">姓名:</label>
        <input type="text" id="name" v-model="user.name">
      </div>
      <div class="form-row">
        <label for="password">密碼:</label>
        <input type="password" id="password" v-model="user.password">
      </div>
      <div class="form-row">
        <label for="password2">再次輸入密碼:</label>
        <input type="password" id="password2" v-model="user.password2">
      </div>
      <div class="form-row">
        <label for="email">信箱:</label>
        <input type="email" id="email" v-model="user.email">
      </div>
      <div class="form-row">
        <label for="phone">電話:</label>
        <input type="tel" id="phone" v-model="user.phone">
      </div>
      <div class="form-row">
        <!-- 錯誤訊息顯示區域 -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <button type="button" class="submit-button" @click="submitInfo">註冊</button>
    </form>
  </div>
</template>


<style scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平置中 */
  justify-content: center; /* 垂直置中 */
  height: 100vh;
  width: 100%; /* 確保佔滿整個螢幕寬度 */
}

h3 {
  font-size: 24px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center; /* 保持元素在form內部居中 */
  justify-content: center;
  width: 50%; /* 可根據需要調整表單的寬度 */
}

.form-row {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
}

input {
  width: calc(100% - 10px);
  background-color: transparent;
  border: none;
  border-bottom: 1px solid grey;
  outline: none;
  padding: 5px;
}

input:focus {
  border-bottom: 2px solid darkgrey;
}

.submit-button {
  background-color: #ffb700;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: #ff8000;
  /* 鼠標懸停時的背景顏色 */
}

label {
  margin-bottom: 5px;
}


.error-message {
  color: red;
  font-size: 14px;
}

</style>
