<template>
  <div class="error">
    <div class="empty-box">
      <img @click="goIndex" src="../../assets/img/commen/tips-400.png" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    goIndex() {
      this.$router.push({ name: "index" });
    },
  },
};
</script>
<style lang="less" scoped>
.error {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  .empty-box {
    width: 400px;
    height: 400px;
    img {
      width: 400px;
      height: 400px;
      cursor: pointer;
    }
  }
}
</style>