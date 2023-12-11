<script setup>
import stopStation from './stopStation.vue'
import {ref,computed} from 'vue'
const props = defineProps(['allStations','display','stst','edst','stopStations','showSideBar','pbStart','pbEd'])
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
  <div style="width:210px">
    <transition name="fade" mode="in-out">
      <div v-show="showSideBar">
        <ul class="side-bar">
          <li v-for="(st,idx) of allStations" :key="st.stationId" >
            <stopStation   @changeStop="(newStop)=>changeStopSt(newStop.stationId)" :stations="st" :pickedStart="st.stationId==stst" :pickedEnd="st.stationId==edst"  :willStop="willStop(st.stationId)"></stopStation>
          </li>
        </ul>
        <div class="progress progress-bar-vertical" v-show="showSideBar">
          <div class="progress-bar" role="progressbar" :style="{'height':props.pbStart}"></div>
          <div class="progress-bar" role="progressbar"  style="background-color: rgb(255, 195, 14);" :style="{'height': pbEd}"></div>
        </div>
      </div>
    </transition>
  </div>
</template>
<style>
.progress,
.progress-bar-vertical{
  background-color: white;
}
.side-bar{
    margin: left 5%;
    width: 220px;
    list-style-type: none;
}
.list-leave-active {
  transition :all 0.7s ease;
}
.list-enter-active{
  transition: all 0.7s ease;
}
/* .list-leave-to { */
.list-enter-from{
  opacity: 0;
  transform: translateX(30px);
}
</style>