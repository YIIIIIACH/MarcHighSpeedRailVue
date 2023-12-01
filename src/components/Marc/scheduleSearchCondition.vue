<script setup>
import {ref,computed,reactive, watch} from 'vue'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
//:stst="selectStartStation" :edst="selectEndStation"
const props = defineProps(['selectdatetime','allDiscount','allStation','allDiscount','stst','edst'])
const emits = defineEmits(['discchange','ststchange','edstchange','search',])
const selectStSt = ref({'stationName':'南港'})
const selectEdSt = ref({'stationName':'左營'})
const selectDisc = ref('一般票')// recieve a empty string of ticket discount name
function changeSelectStation(selectst, newStationName){
    //find the newStation name in allStation
    console.log(newStationName)
    for( let st of props.allStation){
        if(st.stationName ===newStationName){
            selectst.value = st;
        }
    }
    console.log(selectst.value)
    emits('ststchange',selectst.value)
    emits('edstchange',selectst.value)
}
// const dd = ref(new Date())
</script>
<template>
    <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon3">搜尋時間</span> <!-- yyyy-MM-ddTHH:mm-->
        <Datepicker class="form-control" id="datetimeInput" v-model="props.selectdatetime.time"></Datepicker>
    <!-- <input :value="props.selectdatetime.time" type="datetime"  format class="form-control" id="datetimeInput" aria-describedby="basic-addon3"> -->
    <span class="input-group-text" id="basic-addon3">購票模式</span> <!-- @change="selectDisc=$event.target.value"-->
    <select class="form-select" aria-label="Default select example"   @change="selectDisc=$event.target.value">
        <option v-for="(discType,idx) of props.allDiscount" :key="idx">{{ discType }}</option>
    </select>
    </div>
    <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon3">上車車站</span> <!--@change="st['stationName']=$event.target.value"-->
    <select class="form-select" aria-label="Default select example"   @change="(e)=>changeSelectStation(stst, e.target.value)">
        <option v-for="station in props.allStation" :key="station.id"  >{{ station.stationName }}</option>
    </select>
    <span class="input-group-text" id="basic-addon3">下車車站</span> <!--@change="selectEdSt['stationName']=$event.target.value"-->
    <select class="form-select" aria-label="Default select example"   @change="(e)=>changeSelectStation(edst, e.target.value)">
        <option v-for="station of props.allStation" :key="station.id"  >{{ station.stationName }}</option>
    </select>
    <button @click="$emit('search',[selectStSt,selectEdSt,selectDisc])" type="button" class="btn btn-primary">SEARCH</button>
    </div>
</template>

<style>
.input-group-append {
  cursor: pointer;
}
</style>