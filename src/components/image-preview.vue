<template>
  <div class="image-preview-shadow-box" @click="close">
    <img class="img" :src="url" />
  </div>
</template>

<script>
export default {
  props: ["url"],
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.image-preview-shadow-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.8);
  text-align: center;
  overflow-y: auto;
  padding-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img {
  max-width: 100%;
}
</style>