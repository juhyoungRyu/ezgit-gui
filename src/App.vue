<script>
import {
  ElText,
  ElDivider,
  ElButton,
  ElCol,
  ElRow,
  ElMessage,
  ElDialog,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
} from "element-plus";
import { Download, FolderOpened } from "@element-plus/icons-vue";
import ActionButton from "./components/ActionButton";
import PopupComponent from "./components/PopupComponent.vue";
import { ipcRenderer } from "electron";
import { useStore } from "./store/store";

export default {
  name: "App",
  components: {
    ElText,
    ElDivider,
    ElButton,
    ElCol,
    ElRow,
    ActionButton,
    ElDialog,
    ElContainer,
    ElHeader,
    ElMain,
    ElFooter,
    PopupComponent,
  },
  methods: {
    execAction(method) {
      switch (method) {
        case "push":
          this.popupState = true;
          this.popupType = "push";
          break;
        case "pull":
          this.popupState = true;
          this.popupType = "pull";
          break;
        case "checkout":
          this.popupState = true;
          this.popupType = "checkout";
          break;
      }
    },

    callNoti(message, type) {
      ElMessage({
        message: message,
        type: type,
        duration: 2500,
        showClose: false,
      });
    },

    closePopup() {
      this.popupState = false;
    },

    async selectDir() {
      this.fileSelector.isLoading = true;
      ipcRenderer.send("selectDir");
      ipcRenderer.once("sendPath", (event, arg) => {
        if (arg !== "cancel") {
          this.fileSelector.path = arg;
          this.store.setPath(arg); // 전역 스토어에 path 지정
        }
        this.fileSelector.isLoading = false;
      });
      // this.fileSelector.path = "C:/Users/jhryu/Documents/ezgit-gui"; // 개발용
      // this.fileSelector.isLoading = false; // 개발용
    },
  },
  data() {
    return {
      items: ["Push", "Pull", "Checkout"],
      popupState: false,
      popupType: "push",
      popupFooter: null,
      fileSelector: {
        path: "",
        isLoading: false,
      },
      store: useStore(),
      Download,
      FolderOpened,
      ipcRenderer,
    };
  },
};
</script>

<template>
  <!-- popup -->
  <ElDialog
    v-model="popupState"
    v-if="popupState"
    :title="`${popupType.substring(0, 1).toUpperCase()}${popupType.substring(
      1,
      popupType.length
    )} Popup`"
    width="90%"
    custom-class="popup"
    @open="
      () => {
        this.$.components.PopupComponent.components.PushPopup.methods.getChangedFileList();
      }
    "
  >
    <PopupComponent :type="popupType" />
  </ElDialog>
  <!-- popup -->

  <ElContainer id="main">
    <ElHeader height="90px" class="header">
      <ElRow>
        <ElCol :span="24">
          <ElText class="title" type="primary" size="large" tag="b"
            >EzGit</ElText
          >
        </ElCol>
        <ElCol :span="24">
          <ElText class="subTitle" type="info" size="small" tag="i"
            >For your easy git use</ElText
          >
        </ElCol>

        <ElCol :span="24">
          <ElDivider />
        </ElCol>
      </ElRow>
    </ElHeader>

    <ElMain>
      <ElRow>
        <ActionButton
          v-for="item in items"
          v-bind:key="item"
          :title="item"
          :path="fileSelector.path"
          @execAction="execAction"
        />
      </ElRow>
    </ElMain>

    <ElFooter height="100px">
      <ElCol :span="24">
        <ElDivider />
      </ElCol>

      <ElRow justify="start">
        <ElCol :span="10">
          <ElButton
            :loading="fileSelector.isLoading"
            size="small"
            @click="selectDir"
            :icon="FolderOpened"
            >{{
              fileSelector.path === ""
                ? "please select your working dir"
                : fileSelector.path
            }}</ElButton
          >
        </ElCol>
      </ElRow>
    </ElFooter>
  </ElContainer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
}

#main {
  width: 100vw;
  height: 100vh;
}

.header {
  margin-top: 30px;
}

.title {
  font-size: 35px;
  font: bold;
}

.btn {
  width: calc(100vw - 40vw);
  height: 60px;
  margin-bottom: 10px;
}

.noti {
  width: 220px;
  height: 80px;
  font-size: 40px;
}

.popup {
  text-align: left;
}

.pathSelector {
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
}

.pathSelector button {
  color: #888;
}
</style>
