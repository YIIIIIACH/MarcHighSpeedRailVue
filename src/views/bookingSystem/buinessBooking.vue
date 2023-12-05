<script setup>
import seatColumn from '../../components/Marc/bookBuiness/seatColumn.vue';
import httpClient from '../../main'
import { onBeforeMount ,reactive, computed} from 'vue'
import 'vue-router'
const props = defineProps(['schid','ststid','edstid','amount'])// remove 'departTime'
const seats = reactive([])
const bookeds= reactive([])
const info = reactive({})
const getTotalPrice = computed(()=>{
    let cnt = 0;
    let selecteds = seats.filter((st)=> st.selected)
    for( let slct of selecteds){
        cnt += info.rrseg.railRouteSegmentTicketPrice * info.ticketDiscount.ticketDiscountPercentage/100-info.ticketDiscount.ticketDiscountAmount;
    }
    return cnt;
})
const hasSelect = computed(()=>{
    let res =seats.filter((st)=> st.selected)
    return res.length>0;
})
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
function newGoBuinessBook(){
    let selectedList = seats.filter((st)=>st.selected).map(st=>st.seatId);
    httpClient.post('/createBuinessTicketOrder/'+props.ststid+'/'+props.edstid+'/'+props.amount+'/'+props.schid,{
        "seatList": selectedList
    }
    )
    .then((res)=>{
        console.log(res.data)
        let str = res.data.toString();
        let json = JSON.parse(str.slice(8))
        console.log(json['links'])
        for( let linkObj of json['links']){
            if( linkObj['rel'] == 'approve'){
                window.location= linkObj['href']
            }
        }
    }).catch((err)=>{
        console.log(err)
    })
}
function goBookBuinessSeats(){
   //get all select seat's scheduleSeatStatus
   let toBookSeatidList = []
   for( let st of seats){
        if(st.selected){
            toBookSeatidList.push(st.seatId);
        }
   }
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
        if(res.data== 'book buiness'){
            this.$router.push('/bookSuccess/buinessBook')
        }else{
            this.$router.push('/bookFail');
        }
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
    //build up departTime;
    // console.log( props.departTime)
    // let ymd = props.departTime.toString().split(' ')[0]
    // console.log(ymd)
    // ymd = ymd.split('-')
    // let hm = props.departTime.toString().split(' ')[1]
    // console.log(hm)
    // hm = hm.split(':')
    // departTime.setFullYear( ymd[0] )
    // departTime.setMonth(ymd[1]-1)
    // departTime.setDate(ymd[2])
    // departTime.setHours( hm[0])
    // departTime.setMinutes(hm[1])
})

</script>
<template>
    <div class="container">
        <h1>MarcHighSpeedRail 商務艙訂位</h1>
        <div class=" carriage" >
            <div >
                <seatColumn v-for="(column ,idx) in columns" :key="idx" :seats="column" :bookedSeats="bookeds" :colCode="idx" ></seatColumn>
            </div>
        </div>
    </div>
    <div class="container">
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
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            前往訂票
        </button>
    
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">[注意] 商務座訂票須直接付費</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div v-if="hasSelect">
                    <span>確定要訂位</span>
                    <div v-for="selectedSeat of getSelected">
                        <span>{{ selectedSeat.seatCode }}</span>{{ selectedSeat.seatDescirption }}
                        <span v-if="selectedSeat.seatId!=undefined">
                        {{info.ticketDiscount.ticketDiscountName}}
                        </span>
                    </div>
                    <div>
                        <span>總計：{{ getTotalPrice }}元</span>
                    </div>
                </div>
                <div v-else>
                    <span>你沒有選取座位</span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                <button type="button" @click="newGoBuinessBook" data-bs-dismiss="modal" class="btn btn-primary">前往付費訂票</button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>
<style>
.carriage{
    border: 4px grey solid;
    border-radius: 8px;
    display:flex;
    justify-content: center;
}
</style>