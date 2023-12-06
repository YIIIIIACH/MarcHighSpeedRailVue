<script setup>
import { computed,ref,reactive } from 'vue'
import 'vue-router'
const props = defineProps(['info','colorList','allDisc','currDisc','currColor'])
const emits = defineEmits(['showNewDisc'])
const wealthShowDisc = computed(()=>{
    return props.info.containTicketDiscountName
})
// const currDiscf
const getLink = ()=>{
    console.log('getlink')
    console.log('here'+props.info.getOnTime)
    return "/booking/buinessSeat/"+props.info.scheduleId+"/"+props.info.getOnStation.stationId+"/"+props.info.getOffStation.stationId+"/"+props.info.getOnTime
}
const getDiscountPrice = computed(()=>{
    for( let d of props.info.containTicketDiscount){
        if( d.ticketDiscountType == props.currDisc){
            return Math.ceil((props.info.originTicketPrice* d.ticketDiscountPercentage) / 100 -d.ticketDiscountAmount)+'元'
        }
    }
    return props.info.originTicketPrice+'元'
})
</script>
<template>
    <div class="card schedulecardbox" style="display:flex">
        <div class="card-header">
            班次 {{ info.scheduleId }}<label style="text-align: right;margin-left: 60%;">花費時間 {{ info.durationMinute }}分鐘</label>
        </div>
        <div class="card-body scheduleinfobox" style="display:flex;justify-content: space-between;">
            <div style="width:55%;display:flex;justify-items:center;">
                <div class="timestationbox" >
                    <div style="padding:15% 0px"><label class="timeText">{{ info.getOnTime.split(' ')[1] }}</label><hr><label class="stationText">{{ info.getOnStation.stationName+'站' }}</label></div>
                </div>
                <div style="padding:7% 0px;width:20px;margin: 0px 40px;">
                    <label><hr></label>
                </div>
                <div class="timestationbox">
                    <div style="padding:15% 0px"><label class="timeText">{{ info.getOffTime.split(' ')[1] }}</label><hr><label class="stationText">{{ info.getOffStation.stationName+'站' }}</label></div>
                </div>
                <div class="timestationbox" style="padding: 7% 0px;margin-right:0%">
                    <div ><label class="price-tag">{{ (info.containTicketDiscountName.includes(currDisc))? getDiscountPrice:'無該優惠'}}</label></div>
                </div>
            </div>
            <div>

            </div>
            <div  >
                <a href="#" v-for="disc of info.containTicketDiscount" :key="disc.ticketDiscountName" class="btn btn-lg discounticon" @click="$emit('showNewDisc',disc.ticketDiscountType)" :style="{'background-color':  (currDisc==disc.ticketDiscountType)?currColor:'#ffffff'}">
                    <span class="glyphicon glyphicon-asterisk"></span>{{ disc.ticketDiscountType }}
                </a>
            </div>
        </div>
    </div>
</template>
<style>
.timestationbox{
    margin: 20px 20px;
}
.scheduleinfobox{
    display:flex;
    justify-content: flex-end;
    align-items: center
}
.discounticon{
    margin: 0px 10px;
    height: 55px;
}
.schedulecardbox{
    margin:20px 20px
}
.stationText{
    font-size: 48px;
}
.timeText{
    text-align: center;
}
.price-tag{
    font-size: 42px;
}
</style>