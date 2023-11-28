<script setup>
import {ref,computed,reactive, watch} from 'vue'
let props = defineProps(['selectdatetime','allDiscount','allStation','allDiscount'])
</script>
<template>
    <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon3">搜尋時間</span> <!-- yyyy-MM-ddTHH:mm-->
    <input :value="props.selectdatetime.time" type="datetime"  format class="form-control" id="datetimeInput" aria-describedby="basic-addon3">
    <span class="input-group-text" id="basic-addon3">購票模式</span> 
    <select class="form-select" aria-label="Default select example"   @change="$emit('discchange',$event.target.value)">
        <option v-for="(discType,idx) of props.allDiscount" :key="idx">{{ discType }}</option>
    </select>
    </div>
    <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon3">上車車站</span> 
    <select class="form-select" aria-label="Default select example"   @change="$emit('ststchange',$event.target.value)">
        <option v-for="station in props.allStation" :key="station.id">{{ station.stationName }}</option>
    </select>
    <span class="input-group-text" id="basic-addon3">下車車站</span> 
    <select class="form-select" aria-label="Default select example"  @change="$emit('edstchange', $event.target.value)">
        <option v-for="station of props.allStation" :key="station.id">{{ station.stationName }}</option>
    </select>
    <button @click="$emit('search')">SEARCH</button>
    </div>
</template>

<style>
.input-group-append {
  cursor: pointer;
}
</style>