<script setup>
import { onBeforeMount,reactive,computed,ref } from 'vue';
import  router from  '../../router/index'
import httpClient from '../../main';
const currDate = ref(new Date('2023-12-14T00:00:00'));
const ticketOrderIds = reactive([])
const orderCreateTimes = reactive([]);
const paymentDealines = reactive([])
const orderStatuses = reactive([])
const totalPrices = reactive([])
function formatDate(d){
    return d.getFullYear()+'/' +(d.getMonth()+1)+'/' +String(d.getDate()).padStart(2, "0")+' '+String(d.getHours()).padStart(2, "0")+':'+String(d.getMinutes()).padStart(2, "0")
}
function isExpired(d){
    return (currDate.value-d<=0)? false: true }
const currentPwdInputType = ref('password')
const passwordVisible = ref(false);
const loginMsg = ref('')
const account = ref('')
const password = ref('')
const isLoging= ref(false)
const showSpin = computed (()=> isLoging.value)
const msg = ref('')
const orderMethod = ref('訂票時間增') //訂票時間 ｜ 到期時間 
const displayMode = ref('未付款') // non-payed payed all
const isNonpayedMode = computed(()=>displayMode.value=='未付款')
const isPayedMode = computed(()=>displayMode.value=='已付款')
const isAllMode = computed(()=>displayMode.value=='全部')
const nonPayedFilter = computed(()=>{
    let res = []
    for(let idx in orderStatuses){
        if( displayMode.value=='全部') 
            res.push(idx)
        if( orderStatuses[idx] == displayMode.value){
            res.push( idx)
        }
    }
    // order 
    if( orderMethod.value=='訂票時間增'){
        res.sort( function(a,b){
            return orderCreateTimes[parseInt(a)]-orderCreateTimes[parseInt(b)];
        })
    }else if( orderMethod.value=='訂票時間減'){
        res.sort( function(a,b){
            return orderCreateTimes[parseInt(b)]- orderCreateTimes[parseInt(a)]
        })
    }else if( orderMethod.value=='付款到期時間遞增'){
        res.sort( function(a,b){
            return paymentDealines[parseInt(a)]- paymentDealines[parseInt(b)]
        })
    }else if( orderMethod.value=='付款到期時間遞減'){
        res.sort( function(a,b){
            return paymentDealines[parseInt(b)]- paymentDealines[parseInt(a)]
        })
    }
    return res;
})
function chnageDisplayMode(newDisplayMode){
    displayMode.value = newDisplayMode;
}
onBeforeMount(()=>{
    httpClient.get('/getAllMemberTicketOrder',{withCredentials:true})
    .then((res)=>{
        
        for( let i=0; i<res.data.ticketOrderIds.length; i++){
            ticketOrderIds.push( res.data.ticketOrderIds[i]);
            orderCreateTimes.push(new Date(res.data.orderCreateTimes[i]))
            paymentDealines.push(new Date( res.data.paymentDeadlines[i]))
            totalPrices.push( res.data.totalPrices[i])
            orderStatuses.push(res.data.orderStatuses[i])
        }
        console.log( res.data);
    })
})
function goChangeLogin(){
    document.getElementById('login-modal-open-btn').click();
}
function chanageLogin(){
    let popcnt= 0;
    let len = Object.keys(ticketOrderIds).length;
    while( popcnt < len){
        console.log('pop')
        ticketOrderIds.pop()
        orderCreateTimes.pop()
        paymentDealines.pop()
        totalPrices.pop()
        orderStatuses.pop()
        popcnt++;
    }
    isLoging.value= true;
    httpClient.post('requestMemberLogin',{
        "email": account.value,
        "password": password.value
    },{withCredentials:true})
    .then((res)=>{
        if(res.status==200){
            //click the  cancel btn to close the modal
            document.getElementById('cancelBtn').click();
            msg.value='';
        }
    }).catch((err)=>{
        msg.value='帳號或密碼有誤'
        return
    }).then(()=>{
        httpClient.get('/getAllMemberTicketOrder',{withCredentials:true})
        .then((res)=>{
            for( let i=0; i<res.data.ticketOrderIds.length; i++){
                ticketOrderIds.push( res.data.ticketOrderIds[i]);
                orderCreateTimes.push(new Date(res.data.orderCreateTimes[i]))
                paymentDealines.push(new Date( res.data.paymentDeadlines[i]))
                totalPrices.push( res.data.totalPrices[i])
                orderStatuses.push(res.data.orderStatuses[i])
            }
            console.log( res.data);
            isLoging.value=false
        }).catch(err=> isLoging.value=false)
        setTimeout(function(){
            document.getElementById('cancelBtn').click();
        },1500)
    })
}
function checkBooking(i){
    if( isExpired(paymentDealines[i]) || orderStatuses[i]!='已付款'){
        console.log('not able to ckeck booking')
        return 
    }
    router.push('/ticketOrderDetail/'+ticketOrderIds[i])
}
</script>
<template>
<div class="member-info-bar">
    <span @click="goChangeLogin">更換帳號登出</span>
