<script setup>
import EmptyScheduleListItem from './emptyScheduleListItem.vue';
import scheduleItem from './scheduleListItem.vue'
var schedules = defineProps(['schedules'])
const emits = defineEmits(['refresh-stop-station-display'])
function show(){
    console.log( schedules.schedules)
}
</script>

<template>
    <!-- <button @click="show">out show</button> -->
<EmptyScheduleListItem v-if="schedules.schedules.length==0"></EmptyScheduleListItem>
<scheduleItem v-for="sch of schedules.schedules" :key="sch.scheudleId" :info="sch" @click="$emit('refresh-stop-station-display',sch)"></scheduleItem>
</template>

<style>
</style>