<script setup>
import scheduleItem from './scheduleListItem.vue'
var schedules = defineProps(['schedules'])
function show(){
    console.log( schedules.schedules)
}
</script>

<template>
    <!-- <button @click="show">out show</button> -->
<scheduleItem v-for="sch of schedules.schedules" :key="sch.scheudleId" :info="sch"></scheduleItem>
</template>

<style>
</style>