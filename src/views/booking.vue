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
                selectStartStation: ref({ }),
                selectEndStation: ref({ }),
                departTime: reactive({'time':new Date()}),
                allStation: reactive([]),
                allDiscount: ref([]),
                //'一般票','早鳥票','學生票','商務票'
                selectDiscount: ref(''),
                scheduleSearchResult: reactive([]),
                scheduleStopStations: ref([
                    // {
                    //     stationId:14,
                    //     stationName:'南港站'
                    // },
                    // {
                    //     stationId:15,
                    //     stationName:'台北站'
                    // },
                    // {
                    //     stationId:16,
                    //     stationName:'板橋站'
                    // }
                ])
            }
        },
        computed:{
            
        },
        methods:{
            searchTimeShift: function( hr){
                // update new search time
                let tmpDate = new Date();
                tmpDate.setTime( this.departTime.time.getTime() + hr*60*60*1000)
                this.departTime.time = tmpDate;
                // fetch the new search condition schedule result
                // refresh on scheudle list
                this.search();
            },
            goSearch:function(sted){
                //find allStation which stationName.euqals sted[0].station ==>reasign
                this.selectDiscount=sted[2]
                for( let t of this.allStation){
                    if(t.stationName == sted[0].stationName){
                        this.selectStartStation.value = t;
                    }
                }
                for( let t of this.allStation){
                    if(t.stationName == sted[1].stationName){
                        this.selectEndStation.value= t;
                    }
                }
                this.search();
            },
            search:function(){
                ///searchScheduleByTimeGetOnOffStation/{onStationId}/{offStationId}/{proximateTime}
                //proximateTime  yyyy-MM-dd-HH-mm
                // console.log('search string: '+this.selectStartStation.value.stationId+'/'+this.selectEndStation.value.stationId+'/'+(this.departTime.time.getYear()+1900)+'-'+this.departTime.time.getMonth()+'-'+this.departTime.time.getDate()+'-'+this.departTime.time.getHours()+'-'+this.departTime.time.getMinutes()+'/'+this.selectDiscount)
                httpClient.get('searchScheduleByTimeGetOnOffStation/'+this.selectStartStation.value.stationId+'/'+this.selectEndStation.value.stationId+'/'+(this.departTime.time.getYear()+1900)+'-'+(this.departTime.time.getMonth()+1)+'-'+this.departTime.time.getDate()+'-'+this.departTime.time.getHours()+'-'+this.departTime.time.getMinutes())
                .then(res=>{
                    // try to sort array of schedule in here 
                    res.data.sort( function(a,b){
                        return new Date(a.getOnTime) - new Date(b.getOnTime);
                    })
                    //clear old schedule search result
                    while( this.scheduleSearchResult.length>0){
                        this.scheduleSearchResult.pop();
                    }
                    for( let tmp of res.data){
                        this.scheduleSearchResult.push( tmp)
                    }
                }).then(()=>{
                    // console.log( this.scheduleSearchResult)
                })
            },
            refreshStopStationDisplay:function(schid){
                httpClient.get('/getScheduleStopStationByScheduleId?schid='+schid)
                .then((res)=>{
                    while(this.scheduleStopStations.length>0){
                        this.scheduleStopStations.pop();
                    }
                    for( let schspst of res.data){
                        this.scheduleStopStations.push(schspst);
                    }
                    // console.log(res.data)
                })
            }
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
                this.selectEndStation.value=this.allStation[this.allStation.length-1]
            }).then(()=>{
                // fetch the default result of schedule
                this.search();
            })

            httpClient.get('/getAllTicketDiscountType').then(res=>{
                // this.allDiscount.value= res.data;
                let a = res.data;
                for( let ds of a){
                    this.allDiscount.push(ds)
                }
            }).then(()=>{
                this.selectDiscount= this.allDiscount[0]
            })
        }
    }
</script>

<template >
    <div class="bookingSystem">
        <div class="displayStopStation">
            <displayScheduleStopStation :stop-stations="scheduleStopStations"></displayScheduleStopStation>
        </div>
        <div class="displaySchedule">
            <scheduleSearchCondition :selectdatetime="departTime" :allStation="allStation"  :allDiscount="allDiscount"  @search="(edst)=>goSearch(edst)"></scheduleSearchCondition>
            <scheduleList :schedules="scheduleSearchResult" @refresh-stop-station-display="(sch)=>refreshStopStationDisplay(sch.scheduleId)"></scheduleList>
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
        width: 20%;
        margin:0px;
    }
    .displaySchedule{
        width:80%;
        margin: 0px;
    }
</style>