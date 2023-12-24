<script setup>
import axios from "axios";
import {ref, onMounted, inject} from 'vue'
import {Base64} from 'js-base64'
import { useRouter, useRoute } from 'vue-router'
const $cookies = inject('$cookies');

const router = useRouter()
const route = useRoute()
// 響應式引用
const user = ref({
  name: '',
  email: '',
  phone: ''
})
const errorMessage = ref('');


onMounted( () => {
  console.log("77777");
  if ($cookies.isKey('info')){
    let getInfo = $cookies.get("info");
    if (getInfo!==""){
      let memberInfo = JSON.parse(Base64.decode(getInfo));
      user.value.name=memberInfo.member_name;
      user.value.email=memberInfo.member_email;
      user.value.phone=memberInfo.member_phone;
    }
  }

});

//   const usetoken = ref(null);
// try {
//   const myToken = this.$cookies.get('token')
//   const postData = {
//     // 這裡填入您想要發送給後端的資料，例如用戶ID或其他查詢參數
//     login_token: myToken
//   };
//
//   const response = await axios.post('/api/member/tokenlogin', postData);
//   user.value = response.data; // 假設返回的數據結構與user物件匹配
//   console.log(JSON.stringify(user))
// } catch (error) {
//   console.error('Error fetching user data:', error);
//   errorMessage.value = '無法加載用戶資料';
// }
// useToken.value.checkToken();
// console.log("profile"+JSON.stringify(app.config.globalProperties.$memberInfo))


// 提交表單
function logout() {
  try {
    const response = axios.post('/api/member/signout', user.value);

    console.log('Response:', response.data);
    if (response.data.success) {
      $cookies.remove("token");
      router.push('/profile');
    }
  } catch (error) {
    console.error('Error:', error.response);
    errorMessage.value = '錯誤'; // 更新錯誤訊息
  }
}

function pwd() {
  router.push('/pwd');
}

function deleteInfo() {
  try {
    const getToken = $cookies.get("token")
    const response = axios.post('/api/member/removeUser', getToken);
    console.log('Response:', response.data);

    if (!response.data==null) {
     $cookies.remove("token");
      router.push('/login');
    }
  } catch (error) {
    console.error('Error:', error.response);
    errorMessage.value = '錯誤'; // 更新錯誤訊息
  }
}

function edit() {
  try {
    const response = axios.post('/api/member/edit', user.value);
    console.log('Response:', response.data);

    if (!response.data == null) {
      router.push('/profile');
    }
  } catch (error) {
    console.error('Error:', error.response);
    errorMessage.value = '輸入錯誤'; // 更新錯誤訊息
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

      <button class="save-button" @click="edit">更改資訊</button>
      <button class="pwd-button" @click="pwd">變更密碼</button>
      <button class="logout-button" @click="logout">登出</button>
      <button class="delete-button" @click="deleteInfo">刪除帳號</button>
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

label {
  margin-bottom: 5px;
}

.save-button {
  background-color: #ffb700;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.save-button:hover {
  background-color: #ff8000;
  /* 鼠標懸停時的背景顏色 */
}

.pwd-button {
  background-color: #ffb700;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.pwd-button:hover {
  background-color: #ff8000;
  /* 鼠標懸停時的背景顏色 */
}

.error-message {
  color: red;
  font-size: 14px;
}

.logout-button {
  background-color: #ffb700;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.logout-button:hover {
  background-color: #ff8000;
}


.delete-button {
  background-color: #ffb700;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>
