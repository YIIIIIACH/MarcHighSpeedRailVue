<script setup>
import stopStation from './stopStation.vue'
const props = defineProps(['stopStations','display','stst','edst'])
function isSelect(stid){
  return stid==stst.stationId || stid==edst.stationId
}
</script>
<template>
    <TransitionGroup name="list" tag="ul" class="side-bar">
        <li v-for="st of stopStations" v-show="display" :key="st.stopStation.stationId" >
            <stopStation    :stopSt="st.stopStation" :picked="st.stopStation.stationId==stst.value.stationId || st.stopStation.stationId==edst.value.stationId"></stopStation>
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