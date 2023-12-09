<script setup>
import { ref} from 'vue'
import EmptyScheduleListItem from '../emptyScheduleListItem.vue';
import scheduleItem from './searchScheduleListItem.vue'
var schedules = defineProps(['schedules','colorList','allDisc'])
const emits = defineEmits(['refresh-stop-station-display'])
const currDisc = ref('一般票')
const currColor = ref('#ffffff');
function updateCurrColor(discName){
    for(let i=0 ; i<schedules.allDisc.length; i++){
        if( schedules.allDisc[i] == discName){
            currColor.value =  schedules.colorList[i];
            return;
        }
    }
    currColor.value = schedules.colorList[0]
}
updateCurrColor( currDisc)
</script>


<template>
<EmptyScheduleListItem v-if="schedules.schedules.length==0"></EmptyScheduleListItem>
<TransitionGroup name="list" tag="ul" style="padding: 0px;">
    <li v-for="sch of schedules.schedules" :key="sch" style="list-style-type: none;list-style-position: unset">
        <scheduleItem  :colorList="colorList" :info="sch" :allDisc="allDisc" :currDisc="currDisc" :currColor="currColor" @click="$emit('refresh-stop-station-display',sch)" @show-new-disc="(newdisc)=>{console.log('disc change');currDisc=newdisc;updateCurrColor(newdisc)}" ></scheduleItem>
    </li>
</TransitionGroup>
</template>

<style>
.list-enter-from{
    opacity: 0;
    transform: translateX(100%);
}
.list-leave-to{
    opacity: 0;
    transform: translateX(100%);
}
.list-enter-to{
    opacity: 1;

}
.list-enter-active,
.list-leave-active{
    transition: all 1s
}
</style>