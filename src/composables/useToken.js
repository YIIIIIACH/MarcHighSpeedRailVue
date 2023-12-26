import axios from "axios";

export function useToken() {
      function checkToken() {
         // const token = app.config.globalProperties.$cookies.get('token');
         if (!$cookies.isKey('token')) {
             return;
         }
         const token = $cookies.get('token')
         console.log('token =' + token)
// 如果Token存在
         console.log('Token存在')
         try {
             console.log("submitLogin");
             const response =  axios.post('/member/tokenlogin', {
                 login_token: this.login_token
             }, {
                 headers: {
                     'Content-Type': 'application/json'
                 }
             });
             console.log('tokenlogin data' + JSON.stringify(response.data))
             if (response.data === null) {
                 console.log('tokenlogin=null')
             } else {
                 // 處理成功的響應數據
                 console.log('tokenlogin success')
                 // 創建cookie並將回傳值放進cookie
                 // this.$cookies.set('token', response.login_token, 60 * 60 * 24 * 3)
             }
         } catch (error) {
             console.error(error);
             this.loginError = true; // 處理錯誤
         }

     }
    return{
        checkToken
    }

// // 在應用啟動時檢查Token
//     checkToken();
//
// // 使用Vue Router導航守衛在每次路由變更時檢查Token
//     router.beforeEach((to, from, next) => {
//         checkToken();
//         next();
//     });
}