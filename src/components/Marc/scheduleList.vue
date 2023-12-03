<script setup>
import EmptyScheduleListItem from './emptyScheduleListItem.vue';
import scheduleItem from './scheduleListItem.vue'
var schedules = defineProps(['schedules','discColor'])
const emits = defineEmits(['refresh-stop-station-display'])

</script>

<template>
<EmptyScheduleListItem v-if="schedules.schedules.length==0"></EmptyScheduleListItem>
<scheduleItem v-for="sch of schedules.schedules" :key="sch.scheudleId" :info="sch" :useColor="discColor" @click="$emit('refresh-stop-station-display',sch)"></scheduleItem>
</template>

<style>
</style>