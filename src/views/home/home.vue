<script setup>
import { reactive, onBeforeMount } from "vue";
const props = defineProps(["memberId"]);
const emits = defineEmits(["updateMemberId"]);
const pageBlockDisplayArr = reactive([true, false, false, false]);
onBeforeMount(() => {
  window.addEventListener("scroll", function handleScroll() {
    let y = window.scrollY;
    pageBlockDisplayArr[1] = y > 60 ? true : false;
    pageBlockDisplayArr[2] = y > 576 ? true : false;
    pageBlockDisplayArr[3] = y > 1340 ? true : false;
  });
});
</script>
<template>
  <div class="bg">
    <div class="home-page-container">
      <Transition>
        <div class="page-block" id="div1" v-show="pageBlockDisplayArr[0]"></div>
      </Transition>
      <Transition>
        <div class="page-block" id="div2" v-show="pageBlockDisplayArr[1]"></div>
      </Transition>
      <Transition>
        <div class="page-block" id="div3" v-show="pageBlockDisplayArr[2]"></div>
      </Transition>
      <Transition>
        <div class="page-block" id="div4" v-show="pageBlockDisplayArr[3]"></div>
      </Transition>
    </div>
  </div>
</template>

<style>
.home-page-container {
  margin-top: 0px;
  margin-bottom: 300px;
}
.page-block {
  padding: auto 0px;
  margin: 0px 15%;
  width: 70%;
  height: 600px;
}
#div1 {
  background-color: chartreuse;
}
#div2 {
  background-color: rgb(0, 89, 255);
}
#div3 {
  background-color: rgb(0, 153, 255);
}
#div4 {
  background-color: rgb(140, 0, 255);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.bg {
  background-color: #3ca86c;
  height: 2600px;
}
</style>