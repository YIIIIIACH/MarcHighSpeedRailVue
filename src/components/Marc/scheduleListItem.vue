<script setup>
import { computed} from 'vue'
    const props = defineProps(['info'])
const wealthShowDisc = computed(()=>{
    return props.info.containTicketDiscountName.filter((name)=>{
        return !(name==='一般票' || name==='商務票')
    })
})
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
            <a href="#" v-for="discName of wealthShowDisc" class="btn btn-info btn-lg discounticon">
                <span class="glyphicon glyphicon-asterisk"></span>{{ discName }}
            </a>
                
            <div class="timestationbox" style="padding:7%">
                <a href="#" @click.stop="" class="btn btn-primary">  前往訂票</a>
            </div>
        </div>
    </div>
</template>
<style>
.timestationbox{
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