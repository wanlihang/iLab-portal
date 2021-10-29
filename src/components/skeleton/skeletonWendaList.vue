<template>
  <div class="skeleton">
    <div class="item">
      <div class="title"></div>
      <div class="text"></div>
      <div class="text"></div>
      <div class="info"></div>
    </div>
    <div class="item">
      <div class="title"></div>
      <div class="text"></div>
      <div class="text"></div>
      <div class="info"></div>
    </div>
    <div class="item">
      <div class="title"></div>
      <div class="text"></div>
      <div class="text"></div>
      <div class="info"></div>
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
  width: 100%;
  display: flex;
  flex-direction: column;
  .item {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 20px;
    .title {
      width: 234px;
      height: 20px;
      margin-bottom: 20px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .text {
      width: 709px;
      height: 16px;
      margin-top: 10px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .info {
      width: 200px;
      height: 16px;
      margin-top: 15px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
  }
}
</style>