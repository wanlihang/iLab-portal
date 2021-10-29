<template>
  <div class="none" :class="{ active: type === 'white' }">
    <div class="empty-box">
      <div class="image-empty-item">
        <img src="../assets/img/commen/img-placeholder.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["type"],
};
</script>
<style lang="less" scoped>
.none {
  width: 100%;
  height: auto;
  float: left;
  padding-top: 100px;
  padding-bottom: 100px;
  background-color: #f4fafe;
  &.active {
    background-color: #fff;
  }
  .empty-box {
    width: 100%;
    height: auto;
    float: left;
    text-align: center;
    padding-top: 50px;
    padding-bottom: 50px;
    .image-empty-item {
      display: inline-block;
      img {
        width: 200px;
        height: 200px;
      }
    }
  }
}
</style>