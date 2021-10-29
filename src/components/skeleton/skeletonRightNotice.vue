<template>
  <div class="skeleton">
    <div class="item">
      <div class="title"></div>
      <div class="info"></div>
    </div>
    <div class="item">
      <div class="title"></div>
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
  box-sizing: border-box;
  .item {
    width: 100%;
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0px;
    }
    .title {
      width: 100%;
      height: 24px;
      margin-bottom: 10px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .info {
      width: 100%;
      height: 12px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
  }
}
</style>