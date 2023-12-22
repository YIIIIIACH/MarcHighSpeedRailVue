<script setup>
import { reactive, onBeforeMount } from 'vue';
const props = defineProps(['memberId'])
const emits = defineEmits(['updateMemberId'])
const pageBlockDisplayArr = reactive([true, false, false, false])
onBeforeMount(()=>{
    window.addEventListener("scroll", 
    function handleScroll(){
        let y = window.scrollY;
        pageBlockDisplayArr[1] = (y> 60)?true: false
        pageBlockDisplayArr[2] = (y> 576)?true: false
        pageBlockDisplayArr[3] = (y> 1340)?true: false
    })
})

</script>
<template>
    <div class="home-page-container">
        <Transition>
            <div class="page-block" v-show="pageBlockDisplayArr[0]" ></div>
        </Transition>
        <Transition>
            <div class="page-block" v-show="pageBlockDisplayArr[1]" ></div>
        </Transition>
        <Transition>
            <div class="page-block" v-show="pageBlockDisplayArr[2]" ></div>
        </Transition>
        <Transition>
            <div class="page-block" v-show="pageBlockDisplayArr[3]" ></div>
        </Transition>
    </div>
</template>

<style>
.home-page-container{
    margin-top: 50px;
    margin-bottom: 300px;
}
.page-block{
    background-color: red;
    padding: auto 0px;
    margin: 40px 15%;
    width: 70%;
    height: 600px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>