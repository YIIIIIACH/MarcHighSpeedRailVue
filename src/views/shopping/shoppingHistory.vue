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
            orders: ref([]),
            productIds: ref([]),
            products: ref([]),
            passwordVisible: ref(false),

            showPaid: ref(false),
            showUnpaid: ref(true),
        }
    },
    computed:{
        isLogined(){              
            return (this.memberId == 'undefined')? false: true;
        },
        getCurrentPwdInputType(){
            return (this.passwordVisible==true)?'text':'password'
        },
        filteredOrders() {
            // 透過計算屬性過濾顯示的訂單
            return this.orders.filter(order => {
                if (this.showPaid && order.orderStatus === '已付款') {
                return true;
                }
                if (this.showUnpaid && order.orderStatus === '待付款') {
                return true;
                }
                // 都沒有勾選就顯示所有訂單
                return !this.showPaid && !this.showUnpaid; 
            });
        },
    },
    methods:{
        showPaidOrders() {
            this.showPaid = true;
            this.showUnpaid = false;
        },
        showUnpaidOrders() {
            this.showPaid = false;
            this.showUnpaid = true;
        },
        toPayPal(order){
            let productIds = []
            let sum = 0;
            if(order.orderStatus == '已付款'){
                alert('此訂單已付款')
                return;
            }else{
                for( let i=0; i< order.products.length; i++){
                    for( let j=0; j< order.quantity[i] ; j++){
                        // productIds.push( order.products[i])
                        sum+= order.products[i].productPrice;
                    }
                }
                httpClient.post('/createPaypalOrder',{
                    orderId: order.orderId,
                    memerId: this.memberId,
                    totalPrice: sum
                }).then((res)=>{
                   console.log(res.data)
                   if( res.status == 200){
                    
                        let json = res.data;
                        for( let linkObj of json['links']){
                            if( linkObj['rel'] == 'approve'){
                                window.location= linkObj['href']
                            }
                        }
                        return;
                    }
                    alert('create paypal order failed')
                })
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
            this.userName= res.data.member_name;
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
        httpClient.get('/OrderHistory?memberId=' + this.memberId)
        .then((res)=>{
            let orders = res.data
            for(let order of orders){
                console.log(order)
                this.orders.push(order)
                this.productIds.push(order.productId)
            }
                // console.log(this.productIds)
        })
        .then(()=>{
            httpClient.get('/product/findByProductIds?productIds=' + this.productIds.join(','))
            .then((res)=>{
                console.log(res.data)
                let resProducts = res.data
                for(let product of resProducts){
                    this.products.push(product)
                }
                    // console.log(this.products)
            })
        })
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
     
    <div v-if="this.memberId === 'undefined'" style="text-align: center">
        <br>
        <br>
        <h1>請先<span data-bs-toggle="modal" data-bs-target="#exampleModal" style="cursor: pointer; color:blue">登入</span>會員，即可查詢訂購紀錄</h1>
    </div>
    <div class="order-history-info mx-auto" v-else>
        <h1 class="shoppingHistory-title">📋 訂購紀錄</h1>
        <div class="text-center mt-3">
            <button class="btn btn-primary" @click="showPaidOrders">已付款</button>
            <button class="btn btn-warning" @click="showUnpaidOrders">待付款</button>
        </div>  
        <table class="table" v-for="order of filteredOrders" :key="order.orderId">
            <thead class="table-info">
                <tr>
                <th scope="col">訂單編號</th>
                <th scope="col">訂單成立日期</th>
                <th scope="col">訂單完成日期</th>
                <th scope="col">訂單金額</th>
                <th scope="col">訂單狀態</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">{{order.orderNumber}}</th>
                <td>{{order.orderCreationDate}}</td>
                <td>{{order.orderCompletionDate}}</td>
                <td>$ {{order.totalPrice}}</td>
                <td :style="{color : order.orderStatus === '待付款' ? 'red' : 'dark'}">{{order.orderStatus}}</td>
                </tr>
                <tr>
                    <th colspan="">
                        <p>
                            <button class="btn btn-info" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapseExample' + order.orderId" aria-expanded="false" aria-controls="collapseExample">查看細項</button>
                        </p>
                    </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td v-if="order.orderStatus == '待付款'">
                        <button type="button" class="btn btn-success" @click="toPayPal(order)">前往付款</button>
                    </td>
                    <td v-else>
                        <button style="display:none">此 Button 佔位用</button>
                    </td>
                </tr>
            </tbody>
            <tfoot class="collapse" :id="'collapseExample' + order.orderId">
                <tr v-for="(o,idx) of order.products" :key="idx">
                    <th class="card-body">
                        <div >
                            <img :src="order.photoData[idx]"  style="width:100px; height:100px">
                        </div>
                    </th> 
                    <td>
                        <div>
                            <p>{{order.products[idx].productName}}</p>
                        </div>
                    </td> 
                    <td>      
                        <div>
                            <p>單價: {{ order.products[idx].productPrice}}</p>
                        </div>
                    </td>
                    <td>
                        <div >
                            <p>數量: {{ order.quantity[idx]}}</p>
                        </div>
                    </td>
                    <td>
                        <div>
                            <p>總金額: {{order.products[idx].productPrice * order.quantity[idx]}}</p>
                        </div>
                    </td>
                </tr>
            </tfoot> 
        </table>     
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
<style>
    .order-history-info{
        width:1000px;
    }
    .table{
        text-align: center;
    }
    .shoppingHistory-title{
        text-align: center; 
        margin: 30px;
    }
</style>