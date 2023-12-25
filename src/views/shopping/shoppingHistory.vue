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
            let filterOrders= this.orders.filter(order => {
                if (this.showPaid && order.orderStatus === '已付款') {
                return true;
                }
                if (this.showUnpaid && order.orderStatus === '待付款') {
                return true;
                }
                // 都沒有勾選就顯示所有訂單
                return !this.showPaid && !this.showUnpaid; 
            });

            console.log(filterOrders)
            // 透過計算屬性過濾顯示的訂單
            return filterOrders;
        },
    },
    methods:{
        // sortByCompletionDate(){
        //     this.filteredOrders.sort((a,b) => {

        //     })
        // },
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
            console.log(order)
            if(order.orderStatus == '已付款'){
                alert('此訂單已付款')
                return;
            }else{
                for( let i=0; i< order.products.length; i++){
                    for( let j = 0; j< order.quantity[i] ; j++){
                        // productIds.push( order.products[i])
                        sum+= order.products[i].productPrice;
                    }
                }
                httpClient.post('/createPaypalOrder',{
                    orderId: order.orderId,
                    memerId: this.memberId,
                    totalPrice: sum
                }).then((res)=>{
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
            },{withCredentials: true})
            .then((res) => {
            if(res.data.member_id == null){
                return; //中斷, 不執行下面的code
            }
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

        // const allCookies = document.cookie.split(';');
        // for(let c of allCookies){
        //     const [name, value] = c.trim().split('=');
        //     if(name  == "member-name"){
        //         this.userName = value
        //         break;
        // console.log(this.userName)
        //     }
        // }

        httpClient.post('/verifyLoginToken',{},{withCredentials: true})
        .then((res) => {
          console.log(res.data)
          if( res.status == 200){
            this.$emit('updateMemberId', res.data)
            // console.log( 'emits to update memberid ')
          }
        })
        .catch(err=>console.log(err))
        
        httpClient.get('/OrderHistory?memberId=' + this.memberId)
        .then((res)=>{
            // console.log( res.data)
            let orders = res.data
            for(let order of orders){
                console.log(order)
                
                let isoString = order.orderCreationDate // 接收後端傳來的日期字串
                let date = new Date(isoString); // 字串轉成 JS Date 物件
                let formattedDate = date.toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }); // 使用 toLocaleString 將日期格式化為本地格式, 並忽略"秒"的時間
                order.orderCreationDate = formattedDate 

                if(order.orderCompletionDate !== null){
                    order.orderCompletionDate = new Date( order.orderCompletionDate).toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
                }

                // console.log( order.orderCompletionDate);
                this.orders.push(order)
                this.productIds.push(order.productId)
            }
        })
        .then(()=>{
            httpClient.get('/product/findByProductIds?productIds=' + this.productIds.join(','))
            .then((res)=>{
                let resProducts = res.data
                for(let product of resProducts){
                    this.products.push(product)
                }
            })
        })
    },
}
</script>

<template>
    <!-- 登入登出 -->
    <div style="display: flex; justify-content: flex-end;" >
        <button type="button" class="btn btn-outline-primary" @click="logout()" v-if="isLogined">
            登出
        </button>
        <button type="button" id="login-modal-open-btn" class="btn btn-primary login-btn" data-bs-toggle="modal" data-bs-target="#exampleModal"
        v-else>
            登入
        </button>
    </div>
    
    <!-- 訂購紀錄 -->
    <div v-if="this.memberId === 'undefined'" style="text-align: center">
        <br>
        <br>
        <h1>請先<span data-bs-toggle="modal" data-bs-target="#exampleModal" style="cursor: pointer; color:blue">登入</span>會員，即可查詢訂購紀錄</h1>
    </div>
    <div class="order-history-info mx-auto" v-else>
        <h1 class="shoppingHistory-title">📋 訂購紀錄</h1>
        <hr>
        <div class="text-center mt-4 mb-3">
            <button class="btn btn-primary " @click="showPaidOrders" style="width:130px">已付款訂單</button>
            <button class="btn btn-warning " @click="showUnpaidOrders" style="width:130px; margin-left:50px">待付款訂單</button>
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
                <td>$ <span style="color: red">{{order.totalPrice}}</span></td>
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
                        <div><img :src="order.photoData[idx]"  style="width:100px; height:100px"></div>
                    </th> 
                    <td>
                        <div><p>{{order.products[idx].productName}}</p></div>
                    </td> 
                    <td>      
                        <div><p>單價: {{ order.products[idx].productPrice}}</p></div>
                    </td>
                    <td>
                        <div><p>數量: {{ order.quantity[idx]}}</p></div>
                    </td>
                    <td>
                        <div><p>小計: {{order.products[idx].productPrice * order.quantity[idx]}}</p></div>
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