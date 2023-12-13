<script>
import {ref, reactive} from 'vue'
import axios from 'axios';
import 'vue-router'
import httpClient from '../../main'
import  scheduleList from  '../../components/Marc/schedule/scheduleList.vue'
import scheduleSearchCondition from '../../components/Marc/schedule/scheduleSearchCondition.vue'
import displayScheduleStopStation from '../../components/Marc/schedule/displayScheduleStopStation.vue'
const backendURL = import.meta.env.VITE_AXIOS_HTTP_BASEURL
var isToBooking = false;
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
                computedPrice: ref(0),
                passwordVisible:ref(false),
                userName : ref(''),
                msg : ref(''),
                account : ref(''),
                password : ref(''),
                // isToBooking: ref(false),
                emptySelectMsg: ref('')
            }
        },
        computed:{
            
            getCurrentPwdInputType(){
                return (this.passwordVisible==true)?'text':'password'
            },
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
            },
            isLogined(){
                if(document.cookie=='') return false
                let ckArr = document.cookie.split('login-token=');
                console.log( document.cookie)
                if(ckArr.length==1){
                    return false
                }
                return true;
            }
        },
        methods:{
            goLogin:function(){
                httpClient.post('requestMemberLogin',{
                    "email": this.account,
                    "password": this.password
                },{withCredentials:true})
                .then((res)=>{
                    console.log( res)
                    if(res.status==200){
                        this.userName = res.data.member_name;
                        //click the  cancel btn to close the modal
                        document.getElementById('cancelBtn').click();
                        this.msg='';
                        this.account=''
                        this.password=''
                        this.$emit('updateMemberId', res.data.member_id)
                        if(isToBooking){
                            document.getElementById('ticket-amt-select-modal-open-btn').click();
                        }
                    }
                }).catch((err)=>{
                    this.msg='帳號或密碼有誤'
                })
            },
            checkLoginToken:function(){
                if( this.memberId ==='undefined' ) return false;
                return true;
            },
            updatePrice: function(){
                let cnt = 0;
                for(let key  in this.toBookTickets){
                    // get disc Price of key
                    let price =0;
                    for( let discDt of this.allDiscountDetail){
                        if (key == discDt.ticketDiscountId){
                            // console.log( discDt)
                            price += Math.ceil(((this.selectInfo.originTicketPrice * discDt.ticketDiscountPercentage)/100.0)-discDt.ticketDiscountAmount)* this.toBookTickets[key]
                        }
                    } 
                    cnt+= price;
                }
                // return cnt;
                this.computedPrice=cnt;
            },
            bookTicket:function(){
                // check login first,
                //ticket-amt-select-modal-btn
                console.log('in bookticket function')
                if( this.isEmptySelect() ){
                    this.emptySelectMsg = '請至少選取一張車票';
                    return;
                }else{
                    this.emptySelectMsg= '';
                }
                if( this.checkLoginToken()==false){
                    console.log( 'foucd no login-token toggle login modal')
                    isToBooking=true;
                    document.getElementById('login-modal-open-btn').click();
                    return;
                }
                if( this.toBookDisc.ticketDiscountName=='商務票'){
                    //'/booking/buinessSeat/:schid/:ststid/:edstid/:departTime/:amount'
                    document.getElementById('ticket-amt-select-modal-btn').click();
                    this.$router.push({path:'/booking/buinessSeat/'+this.selectSchedule+'/'+this.selectStartStation+'/'+this.selectEndStation+'/'+this.getToBookTicketInDiscList().length})
                    return;
                }
                if(this.checkLoginToken() ){
                    httpClient.post('/booking'
                    ,{
                        "scheduleId": this.selectSchedule,
                        "ticketDiscountId": this.toBookDisc.ticketDiscountId,
                        "startStationId": this.selectStartStation,
                        "endStationId":this.selectEndStation,
                        "chooseDiscounts": this.getToBookTicketInDiscList()
                    },{
                        withCredentials:true
                    }).then((res)=>{
                        console.log(res)
                        if( res.status== 200){
                            let ticketOrderId = res.data.split(':')[1];
                            document.getElementById('ticket-amt-select-modal-btn').click();
                            // console.log( ticketOrderId);
                            this.$router.push('/bookSuccess/'+ticketOrderId)
                        }else{
                            console.log(res.data);
                            
                        }
                    }).catch(err=>{
                        document.getElementById('ticket-amt-select-modal-btn').click();
                        alert('訂位失敗 剩餘座位不足')
                        console.log( err)
                    })
                    isToBooking=false
                }  
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
                }, 400);
                this.showScheduleStopStation=false
                // /searchScheduleByTimeGetOnOffStation/{onStationId}/{offStationId}/{proximateTime}
                // proximateTime  yyyy-MM-dd-HH-mm
                // /searchBookableScheduleByTimeGetOnOffStation
                httpClient.get('/searchBookableScheduleByTimeGetOnOffStation/'+this.selectStartStation+'/'+this.selectEndStation+'/'+(this.departTime.time.getYear()+1900)+'-'+(this.departTime.time.getMonth()+1)+'-'+this.departTime.time.getDate()+'-'+this.departTime.time.getHours()+'-'+this.departTime.time.getMinutes()+'/'+this.selectDiscount)
                .then(res=>{
                    
                    while( this.scheduleSearchResult.length>0){
                        this.scheduleSearchResult.pop();
                    }
                    // try to sort array of schedule in here 
                    res.data.sort( function(a,b){
                        return new Date(a.getOnTime) - new Date(b.getOnTime);
                    })
                    //clear old schedule search result
                    
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
            },
            clearCookie(){
                // console.log('cleearcookie')
                // document.cookie=''
                this.userName=''
                this.$emit('updateMemberId','undefined')
            },
            loginBtnClick(){
                document.getElementById('login-modal-open-btn').click()
            },
            isEmptySelect(){
                if( Object.keys(this.toBookTickets).length==0){
                    return true;
                }
                for( let k in this.toBookTickets){
                    if( this.toBookTickets[k] >0){
                        return false;
                    }
                }
                return true;
            }
        },
        components:{
            scheduleList,
            scheduleSearchCondition,
            displayScheduleStopStation
        },
        beforeMount(){
            this.userName= '會員'
            // this.userName=this.getCookie('member-name');
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
            httpClient.get('/getAllDiscount').then((res)=>{
                // console.log( res.data)
                for( let d of res.data){
                    this.allDiscountDetail.push( d );
                }
            })
            httpClient.post('/verifyLoginToken',{},{withCredentials:true})
            .then(res=>{
                if(res.data!= 'failed'){
                    this.userName=res.data
                    console.log('verify login token success')
                }else{
                    console.log( 'verify failed')
                }
            }).catch(err=>{
                console.log( 'verify failed')
                console.log( err)
            })
        },
        props:['memberId'],
        emits:['updateMemberId']
    }
