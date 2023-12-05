<script>
import {ref, reactive} from 'vue'
import 'vue-router'
import httpClient from '../../main'
import  scheduleList from  '../../components/Marc/schedule/scheduleList.vue'
import scheduleSearchCondition from '../../components/Marc/schedule/scheduleSearchCondition.vue'
import timeShiftButton from '../../components/Marc/schedule/timeShiftButton.vue'
import displayScheduleStopStation from '../../components/Marc/schedule/displayScheduleStopStation.vue'
    export default{
        setup(){
            return {
                selectSchedule: ref(null),
                selectStartStation: ref(14),
                selectEndStation: ref(25),
                departTime: reactive({'time':new Date()}),
                allStation: reactive([]),
                allDiscount: ref([]),
                //'一般票','早鳥票','學生票','商務票'
                allDiscountDetail: ref([]),
                selectDiscount: ref('一般票'),
                scheduleSearchResult: reactive([]),
                scheduleStopStations: ref([]),
                showScheduleStopStation: ref(true),
                showProgressBar:ref(false),
                pbStart:ref('0%'),
                pbEnd:ref('100%'),
                //分別代表 一般票 商務票 學生票 早鳥票的優惠 以及額外兩種多餘顏色
                discColorList:ref(['#ff7f7f','#cfb558','#97e422','#55e9ff','#c385ff','#e8e6c0']),
                toBookDisc : ref({}),
                toBookTickets : reactive({}),
                selectInfo : reactive({}),
                computedPrice: ref(0)
            }
        },
        computed:{
            // getCurrentTotalPrice(){
            //     let cnt = 0;
            //     for(let key  of Object.keys(this.toBookTickets)){
            //         // get disc Price of key
            //         let price =0;
            //         for( let discDt of this.allDiscountDetail){
            //             if (key == discDt.ticketDiscountId){
            //                 console.log(this.selectInfo.originTicketPrice)
            //                 console.log( discDt)
            //                 price += Math.ceil(((this.selectInfo.originTicketPrice * discDt.ticketDiscountPercentage)/100.0)-discDt.ticketDiscountAmount)* this.toBookTickets[key]
            //             }
            //         } 
            //         cnt+= price;
            //     }
            //     return cnt;
            // },
            getStartStationName(){
                for( let st of this.allStation){
                    if( this.selectStartStation == st.stationId){
                        return st.stationName;
                    }
                }
                return '沒找到';
            },
            getEndStationName(){
                for( let st of this.allStation){
                    if( this.selectEndStation == st.stationId){
                        return st.stationName;
                    }
                }
                return '沒找到';
            },
            getDiscByDiscType(){
                this.toBookTickets={}
                let res = []
                if(this.toBookDisc=={}){
                    return []
                }
                if(this.toBookDisc.ticketDiscountType=='一般票'){
                    //get all ticket discount of discountType is '一般票'
                    for(let d of this.allDiscountDetail){
                        if( d.ticketDiscountType=='一般票'){
                            res.push( d)
                        }
                    }
                    // and return
                    return res;
                }
                // return this.allDiscountDetail;
                return [ this.toBookDisc ]
            },
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
            updatePrice: function(){
                let cnt = 0;
                for(let key  in this.toBookTickets){
                    // get disc Price of key
                    let price =0;
                    for( let discDt of this.allDiscountDetail){
                        if (key == discDt.ticketDiscountId){
                            console.log( discDt)
                            price += Math.ceil(((this.selectInfo.originTicketPrice * discDt.ticketDiscountPercentage)/100.0)-discDt.ticketDiscountAmount)* this.toBookTickets[key]
                        }
                    } 
                    cnt+= price;
                }
                console.log( cnt)
                // return cnt;
                this.computedPrice=cnt;
            },
            bookTicket:function(){
                if( this.toBookDisc.ticketDiscountName=='商務票'){
                    //'/booking/buinessSeat/:schid/:ststid/:edstid/:departTime/:amount'
                    this.$router.push({path:'/booking/buinessSeat/'+this.selectSchedule+'/'+this.selectStartStation+'/'+this.selectEndStation+'/'+this.getToBookTicketInDiscList().length})
                    return;
                }

                // console.log( this.getToBookTicketInDiscList());
                httpClient.post('/booking'
                ,{
                    "scheduleId": this.selectSchedule,
                    "ticketDiscountId": this.toBookDisc.ticketDiscountId,
                    "startStationId": this.selectStartStation,
                    "endStationId":this.selectEndStation,
                    "chooseDiscounts": this.getToBookTicketInDiscList()
                }).then((res)=>{
                    console.log(res)
                    if( res.status== 200){
                        let ticketOrderId = res.data.split(':')[1];
                        // console.log( ticketOrderId);
                        this.$router.push('/bookSuccess/'+ticketOrderId)
                    }else{
                        this.$router.push('/bookFail');
                    }
                })
            },
            dateToStr:function(dt){
                console.log( dt)
                console.log( dt.getYear())
                return dt.getYear()+'-'+dt.getMonth()+'-'+dt.getDate()+'%'+dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds();
            },
            getToBookTicketInDiscList:function(){
                if( this.toBookTickets=={}){
                    return []
                }
                let res = [];
                for( let key in this.toBookTickets){
                    for( let cnt=0; cnt<this.toBookTickets[key]; cnt++){
                        res.push( key )
                    }
                }
                return res;
            },
            stChange:function(newst){
                this.selectStartStation = newst;
                this.pbEnd='0%' 
            },
            edChange:function(newst){
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
                this.search();
            },
            search:function(){
                this.computedPrice=0
                this.toBookTickets={}
                this.showProgressBar=false
                setTimeout(() => {
                    this.showProgressBar=true;
                }, 700);
                while(this.allStation.length>0){
                    this.allStation.pop();
                }
                httpClient.get('/getAllStation')
                .then((res)=>{
                    let a = res.data;
                    for( let st of a){
                        this.allStation.push(st)
                    }
                }).catch((err)=>{
                    console.log(err)
                })
                // this.showScheduleStopStation=false
                ///searchScheduleByTimeGetOnOffStation/{onStationId}/{offStationId}/{proximateTime}
                //proximateTime  yyyy-MM-dd-HH-mm
                ///searchBookableScheduleByTimeGetOnOffStation
                httpClient.get('/searchBookableScheduleByTimeGetOnOffStation/'+this.selectStartStation+'/'+this.selectEndStation+'/'+(this.departTime.time.getYear()+1900)+'-'+(this.departTime.time.getMonth()+1)+'-'+this.departTime.time.getDate()+'-'+this.departTime.time.getHours()+'-'+this.departTime.time.getMinutes()+'/'+this.selectDiscount)
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
                    if(this.scheduleSearchResult.length==0){
                        while(this.scheduleStopStations.length>0){
                            this.scheduleStopStations.pop();
                        }
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
            timeShiftButton,
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
                console.log( 'before mount show '+ this.allDiscount.length)
            }).then(()=>{
                this.selectDiscount= this.allDiscount[0]
            })
            httpClient.get('/getAllDiscount').then((res)=>{
                // console.log( res.data)
                for( let d of res.data){
                    this.allDiscountDetail.push( d );
                }
            })
        }
    }
