<script setup>
import { onBeforeMount, reactive, computed } from 'vue';
import httpClient from '../../main'
const props = defineProps(['tckodid'])
const memberToken = 'e7039cb4-ee63-47fa-8f79-3585bd4c73a2';
const resInfo = reactive({
    "scheduleInfo":{},
    "ticketPrice":[],
    "ticketDiscountList":[],
    "trainDesp":'',
    "railRouteSegment":{},
    "startStationName":'',
    "endStationName":'',
    "duration":''
})
const getTotalPrice = computed(()=>{ 
    let sum =0;
    for( let p of resInfo.ticketPrice){
        sum+= p
    }
    return sum;
 })
onBeforeMount(()=>{
    httpClient.get('/getBookingByTicketOrder/'+memberToken+'/'+props.tckodid)
    .then((res)=>{
        console.log(res.data);
        // ticketOrderInfo = res.data
        resInfo.scheduleInfo = res.data.ticketSchedule;
        resInfo.ticketPrice = res.data.ticketPriceList;
        resInfo.ticketDiscountList= res.data.ticketDiscountList
        resInfo.trainDesp = res.data.ticketSchedule.train.trainDescription
        // resInfo.railRouteSegment= res.data.ticketRailRouteSegment
        resInfo.startStationName= res.data.ticketRailRouteSegment.startStation.stationName
        resInfo.endStationName= res.data.ticketRailRouteSegment.endStation.stationName
        resInfo.duration= res.data.ticketRailRouteSegment.railRouteSegmentDurationMinute
    }).catch(err=>console.log(err))
})
</script>
<template>
    <div class="card  order-detail-box">
    <div class="card-header">高鐵訂票</div>
    <div class="card-body  brought-ticket-box">
        <div class="name-piece-price">
            <label class="station-name">{{ resInfo.startStationName }}</label><label class="ticket">旅途花費：{{ resInfo.duration }}分鐘</label><lable class="station-name">{{ resInfo.endStationName }}</lable>
        </div>
        <!-- {{ res.scheduleInfo.$props }} -->
    </div>
    <div class="card-body brought-ticket-box ticket">
        <!-- <h5 class="card-title one-ticket">Special title treatment</h5>
        <p class="card-text one-ticket">With supporting text below as a natural lead-in to additional content.</p> -->
        <div v-for="(disc,idx) of resInfo.ticketDiscountList" class="name-piece-price">
            <label>{{ disc.ticketDiscountName }}</label><label>1</label><label>{{ resInfo.ticketPrice[idx] }}</label>
        </div>
        <hr>
        <div class="name-piece-price ticket">
            <label>{{ resInfo.trainDesp }}/總計：</label><label>{{ resInfo.ticketPrice.length }}張</label><label >{{ getTotalPrice }}</label>
        </div>
        <div class="card-foot name-piece-price"> 
            <button type="button" class="btn btn-outline-primary">返回</button><button type="button" class="btn btn-primary">立即付費</button>
        </div>
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
</style>