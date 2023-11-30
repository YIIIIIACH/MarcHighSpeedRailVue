<script setup>
const props = defineProps(['stopSt'])
</script>
<template>
    <div class="stationDisplayBox"> 
        <div class="circle"></div>{{ stopSt.stationName }}
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
</style>