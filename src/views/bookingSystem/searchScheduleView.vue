<script>
import {ref, reactive} from 'vue'
import httpClient from '../../main'
import  scheduleList from  '../../components/Marc/schedule/searchSchedule/searchScheduleList.vue'
import scheduleSearchCondition from '../../components/Marc/schedule/searchSchedule/searchScheduleSearchCondition.vue'
// import timeShiftButton from '../../components/Marc/schedule/timeShiftButton.vue'
import displayScheduleStopStation from '../../components/Marc/schedule/displayScheduleStopStation.vue'
    export default{
        setup(){
            return {
                selectStartStation: ref(14),
                selectEndStation: ref(25),
                departTime: reactive({'time':new Date()}),
                allStation: reactive([]),
                allDiscount: ref([]),
                //'一般票','早鳥票','學生票','商務票'
                selectDiscount: ref('一般票'),
                scheduleSearchResult: reactive([]),
                scheduleStopStations: ref([]),
                showScheduleStopStation: ref(true),
                showProgressBar:ref(false),
                pbStart:ref('0%'),
                pbEnd:ref('100%'),
                //分別代表 一般票 商務票 學生票 早鳥票的優惠 以及額外兩種多餘顏色
                discColorList:ref(['#ff7f7f','#cfb558','#97e422','#55e9ff','#c385ff','#e8e6c0'])
            }
        },
        computed:{
            discColor(){
                //get index of selectDiscount in allDiscount
                for( let idx = 0; idx<this.allDiscount.length;idx++){
                    if( this.allDiscount[idx]== this.selectDiscount){
                        return this.discColorList[idx]
                    }
                }
                return '#ffffff'
            }
        },
        methods:{
            stChange:function(newst){
                this.selectStartStation = newst;
                this.pbEnd='0%' 
            },
            edChange:function(newst){
                this.showProgressBar=false
                this.selectEndStation = newst;
                // determine is forward seqence 
                if(newst > this.selectStartStation){
                    for( let i=0;i < this.allStation.length; i++){
                        if(this.allStation[i].stationId==this.selectStartStation){
                            this.pbStart= ( (100*i) /(this.allStation.length-1))+'%'
                        }
                    }
                    for( let i=0;i < this.allStation.length; i++){
                        if(this.allStation[i].stationId==newst){
                            this.pbEnd= ( (100*i) /(this.allStation.length-1) - parseFloat( this.pbStart.split('%')[0]))+'%'
                        }
                    }
                }else{
                    for( let i=0;i < this.allStation.length; i++){
                        if(this.allStation[i].stationId==newst){
                            this.pbStart= ( (100*i) /(this.allStation.length-1))+'%'
                        }
                    }
                    for( let i=0;i < this.allStation.length; i++){
                        if(this.allStation[i].stationId==this.selectStartStation){
                            this.pbEnd= ( (100*i) /(this.allStation.length-1) - parseFloat( this.pbStart.split('%')[0]))+'%'
                        }
                    }
                }

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
                console.log('go search')
                this.search();
            },
            search:function(){
                this.showProgressBar=false
                setTimeout(() => {
                    this.showProgressBar=true;
                }, 400);
                // this.showScheduleStopStation=false
                ///searchScheduleByTimeGetOnOffStation/{onStationId}/{offStationId}/{proximateTime}
                //proximateTime  yyyy-MM-dd-HH-mm
                httpClient.get('searchScheduleByTimeGetOnOffStation/'+this.selectStartStation+'/'+this.selectEndStation+'/'+(this.departTime.time.getYear()+1900)+'-'+(this.departTime.time.getMonth()+1)+'-'+this.departTime.time.getDate()+'-'+this.departTime.time.getHours()+'-'+this.departTime.time.getMinutes())
                .then(res=>{
                    let newSchs = res.data;
                    // try to sort array of schedule in here 
                    newSchs.sort( function(a,b){
                        return new Date(a.getOnTime) - new Date(b.getOnTime);
                    })
                    while( this.scheduleSearchResult.length>0){
                        this.scheduleSearchResult.pop();
                    }
                    for( let i=0; i<newSchs.length; i++){
                        this.scheduleSearchResult.push( newSchs[i])
                    }
                    
                }).then(()=>{
                    if( this.scheduleSearchResult.length>0){
                        this.refreshStopStationDisplay(this.scheduleSearchResult[0].scheduleId)
                    }
                })
            },
            refreshStopStationDisplay:function(schid){
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
                })
            }
        },
        components:{
            scheduleList,
            scheduleSearchCondition,
            // timeShiftButton,
            displayScheduleStopStation
        },
        beforeMount(){
            setTimeout(()=>this.showProgressBar=true,700)
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
        },
        props:['memberId'],
        emits:['updateMemberId']
    }
</script>

<template >
    <div class="bookingSystem">
        <displayScheduleStopStation @changeStSt="(newSt)=>stChange(newSt)" @changeEdSt="(newSt)=>{edChange(newSt);goSearch()}" :pbStart="pbStart" :pbEd="pbEnd" :showSideBar="showProgressBar" :stop-stations="scheduleStopStations" :all-stations="allStation" :display="showScheduleStopStation" :stst="selectStartStation" :edst="selectEndStation" ></displayScheduleStopStation>
        <div class="displaySchedule">
            <scheduleSearchCondition :selectdatetime="departTime" :allStation="allStation"  :allDiscount="allDiscount"  :disc="selectDiscount" :stst="selectStartStation" :edst="selectEndStation" @search="goSearch" @ststchange="(newst)=>stChange(newst)" @edstchange="(newst)=>edChange(newst)" @discchange="(newDisc)=>discChange(newDisc)" @timeShift="(hr)=>searchTimeShift(hr)"></scheduleSearchCondition>
            
            <scheduleList :schedules="scheduleSearchResult"  @refresh-stop-station-display="(sch)=>refreshStopStationDisplay(sch.scheduleId)" :colorList="discColorList" :allDisc="allDiscount"></scheduleList>
        </div>
    </div>
    <div class="container">
        
    </div>
</template>
<style>
    /* .display-stop-station{
        width:160px
    } */
    .bookingSystem{
        position:relative;
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
    .progress-bar-vertical {
        position:absolute;
        left:45px;
        top:40px;
        width: 25px;
        min-height: 780px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        /* align-items: flex-end; */
        float:left;
        z-index: 10;
    }

    .progress-bar-vertical
    .progress-bar {
        width: 100%;
        background-color: rgb(255, 255, 255);
        z-index: 10;
    }
    
    .fade-enter-active{
        transition: opacity .5s
    }
    .fade-leave-active {
        transition: opacity .07s;
    }
    .fade-enter-from,
    .fade-leave-to {
    opacity: 0;
    }
</style>