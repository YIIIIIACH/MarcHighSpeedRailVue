<script setup>
import seatColumn from '../../components/Marc/bookBuiness/seatColumn.vue';
import httpClient from '../../main'
import { onBeforeMount ,reactive, computed,ref} from 'vue'
import 'vue-router'
import router from '../../router';
const passwordVisible= ref(false);
const userName= ref('')
const msg = ref('')
const account = ref('')
const password = ref('')
const props = defineProps(['schid','ststid','edstid','amount','memberId'])// remove 'departTime'
const emits = defineEmits(['updateMemberId'])
const seats = reactive([])
const bookeds= reactive([])
const info = reactive({})
const selectCnt= ref({"cnt":0})
const selected= reactive([])
const makeTicketOrderLoading = ref(false)
const colHeader= computed(()=>{
    return seats.filter((a)=>{
        let tmp = a.seatCode.split('-')
        return tmp[1]=='A'
    })
})
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
const getSelected=function(){
    let res =seats.filter((st)=> st.selected)
    // if(res.length==0)
    //remove which selected are not in res now
    for(let i=0; i<selected.length ;i++){
        if( !res.includes( selected[i]) ){
            selected.splice(i,1)
            continue;
        }
    }
    for( let i=0; i<res.length; i++){
        if( !selected.includes( res[i])){
            selected.push(res[i])
        }
    }
    // return res;
}
const columns = reactive({
    "A":[],
    "B":[],
    "C":[],
    "alley":[],
    "D":[],
    "E":[]
})
const getCurrentPwdInputType = computed(()=>(passwordVisible.value==true)?'text':'password')
function goLogin(){
    httpClient.post('requestMemberLogin',{
        "email": account.value,
        "password": password.value
    },{withCredentials:true})
    .then((res)=>{
        console.log( res)
        if(res.status==200){
            //click the  cancel btn to close the modal
            document.getElementById('cancelBtn').click();
            msg.value='';
            account.value=''
            password.value=''
            emits('updateMemberId', res.data.member_id)
        }
    }).catch((err)=>{
        this.msg='帳號或密碼有誤'
    })
}
function checkLoginToken(){
    return (props.memberId=='undefined')? false: true;
}
function clearCookie(){
    emits('updateMemberId','undefined')
}
function loginBtnClick(){
    document.getElementById('login-modal-open-btn').click()
}
function newGoBuinessBook(){
    makeTicketOrderLoading.value= true
    if( checkLoginToken()==false){
        makeTicketOrderLoading.value = false
        document.getElementById('login-modal-open-btn').click();
        return;
    }
    let selectedList = seats.filter((st)=>st.selected).map(st=>st.seatId);
        httpClient.post('/createBuinessTicketOrder/'+props.ststid+'/'+props.edstid+'/'+props.amount+'/'+props.schid,{
            "seatList": selectedList
        },{withCredentials:true})
        .then((res)=>{
            console.log(res.data)
            let json = res.data;
            console.log(json['links'])
            for( let linkObj of json['links']){
                if( linkObj['rel'] == 'approve'){
                    window.location= linkObj['href']
                }
            }
            makeTicketOrderLoading.value = false
        }).catch((err)=>{
            router.push('/booking')
            alert('訂位失敗')
            console.log(err)
            makeTicketOrderLoading.value = false
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
    <div class="member-info-bar">
        <span v-if="memberId!='undefined'">歡迎會員{{ userName }}  <span @click="{clearCookie();userName='會員'}">登出</span></span><span @click="loginBtnClick" v-else>登入</span>
    </div>
    <div class="container">
        <h1>MarcHighSpeedRail 商務艙訂位</h1>
        <div class="card">
            <div class="card-body ticket-cnt"><label>已選取車票數{{ selectCnt.cnt }}張</label><label>訂位數量{{ props.amount }}</label></div>
        </div>
        <div class=" carriage" >
            <img src="../../assets/exit.png" width="100" height="120">
            <div >
                <div style="display:flex;justify-content: center">
                    <div v-for="(col,idx) in colHeader" :key="idx"  class="col-head">{{ col.seatCode.split('-')[0] }}排</div>
                </div>
                <seatColumn v-for="(column ,idx) in columns" :key="idx" :seats="column" :max-limit="amount" :select-cnt="selectCnt" :bookedSeats="bookeds" :colCode="idx" @select="getSelected"></seatColumn>
            </div>
            <img class="exit" src="../../assets/exit.png" width="100" height="120">
        </div>
    </div>
    <div class="container">
        <button type="button"  class="btn btn-primary blue-btn" @click="this.$router.push('/booking')">
            返回班次搜尋頁面
        </button>
        <button type="button"  class="btn btn-primary blue-btn" style="float:right" data-bs-toggle="modal" :data-bs-target="'#exampleModal'">
            前往訂票
        </button>
        <div class="card">
        <a class="card-header" style="text-decoration: none;" data-bs-toggle="collapse" href="#buinessBookDetail" role="button" aria-expanded="false" aria-controls="buinessBookDetail">
            查看已選取座位
        </a>
        </div>
    
        <div class="collapse.show" id="buinessBookDetail">
            <div class="card card-body one-seat" v-if="selected.length==0">你沒有選擇座位</div>
            <TransitionGroup name="list" class="selected-list" tag="ul">
                <li class="card card-body one-seat" v-for="(selectedSeat,idx) in selected" :key="selectedSeat.seatId"><!--class="card card-body item"-->
                    {{ selectedSeat.seatId }}{{ selectedSeat.seatCode }}{{ selectedSeat.seatDescirption }}
                        <span v-if="selectedSeat.seatId!=undefined">
                        {{info.ticketDiscount.ticketDiscountName}}:{{ info.rrseg.railRouteSegmentTicketPrice *(info.ticketDiscount.ticketDiscountPercentage/100)-info.ticketDiscount.ticketDiscountAmount+'元' }}
                        </span>
                </li>
            </TransitionGroup>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">[注意] 商務座訂票須直接付費</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div v-if="!hasSelect">
                    <span>你沒有選取座位</span>
                </div>
                <div v-else-if="selectCnt.cnt>=props.amount">
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
                    <span>你沒有選取足夠座位</span>
                </div>
               
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary blue-btn" data-bs-dismiss="modal">關閉</button>
                <button type="button" :disabled="selectCnt.cnt<props.amount" @click="newGoBuinessBook" data-bs-dismiss="modal" class="btn  btn-primary blue-btn">
                    <span v-if="makeTicketOrderLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span >前往付費訂票</span>
                </button>
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
</template>
<style>
.member-info-bar{
    display: flex;
    flex-direction: row-reverse;
}
.ticket-cnt{
    display:flex;
    justify-content: space-around;
}
.carriage{
    border: 4px grey solid;
    border-radius: 8px;
    display:flex;
    justify-content: space-around;
    align-items: center;
}
.list-enter-active,
.list-leave-active,
.list-move{
    transition:opacity 0.7s , transform 0.7s;
}
.list-leave-active{
    position: absolute;
}
.list-enter-from{
    opacity:0;
    transform: translateX(-40px)
}
.list-leave-to{
    opacity: 0;
    transform: translateX(-40px)
}
.selected-list{
    padding-left: 0px;
}
.one-seat{
    display:inline-block;
    list-style-type:none
}
.col-head{
    justify-content: center;
    width: 30px;
    height: 60px;
    /* border: 4px black solid; */
    border-radius: 7px;
    padding: 0px;/*4px;*/
    margin: 8px;
    
}
.blue-btn{
    width:170px;
    height: 70px;
}
</style>