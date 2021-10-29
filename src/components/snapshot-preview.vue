<template>
  <div class="image-preview-shadow-box" @click="close">
    <img class="del" @click="del" src="../assets/img/commen/icon-delete.png" />
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
    del() {
      this.$emit("del");
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
.del {
  position: absolute;
  z-index: 100000;
  right: 20px;
  top: 20px;
  cursor: pointer;
  width: 40px;
  height: 40px;
}
</style>