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
  },
  data() {
    return {};
  },
};
</script>

<template>
  <ElRow class="popup">
    <ElCol :span="24">
      <PushPopup v-if="type === 'push'" />
      <PullPopup v-if="type === 'pull'" />
      <CheckoutPopup v-if="type === 'checkout'" />
    </ElCol>
  </ElRow>
</template>

<style>
</style>
