<script>
import httpClient from "@/main";
import { ref, reactive} from "vue";
export default {
    props:['memberId'],
    emits:['updateMemberId'],
    setup(props) {
        return{
            account: ref(''),
            password: ref(''),
            userName: ref(''),

            trackingProducts : ref([]),
            highlightId: ref(0),
            passwordVisible:ref(false),
        }
    },
    computed:{
        isLogined(){
            return (this.memberId == 'undefined')? false: true;
        },
        getCurrentPwdInputType(){
            return (this.passwordVisible==true)?'text':'password'
        },
    },
    methods:{
        goToGoodsDetail(productId) {
            this.$router.push({ name: 'goods-detail', params: { Id: productId } });
        },  
        handleMouseOver: function(productId) {
            this.highlightId = productId;
        },
        handleMouseLeave: function() {
            this.highlightId = null;
        },
        addItemToShoppingCart(t){

            if( this.memberId==''){
            document.getElementById('login-modal-open-btn').click();
            return ;
            }
            httpClient.post('/ShoppingCart/addProduct?productId=' + t.productId + '&' + 'memberId=' + this.memberId)
            .then((res)=>{
                console.log(res.data)
                if(res.data == "商品已在購物車中。"){
                    alert("商品已在購物車中，無需重複添加")
                }else{
                    t.showAddInCart = true
                    setTimeout(function(){t.showAddInCart=false},1500)
                }
            })
        },
        deleteTracking(tId){
            httpClient.delete('/ProductTrackingList/delete?mId=' + this.memberId + '&tId=' + tId)
            .then((res)=>{
                console.log(res.data)
            })
            .catch((err)=>{
            console.log(err)
            })

            for(let i = 0 ; i < this.trackingProducts.length ; i++){
                if(this.trackingProducts[i].trackingId == tId){
                    this.trackingProducts.splice(i,1)
                    continue;
                }

            }
        },
        login: function() {
            httpClient.post( '/requestMemberLogin',{
            "password": this.password,
            "email": this.account
            },{withCredentials:true})
            .then((res) => {
            if(res.data.member_id == null){
                console.log('login failed')
                return; //中斷, 不執行下面的code
            }
            // console.log(res.data)
            this.userName = res.data.member_name;
            // console.log(this.userName)
            // this.memberId = res.data.member_id;
            this.$emit('updateMemberId', res.data.member_id);
            document.getElementById('login-modal-close-btn').click();
            })
        },
        logout: function(){
            this.$emit('updateMemberId','undefined')
            this.userName = ''
      },
    },
    beforeMount() {
        httpClient.get('/ProductTrackingList?mId=' + this.memberId)
        .then(res =>{
            console.log(res.data)
            for(let tracking of res.data){
                this.trackingProducts.push(tracking)
            }
        })
    },
}
</script>
<template>
    <div style="display: flex; justify-content: flex-end;" >
        <span>使用者: {{this.userName}}</span>
        <button type="button" class="btn btn-outline-primary" @click="logout()" v-if="isLogined">
            登出
        </button>
        <button type="button" id="login-modal-open-btn" class="btn btn-primary login-btn" data-bs-toggle="modal" data-bs-target="#exampleModal"
        v-else>
            登入
        </button>
    </div>
    <div id="main-content">
        <h1 style="text-align:center; margin:30px">追蹤清單</h1>
        <hr>
        <div class="product-container">
            <div v-for="t of trackingProducts" :key="t.trackingId">
                <div class="card card-gap" @click="goToGoodsDetail(t.productId)">
                    <div @mouseover="handleMouseOver(t.productId)" @mouseleave="handleMouseLeave" :style="{ border: highlightId === t.productId ? '1px solid rgb(221, 112, 112)' : 'none','pos-ab': t.showAddInCart}" style="height:400px">
                        <p style="text-align:end;" @click.stop="deleteTracking(t.trackingId)" >
                            <span style="cursor: pointer">⨉</span>
                        </p>
                        <img :src="t.photoData" class="card-img-top" :alt="t.productName" style="height:200px">
                        <div v-show="t.showAddInCart" class="inimg-notification" style="width:9rem">成功加入購物車</div>
                        <div class="card-body">
                            <p class="card-title">{{t.productName}}</p>
                            <div>
                                <p style="color:#EA7500;">${{t.productPrice}}</p>
                            </div>
                            <button class="btn btn-success mt-1 add-cart-btn" @click.stop="addItemToShoppingCart(t)" type="submit">加入購物車</button>
                            <p style="color:gray">追蹤日期 :  {{t.trackingDate}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- modal -->
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
<style >
    .product-container {
    display: flex;
    justify-content:flex-start;
     flex-wrap: wrap;
    }
    .inimg-notification {
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(57, 53, 46, 0.6);
    color: white;
    padding: 15px;
    border-radius: 10px;
    z-index: 1000;
    }
    .card-gap{
    width: 15rem; 
    box-shadow: 5px 5px 5px #6d6d6d;
    }
    .card-title{
        font-size: 14px;
    }
    #main-content{
        width:70%;
        margin: auto;
    }
</style>