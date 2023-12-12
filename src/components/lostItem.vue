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
