<template>
  <div id="app" class="container mt-4">
    <h1 class="mb-4">遺失物搜尋</h1>

    <!-- 搜尋框 -->
    <div class="input-group mb-3">
      <input
        v-model="searchTerm"
        type="text"
        class="form-control"
        placeholder="輸入搜尋內容"
      />
      <button @click="performSearch" class="btn btn-primary">搜尋</button>
    </div>
    <div>
      <table class="table">
        <thead>
          <tr>
            <th>發現站名</th>
            <th>發現日期</th>
            <th>遺失物所在站</th>
            <th>物品種類</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in jsonDateFilted" :key="index">
            <td>{{ item.stationName }}</td>
            <td>{{ item.findDate }}</td>
            <td>{{ item.stayStation }}</td>
            <td>{{ item.simpleOutward }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="page-bar">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" @click="changePage(-1,-1)">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item" v-for="i in jsonDataPageCnt" :key="i" :class="{'active': currPageNum==i}" @click="changePage(0, i)"><a class="page-link" href="#" >{{ i }}</a></li>
          <li @click="changePage(1,-1)">
            <a class="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <!-- <ul class="list-group">
      <li
        v-for="(item, index) in jsonData.values"
        :key="index"
        class="list-group-item"
      >
        <h5 class="mb-1">
          <strong>Station Name:</strong> {{ item.stationName }}
        </h5>
        <ul class="list-unstyled">
          <li><strong>Find Date:</strong> {{ item.findDate }}</li>
          <li><strong>Stay Station:</strong> {{ item.stayStation }}</li>
          <li><strong>Simple Outward:</strong> {{ item.simpleOutward }}</li>
        </ul>
      </li>
    </ul> -->
  </div>
</template>

<script setup>
import httpClient from "@/main";
import { reactive, ref, computed } from "vue";

const props = defineProps(["memberId"]);
const emits = defineEmits(["updateMemberId"]);

const jsonData = reactive([]);
const searchTerm = ref("");
const currPageNum = ref(1)
const pageSize = 4;
const jsonDateFilted = computed(()=>{
  // default page size is 4
  // return idx (pageNum-1)*pageSize  to (pageNum)*pageSize-1
  let cnt = 0;
  let res = [];
  for( let i=0; i< jsonData.values.length ; i++){
    if( i>= (currPageNum.value-1)*pageSize  && i< (currPageNum.value)*pageSize){
      res.push( jsonData.values[i]);
    }
  }
  return res;
})
const jsonDataPageCnt = computed(()=>{
  let cnt = jsonData.values.length
  return  Math.ceil(cnt/pageSize)
})
function changePage(offset, tarPageNum){
  if(tarPageNum != -1){
    currPageNum.value = tarPageNum
  }
  if( currPageNum.value+offset < 1 || currPageNum.value+offset> Math.ceil( jsonData.values.length/pageSize)){
    return;
  }
  currPageNum.value+= offset;
}
function performSearch() {
  getSearchSimple(searchTerm.value);
}
function getSearchSimple(simpleOutward) {
  currPageNum.value = 1;
  httpClient
    .get(
      "/LostProperty/frontend/search/simpleOutward?simpleOutward=" +
        simpleOutward,
      jsonData
    )
    .then((res) => {
      // console.log(res.data);
      jsonData.values = res.data;
      console.log(jsonData.values);
    })
    .catch(function (err) {
      console.error("Error:", err);
      // Handle the error as needed
    });
}

// onMounted();
</script>
<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.8s ease;
  position: absolute;
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.page-bar{
  display: flex;
  justify-content: center;
}
</style>
