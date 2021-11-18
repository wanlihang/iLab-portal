<template>
  <div class="backTop"  @click="goBackTop">
    <img src="../assets/img/commen/icon-backtop.png" />
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    goBackTop() {
      window.scrollTo(0, 0);
    },
  }
}
</script>
<style lang="less" scoped>
.backTop {
  position: fixed;
  right: 17px;
  bottom: 150px;
  z-index: 30;
  cursor: pointer;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  &:hover {
    opacity: 0.8;
  }
  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }
}
</style>
