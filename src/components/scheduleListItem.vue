<script>
    export default{
        props:[ 'schDetail']
    }
</script>

<template>
    <li><label>{{schDetail.startStationName}}</label> <label>{{schDetail.endStationName}}</label><label>{{ schDetail.durationTime }}Minutes</label></li>
</template>