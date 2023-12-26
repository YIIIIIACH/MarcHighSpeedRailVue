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
    <!-- <img src="@/src/assets/background.jpg " /> -->
    <div class="home-page-container">
      <Transition>
        <div class="page-block" id="div1" v-show="pageBlockDisplayArr[0]">
          <router-link to="/booking">
            <img class="centerDiv" src="src\assets\div1.jpg"
          /></router-link>
        </div>
      </Transition>
      <Transition>
        <div class="page-block" id="div2" v-show="pageBlockDisplayArr[1]">
          <router-link to="/goods"
            ><img class="centerDiv" src="src\assets\div2.jpg"
          /></router-link>
        </div>
      </Transition>
      <Transition>
        <div class="page-block" id="div3" v-show="pageBlockDisplayArr[2]">
          <router-link to="/lostItem"
            ><img class="centerDiv" src="src\assets\div3.jpg"
          /></router-link>
        </div>
      </Transition>
      <Transition>
        <div class="page-block" id="div4" v-show="pageBlockDisplayArr[3]">
          <router-link to="/register"
            ><img class="centerDiv" src="src\assets\div4.jpg"
          /></router-link>
        </div>
      </Transition>
    </div>
  </div>
  <footer class="bd-footer py-4 py-md-5 bg-dark">
    <div class="container py-4 py-md-5 px-4 px-md-3" id="footerType">
      本網頁僅提供學習JAVA還有一堆酷酷的程式課程<br />圖像和人物皆有肖像權，請勿無斷轉載使用<br /><br />This
      webpage is only for learning web program,<br />Do not use it for
      otherside.
    </div>
  </footer>
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
  background-image: url("../src/assets/background.jpg");
  background-attachment: fixed; /* 設定背景圖片固定 */
  background-position: center center; /* 調整背景圖片位置為中心 */
  background-repeat: no-repeat; /* 禁止背景圖片重複 */
  background-size: cover; /* 使背景圖片充滿整個容器 */
  position: static;
  z-index: -1000;
  background-color: #3ca86c;
  height: 2400px;
}
.centerDiv {
  text-align: center;
}
#footerType {
  /* height: 200px; */
  text-align: center;
  color: #3ca86c;
}
</style>