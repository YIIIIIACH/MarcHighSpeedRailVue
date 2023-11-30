<script setup>
import { isProxy, toRaw, toValue } from 'vue';

const props = defineProps(['info'])
function log(){
    if( isProxy(props.info)){
        console.log('is proxy')
        console.log( toRaw(props.info))
    }
    // console.log(info)
}
</script>
<template>
    <div class="card schedulecardbox">
        <!-- <button @click="log" >test log</button> -->
        <div class="card-header">
            班次 {{ info.scheduleId }}<label style="text-align: right;margin-left: 60%;">花費時間 {{ info.durationMinute }}分鐘</label>
        </div>
        <div class="card-body scheduleinfobox">
            <div class="timestationbox">
                <div style="padding:15% 0px"><label>{{ info.getOnTime.split(' ')[1] }}</label><hr><label>{{ info.getOnStation.stationName+'站' }}</label></div>
            </div>
            <div style="padding:7% 15px">
                <label><hr></label>
            </div>
            <div class="timestationbox">
                <div style="padding:15% 0px"><label>{{ info.getOffTime.split(' ')[1] }}</label><hr><label>{{ info.getOffStation.stationName+'站' }}</label></div>
            </div>
            <div class="timestationbox" style="padding: 7% 0px">
                <div ><label>{{ info.originTicketPrice +'元' }}</label></div>
            </div>
            <div>

            </div>
            <a href="#" v-for="discName of info.containTicketDiscountName" class="btn btn-info btn-lg discounticon">
                <span class="glyphicon glyphicon-asterisk"></span>{{ discName }}
                </a>
                
            <div class="timestationbox" style="padding:7%">
                <a href="#" class="btn btn-primary">  前往訂票</a>
            </div>
        </div>
    </div>
</template>
<style>
.timestationbox{
    /* border:4px rgb(126, 113, 113) solid; */
    /* border-radius:10px; */
    margin: auto 20px;
}
.scheduleinfobox{
    display:flex;
}
.discounticon{
    margin:6% 10px
}
.schedulecardbox{
    margin:20px 20px
}
</style>