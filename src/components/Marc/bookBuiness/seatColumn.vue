<script setup>
const props = defineProps(['seats','bookedSeats','colCode','maxLimit','selectCnt'])
const emits = defineEmits(['select'])
const clickSelect= function( seat){
    if( isBooked(seat)){
        return
    }
    if( !seat.selected){
        if( props.selectCnt.cnt < parseInt(props.maxLimit)){
            props.selectCnt.cnt++;
            seat.selected= true;
        }
        return
    }else{
        props.selectCnt.cnt -= (props.selectCnt.cnt>0)?1: 0;
        seat.selected= false;
    }
}
const isBooked= function(st){
    if(props.bookedSeats.includes( st.seatId)){
        return true;
    }
    return false;
}
///bookBuinessSeat to book buiness seat
</script>
<template>
<div class="column">{{ props.colCode }}
<div v-for="seat of seats" :key="seat.seatId" :class="{'seat':true,'booked':isBooked(seat),'seat-selected':seat.selected}" @click="clickSelect(seat)"></div>
</div>
</template>
<style>
.column{
    display:flex;
    
}
.seat{
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 4px black solid;
    border-radius: 7px;
    padding: 4px;
    margin: 8px;
}
.booked{
    background-color: aqua;
}
.seat-selected{
    background-color:orangered;
    width:34px;
    height:34px;
    border: 4px orange solid;
    margin: 6px;
}
</style>