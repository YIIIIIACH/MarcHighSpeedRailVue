<script setup>
import stopStation from './schedule/stopStation.vue'
import {ref,computed} from 'vue'
const props = defineProps(['stopStations','pbStart','pbEd'])
const startOrEnd = ref(false);
</script>
<template>
  <transition name="fade" mode="in-out">
    <div >
    <div class="stop-station-line">
      <div v-for="st of stopStations" :key="st.stationId"  >
        <stopStation class="station-block-name" :stations="st.stopStation" :pickedStart="st.stationId==pbStart.stationId" :pickedEnd="st.stationId==pbEd.stationId" :ticketSystem="true" :willStop="true"></stopStation>
      </div>
    </div>
    <div class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"  style="background-color: rgb(255, 195, 14);" :style="{'width': '100%'}"></div>
    </div>
        <!-- <div class="progress progress-bar-vertical" v-show="showSideBar">
          <div class="progress-bar" role="progressbar" :style="{'height':props.pbStart}"></div>
          <div class="progress-bar" role="progressbar"  style="background-color: rgb(255, 195, 14);" :style="{'height': pbEd}"></div>
        </div> -->
    </div>
  </transition>
</template>
<style>
.progress,
.progress-bar{
  background-color: red;
}
.stop-station-line{
  height: 200px;
    margin: left 5%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.station-block-name{
  width: 120px;
  height: 150px;
}
</style>