<script setup>
import { onBeforeMount,ref, reactive} from 'vue';
import httpClient from '../../main';
const userName = ref('')
const schInfo = reactive({
})
const ststName = ref('')
const edstName = ref('')
const bookingInfo = reactive([])
const props = defineProps(['tckodid'])
const ticketQRcodeSrc = ref('')
onBeforeMount(()=>{
    // check is login
    httpClient.post('/verifyLoginToken',{},{withCredentials:true}).then((res)=>{
        if( res.data=="not cookie found" || res.data=="failed"){
            // with out login-token in cookie
            // toggle login modal
            console.log('login failed')
            return 
        }
        userName.value = res.data
    }).catch(err=>console.log(err))

    httpClient.get('/getBookingByTicketOrder/'+props.tckodid,{withCredentials:true})
    .then((res)=>{
        console.log(res.data)
        ststName.value = res.data.ticketRailRouteSegment.startStation.stationName;
        edstName.value = res.data.ticketRailRouteSegment.endStation.stationName
        schInfo.ticketSchedule= res.data.ticketSchedule;
        schInfo.ticketRailRouteSegment=res.data.ticketRailRouteSegment
        let len = res.data.bookingIdList.length;
        console.log('len:'+len)
        for( let i =0;i<len; i++){
            let b ={
                "bookingId": res.data.bookingIdList[i],
                "seat" : res.data.seatList[i],
                'ticketDiscount': res.data.ticketDiscountList[i],
                'ticketStatus': res.data.ticketStatusList[i],
                'ticketPrice':res.data.ticketPriceList[i],
                'ticketQRcode':res.data.ticketQRcodeList[i]
            }
            bookingInfo.push(b)
        }
    })
})
function createTicketQR(){
    httpClient.get('https://chart.googleapis.com/chart?cht=qr&chl=https://google.com&chs=150x150',{withCredentials:false})
    .then(res=>{
        // console.log(res.data)
        ticketQRcodeSrc.value = res.data;
    });
}
</script>
<template>
    <div class="container">
        <div class="card text-center">
        <div class="card-header">
            <label>{{ ststName }}</label><label>{{ edstName }}</label>
        </div>
        <div v-for="b of bookingInfo" class="card-body booking-box">
            <h5 class="card-title">{{ b.ticketDiscount.ticketDiscountName }}</h5><!--{{ seatList[i].carriage }}-->
            <p class="card-text">第{{ b.seat.carriage }}車廂 {{ b.seat.seatCode }} {{ b.seat.seatDescirption }} {{ b.ticketDiscount.ticketDiscountName }}</p>
            <a href="#" v-if="b.ticketQRcode==null" @click="createTicketQR" class="btn btn-primary">生成車票QRcode</a>
            <a href="#" v-else class="btn btn-primary">查看車票QRcode</a>
        </div>
        </div>
    </div>
    <!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Launch static backdrop modal
</button>

<!-- Modal -->
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <img :src="ticketQRcodeSrc">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Understood</button>
      </div>
    </div>
  </div>
</div>
</template>
<style>
.schedule-box{
    display:flex;
    justify-content: space-around;
}
.booking-box{
    border: 2px rgb(179, 179, 179) solid;
    display:flex;
    justify-content: space-around;

}
</style>