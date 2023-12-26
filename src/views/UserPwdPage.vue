<script setup>
import {ref, onMounted, inject} from 'vue'
import {Base64} from 'js-base64'
import {useRouter} from 'vue-router'
import httpClient from '@/main'

const $cookies = inject('$cookies');

const router = useRouter()

// 響應式引用
const user = ref({
  password: '',
  new_password: '',
  new_password2: ''
})
const errorMessage = ref('');


onMounted(() => {
  console.log("start pwd");
  if (!$cookies.isKey('info')) {
    console.log("no cookie")
    router.push("/login")
    return;
  }
  let getInfo = $cookies.get("info");
  if (getInfo === "") {
    console.log("no cookie")
    router.push("/login")
  }
});


// 提交表單

async function edit() {
  try {
    if (user.value.new_password !== user.value.new_password2) {
      errorMessage.value="新密碼不相等"
    }
    if (!$cookies.isKey('info')) {
      //登入不存在
      console.log("info not find")
      await router.push("/login")

      return;
    }
    let getInfo = $cookies.get("info");
    if (getInfo === "") {
      console.log("info not find 2")
      await router.push("/login")
      return;
    }

    let memberInfo = JSON.parse(Base64.decode(getInfo));
    console.log("try pwdEdit" + memberInfo.member_id);

    let pwdPost = {
      member_id: memberInfo.member_id,
      curent_password: user.value.password,
      new_password: user.value.new_password,
      mode: 0
    }

    // console.log('Response:', response.data);

    const response = await httpClient.post('/member/editpwd', pwdPost);
    // console.log('Response:', response.data);


    if (response.data !== null) {
      errorMessage.value = '變更成功';
      await router.push('/profile');
    } else {
      errorMessage.value = '輸入錯誤'; // 更新錯誤訊息
    }
  } catch (error) {
    console.log('Error:', error);
    errorMessage.value = '輸入錯誤'; // 更新錯誤訊息
  }
}

</script>

<template>
  <div class="user-profile">
    <h3>修改密碼</h3>
    <form>

      <div class="form-row">
        <label for="password">現在密碼:</label>
        <input type="password" id="password" v-model="user.password">
      </div>
      <div class="form-row">
        <label for="new_password">新密碼:</label>
        <input type="password" id="new_password" v-model="user.new_password">
      </div>
      <div class="form-row">
        <label for="new_password2">確認密碼:</label>
        <input type="password" id="new_password2" v-model="user.new_password2">
      </div>
      <div class="form-row">
        <!-- 錯誤訊息顯示區域 -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <button type="button" class="save-button" @click="edit">更改密碼</button>

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

.error-message {
  color: red;
  font-size: 14px;
}

</style>
