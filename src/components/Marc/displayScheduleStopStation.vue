<script setup>
import stopStation from './stopStation.vue'
const props = defineProps(['stopStations'])

</script>
<template>
    <div class="card">
        <stopStation v-for="st of stopStations" :key="st.stopStation.stationId" :stopSt="st.stopStation"></stopStation>
    </div>
</template>
<style>
</style>