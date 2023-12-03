<script setup>
import { computed, } from 'vue'
import 'vue-router'
    const props = defineProps(['info','useColor'])
const wealthShowDisc = computed(()=>{
    // return props.info.containTicketDiscountName.filter((name)=>{
    //     return !(name==='一般票' || name==='商務票')
    // })
    return props.info.containTicketDiscountName;
})
const getLink = ()=>{
    console.log('getlink')
    console.log('here'+props.info.getOnTime)
    return "/booking/buinessSeat/"+props.info.scheduleId+"/"+props.info.getOnStation.stationId+"/"+props.info.getOffStation.stationId+"/"+props.info.getOnTime
}
</script>
<template>
    <div class="card schedulecardbox" style="display:flex">
        <!-- <button @click="log" >test log</button> -->
        <div class="card-header" :style="{ 'background-color': useColor}">
            班次 {{ info.scheduleId }}<label style="text-align: right;margin-left: 60%;">花費時間 {{ info.durationMinute }}分鐘</label>
        </div>
        <div style="height:10px;display:flex;justify-content: flex-end;align-items:flex-start;margin:0px 20%;padding:0px 0px;padding:0px 0px">
            <a href="#" v-for="discName of wealthShowDisc" class="discounticon" :style="{ 'background-color': useColor}">
                <span class="glyphicon glyphicon-asterisk"></span>{{ discName }}
            </a>
        </div>
        <div class="card-body scheduleinfobox">
            <div class="timestationbox">
                <div style="padding:15% 0px" class="timeText"><label>{{ info.getOnTime.split(' ')[1] }}</label><hr><label class="stationText" >{{ info.getOnStation.stationName+'站' }}</label></div>
            </div>
            <div style="padding:7% 15px">
                <label><hr></label>
            </div>
            <div class="timestationbox">
                <div style="padding:15% 0px" class="timeText"><label >{{ info.getOffTime.split(' ')[1] }}</label><hr><label class="stationText">{{ info.getOffStation.stationName+'站' }}</label></div>
            </div>
            <div class="timestationbox" style="padding: 7% 0px;margin-right: 35%">
                <div ><label>{{ info.originTicketPrice +'元' }}</label></div>
            </div>
            <div>

            </div>
            
                
            <div  style="padding:7%">
                <a href="#" @click.stop="this.$router.push(getLink())" :style="{ 'background-color': useColor}" class="btn">  前往訂票</a>
            </div>
            <!-- <a :href="getLink">link here</a> -->
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
}
.discounticon{
    height: 35px;
    margin:0px 0px;
    padding: 3px;
    border-radius: 5px;
    text-decoration: none;
    
}
.schedulecardbox{
    margin:20px 20px;
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
</style>