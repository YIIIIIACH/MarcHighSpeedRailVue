<script setup>
defineEmits(
    ['timeShift']
)
</script>
<template>
    <div class="btn-group" role="group" aria-label="Basic outline example">
        <button type="button" @click="$emit('timeShift',-2)" class="btn btn-secondary">稍早班次</button>
        <button type="button" @click="$emit('timeShift',2)" class="btn btn-secondary">稍晚班次</button>
    </div>
</template>
<style>
</style>