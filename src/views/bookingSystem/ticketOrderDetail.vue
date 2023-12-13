<script setup>
import { onBeforeMount,ref, reactive,computed} from 'vue';
import httpClient from '../../main';
import ticketStopStation from '../../components/Marc/ticketStopStation.vue'
// import { defineEmits,defineProps } from 'vue';
// import { defineEmits} from 'vue'
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
const formatStArrtime = computed(()=> {
  if(Object.keys(schInfo).length >0 ){
    let allTime = stArr.arriveTime.toString()
    let dstr = allTime.split(' ')[0]
    dstr = dstr.split('-')
    return dstr[0]+'年' +dstr[1]+'月'+dstr[2] +'日'
  }
  return ''
})
const formatEtArrtime = computed(()=> {
  if(Object.keys(schInfo).length >0 ){
    let allTime = edArr.arriveTime.toString()
    let dstr = allTime.split(' ')[0]
    dstr = dstr.split('-')
    return dstr[0]+'年' +dstr[1]+'月'+dstr[2] +'日'
  }
  return ''
})
const emits = defineEmits(['updateMemberId'])
// this.defineProps([])
const props = defineProps(['tckodid','memberId'])
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
        // console.log(res.data)
        ststName.value = res.data.ticketRailRouteSegment.startStation.stationName;
        edstName.value = res.data.ticketRailRouteSegment.endStation.stationName
        Object.assign(schInfo , res.data.ticketSchedule);
        Object.assign( railRouteSegmentInfo, res.data.ticketRailRouteSegment)
        Object.assign( stArr, res.data.startArrive);
        Object.assign( edArr, res.data.endArrive);
        let len = res.data.bookingIdList.length;
        // console.log('len:'+len)
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
    let i = 0;
    for (let stst of res.data){
      railRouteStopStation.push(stst);
    }
    loadingStopSt.value=false
  }).catch(err=> {
  })
}
</script>
<template>
<div >
<div class="container" style="padding-bottom: 20%;">
  <div class="row justify-content-center" style="z-index: 1000;" >
    <div class="card" style="padding: 10px 0px;padding-bottom: 30px;margin-top: 5%;border: 0px rgb(255, 255, 255) solid;" >
      <div class="card-header text-center"  style="display: flex;justify-content: space-between;padding: 50px 50px;border-radius: 15px;" >
        <button type="button" @click="$router.push('/ticketOrder')" class="btn btn-outline-secondary changepage-botton">回上一頁</button>
        <div class="card-text"  v-show="!loadingStopSt">
        <label>花費時間{{ railRouteSegmentInfo.railRouteSegmentDurationMinute }}分鐘</label>
        <div class="cart-title" style="display: flex;justify-content: space-between;align-items: center;" ><label>{{formatStArrtime}}</label><label class="station-text">{{ ststName }}站 —————  {{ edstName }}站</label><label>{{ formatEtArrtime }}</label></div>
        </div>
      <button type="button" @click="$router.push('/')" class="btn btn-outline-secondary changepage-botton" >回首頁</button>
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
  <Transition name="slide">
    <div class="card w-75" v-show="!loadingStopSt"  style="padding: 0px 0px;border: 0px white solid;margin: 10px 0px;z-index: 0;">
      <div class="card-header">
        <h5 class="card-title">訂單車票</h5><!--{{ seatList[i].carriage }}-->
      </div>
      <div class="card-body booking-box" v-for="b of bookingInfo">
        <div>
          <h3>{{ b.ticketDiscount.ticketDiscountName }}</h3>
          <p class="card-text ">第{{ b.seat.carriage }}車廂 {{ b.seat.seatCode }} {{ b.seat.seatDescirption }} {{ b.ticketDiscount.ticketDiscountName }}{{ railRouteSegmentInfo.railRouteSegmentTicketPrice }}元</p>
        </div>
        <div v-if="b.ticketQRcode==null" @click="createTicketQR(b)" class="ticket-button">
          <a href="#"   class="btn btn-primary">
            生成車票QRcode
          </a>
        </div>
        <div v-else class="ticket-button">
          <a href="#" class="btn btn-success">分配車票</a>
          <a href="#" @click="checkQrcode(b)" class="btn btn-outline-success">查看車票QRcode</a>
        </div>
      </div>
    </div>
  </Transition>
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
</div>
</template>
<style>
.schedule-box{
  display:flex;
    justify-content: space-around;
  }
  .booking-box{
    border: 5px rgb(255, 255, 255) solid;
    margin: 20px 15px;
    box-shadow: 2px 2px 2px 2px rgb(180, 180, 180);
    border-radius: 10px;
    display: inline-flex;
    justify-content: space-between;
    align-items:end;
    transition: width 1s, height 1s, transform 1s;
}
.ticket-button{
  margin-right: 20px;
}
.booking-box:hover{
  border: 5px rgb(13, 104, 66) solid;
  box-shadow: 5px 5px 5px 5px rgb(180, 180, 180);
  transform: scale(1.1)
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
.changepage-botton:hover{
  border-radius: 30%;
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
.member-info-bar{
    display: flex;
    flex-direction: row-reverse;
}
.station-text{
  font-size: 42px;
}
.slide-leave-active,
.slide-enter-active {
  transition: all .9s ease;
}

.slide-enter-from {
  transform: translateY(70%);
}

.slide-leave-to {
  transform: translateY(-70%);
}
</style>