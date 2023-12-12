<template>
    <div class="container">
      <h5 class="title">會員註冊</h5>
      <form @submit.prevent="submitForm" class="form">
        <div class="input-group">
          <label for="name">姓名:</label>
          <input type="text" id="name" v-model="form.name">
        </div>
        <div class="input-group">
          <label for="password">密碼:</label>
          <input type="password" id="password" v-model="form.password">
        </div>
        <div class="input-group">
          <label for="email">信箱:</label>
          <input type="email" id="email" v-model="form.email">
        </div>
        <div class="input-group">
          <label for="phone">電話:</label>
          <input type="tel" id="phone" v-model="form.phone">
        </div>
        <button type="submit" class="submit-button">註冊</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const form = ref({
        name: '',
        password: '',
        email: '',
        phone: ''
      });
  
      function submitForm() {
        console.log(form.value);
      }
  
      return {
        form,
        submitForm
      };
    },
    props:['memberId'],
    emits: ['updateMemberId'],
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  
  .title {
    margin-bottom: 20px;
  }
  
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 28%;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  input {
    border: none;
    border-bottom: 1px solid grey;
    padding: 5px;
    text-align: center;
    width: 100%;
  }
  
  input:focus {
    outline: none;
    border-bottom: 2px solid blue;
  }
  
  .submit-button {
    width: 100%;
    padding: 10px;
    background-color: #ffb700;
    color: white;
    border: none;
    margin-top: 15px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .submit-button:hover {
    background-color: #ffb700;
  }
  </style>
  