</script>

<template >
    <div class="member-info-bar">
        <span v-if="memberId!='undefined'">歡迎會員{{ userName }}  <span @click="{clearCookie();userName='會員'}">登出</span></span><span @click="loginBtnClick" v-else>登入</span>
    </div>
    <div class="bookingSystem">
        <displayScheduleStopStation @changeStSt="(newSt)=>stChange(newSt)" @changeEdSt="(newSt)=>{edChange(newSt);goSearch()}" :pbStart="pbStart" :pbEd="pbEnd"      :showSideBar="showProgressBar" :stop-stations="scheduleStopStations" :all-stations="allStation" :display="showScheduleStopStation" :stst="selectStartStation" :edst="selectEndStation" ></displayScheduleStopStation>
        <div class="displaySchedule">
            <scheduleSearchCondition :selectdatetime="departTime" :allStation="allStation"  :allDiscount="allDiscount"  :disc="selectDiscount" :stst="selectStartStation" :edst="selectEndStation" @search="goSearch" @ststchange="(newst)=>stChange(newst)" @edstchange="(newst)=>edChange(newst)" @discchange="(newDisc)=>{discChange(newDisc);goSearch()}" @timeShift="(hr)=>searchTimeShift(hr)"></scheduleSearchCondition>
            <!-- <timeShiftButton @timeShift="(hr)=>searchTimeShift(hr)"></timeShiftButton> -->
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
                    <label>{{emptySelectMsg}}</label><br>
                    <label style="margin-bottom: 20px;"> 總價格：{{ computedPrice }}元</label>
                    <div v-for="d of getDiscByDiscType" :key="d.ticketDiscountId">
                        <label>{{ d.ticketDiscountName }}</label><input type="number" @change="updatePrice()" min="0" v-model="toBookTickets[d.ticketDiscountId]" class="form-control"/>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="ticket-amt-select-modal-btn" class="btn btn-secondary"  data-bs-dismiss="modal">取消</button>
                    <button type="button" @click="bookTicket()" class="btn btn-primary">前往訂票</button>
                </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="modal" tabindex="-1" id="login-modal">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5>登入</h5>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">帳號：</span>
                        <input type="text" v-model="account" class="form-control" placeholder="會員帳號" aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">密碼：</span>
                        <input  v-model="password" :type="getCurrentPwdInputType" class="form-control" placeholder="會員密碼" aria-label="Username" aria-describedby="basic-addon1"><span class="input-group-text" @click="passwordVisible=(passwordVisible)?false:true">{{ (passwordVisible)?'隱藏密碼':'顯示密碼' }}</span>
                    </div>
                    <span>{{ msg }}</span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="{msg='';isToBooking=false}" id="cancelBtn" data-bs-dismiss="modal">取消</button>
                    <button type="button"  @click="goLogin"  class="btn btn-primary">登入</button>
                </div>
                </div>
            </div>
        </div>
    </div>
    <button id="login-modal-open-btn" hidden data-bs-toggle="modal" data-bs-target="#login-modal"></button>
    <button id="ticket-amt-select-modal-open-btn" hidden data-bs-toggle="modal" data-bs-target="#howManyTicket"></button>
</template>
<style>
    .member-info-bar{
        display: flex;
        flex-direction: row-reverse;
    }
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
        padding: 0px;
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