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
                selectStartStation: ref(-1),
                selectEndStation: ref(-1),
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
                this.selectStartStation = newst;
            },
            edChange:function(newst){
                this.selectEndStation = newst;
            },
            discChange:function(newDisc){
                this.selectDiscount=newDisc;
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
            goSearch:function(){
                //find allStation which stationName.euqals sted[0].station ==>reasign
                // this.selectDiscount=sted[2]
                console.log('go search')
                this.search();
            },
            search:function(){
                
                ///searchScheduleByTimeGetOnOffStation/{onStationId}/{offStationId}/{proximateTime}
                //proximateTime  yyyy-MM-dd-HH-mm
                httpClient.get('searchScheduleByTimeGetOnOffStation/'+this.selectStartStation+'/'+this.selectEndStation+'/'+(this.departTime.time.getYear()+1900)+'-'+(this.departTime.time.getMonth()+1)+'-'+this.departTime.time.getDate()+'-'+this.departTime.time.getHours()+'-'+this.departTime.time.getMinutes())
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
                    
                    console.log(res.data)
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
                this.selectStartStation=this.allStation[0].stationId
                this.selectEndStation=this.allStation[this.allStation.length-1].stationId
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
    <div class="bookingSystem"><!--@ststchange="(newst)=>stChange(newst)" @edstchange="(newst)=>edChange(newst)" 'changeStSt','changeEdSt'-->
            <displayScheduleStopStation @changeStSt="(newSt)=>stChange(newSt)" @changeEdSt="(newSt)=>{edChange(newSt);goSearch()}" :stop-stations="scheduleStopStations" :all-stations="allStation" :display="showScheduleStopStation" :stst="selectStartStation" :edst="selectEndStation" ></displayScheduleStopStation>
            <div class="displaySchedule">
                <scheduleSearchCondition :selectdatetime="departTime" :allStation="allStation"  :allDiscount="allDiscount"  :disc="selectDiscount" :stst="selectStartStation" :edst="selectEndStation" @search="goSearch" @ststchange="(newst)=>stChange(newst)" @edstchange="(newst)=>edChange(newst)" @discchange="(newDisc)=>discChange(newDisc)"></scheduleSearchCondition>
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