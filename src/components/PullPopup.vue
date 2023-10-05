<script>
import { ElButton } from 'element-plus';

export default {
  name: "PushPopup",
  components: {
    ElButton
  },
  methods: {
    handleClose() {
        this.$emit('closePopup')
    }
  },
  data() {
    return {
        popVisiable : this.visiable
    };
  },
  props: {
    visiable : Boolean
  }
};
</script>

<template>
  <ElButton>test</ElButton>
</template>

<style></style>
