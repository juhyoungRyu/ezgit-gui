<script>
import { ElButton, ElCol } from "element-plus";

export default {
  name: "ActionButton",
  components: {
    ElButton,
    ElCol,
  },
  methods: {
    callEmit() {
      console.log(`button : ${this.title.toLowerCase()}`)
      this.$emit("execAction", this.title.toLowerCase());
    },
  },
  props: {
    title: String,
  },
};
</script>

<template>
  <ElCol :span="24">
    <ElButton class="btn" @click="callEmit">{{ title }}</ElButton>
  </ElCol>
</template>

<style>
.btn {
  width: calc(100vw - 40vw);
  height: 60px;
  margin-bottom: 10px;
}
</style>
