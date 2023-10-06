<script>
import PushPopup from "./PushPopup.vue";
import PullPopup from "./PullPopup.vue";
import CheckoutPopup from "./CheckoutPopup.vue";
import { ElCol, ElRow } from "element-plus";

export default {
  name: "PopupComponent",
  components: {
    PushPopup,
    PullPopup,
    CheckoutPopup,
    ElCol,
    ElRow,
  },
  methods: {},
  props: {
    type: String,
    cwd: String,
  },
  data() {
    return {};
  },
};
</script>

<template>
  <ElRow class="popup" justify="center">
    <ElCol :span="22">
      <PushPopup v-if="type === 'push'" :cwd="cwd" />
      <PullPopup v-if="type === 'pull'" :cwd="cwd" />
      <CheckoutPopup v-if="type === 'checkout'" :cwd="cwd" />
    </ElCol>
  </ElRow>
</template>

<style></style>
