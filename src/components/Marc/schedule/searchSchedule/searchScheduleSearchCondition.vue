<script setup>
import timeShiftButton from '../timeShiftButton.vue';
import {computed} from 'vue'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
//:stst="selectStartStation" :edst="selectEndStation"
var props = defineProps(['selectdatetime','allDiscount','allStation','allDiscount','stst','edst','disc'])
const emits = defineEmits(['discchange','ststchange','edstchange','search','timeShift'])

// const selectDisc = ref('一般票')
const isStSelect= computed(()=>{
    return props.stst
})
function changeStStation(newStation){
    //find the newStation name in allStation
    console.log('newselect start Stationid'+newStation)
    emits('ststchange',newStation)
}
function changeEdStation(newStation){
    console.log('newselect end Stationid'+newStation)
    emits('edstchange',newStation)
}
function searchTimeShift(hr){
    emits('timeShift',hr);
}
// const dd = ref(new Date())
</script>
<template>
    <div class="input-group mb-3" >
        <span class="input-group-text" id="basic-addon3">搜尋時間</span> <!-- yyyy-MM-ddTHH:mm-->
        <Datepicker class="form-control" id="datetimeInput" v-model="props.selectdatetime.time"></Datepicker>
    </div>
    <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon3">上車車站</span>
    <select class="form-select" aria-label="Default select example"  @change="(e)=>changeStStation( e.target.value)">
        <option v-for="station in props.allStation" :key="station.stationId" :value="station.stationId" :selected="stst==station.stationId" >{{ station.stationName }}</option>
    </select>
    <span class="input-group-text" id="basic-addon3">下車車站</span> <!--(e)=>changeSelectStation(edst, e.target.value)-->
    <select class="form-select" aria-label="Default select example"  @change="(e)=>changeEdStation(e.target.value)" >
        <option v-for="station of props.allStation" :key="station.stationId"  :value="station.stationId" :selected="edst==station.stationId">{{ station.stationName }}</option>
    </select>
    <!-- <button  type="button" @click="$emit('search')" class="btn btn-primary">SEARCH</button> -->
    </div>
    <timeShiftButton @timeShift="(hr)=>searchTimeShift(hr)" @search="()=>$emit('search')"></timeShiftButton>
</template>

<style>
.input-group-append {
  cursor: pointer;
}
</style>