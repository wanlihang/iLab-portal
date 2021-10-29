<template>
  <div class="skeleton">
    <div class="item">
      <div class="text"></div>
    </div>
    <div class="item">
      <div class="text"></div>
    </div>
    <div class="item">
      <div class="text"></div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@keyframes el-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  to {
    background-position: 0 50%;
  }
}
.skeleton {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .item {
    width: 1200px;
    height: 86px;
    display: flex;
    box-sizing: border-box;
    margin-bottom: 10px;
    align-items: center;
    .text {
      width: 100%;
      height: 40px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
  }
}
</style>