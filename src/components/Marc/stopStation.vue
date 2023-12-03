<script setup>
import {ref ,onMounted,onUpdated} from 'vue'
const props = defineProps(['stopSt','pickedStart','pickedEnd'])
const emits= defineEmits(['changeStop'])
</script>
<template>
    <div class="stationDisplayBox" @click="$emit('changeStop',props.stopSt)"  >
        <button :class="{ circle:true, 'selectedStart': pickedStart,'selectedEnd':pickedEnd}"  ></button><label style="font-size: 28px;font-weight:bold;align-self: center;">{{ stopSt.stationName }}</label>
    </div>
</template>
<style>

.circle{
    border:8px orange solid;
    border-radius: 15px;
    width: 50px;
    height:50px;
    background-color: white;
    align-self: center;
}
.stationDisplayBox{
    margin-top: 20px;
    display: flex;
}
.selectedEnd{
    background-color: rgb(255, 225, 0);
    border:10px black solid
}
.selectedStart{
    background-color: rgb(255, 102, 0);
    border:10px black solid
}


</style>