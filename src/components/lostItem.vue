<script>
import { ref } from "vue";
export default {
  setup() {
    return {
      test: "test lost item",
      testNum: ref(2),
    };
  },
  methods: {
    testFunc: function () {
      return "testFunc";
    },
  },
  components: {
    testComp: { template: "<div>遺失物測試</div>" },
  },
};
</script>
<template>
  <testComp></testComp>
</template>