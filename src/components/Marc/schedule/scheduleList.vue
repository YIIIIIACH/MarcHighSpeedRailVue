<script setup>
import EmptyScheduleListItem from './emptyScheduleListItem.vue';
import scheduleItem from './scheduleListItem.vue'
var schedules = defineProps(['schedules','discColor','selectDisc'])
const emits = defineEmits(['refresh-stop-station-display','goBook'])

</script>

<template>
<Transition>
    <EmptyScheduleListItem v-if="schedules.schedules.length==0"></EmptyScheduleListItem>
</Transition>
<TransitionGroup name="list" tag="ul" style="padding: 0px;">
    <li v-for="sch of schedules.schedules" :key="sch.scheduleId" style="list-style-type: none;list-style-position: unset">
        <scheduleItem  :info="sch" :useColor="discColor" :selectDisc="schedules.selectDisc" @click="$emit('refresh-stop-station-display',sch)" @goBook="(schidAndDisc)=>emits('goBook',schidAndDisc)"></scheduleItem>
    </li>
</TransitionGroup>
</template>

<style>
list-enter-from{
    opacity: 0;
    transform: translateX(100%);
}
.list-leave-to{
    opacity: 0;
    transform: translateX(100%);
}
.list-enter-to{
    opacity: 1;

}
.list-enter-active,
.list-leave-active{
    transition: all 1s
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>