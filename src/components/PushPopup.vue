<script>
import {
  ElCol,
  ElRow,
  ElInput,
  ElCheckbox,
  ElButton,
  ElText,
  ElDivider,
  ElMessage,
} from "element-plus";
import { ipcRenderer } from "electron";
import { Refresh, Message, Check, Close } from "@element-plus/icons-vue";
import { useStore } from "@/store/store";

export default {
  name: "PushPopup",
  components: {
    ElInput,
    ElCheckbox,
    ElButton,
    ElCol,
    ElRow,
    ElText,
    ElDivider,
  },
  mounted() {
    console.log("mounted : "+this.store.path)
    let path = this.store.path;
    if (path !== undefined) {
      this.getChangedFileList(path);
    } 
  },
  data() {
    const store = useStore();

    return {
      commitMessage: "",
      stagingFileList: null,
      checkboxLoading: false,
      commitTargetFileList: [],
      store,
      Refresh,
      Message,
      Check,
      Close,
    };
  },
  methods: {
    handleClose() {
      this.$emit("closePopup");
    },

    async getChangedFileList(path) {
      const _this = this;
      _this.stagingFileList = null;
      _this.checkboxLoading = true;

      ipcRenderer.send("execGitMethod", [path, "git status --porcelain"]);

      return new Promise((resolve, reject) => {
        ipcRenderer.once("gitMethodReturn", async (event, arg) => {
          try {
            const fileList = arg
              .split("\n") // Convert to array
              .filter((file) => file.trim() !== "") // Delete empty lines
              .map((fileStatus) => {
                // Extract only file names
                const parts = fileStatus.trim().split(" ");
                return parts[parts.length - 1];
              });

            _this.commitTargetFileList = Array.from(
              { length: fileList.length },
              () => true
            );
            _this.stagingFileList = fileList;
            resolve(fileList);
            _this.checkboxLoading = false;
          } catch (error) {
            _this.stagingFileList = ["Loading Fail..."];
            _this.checkboxLoading = false;
            reject(error);
          }
        });
      });
    },

    changeFileState(fileName) {
      const index = this.stagingFileList.indexOf(fileName);
      const originValue = this.commitTargetFileList[index];

      this.commitTargetFileList[index] = !originValue;

      console.log(this.commitTargetFileList);
    },

    handleCommitBtnClick() {
      if (this.commitMessage.trim() === "") {
        this.commitMessage = "";
        return ElMessage({
          message: "empty commit message",
          type: "error",
          duration: 1500,
        });
      }

      const list = this.commitTargetFileList;

      for (let i = 0; i < list.length; i++) {
        if (list[i] === false) {
          continue;
        } else {
          console.log(this.stagingFileList[i]);
          list[i] = this.stagingFileList[i];
        }
      }

      this.commitTargetFileList = list.filter((item) => item !== false);
    },
  },
  props: {},
};
</script>

<template>
  <ElRow justify="space-between" class="pushPopupItem">
    <ElText>Pick a target to staged</ElText>
    <ElButton :icon="Refresh" circle size="small" @click="getChangedFileList(this.store.path)" />
  </ElRow>
  <ElRow class="pushPopupItem" v-loading="checkboxLoading">
    <ElCol :span="5">
      <ElCheckbox
        size="small"
        v-for="file in stagingFileList"
        v-bind:key="file"
        checked="true"
        @change="changeFileState(file)"
        >{{ file }}</ElCheckbox
      >
    </ElCol>
  </ElRow>

  <ElDivider />

  <ElRow class="pushPopupItem" justify="space-between">
    <ElCol :span="20">
      <ElInput
        v-model="commitMessage"
        placeholder="Please Input Commit Message"
        clearable
        size="small"
      ></ElInput>
    </ElCol>

    <ElCol :span="3">
      <ElButton
        v-if="commitMessage === ''"
        :icon="Close"
        plain
        type="danger"
        size="small"
      ></ElButton>
      <ElButton
        v-else
        :icon="Check"
        plain
        type="success"
        size="small"
      ></ElButton>
    </ElCol>
  </ElRow>

  <ElRow justify="end" style="margin-top: 30px">
    <ElButton
      :disabled="!commitMessage"
      plain
      :icon="Message"
      round="true"
      @click="handleCommitBtnClick"
    >
      Commit
    </ElButton>
  </ElRow>
</template>

<style scoped>
.pushPopupItem {
  margin-bottom: 10px;
}
</style>
