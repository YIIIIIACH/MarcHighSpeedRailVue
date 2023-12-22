<template>
    <div class="user-profile">
        <h3>個人資訊</h3>
        <form @submit.prevent="submitForm">
            <div class="form-row">
                <label for="name">姓名:</label>
                <input type="text" id="name" v-model="user.name">
            </div>
            <div class="form-row">
                <label for="password">密碼:</label>
                <input type="password" id="password" v-model="user.password">
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

          <div class="form-row">
                <button type="submit">Save</button>
            </div>
        </form>
    </div>
</template>  
  
<script>
import axios from "axios";
import {useToken} from "@/composables/useToken";

export default {
    name: 'UserProfile',
    data() {
        return {
            user: {
                name: '',
                password: '',
                email: '',
                phone: ''
            },
          errorMessage: ''
        };
    },
   created() {
    console.log('Value of val is:created ');
     useToken.checkToken();
         // .then(response=>{
         //
         //     }
         // )
  },
    methods: {
          async submitForm() {
            try {

              const response = await axios.post('/member/profile', this.user);
              console.log('Response:', response.data);
              if (response.data.success) {
                this.$router.push('/profile');
              }
            } catch (error) {
              console.error('Error:', error.response);
              this.errorMessage = '輸入錯誤';
              // 處理錯誤，例如顯示錯誤訊息
            }
        },
        edit(field) {
            // 處理特定欄位的修改
            console.log(`Modify ${field}`);
        }
    },
    props:['memberId'],
    emits: ['updateMemberId'],
}
</script>
  
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

button[type="submit"] {
    width: calc(100% - 10px);
    /* 按鈕寬度與輸入框相同 */
    background-color: #ffb700;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}

button[type="submit"]:hover {
    background-color: #ffb700;
    /* 鼠標懸停時的背景顏色 */
}

.error-message {
  color: red;
  font-size: 14px;
}
</style>