</div>
<div class="container">
    <div class="card text-center">
        <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
                <a class="nav-link" @click="chnageDisplayMode('未付款')" :class="{'active':isNonpayedMode}" aria-current="true" href="#">未付款</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="chnageDisplayMode('已付款')" :class="{'active':isPayedMode}" href="#">已付款</a>
            </li>
            <li class="nav-item">
                <a class="nav-link"  @click="chnageDisplayMode('全部')" :class="{'active':isAllMode}" href="#">全部訂票紀錄</a>
            </li>
            <li class="nav-item dropdown"><!-- 空的nav-item 不放後面的drop down link will not work-->
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    訂位時間排序
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li><a @click="orderMethod='訂票時間增'" class="dropdown-item" href="#">遞增</a></li>
                    <li><a @click="orderMethod='訂票時間減'" class="dropdown-item" href="#">遞減</a></li>
                </ul>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    繳費到期時間排序
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li><a @click="orderMethod='付款到期時間遞增'" class="dropdown-item" href="#">遞增</a></li>
                    <li><a @click="orderMethod='付款到期時間遞減'" class="dropdown-item" href="#">遞減</a></li>
                </ul>
            </li>
            
            </ul>
        </div>
        <div v-for="i in nonPayedFilter" class="card-body ticket-order-box">
            <h5 class="card-title" :class="{ 'expire-text': isExpired(paymentDealines[i])}">訂單編號：{{ ticketOrderIds[i] }}</h5>
            <p class="card-text" :class="{ 'expire-text': isExpired(paymentDealines[i])}">訂單建立時間{{formatDate( orderCreateTimes[i])}} 訂單價格{{totalPrices[i]}}元</p>
            <p class="card-text" :class="{ 'expire-text': isExpired(paymentDealines[i])}">付款期限：{{  formatDate( paymentDealines[i]) }}</p>
            <button href="#" @click="checkBooking(i)" class="btn btn-primary"  :class="{'btn-secondary': isExpired(paymentDealines[i])}">查看該筆訂單</button>
        </div>
        <div class="card-footer page-code" >
            <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                <li class="page-item"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
            </nav>
        </div>
    </div>
</div>
<div class="container">
<div class="modal" tabindex="-1" id="login-modal">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5>登入</h5>
        </div>
        <div class="modal-body">
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">帳號：</span>
                <input type="text" v-model="account" class="form-control" placeholder="會員帳號" aria-label="Username" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">密碼：</span>
                <input  v-model="password" :type="currentPwdInputType" class="form-control" placeholder="會員密碼" aria-label="Username" aria-describedby="basic-addon1"><span class="input-group-text" @click="{ currentPwdInputType=(passwordVisible==true)?'password':'text';passwordVisible=!passwordVisible}">{{ (passwordVisible)?'隱藏密碼':'顯示密碼' }}</span>
            </div>
            <span>{{ loginMsg }}</span>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="{msg='';isToBooking=false}" id="cancelBtn" data-bs-dismiss="modal">取消</button>
            <div v-show="showSpin" class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
            <button type="button"  @click="chanageLogin"  class="btn btn-primary">
                登入
            </button>
        </div>
        </div>
    </div>
</div>
</div>
    <button id="login-modal-open-btn" hidden data-bs-toggle="modal" data-bs-target="#login-modal"></button>
</template>
<style>
.member-info-bar{
    display: flex;
    flex-direction: row-reverse;
}
.ticket-order-box{
    border-bottom: 3px rgb(206, 206, 206) solid;
    margin: auto 10%;
}
.page-code{
    display: flex;
    justify-content: center;
}
.expire-text{
    color: gray;
    
}
.expire-button{
    background-color: lightblue;
}
</style>