<script>
    import httpClient from "@/main";
    import { ref, reactive} from "vue";
    export default {
            props:['Id','memberId'],
            emits:['updateMemberId'],
            setup(props) {
                return{
                    product: ref({}),
                    quantity: ref(1),
                    productType: ref(''),
                    recommendProducts: ref([]),
                    
                    account: ref(''),
                    password: ref(''),
                    userName: ref(''),
                    // memberId: ref(props.memberId),
                    passwordVisible:ref(false),
                }            
            },
            computed:{
                getCurrentPwdInputType(){
                    
                    return (this.passwordVisible==true)?'text':'password'
                },
                isLogined(){              
                    return (this.memberId == 'undefined')? false: true;
                },
            },
            
            methods:{
                // 加入購物車
                addItemToShoppingCart(productId, quantity){
                    if(this.memberId == 'undefined'){
                        document.getElementById('login-modal-open-btn').click();
                        return ;
                    }
                    httpClient.post('/ShoppingCart/addProducts?productId=' + productId + '&memberId=' + this.memberId + '&quantity=' + quantity,{},{withCredentials:true})
                    .then((res) =>{
                        alert(res.data)
                    })
                    .catch(err =>{
                        alert(err)
                    })
                },
                decrementQuantity(){
                    if (this.quantity > 1) {
                        this.quantity -= 1;
                    }
                },
                incrementQuantity(){
                    // if(this.quantity < 5){
                        this.quantity += 1;
                    // }
                },
                handleNumberInput(){
                    this.quantity = this.quantity.replace(/\D/g, '');
                },
                login: function(){
                    httpClient.post( '/requestMemberLogin',{
                    "password": this.password,
                    "email": this.account
                    },{withCredentials:true})
                    .then((res)=>{
                        if(res.data.member_id == null){
                            console.log('login failed')
                            return;
                        }
                        console.log(res.data)
                        this.userName= res.data.member_name;
                        // this.memberId = res.data.member_id;

                        this.$emit('updateMemberId', res.data.member_id);
                        document.getElementById('login-modal-close-btn').click();
                        httpClient.get(`/api/product/${this.Id}`)
                        .then((res) =>{
                            //物件用.value
                            //陣列用.push()
                            this.product.value = res.data
                            this.productType = res.data.productType
                        })
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                    
                },
                logout: function(){
                    this.$emit('updateMemberId','undefined')
                    this.userName = ''
                },
            },
            beforeMount() {
                const productId = this.Id
                // httpClient.post('/verifyLoginToken')
                // .then(res=>{      
                //     this.userName = res.data;
                //     console.log(this.userName)
                // })
                // .then(()=>{
                    httpClient.get(`/api/product/${productId}`)
                    .then((res) =>{
                        //物件用.value
                        //陣列用.push()
                        this.product.value = res.data
                        this.productType = res.data.productType
                    })
                    .then(() =>{
                            httpClient.get('/product/findByType?selectType=' + this.productType)
                            .then((res)=>{
                                // console.log(res.data)
                                for(let p of res.data){
                                    this.recommendProducts.push(p)
                                }
                            })
                            .catch((err)=>{
                                console.log(err)
                            })
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                // }).catch(err=>{
                //     console.log('login-token verify failed')
                //     document.getElementById('login-modal-open-btn').click();
                // })
        
            },
    }
</script>

<template>
    <div style="display: flex; justify-content: flex-end;" >
      <button type="button" class="btn btn-outline-primary" @click="logout()" v-if="isLogined">
        登出
      </button>
      <button type="button" id="login-modal-open-btn" class="btn btn-primary login-btn" data-bs-toggle="modal" data-bs-target="#exampleModal"
      v-else>
        登入
      </button>
    </div>
    <div class="product-container">  
        <h1 class="display-7" id="productType-head" style="text-align:center; margin:30px">{{this.productType}}
            <span class="productType-head-bottomLine"></span>
        </h1>
        <div class="product-section">
            <img :src="this.product.value.photoData" class="rounded float-start img-customize" alt="this.product.value.productName">
        </div>
        <div class="row product-desc">
            <h1 class="display-6 mb-1" style="color:darkblue; font-size:25px">{{this.product.value.productName}}</h1><br>
            <hr style=" margin: 0px;">
            <h4 class="mb-5 mt-5">
                <small class="text-muted ">建議售價 </small>
                <span :style="{ color: 'red' }">${{this.product.value.productPrice}}</span>
                <hr style="margin: 0px;">
            </h4>
            <h4 class="mb-4">{{this.product.value.productDescription}}</h4>
            <h5 class="mb-5 mt-4">數量  
                <span class="quantity-controls">
                    <button @click="decrementQuantity" class="btn btn-outline-secondary btn-sm custom-button">－</button>
                    <input v-model="quantity" type="text" @input="handleNumberInput" style="width:50px; text-align: center;"/>
                    <button @click="incrementQuantity" class="btn btn-outline-secondary btn-sm custom-button">＋</button>
                </span>
            </h5>    
            <hr style=" margin: 0px;">
        </div>
    </div>
    <div class="button-container" style="width:1200px">
        <button type="button" class="btn btn-success mx-6" @click="addItemToShoppingCart(this.Id, this.quantity)" style="width:130px">加入購物車</button>
        <!-- <button type="button" class="btn btn-primary mx-6" data-bs-toggle="button" autocomplete="off">直接購買</button>
        <button type="button" class="btn btn-primary mx-6" data-bs-toggle="button" autocomplete="off">加入追蹤</button> -->
    </div>
    <br>
    <br>
    <hr style="width: 90%; margin: 20px auto;">
    <br> 
    
    <!-- 推薦商品 -->
    <!-- <div style="display: flex; flex-direction: column;justify-content:center; align-items: center;text-align: center;">
        <h2 style="margin-bottom: 10px;">推薦商品</h2>
        <div style="display: flex; justify-content: space-around;">
            <div style="width: 230px;">
                <img :src="recommendProducts[0].photoData" :alt="recommendProducts[0].productName" style="width:100%">
                <p>{{recommendProducts[0].productName}}</p>
            </div>
            <div style="width: 230px;">
                <img :src="recommendProducts[1].photoData" :alt="recommendProducts[1].productName" style="width:100%">
                <p>{{recommendProducts[1].productName}}</p>
            </div>
            <div style="width: 230px;">
                <img :src="recommendProducts[2].photoData" :alt="recommendProducts[2].productName" style="width:100%">
                <p>{{recommendProducts[2].productName}}</p>
            </div>
            <div style="width: 230px;">
                <img :src="recommendProducts[3].photoData" :alt="recommendProducts[3].productName" style="width:100%">
                <p>{{recommendProducts[3].productName}}</p>
            </div>
            <div style="width: 230px;">
                <img :src="recommendProducts[4].photoData" :alt="recommendProducts[4].productName" style="width:100%">
                <p>{{recommendProducts[4].productName}}</p>
            </div>
        </div>
    </div> -->

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">會員登入</h5>
      </div>
      <div class="modal-body">
       <div class="input-group mb-3 ">
          <span class="input-group-text" id="basic-addon1">帳號：</span>
          <input type="text" v-model="account" class="form-control" placeholder="會員帳號" aria-label="Username" aria-describedby="basic-addon1">
      </div>
      <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">密碼：</span>
          <input  v-model="password" :type="getCurrentPwdInputType" class="form-control" placeholder="會員密碼" aria-label="Username" aria-describedby="basic-addon1"><span class="input-group-text" @click="passwordVisible=(passwordVisible)?false:true">{{ (passwordVisible)?'隱藏密碼':'顯示密碼' }}</span>
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" @click="login" class="btn btn-primary" >登入</button>
        <button type="button" id="login-modal-close-btn" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
      </div>
    </div>
  </div>
</div>
</template>

<style>
    .img-customize{
        /* border: 2px solid; */
        width: 460px;
        margin: 0px 80px 0px 200px;
    }
    .product-section{
        /* display: flex; */
        flex-wrap: wrap;
        
    }
    .productType-head-bottomLine{
        position: absolute; 
        bottom: 0; 
        left: 50%; 
        transform: translateX(-50%);
        width: 100px; 
        height: 4px; 
        background-color: darkgray; 
        margin-bottom: -5px;
    }
    #productType-head{
        text-align:center; 
        margin: 10px; 
        position: relative; 
        font-weight: bold;
        font-size: 30px;
        
    }
    .recommend-product{
        width: 10px;
    }
    .product-desc{
        padding-top: 60px;
        width: 500px
    }
    .button-container{    
        display: flex;
        justify-content: flex-end; 
        margin-right: 70px
    }
    .custom-button {
         width: 30px;
    }
</style>