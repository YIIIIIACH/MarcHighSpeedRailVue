<script setup>
const emits = defineEmits(
    ['timeShift','search']
)
</script>
<template>
    <div class="btn-group" role="group" style="width: 100%;" aria-label="Basic outline example">
        <button type="button" @click="emits('timeShift',-2)" class="btn btn-secondary">稍早班次</button>
        <button type="button" @click="emits('timeShift',2)" class="btn btn-secondary">稍晚班次</button>
        <button type="button"  @click="emits('search')" class="btn btn-primary">班次搜尋</button>
    </div>
</template>
<style>
</style>