<script setup>
import { computed, } from 'vue'
import 'vue-router'
const props = defineProps(['info','useColor','selectDisc'])
const emits = defineEmits(['goBook'])
function getPrice(origin){
    // find the discount;
    for( let disc of props.info.containTicketDiscount){
        if(disc.ticketDiscountType.toString().valueOf()==props.selectDisc.toString().valueOf()){
            return Math.ceil((origin*disc.ticketDiscountPercentage)/100 - disc.ticketDiscountAmount)+'元';
        }
    }
    return '無該優惠';
}
const wealthShowDisc = computed(()=>{
    // return props.info.containTicketDiscountName.filter((name)=>{
    //     return !(name==='一般票' || name==='商務票')
    // })
    return props.info.containTicketDiscountName;
})
const getFormatStartTime= computed(()=>{
    return props.info.getOnTime.split(' ')[1].split(':')[0]+'點'+props.info.getOnTime.split(' ')[1].split(':')[1]+'分'
})
const getFormatEndTime= computed(()=>{
    return props.info.getOffTime.split(' ')[1].split(':')[0]+'點'+props.info.getOffTime.split(' ')[1].split(':')[1]+'分'
})
const getDiscByDiscType= function(){
    for( let d of props.info.containTicketDiscount){
        if( d.ticketDiscountType== props.selectDisc){
            return d
        }
    }
    console.log('not found [getDiscByDisctype]')
}
const getLink = ()=>{
    if( props.selectDisc == '商務票'){
        return "/booking/buinessSeat/"+props.info.scheduleId+"/"+props.info.getOnStation.stationId+"/"+props.info.getOffStation.stationId+"/"+props.info.getOnTime
    }

}
</script>
<template>
    <div class="card schedulecardbox" style="margin:20px 0px;">
        <div class="card-header" :style="{ 'background-color': useColor,'width':'100%'}">
            班次 {{ info.scheduleId }}<label style="text-align: right;margin-left: 60%;">花費時間 {{ info.durationMinute }}分鐘</label>
        </div>
        <div class="disc-icon">
            <a href="#" v-for="discName of wealthShowDisc" class="discounticon" :style="{ 'background-color': (discName==props.selectDisc)?useColor:'white'}" style="margin-top: 20px;">
                <span class="glyphicon glyphicon-asterisk">{{ discName }}</span>
            </a>
        </div>
        <div class="card-body scheduleinfobox">
            <div style="width:70%;display:flex;margin-left: 0px;justify-content: space-around">
                <div class="timestationbox" >
                    <div style="padding:15% 0px"><label class="timeText">{{ getFormatStartTime }}</label><hr><label class="stationText">{{ info.getOnStation.stationName+'站' }}</label></div>
                </div>
                <div style="padding:7% 0px;width:20px">
                    <label><hr></label>
                </div>
                <div class="timestationbox">
                    <div style="padding:15% 0px"><label class="timeText">{{ getFormatEndTime }}</label><hr><label class="stationText">{{ info.getOffStation.stationName+'站' }}</label></div>
                </div>
                <div class="timestationbox" style="padding-top:70px">
                    <div ><label class="price-tag">{{ getPrice(info.originTicketPrice) }}</label></div><!--{{ (info.containTicketDiscountName.includes(currDisc))? getDiscountPrice:'無該優惠'}}-->
                </div>
            </div>
            <div style="width: 30%;padding-left: 10%;">
                <div  style="padding:7%"> <!--@click.stop="this.$router.push(getLink())"-->
                    <a href="#"  data-bs-toggle="modal" data-bs-target="#howManyTicket" :style="{ 'background-color': useColor}" @click="emits('goBook',[info.scheduleId,getDiscByDiscType(),getDiscByDiscType(),info])" class="btn">前往訂票</a>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.timestationbox{
    margin: 10px 20px;
}
.scheduleinfobox{
    width: 100%;
    display:flex;
    justify-content: space-around;
    height: 200px;
    padding-left: 40px;
}
.disc-icon{
    width: 100%;
    height:10px;
    display:flex;
    justify-content: flex-end;
    padding-right: 140px;
}
.discounticon{
    height: 30px;
    justify-items: center;
    padding: 9px 15px 0px;
    border-radius: 5px;
    text-decoration: none;
}
.schedulecardbox{
    display:flex;
    flex-wrap: wrap;
}
a:visited{
    text-decoration: none;
    color:black;
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