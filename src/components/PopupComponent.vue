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
    closePopup : Function
  },
  data() {
    return {};
  },
};
</script>

<template>
  <ElRow class="popup" justify="center">
    <ElCol :span="22">
      <PushPopup v-if="type === 'push'" :@closePopup="closePopup" />
      <PullPopup v-if="type === 'pull'" :@closePopup="closePopup" />
      <CheckoutPopup v-if="type === 'checkout'" :@closePopup="closePopup" />
    </ElCol>
  </ElRow>
</template>

<style></style>
