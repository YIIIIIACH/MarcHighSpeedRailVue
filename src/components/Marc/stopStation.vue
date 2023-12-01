<script setup>
import {ref ,onMounted,onUpdated} from 'vue'
const props = defineProps(['stopSt','picked'])
</script>
<template>
    <div class="stationDisplayBox" >
        <div :class="{ circle:true, 'selected': picked}"></div>{{ stopSt.stationName }}
    </div>
</template>
<style>

.circle{
    border:8px orange solid;
    border-radius: 15px;
    width: 50px;
    height:50px;
    background-color: white;
}
.stationDisplayBox{
    margin-top: 20px;
    display: flex;
}
.selected{
    background-color: orange;
    border:10px black solid
}

</style>