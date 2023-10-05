<script>
import {
  ElInput,
  ElForm,
  ElFormItem,
} from "element-plus";
import { ipcRenderer } from "electron";

let fileList = [];

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

    async getChangedFileList() {
      ipcRenderer.send("execGitMethod", "git status -s");
      ipcRenderer.on("gitMethodReturn", async (event, arg) => {
        if (arg === undefined) {
          this.getChangedFileList();
        } else {
          fileList = []

          fileList = arg
            .split("\n") // 배열로 변환
            .filter((file) => file !== "") // 배열 마지막에 존재하는 공백 삭제
            .filter((file) => file.substring(0, 1) !== "M") // 이미 staging 된 파일 제외
            .map((file) => file.substring(3, file.length)); // 파일 이름만 남기게 포멧팅
        }

        this.changeFileList = fileList
        console.log(fileList);
      });
    },
  },
  data() {
    const changeFileList = fileList

    return {
      popVisiable: this.visiable,
      pushForm: {
        commitMessage: "",
      },
      changeFileList
    };
  },
  props: {
    visiable: Boolean,
  },
};
</script>

<template>
  <p v-for="file in changeFileList" :key="file">test</p>

  <ElForm v-model="pushForm">
    <ElFormItem size="large">
      <ElInput
        v-model="pushForm.commitMessage"
        placeholder="Please Input Commit Message"
        clearable
      ></ElInput>
    </ElFormItem>
  </ElForm>
</template>

<style scoped></style>
