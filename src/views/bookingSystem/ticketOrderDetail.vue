<script setup>
import { onBeforeMount,ref, reactive} from 'vue';
import httpClient from '../../main';
import ticketStopStation from '../../components/Marc/ticketStopStation.vue'
const userName = ref('')
const schInfo = reactive({})
const railRouteSegmentInfo = reactive({})
const stArr = reactive({})
const edArr = reactive({})
const ststName = ref('')
const edstName = ref('')
const bookingInfo = reactive([])
const railRouteStopStation = reactive([])
const loadingStopSt = ref(false)
// const spinCnt = ref(0);
const props = defineProps(['tckodid'])
onBeforeMount(()=>{
  loadingStopSt.value=true
  // check is login
  httpClient.post('/verifyLoginToken',{},{withCredentials:true}).then((res)=>{
        if( res.data=="not cookie found" || res.data=="failed"){
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
        Object.assign(schInfo , res.data.ticketSchedule);
        Object.assign( railRouteSegmentInfo, res.data.ticketRailRouteSegment)
        Object.assign( stArr, res.data.startArrive);
        Object.assign( edArr, res.data.endArrive);
        let len = res.data.bookingIdList.length;
        console.log('len:'+len)
        for( let i =0;i<len; i++){
          let b ={
            "bookingId": res.data.bookingIdList[i],
            "seat" : res.data.seatList[i],
            'ticketDiscount': res.data.ticketDiscountList[i],
            'ticketStatus': res.data.ticketStatusList[i],
            'ticketPrice':res.data.ticketPriceList[i],
            'ticketQRcode':res.data.ticketQRcodeList[i],
          }
          bookingInfo.push(b)
        }
        loadRailRouteStopStation()
    })
})
function createTicketQR(b){
  httpClient.post("/createTicketQRCode",{
    "bookingId": b.bookingId,
    "url": 'https://chart.googleapis.com/chart?cht=qr&chl='+b.bookingId+'&chs=150x150'
  }).then((res)=>{
      if(res.status==200){
        console.log( 'store qrcode in db success');
        b.ticketQRcode = 'https://chart.googleapis.com/chart?cht=qr&chl=https://google.com&chs=150x150';
        document.getElementById('qr-img').src = 'https://chart.googleapis.com/chart?cht=qr&chl='+b.bookingId+'&chs=150x150';
      }
  }).catch(err=>{
    console.log('store qr in db failed')
  })
  document.getElementById('toggle-qr-modal').click();
}
function checkQrcode(b){
  if(b.ticketQRcode!=null){
    document.getElementById('qr-img').src =b.ticketQRcode;
  }else{
    document.getElementById('qr-img').src = 'https://chart.googleapis.com/chart?cht=qr&chl='+b.bookingId+'&chs=150x150';
  }
  document.getElementById('toggle-qr-modal').click();
}
// load railRouteStopStation
function loadRailRouteStopStation(){
 
  httpClient.get('/getScheduleStopStationByScheduleId?schid='+schInfo.scheduleId).then((res)=>{
    console.log(res.data)
    let i = 0;
    for (let stst of res.data){
      railRouteStopStation.push(res.data[i]);
    }
    loadingStopSt.value=false
    // setTimeout(function(){
    //   loadingStopSt.value=false
    // },4000)
  }).catch(err=> {
    // setTimeout(function(){
    //   loadingStopSt.value=false
    // },4000)
  })
}

</script>
<template>
<div class="container">
  <div class="row justify-content-center" >
    <div class="card" >
      <div class="card-header text-center"  >
        <div class="card-text">
        <label>花費時間{{ railRouteSegmentInfo.railRouteSegmentDurationMinute }}分鐘</label>
        <div class="cart-title"><label>{{stArr.arriveTime}} {{ ststName }}站—————{{ edstName }}站 {{ edArr.arriveTime }}</label></div>
      </div>
    </div>
    <div  id="rail-route-stop-station" style=" width:100%;height: 200px;">
      <div  v-show="loadingStopSt" class="stop-stations marquee-container"   >
        <div class="marquee-content">
          <div class="spinner-grow text-secondary c" v-for="i in 7" role="status"><span class="visually-hidden"></span></div>
        </div>
      </div>
      <div v-show="!loadingStopSt" style="width:100%;height: 100%;">
        <ticketStopStation :stop-stations="railRouteStopStation" :pb-ed="railRouteSegmentInfo.endStation" :pb-start="railRouteSegmentInfo.startStation"/>
      </div>
    </div>
  </div>
  <div class="card w-75"  v-for="b of bookingInfo" style="padding: 0px 0px;border: 0px white solid;">
    <div class="card-header">
      <h5 class="card-title">{{ b.ticketDiscount.ticketDiscountName }}</h5><!--{{ seatList[i].carriage }}-->
    </div>
    <div class="card-body booking-box">
      <p class="card-text">第{{ b.seat.carriage }}車廂 {{ b.seat.seatCode }} {{ b.seat.seatDescirption }} {{ b.ticketDiscount.ticketDiscountName }}{{ railRouteSegmentInfo.railRouteSegmentTicketPrice }}元</p>
      <a href="#" v-if="b.ticketQRcode==null" @click="createTicketQR(b)" class="btn btn-outline-primary">
        生成車票QRcode
      </a>
      <div v-else>
        <a href="#" class="btn btn-outline-success">分配車票</a>
        <a href="#" @click="checkQrcode(b)" class="btn btn-outline-success">查看車票QRcode</a>
      </div>
    </div>
  </div>
</div>
</div>
<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" style="display: none;" id="toggle-qr-modal" data-bs-toggle="modal" data-bs-target="#showQRcodeModal">
  qrcode-display-modal-btn
</button>

<!-- Modal -->
<div class="modal fade" id="showQRcodeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">車票QRCODE</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <img id="qr-img" alt="沒有QRcode生成"><!--:src="ticketQRcodeSrc"-->
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
    /* margin: 10px 30px; */
    /* display:flex; */
    /* justify-content: space-around; */

}
.stop-stations{
  display: flex;
  justify-content: center
}
.stop-stations>div{
  margin: 40px 35px;
}
.c{
  margin: 20px 20px;
}
.marquee-container {
  display: inline;
  width: 100%;
  overflow: hidden;
}

.marquee-content {
  /* background-color: green; */
  display: flex;
  white-space: nowrap;
  animation: marquee 3s linear infinite;
}
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(60%);
  }
}

</style>