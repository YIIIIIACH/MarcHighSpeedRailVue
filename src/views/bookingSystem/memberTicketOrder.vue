<script setup>
import { onBeforeMount,reactive,computed,ref } from 'vue';
import  router from  '../../router/index'
import httpClient from '../../main';
const emits= defineEmits(['updateMemberId'])
const props = defineProps(['memberId'])
const currDate = ref(new Date());
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
const filterMode = ref('全部') //到期 全部 未到期
const orderMethod = ref('訂票時間增') //訂票時間 ｜ 到期時間 
const displayMode = ref('立即') // non-payed payed all
const isImmediateMode = computed(()=> displayMode.value=='立即')
const isNonpayedMode = computed(()=>displayMode.value=='未付款')
const isPayedMode = computed(()=>displayMode.value=='已付款')
const isAllMode = computed(()=>displayMode.value=='全部')
const nonPayedFilter = computed(()=>{
    isLoging.value=true;
    setTimeout(function(){isLoging.value=false},300)
    let res = []
    if(displayMode.value=='立即'){
        let found=false;
        let tmp = 0;
        for( let idx in orderStatuses){
            if(currDate.value-paymentDealines[idx]<0 && orderStatuses[idx]=='未付款'){
                found=true;
                tmp = ( paymentDealines[idx]- paymentDealines[tmp] >0)? tmp: idx;
            }
        }
        if(!found){
            return []
        }
        return [tmp];
    }
    for(let idx in orderStatuses){
        if(filterMode.value=='到期' && (currDate.value-paymentDealines[idx]>=0)){
            if( displayMode.value=='全部' ) 
                res.push(idx)
            else if( orderStatuses[idx] == displayMode.value){
                res.push( idx)
            }
        }
        else if( filterMode.value=='未到期' && (currDate.value-paymentDealines[idx]<0)){
            if( displayMode.value=='全部' ) 
                res.push(idx)
            else if( orderStatuses[idx] == displayMode.value){
                res.push( idx)
            }
        }else if( filterMode.value=='全部'){
            if( displayMode.value=='全部' ) 
                res.push(idx)
            else if( orderStatuses[idx] == displayMode.value){
                res.push( idx)
            }
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
    // payImmediately.value=false;
    displayMode.value = newDisplayMode;
}
onBeforeMount(()=>{
    isLoging.value=true;
    httpClient.get('/getAllMemberTicketOrder',{withCredentials:true})
    .then((res)=>{
        
        for( let i=0; i<res.data.ticketOrderIds.length; i++){
            ticketOrderIds.push( res.data.ticketOrderIds[i]);
            orderCreateTimes.push(new Date(res.data.orderCreateTimes[i]))
            paymentDealines.push(new Date( res.data.paymentDeadlines[i]))
            totalPrices.push( res.data.totalPrices[i])
            orderStatuses.push(res.data.orderStatuses[i])
        }
        // console.log( res.data);
        isLoging.value=false
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
    if( isExpired(paymentDealines[i])){
        console.log('not able to ckeck booking')
        return 
    }
    if(orderStatuses[i]=='未付款'){
        router.push('/bookSuccess/'+ticketOrderIds[i]);
        return;
    }
    router.push('/ticketOrderDetail/'+ticketOrderIds[i])
}
</script>
<template>
<div class="member-info-bar">
    <span @click="goChangeLogin">更換帳號登出</span>
</div>
<div class="container">
    <div class="card text-center" >
        <div class="card-header" >
            <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
                <a class="nav-link" @click="chnageDisplayMode('立即')" :class="{'active': isImmediateMode}" aria-current="true" href="#">立即付款</a>
            </li>
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
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    篩選{{ filterMode }}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li><a @click="filterMode='到期'" class="dropdown-item" href="#">到期</a></li>
                    <li><a @click="filterMode='未到期'" class="dropdown-item" href="#">未到期</a></li>
                    <li><a @click="filterMode='全部'" class="dropdown-item" href="#">全部</a></li>
                </ul>
            </li>
            </ul>
        </div>
        <div v-if="!isLoging">
            <div v-for="i in nonPayedFilter" class="card-body ticket-order-box">
                <h5 class="card-title" :class="{ 'expire-text': isExpired(paymentDealines[i])}">訂單編號：{{ ticketOrderIds[i] }}</h5>
                <p class="card-text" :class="{ 'expire-text': isExpired(paymentDealines[i])}">訂單建立時間{{formatDate( orderCreateTimes[i])}} 訂單價格{{totalPrices[i]}}元</p>
                <p class="card-text" :class="{ 'expire-text': isExpired(paymentDealines[i])}">付款期限：{{  formatDate( paymentDealines[i]) }}</p>
                <button href="#" @click="checkBooking(i)" class="btn btn-primary" style="width:200px"  :class="{'btn-secondary': isExpired(paymentDealines[i])}">查看該筆訂單</button>
            </div>
        </div>
            <div class="container" v-if="isLoging" style="display: flex; justify-content: center;padding-top: 50px;padding-bottom: 50px;">
            <div class="spin-block">
                <div v-for="i of 9" class="item"></div>
            </div>
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
.item {
    width: 30px;
    height: 30px;
    margin: 5px;
    background-color: green;
    animation: hideItem .8s infinite;
}
.spin-block{
    width: 120px;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.item:nth-child(1) { animation-delay: 0s; }
.item:nth-child(2) { animation-delay: 0.1s; }
.item:nth-child(3) { animation-delay: 0.2s; }
.item:nth-child(6) { animation-delay: 0.3s; }
.item:nth-child(9) { animation-delay: 0.4s; }
.item:nth-child(8) { animation-delay: 0.5s; }
.item:nth-child(7) { animation-delay: 0.6s; }
.item:nth-child(4) { animation-delay: 0.7s; }
.item:nth-child(5) { opacity: 0; }

@keyframes hideItem {
100% { opacity: 0; }
}

</style>