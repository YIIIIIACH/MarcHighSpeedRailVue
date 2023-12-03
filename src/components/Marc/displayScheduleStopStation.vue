<script setup>
import stopStation from './stopStation.vue'
import {ref,computed} from 'vue'
const props = defineProps(['stopStations','display','stst','edst'])
const emits = defineEmits(['changeStSt','changeEdSt'])
const getStopStSeq = computed(()=>{
})
const startOrEnd = ref(false);
function changeStopSt(newStop){
  if(startOrEnd.value){
    emits('changeEdSt',newStop)
    startOrEnd.value= false;
  }else{
    emits('changeStSt',newStop)
    startOrEnd.value= true;
  }
}
</script>
<template>
    <TransitionGroup name="list" tag="ul" class="side-bar">
        <li v-for="st of stopStations" v-show="display" :key="st.stopStation.stationId" >
            <stopStation   @changeStop="(newStop)=>changeStopSt(newStop.stationId)" :stopSt="st.stopStation" :pickedStart="st.stopStation.stationId==stst" :pickedEnd="st.stopStation.stationId==edst"></stopStation>
        </li>
    </TransitionGroup>
</template>
<style>
.side-bar{
    margin: left 5%;
    width: 160px;
    list-style-type: none;
}
/* .list-leave-active { */
.list-enter-active{
  transition: all 0.5s ease;
}
/* .list-leave-to { */
.list-enter-from{
  opacity: 0;
  transform: translateX(30px);
}
</style>