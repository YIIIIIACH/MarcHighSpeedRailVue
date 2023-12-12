<script setup>
import { onBeforeMount, reactive, computed,onMounted,ref } from 'vue';
import 'vue-router'
import httpClient from '../../main'
import router from '../../router';
const props = defineProps(['tckodid','memberId'])
const emits = defineEmits(['updateMemberId'])
const memberToken = 'e7039cb4-ee63-47fa-8f79-3585bd4c73a2';
const spining = ref(false);
const loading = ref(false);
const resInfo = reactive({
    "scheduleInfo":{},
    "ticketPrice":[],
    "ticketDiscountList":[],
    "trainDesp":'',
    "railRouteSegment":{},
    "startStationName":'',
    "endStationName":'',
    "duration":'',
    "ticketStatusList":[]
})
function checkLoginToken(){
    let cookieArr = document.cookie.split('login-token=')
    if( cookieArr.length==1){
        return false;
    }
    return true;
}
function goCheckOut(){
    spining.value= true;
    
    httpClient.post('/createTicketOrder?ticketOrderId='+props.tckodid,{},{withCredentials:true})
    .then((res)=>{
        if( res.status==200){
            let json = res.data;
            for( let linkObj of json['links']){
                if( linkObj['rel'] == 'approve'){
                    // find the approve link
                    spining.value=false
                    window.location= linkObj['href']
                }
            }
        }
        spining.value= false;
    })
    .catch(err=>{
        spining.value=false
        router.push('/booking');
        alert('建立paypal付費訂單失敗')
        console.log(err)
        spining.value= false;
    })
}
const wasAllocate= computed(()=>{
    for( let stat of resInfo.ticketStatusList){
        if(stat!='未分配'){
            return true;
        }
    }
    return false
    // return !resInfo.ticketStatusList.includes('未分配')
})
const getTotalPrice = computed(()=>{ 
    let sum =0;
    for( let p of resInfo.ticketPrice){
        sum+= p
    }
    return sum;
 })
onBeforeMount(()=>{
    loading.value=true;
    httpClient.get('/getBookingByTicketOrder/'+props.tckodid,{withCredentials:true})
    .then((res)=>{
        // console.log(res.data);
        if(res.data.ticketSchedule==null){
            router.push('/booking')
        }
        // ticketOrderInfo = res.data
        resInfo.scheduleInfo = res.data.ticketSchedule;
        resInfo.ticketPrice = res.data.ticketPriceList;
        resInfo.ticketDiscountList= res.data.ticketDiscountList
        resInfo.trainDesp = res.data.ticketSchedule.train.trainDescription
        // resInfo.railRouteSegment= res.data.ticketRailRouteSegment
        resInfo.startStationName= res.data.ticketRailRouteSegment.startStation.stationName
        resInfo.endStationName= res.data.ticketRailRouteSegment.endStation.stationName
        resInfo.duration= res.data.ticketRailRouteSegment.railRouteSegmentDurationMinute
        resInfo.ticketStatusList= res.data.ticketStatusList
        loading.value=false
    }).catch(err=>{
        console.log(err)
        loading.value= false
    })
})
// onMounted(()=>{
//     if(resInfo.scheduleInfo==null){
//         console.log('haha')
//     }
// //    $routerrouter.push('/booking')
// })
</script>
<template>
    <div class="card  order-detail-box">
    <div class="card-header">高鐵訂票</div>
    <div class="card-body" v-show="loading" style="display: flex; justify-content: center;padding-top: 50px;padding-bottom: 50px;">
        <div class="spin-block">
            <div v-for="i of 9" class="item"></div>
        </div>
    </div>
    <transition name="fade">
        <div class="card-body  brought-ticket-box" v-show="!loading">    
            <div class="name-piece-price">
                <label class="station-name">{{ resInfo.startStationName }}</label><label class="ticket">旅途花費：{{ resInfo.duration }}分鐘</label><label class="station-name">{{ resInfo.endStationName }}</label>
            </div>
            <!-- {{ res.scheduleInfo.$props }} -->
        </div>
    </transition>
    <transition name="fade">
        <div class="card-body brought-ticket-box ticket" v-show="!loading">
            <div v-for="(disc,idx) of resInfo.ticketDiscountList" class="name-piece-price">
                <label>{{ disc.ticketDiscountName }}</label><p>{{resInfo.ticketStatusList[idx] }} 1張</p><label>{{ resInfo.ticketPrice[idx] }}元</label>
            </div>
            <hr>
            <div class="name-piece-price ticket">
                <label>{{ resInfo.trainDesp }}/總計：</label><label>{{ resInfo.ticketPrice.length }}張</label><label >{{ getTotalPrice }}元</label>
            </div>
        </div>
    </transition>
        <div class="card-foot name-piece-price brought-ticket-box" style="margin:40px auto"> 
            <button type="button" @click="$router.push('/booking')" class="btn btn-outline-primary">返回</button>
            <button :disabled="wasAllocate" @click="goCheckOut" type="button" class="btn btn-primary spin-btn" style="width:200px;height: 60px;"><span   v-show ="spining" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>立即付費</button>
        </div>
    </div>
    
</template>
<style>
.order-detail-box{
    padding: auto 0px;
    /* width:60%; */
    margin:6% 20% auto;
}
.schedule-box{
    background-color: rgb(99, 42, 42);
    width: 60%;
    margin: auto 20%;
}
.brought-ticket-box{
    background-color: rgb(255, 255, 255);
    width: 60%;
    margin: auto 20%;
}
.name-piece-price{
    display:flex;
    justify-content: space-between;
}
.one-ticket{
    width:100%
}
.station-name{
    font-size: 48px;
}
.ticket{
    font-size: 28px;
}
.spin-btn{
    display: inline;
    justify-content: space-around;
    justify-items: baseline;
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

.fade-enter-active{
  transition: opacity 2s;
}

.fade-enter-from{
  opacity: 0;
}

.fade-enter-to{
  opacity: 1;
}

</style>