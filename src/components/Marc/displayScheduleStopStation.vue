<script setup>
import stopStation from './stopStation.vue'
import {ref,computed} from 'vue'
const props = defineProps(['allStations','display','stst','edst','stopStations'])
const emits = defineEmits(['changeStSt','changeEdSt'])
const startOrEnd = ref(false);
const lock= ref(true)

const willStop = (stid)=>{
  for( let i=0; i<props.stopStations.length; i++){
    if( props.stopStations[i].stopStation.stationId==stid){
      return true
    }
  }
  return false
}
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
        <li v-for="(st,idx) of allStations" v-show="true" :key="st.stationId" >
            <stopStation   @changeStop="(newStop)=>changeStopSt(newStop.stationId)" v-show="display" :stations="st" :pickedStart="st.stationId==stst" :pickedEnd="st.stationId==edst" :willStop="willStop(st.stationId)"></stopStation>
        </li>
    </TransitionGroup>
</template>
<style>
.side-bar{
    margin: left 5%;
    width: 220px;
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