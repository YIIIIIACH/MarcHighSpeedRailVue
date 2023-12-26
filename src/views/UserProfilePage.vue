<script setup>
import {ref, onMounted, inject} from 'vue'
import {Base64} from 'js-base64'
import {useRouter} from 'vue-router'
import httpClient from '@/main'

const $cookies = inject('$cookies');

const router = useRouter()
// 響應式引用
const user = ref({
  id: '',
  name: '',
  email: '',
  phone: ''
})
const errorMessage = ref('');


onMounted(() => {
  console.log("start profile");
  if (!$cookies.isKey('info')) {
    console.log("no cookie")
    router.push("/login")
    return;
  }
  let getInfo = $cookies.get("info");
  if (getInfo === "") {
    console.log("no cookie")
    router.push("/login")
    return;
  }
  let memberInfo = JSON.parse(Base64.decode(getInfo));
  user.value.id = memberInfo.member_id;
  user.value.name = memberInfo.member_name;
  user.value.email = memberInfo.member_email;
  user.value.phone = memberInfo.member_phone;
});


async function logout() {
  try {
    const myToken = $cookies.get('token')

    // console.log('Response:' + JSON.stringify(response.data));
    const response = await httpClient.post('/member/signout', {login_token: myToken});
    console.log('Response:' + JSON.stringify(response.data));

  } catch (error) {
    console.log('Error:' + error);
    errorMessage.value = '錯誤'; // 更新錯誤訊息
  }
  $cookies.remove("info");
  $cookies.remove("token");
  await router.push('/login');

}

function pwd() {
  router.push('/pwd');
}

async function deleteInfo() {
  try {
    let deletePost = {
      member_id: user.value.id,
      member_name: user.value.name,
      member_email: "",
      member_phone: ""
    }

    // console.log('Response:' + JSON.stringify(response.data));
    const response = await httpClient.post('/member/removeUser', deletePost);
    console.log('Response:' + JSON.stringify(response.data));

    if (response.data !== null) {
      $cookies.remove("info");
      $cookies.remove("token");
      await router.push('/login');
    }
  } catch (error) {
    console.log('Error:' + error);
    errorMessage.value = '錯誤'; // 更新錯誤訊息
  }
}

async function edit() {
  try {
    if (user.value.id === "") {
      await router.push("/login")
      return;
    }
    if (user.value.name === "") {
      errorMessage.value = '名稱不得為空'
      return;
    }
    if (user.value.email === "") {
      errorMessage.value = '信箱不得為空'
      return;
    }
    if (user.value.phone === "") {
      errorMessage.value = '電話不得為空'
      return;
    }
    let memberPost = {
      member_id: user.value.id,
      member_name: user.value.name,
      member_email: user.value.email,
      member_phone: user.value.phone
    }

    // console.log('Response:' + JSON.stringify(response.data));

    const response = await httpClient.post('/member/edit', memberPost);
    console.log('Response:' + JSON.stringify(response.data));

    if (response.data !== null) {
      errorMessage.value = "更新成功"
      $cookies.set('info', Base64.encode(JSON.stringify(response.data)), 60 * 60 * 24 * 3)
    }
  } catch (error) {
    console.log('Error:' + error);
    errorMessage.value = '輸入錯誤'; // 更新錯誤訊息
  }
}

</script>

<template>
  <div class="container">
    <div class="content">
      <div class="content2">
        <h3>個人資訊</h3>
        <div class="menu-wrapper">
          <!-- 條列式選單 -->
          <button class="menu-item" @click="pwd">更改密碼</button>
          <button class="menu-item" @click="logout">登出</button>
          <button class="menu-item" @click="deleteInfo">刪除資料</button>
          <!-- 根據需要添加更多按鈕 -->
        </div>
        <div class="user-profile">

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

            <button type="button" class="save-button" @click="edit">更改資訊</button>
            <!--      <button type="button" class="pwd-button" @click="pwd">變更密碼</button>-->
            <!--      <button type="button" class="logout-button" @click="logout">登出</button>-->
            <!--      <button type="button" class="delete-button" @click="deleteInfo">刪除帳號</button>-->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  position: relative; /* 容器相對定位 */
  width: 100%;
  height: 100vh; /* 螢幕高度 */
  display: table; /* 用於垂直置中 */
}

.content {
  position: absolute; /* 內容絕對定位 */
  top: 50%; /* 垂直置中 */
  left: 50%; /* 水平置中 */
  transform: translate(-50%, -50%); /* 使用轉換偏移以精確置中 */
  width: 60%; /* 或你想要的寬度 */
  max-width: 960px; /* 最大寬度，可調整 */
  display: inline-block; /* 使內容成為可置中的塊元素 */
  text-align: left; /* 重設文字對齊為左對齊 */
  border: 1px solid grey; /* 灰色外框 */
  border-radius: 10px;
}

.menu-wrapper {
  background-color: #f0f0f0;
  height: auto;
  display: inline-block; /* 兩個區塊在一行顯示且能設定寬度 */
  vertical-align: top; /* 確保元素頂部對齊 */
  width: 30%; /* 設定寬度為各佔一半 */
}

.user-profile {
  display: inline-block; /* 兩個區塊在一行顯示且能設定寬度 */
  vertical-align: top; /* 確保元素頂部對齊 */
  width: 70%; /* 設定寬度為各佔一半 */
}


h3 {
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center; /* 保持元素在form內部居中 */
  justify-content: center;
}

.form-row {
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
}

input {
  width: calc(100% - 10px); /* Adjust width if necessary due to new border */
  background-color: #fff; /* Optional: change background color */
  border: 1px solid #ccc; /* New border around the entire input */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Optional: inner shadow for depth */
  border-radius: 4px; /* Rounded corners */
  padding: 8px; /* Adjust padding for aesthetics */
  transition: border-color 0.2s; /* Smooth transition for focus effect */
}

input:focus {
  border-color: gray; /* Or any color that fits your design */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(13, 9, 6, 0.6); /* Optional: outer glow */
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

.error-message {
  color: red;
  font-size: 14px;
}


.menu-item {
  padding: 10px 15px; /* 內部間距 */
  text-align: left; /* 文字對齊 */
  border: none; /* 去除邊框 */
  background-color: transparent; /* 透明背景 */
  width: 100%; /* 充滿容器寬度 */
  cursor: pointer; /* 鼠標樣式 */
}

.menu-item:hover {
  background-color: #eaeaea; /* 鼠標懸停背景色 */
}

</style>
