<script>
import { ElInput, ElForm, ElFormItem } from "element-plus";

export default {
  name: "PushPopup",
  components: {
    ElInput,
    ElForm,
    ElFormItem,
  },

  methods: {
    handleClose() {
      this.$emit("closePopup");
    },
  },
  data() {
    return {
      popVisiable: this.visiable,
      pushForm: {
        commitMessage: "",
      },
    };
  },
  props: {
    visiable: Boolean,
  },
};
</script>

<template>
  <ElForm v-model="pushForm" >
    <ElFormItem size="large">
      <ElInput
        v-model="pushForm.commitMessage"
        placeholder="Please Input Commit Message"
        clearable 
      ></ElInput>
    </ElFormItem>
  </ElForm>
</template>

<style scoped>
</style>
