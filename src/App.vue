<script>
import {
  ElText,
  ElDivider,
  ElButton,
  ElCol,
  ElRow,
  ElMessage,
  ElDialog,
} from "element-plus";
import { Message, Download } from "@element-plus/icons-vue";
import ActionButton from "./components/ActionButton";
import PopupComponent from "./components/PopupComponent.vue";

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
    PopupComponent,
  },
  methods: {
    execAction(method) {
      switch (method) {
        case "push":
          this.popupState = true;
          this.popupType = "push";
          this.popupFooter = {
            buttonType: "primary",
            icon: Message,
            round: true,
            text: "Commit",
          };
          break;
        case "pull":
          this.popupState = true;
          this.popupType = "pull";
          this.popupFooter = null;
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
  },
  data() {
    return {
      items: ["Push", "Pull", "Checkout"],
      popupState: false,
      popupType: "push",
      popupFooter: {},
      Download,
    };
  },
};
</script>

<template>
  <ElRow class="base">
    <ElCol :span="24">
      <ElText class="title" type="primary" size="large" tag="b">EzGit</ElText>
    </ElCol>
    <ElCol :span="24">
      <ElText class="subTitle" type="info" size="small" tag="i"
        >For your easy git use</ElText
      >
    </ElCol>

    <ElCol :span="22">
      <ElDivider />
    </ElCol>

    <ElDialog
      v-model="popupState"
      :title="`${popupType.substring(0, 1).toUpperCase()}${popupType.substring(
        1,
        popupType.length
      )} Popup`"
      width="90%"
      custom-class="popup"
    >
      <PopupComponent :type="popupType" />

      <template v-if="popupFooter" #footer>
        <ElButton
          plain
          :color="popupFooter.color"
          :type="popupFooter.buttonType"
          :round="popupFooter.round"
          :icon="popupFooter.icon"
          >{{ popupFooter.text }}
        </ElButton>
      </template>
    </ElDialog>

    <ActionButton
      v-for="item in items"
      v-bind:key="item"
      :title="item"
      @execAction="execAction"
      @callNoti="callNoti"
    />
  </ElRow>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.base {
  widows: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
