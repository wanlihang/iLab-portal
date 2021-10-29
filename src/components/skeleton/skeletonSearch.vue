<template>
  <div class="skeleton">
    <div class="item">
      <div class="item-top"></div>
      <div class="content"></div>
      <div class="content"></div>
    </div>
    <div class="item">
      <div class="item-top"></div>
      <div class="content"></div>
      <div class="content"></div>
    </div>
    <div class="item">
      <div class="item-top"></div>
      <div class="content"></div>
      <div class="content"></div>
    </div>
    <div class="item">
      <div class="item-top"></div>
      <div class="content"></div>
      <div class="content"></div>
    </div>
    <div class="item">
      <div class="item-top"></div>
      <div class="content"></div>
      <div class="content"></div>
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
    height: auto;
    cursor: pointer;
    margin-top: 50px;
    .item-top {
      width: 100%;
      height: 18px;
      margin-bottom: 15px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .content {
      width: 800px;
      height: 14px;
      margin-bottom: 10px;
      width: 100%;
      height: 18px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
  }
}
</style>