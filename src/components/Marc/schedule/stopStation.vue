<script setup>
const props = defineProps(['stations','pickedStart','pickedEnd','willStop','ticketSystem'])
const emits= defineEmits(['changeStop'])
</script>
<template>
    <div class="stationDisplayBox" :class="{'ticket-detail-displaybox': ticketSystem }" @click="$emit('changeStop',props.stations)"  >
        <button :class="{ circle:true,'will-stop':willStop, 'selectedStart': pickedStart,'selectedEnd':pickedEnd}"  ></button><label style="font-size: 28px;font-weight:bold;align-self: center;">{{ stations.stationName }}</label>
    </div>
</template>
<style>

.circle{
    border:8px rgb(188, 188, 188) solid;
    border-radius: 18px;
    width: 50px;
    height:50px;
    background-color: white;
    align-self: center;
    z-index: 100;
    margin-right:17px;
}
.will-stop{
    border:8px orange solid;
}
.stationDisplayBox{
    margin-top: 20px;
    display: flex;
    
}
.selectedEnd{
    background-color: rgb(255, 225, 0);
    border:10px rgb(138, 77, 28) solid
}
.selectedStart{
    background-color: rgb(255, 102, 0);
    border:10px rgb(138, 77, 28) solid
}

.ticket-detail-displaybox{
  width: 100px;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

}

</style>