</script>

<template >
    <div class="bookingSystem">
        <transition name="fade" mode="in-out">
            <!-- <div class="progress progress-bar-vertical" v-show="showProgressBar">
                <div class="progress-bar" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style="height: 77%;"></div>
            </div> -->
            <div class="progress progress-bar-vertical" v-show="showProgressBar">
            <div class="progress-bar" role="progressbar" :style="{'height':pbStart}"></div>
            <div class="progress-bar" role="progressbar"  style="background-color: rgb(255, 195, 14);" :style="{'height':pbEnd}">
            </div>
        </div>
        </transition>
        <displayScheduleStopStation @changeStSt="(newSt)=>stChange(newSt)" @changeEdSt="(newSt)=>{edChange(newSt);goSearch()}" :stop-stations="scheduleStopStations" :all-stations="allStation" :display="showScheduleStopStation" :stst="selectStartStation" :edst="selectEndStation" ></displayScheduleStopStation>
        <div class="displaySchedule">
            <scheduleSearchCondition :selectdatetime="departTime" :allStation="allStation"  :allDiscount="allDiscount"  :disc="selectDiscount" :stst="selectStartStation" :edst="selectEndStation" @search="goSearch" @ststchange="(newst)=>stChange(newst)" @edstchange="(newst)=>edChange(newst)" @discchange="(newDisc)=>{discChange(newDisc);goSearch()}"></scheduleSearchCondition>
            <timeShiftButton @timeShift="(hr)=>searchTimeShift(hr)"></timeShiftButton>
            <scheduleList :schedules="scheduleSearchResult" :discColor="discColor" @refresh-stop-station-display="(sch)=>refreshStopStationDisplay(sch.scheduleId)" :selectDisc="selectDiscount" @goBook="(schidAndDisc)=>{toBookDisc=schidAndDisc[1];selectSchedule=schidAndDisc[0];selectInfo=schidAndDisc[3]}"></scheduleList>
        </div>
    </div>
    
    <div class="container">
        <div class="modal" tabindex="-1" id="howManyTicket">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ getStartStationName}}站-{{ getEndStationName }}站</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label style="margin-bottom: 20px;"> 總價格：{{ computedPrice }}元</label>
                    <div v-for="d of getDiscByDiscType" :key="d.ticketDiscountId">
                        <label>{{ d.ticketDiscountName }}</label><input type="number" @change="updatePrice()" min="0" v-model="toBookTickets[d.ticketDiscountId]" class="form-control"/>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"  data-bs-dismiss="modal">取消</button>
                    <button type="button"  data-bs-dismiss="modal" @click="bookTicket()" class="btn btn-primary">前往訂票</button>
                </div>
                </div>
            </div>
        </div>
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
        left:50px;
        top:40px;
        width: 30px;
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