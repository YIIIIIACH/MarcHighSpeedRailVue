<script>
import  scheduleList from  '../components/Marc/scheduleList.vue'
import scheduleSearchCondition from '../components/Marc/scheduleSearchCondition.vue'
import timeShiftButton from '../components/Marc/timeShiftButton.vue'
import displayScheduleStopStation from '../components/Marc/displayScheduleStopStation.vue'
import httpClient from '@/main';
import backendURL from '@/main'
import { ref ,reactive , onMounted} from 'vue'
    export default{
        setup(){
            return {
                selectStartStation: ref({ "id":null,"stationName":'others'}),
                selectEndStation: ref({ "id":null,"stationName":'some'}),
                departTime: reactive({'time':new Date()}),
                allStation: reactive([]),
                allDiscount: ref([]),
                //'一般票','早鳥票','學生票','商務票'
                selectDiscount: ref(''),
                scheduleSearchResult: reactive([])
            }
        },
        computed:{
            
        },
        methods:{
            searchTimeShift: function( hr){
                // update new search time
                let tmpDate = new Date();
                tmpDate.setTime( this.departTime.time.getTime() + hr*60*60*1000)
                console.log(tmpDate)
                this.departTime.time = tmpDate;
                // fetch the new search condition schedule result

                // refresh on scheudle list
            },
            outTest:function(sted){
                //find allStation which stationName.euqals sted[0].station ==>reasign
                this.selectDiscount=sted[2]
                console.log(this.selectDiscount)
                for( let t of this.allStation){
                    if(t.stationName == sted[0].stationName){
                        this.selectStartStation.value = t;
                    }
                }
                for( let t of this.allStation){
                    if(t.stationName == sted[1].stationName){
                        this.selectEndStation.value = t;
                    }
                }
                console.log(`${this.selectStartStation.value.stationName}${this.selectEndStation.value.stationName}${this.selectDiscount.value}${this.departTime.time}`)
            },
        },
        components:{
            scheduleList,
            scheduleSearchCondition,
            timeShiftButton,
            displayScheduleStopStation
        },
        beforeMount(){
            // fetch all station 
            httpClient.get('/getAllStation')
            .then((res)=>{
                let a = res.data;
                for( let st of a){
                    this.allStation.push(st)
                }
            }).catch((err)=>{
                console.log(err)
            }).then(()=>{
                this.selectStartStation.value=this.allStation[0]
                this.selectEndStation.value=this.allStation[0]
            })

            // fetch the default result of schedule
            ///searchScheduleByTimeGetOnOffStation/{onStationId}/{offStationId}/{proximateTime}
            //proximateTime  yyyy-MM-dd-HH-mm
            httpClient.get('searchScheduleByTimeGetOnOffStation/'+14+'/'+25+'/'+'2023-12-2-8-30')
            .then(res=>{
                // try to sort array of schedule in here 
                res.data.sort( function(a,b){
                    console.log(a.getOnTime)
                    console.log(b.getOnTime)
                    return new Date(a.getOnTime) - new Date(b.getOnTime);
                })

                for( let tmp of res.data){
                    this.scheduleSearchResult.push( tmp)
                }
            }).then(()=>{
                console.log( this.scheduleSearchResult)
            })

            httpClient.get('/getAllTicketDiscountType').then(res=>{
                // console.log(res);
                // this.allDiscount.value= res.data;
                let a = res.data;
                for( let ds of a){
                    this.allDiscount.push(ds)
                }
                // console.log(this.allDiscount)
            }).then(()=>{
                this.selectDiscount= this.allDiscount[0]
                // console.log(this.selectDiscount.value)
            })
        }
    }
</script>

<template >
    <div class="bookingSystem">
        <div class="displayStopStation">
            <displayScheduleStopStation></displayScheduleStopStation>
        </div>
        <div class="displaySchedule">
            <scheduleSearchCondition :selectdatetime="departTime" :allStation="allStation"  :allDiscount="allDiscount"  @search="(edst)=>outTest(edst)"></scheduleSearchCondition>
            <scheduleList :schedules="scheduleSearchResult"></scheduleList>
            <timeShiftButton @timeShift="(hr)=>searchTimeShift(hr)"></timeShiftButton>
        </div>
    </div>
</template>
<style>
    .bookingSystem{
        padding: 0px;
        margin: 20px 15%;
        display: flex;
    }
    .displayStopStation{
        background-color: aqua;
        width: 20%;
        margin:0px;
    }
    .displaySchedule{
        width:80%;
        margin: 0px;
    }
</style>