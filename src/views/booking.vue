<script>
import  scheduleList from  '../components/Marc/scheduleList.vue'
import scheduleSearchCondition from '../components/Marc/scheduleSearchCondition.vue'
import timeShiftButton from '../components/Marc/timeShiftButton.vue'
import displayScheduleStopStation from '../components/Marc/displayScheduleStopStation.vue'
import { ref ,reactive} from 'vue'
    export default{
        setup(){
            return {
                selectStartStation: ref(),
                selectEndStation: ref(),
                departTime: reactive({'time':new Date()}),
                allStation: ref([
                    {
                        id:14,
                        stationName:'南港'
                    },
                    {
                        id:15,
                        stationName:'台北'
                    },
                    {
                        id:16,
                        stationName:'板橋'
                    },
                    {
                        id:17,
                        stationName:'桃園'
                    },
                    {
                        id:18,
                        stationName:'新竹'
                    },

                ]),
                allDiscount: ref([
                    '一般票','早鳥票','學生票','商務票'
                ]),
                selectDiscount: ref(null)
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
            outTest:function(){
                console.log(`${this.selectStartStation}${this.selectEndStation}${this.selectDiscount}${this.departTime.time}`)
            }
        },
        components:{
            scheduleList,
            scheduleSearchCondition,
            timeShiftButton,
            displayScheduleStopStation
        }
    }
</script>

<template >
    <div class="bookingSystem">
        <div class="displayStopStation">
            <displayScheduleStopStation></displayScheduleStopStation>
        </div>
        <div class="displaySchedule">
            <scheduleSearchCondition :selectdatetime="departTime" :allStation="allStation"  :allDiscount="allDiscount" @ststchange="(st)=>selectStartStation=st" @edstchange="(st)=>selectEndStation=st" @discchange="(disc)=>selectDiscount=disc" @search="outTest()"></scheduleSearchCondition>
            <scheduleList></scheduleList>
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
        background-color: blanchedalmond;
        width:80%;
        margin: 0px;
    }
</style>