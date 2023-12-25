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

    <ul class="list-group">
      <li
        v-for="(item, index) in jsonData"
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
    </ul>
  </div>
</template>

<script setup>
import httpClient from "@/main";
import { ref, onMounted } from "vue";

const jsonData = ref([]);
const searchTerm = ref("");

function performSearch() {
  getSearchSimple(searchTerm.value);
}
function getSearchSimple(simpleOutward) {
  httpClient
    .get(
      "/LostProperty/frontend/search/simpleOutward?simpleOutward=" +
        simpleOutward,
      jsonData
    )
    .then((res) => {
      console.log(res.data);
      jsonData.value = res.data;
    })
    .catch(function (err) {
      console.error("Error:", err);
      // Handle the error as needed
    });
}

onMounted();
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
</style>
