<script>
import {ref, reactive} from 'vue'
import httpClient from '../../main'
import  scheduleList from  '../../components/Marc/scheduleList.vue'
import scheduleSearchCondition from '../../components/Marc/scheduleSearchCondition.vue'
import timeShiftButton from '../../components/Marc/timeShiftButton.vue'
import displayScheduleStopStation from '../../components/Marc/displayScheduleStopStation.vue'
import backendURL from '@/main'
import { onMounted} from 'vue'
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
                scheduleStopStations: ref([]),
                showScheduleStopStation: ref(false)
            }
        },
        computed:{
            
        },
        methods:{
            stChange:function(newst){
                console.log(' st change')
                this.selectStartStation.value = newst;
                console.log( this.selectStartStation.value)
            },
            edChange:function(newst){
                console.log(' ed change')
                this.selectEndStation.value = newst;
                console.log( this.selectEndStation.value)
            },
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
                this.search();
            },
            search:function(){
                ///searchScheduleByTimeGetOnOffStation/{onStationId}/{offStationId}/{proximateTime}
                //proximateTime  yyyy-MM-dd-HH-mm
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
                    if( this.scheduleSearchResult.length>0){
                        this.refreshStopStationDisplay(this.scheduleSearchResult[0].scheduleId)
                    }else{
                        while(this.scheduleStopStations.length>0){
                            this.scheduleStopStations.pop();
                        }
                    }
                })
            },
            refreshStopStationDisplay:function(schid){
                this.showScheduleStopStation=false;
                httpClient.get('/getScheduleStopStationByScheduleId?schid='+schid)
                .then((res)=>{
                    while(this.scheduleStopStations.length>0){
                        this.scheduleStopStations.pop();
                    }
                    // SORT by sequence
                    let tmp = [];
                    for( let spst of res.data){
                        tmp.push(spst);
                    }
                    tmp.sort((a,b)=>{
                        return a.railRouteStopStation - b.railRouteStopStation;
                    })
                    for( let schspst of tmp){
                        this.scheduleStopStations.push(schspst);
                    }
                    this.showScheduleStopStation=true;
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
            this.departTime.time.setMinutes(0);
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
            <displayScheduleStopStation :stop-stations="scheduleStopStations" :display="showScheduleStopStation" :stst="selectStartStation" :edst="selectEndStation" @ststchange="(newst)=>stChange(newst)" @edstchange="(newst)=>edChange(newst)"></displayScheduleStopStation>
            <div class="displaySchedule">
                <scheduleSearchCondition :selectdatetime="departTime" :allStation="allStation"  :allDiscount="allDiscount"  :stst="selectStartStation" :edst="selectEndStation" @search="(edst)=>goSearch(edst)"></scheduleSearchCondition>
                <timeShiftButton @timeShift="(hr)=>searchTimeShift(hr)"></timeShiftButton>
            <scheduleList :schedules="scheduleSearchResult" @refresh-stop-station-display="(sch)=>refreshStopStationDisplay(sch.scheduleId)"></scheduleList>
        </div>
    </div>
</template>
<style>
    /* .display-stop-station{
        width:160px
    } */
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