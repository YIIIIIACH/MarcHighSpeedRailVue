<script setup>
import seatColumn from '../../components/Marc/seatColumn.vue';
import httpClient from '../../main'
import { onBeforeMount ,reactive, computed} from 'vue'
// import { useRouter,useRoute} from 'vue-router'
// const router = useRouter();
// const route = useRoute();
const name = 'bookBuinessSeat'
const props = defineProps(['schid','ststid','edstid'])
const seats = reactive([])
const bookeds= reactive([])
// const railRouteSegment = reactive({})
// const ticketDiscount = reactive({})
const info = reactive({})
const getSelected= computed(()=>{
    let res =seats.filter((st)=> st.selected)
    if(res.length==0)return [{'emptyMsg':'你沒有選取座位'}];
    return res;
})
const columns = reactive({
    "A":[],
    "B":[],
    "C":[],
    "D":[],
    "E":[]
})
function goBookBuinessSeats(){
   //get all select seat's scheduleSeatStatus
   let toBookSeatidList = []
   for( let st of seats){
        if(st.selected){
            toBookSeatidList.push(st.seatId);
        }
   }
//    console.log(toBookSeatidList)
//    console.log(props['schid'])
    httpClient.post('/bookBuinessSeat',{
        "ticketDiscountName":"商務票",
        "scheduleId":props['schid'],
        "startStation":{
            "stationId": props['ststid'],
            "stationName":null
        },
        "endStation":{
            "stationId": props['edstid'],
            "stationName":null
        },
        "orderSeatIdList":toBookSeatidList
    }).then((res)=>{
        console.log(res.data)
    })
}

onBeforeMount(() => {
    httpClient.post('/requestDiscountTypeBook',{
        "ticketDiscountName":"商務票",
        "scheduleId": props.schid,
        "startStation":{
            "stationId":props.ststid,
            "stationName":null
        },
        "endStation":{
            "stationId": props.edstid,
            "stationName": null
        }
    }).then((res)=>{
        // console.log(res.data)
        for( let st of res.data.seatList){
            seats.push(st)
            seats[seats.length-1]['selected']=false
        }
        for( let st of seats){
            columns[st.seatCode.split('-')[1]].push(st);
        }
        for(let bookedSeatId of res.data.bookedSeatIdList){
            bookeds.push(bookedSeatId);
        }
        // console.log(bookeds)
    })
    httpClient.get('/findRailRouteSegmentBySchidStstEdst/'+props.schid+'/'+props.ststid+'/'+props.edstid)
    .then((res)=>{
        // console.log(res.data)
        if(res.data.length>0){
            info.rrseg=res.data[0]
        }
    })
    httpClient.get('/getTicketDiscountByTypeName?discName=商務票')
    .then((res)=>{
        // console.log(res.data)
        if(res.data.length>0){
            info.ticketDiscount=res.data[0]
        }
    })
})

</script>
<template>
    <h1>buiness class booking</h1>
    <div class="container carriage" >
        <div style="width: 25%;padding: 0px;"></div>
        <div>
            <seatColumn v-for="(column ,idx) in columns" :key="idx" :seats="column" :bookedSeats="bookeds" :colCode="idx" ></seatColumn>
        </div>
        <div style="width: 25%;padding: 0px;"></div>
    </div>
    <button @click="goBookBuinessSeats">訂商務票</button>
    <div class="card">
    <a class="card-header" style="text-decoration: none;" data-bs-toggle="collapse" href="#buinessBookDetail" role="button" aria-expanded="false" aria-controls="buinessBookDetail">
        查看已選取座位
    </a>
    </div>
    <div class="collapse" id="buinessBookDetail">
    <div class="card card-body" v-for="selectedSeat of getSelected">
        <div >
            {{ selectedSeat.seatId }}{{ selectedSeat.seatCode }}{{ selectedSeat.seatDescirption }}{{ selectedSeat.emptyMsg }}
             <span v-if="selectedSeat.seatId!=undefined">
                {{info.ticketDiscount.ticketDiscountName}}:{{ info.rrseg.railRouteSegmentTicketPrice *(info.ticketDiscount.ticketDiscountPercentage/100)-info.ticketDiscount.ticketDiscountAmount+'元' }}
             </span>
        </div>
    </div>
    </div>
</template>
<style>
.carriage{
    border: 4px grey solid;
    border-radius: 8px;
    display:flex
}
</style>