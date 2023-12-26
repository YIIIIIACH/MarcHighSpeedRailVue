<script setup>
import {ref, onMounted, inject} from 'vue'
import {Base64} from 'js-base64'
import {useRouter} from 'vue-router'
import httpClient from '@/main'
const $cookies = inject('$cookies');

const router = useRouter()

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

        // console.log('Response:' + JSON.stringify(response.data));
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

    // console.log('Response:'+ JSON.stringify(response.data));

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
    <h3>填入資訊</h3>
    <form>
      <div class="input-wrapper">
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
      </div>
    </form>
    <div class="terms-box">
      <h4>會員條款</h4>
      <div class="terms-content">
        <p>在您註冊成為本網站會員之前，請仔細閱讀以下條款：</p>
        <ul>
          <li>您確認在註冊過程中提供的信息是真實和準確的。</li>
          <li>您同意不會傳播任何非法或有害的內容。</li>
          <li>您同意遵守本網站的所有規則和政策。</li>
          <!-- 更多條款... -->
        </ul>
        <p>繼續使用本網站表示您接受以上條款。</p>
      </div>
    </div>
    <button type="button" class="submit-button" @click="submitInfo">註冊</button>
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
  width: 100%; /* 原為50%，增加至75%以加寬50% */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
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

.input-wrapper {
  width: 500px;
  border: 1px solid #ccc; /* 外框邊框 */
  padding: 20px; /* 內部間距 */
  border-radius: 5px; /* 圓角邊框 */
  margin-bottom: 20px; /* 與下方元素的間距 */
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

.terms-box {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
}

.terms-content {
  height: 150px; /* 或根據需要調整 */
  overflow-y: scroll; /* 啟用垂直捲動條 */
  padding-right: 5px; /* 為捲動條留出空間 */
  border: 1px solid #ddd; /* 給內容框一個辨識度 */
}
</style>
