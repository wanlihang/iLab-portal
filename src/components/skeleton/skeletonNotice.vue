<template>
  <div class="skeleton">
    <div class="title"></div>
    <div class="item"></div>
    <div class="line"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
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
  .title {
    width: 806px;
    height: 18px;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .item {
    width: 200px;
    height: 20px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .line {
    width: 806px;
    height: 1px;
    background: #e5e5e5;
    margin: 30px 0px;
  }
  .info {
    width: 806px;
    height: 16px;
    margin-bottom: 20px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
    &:last-child {
      margin-bottom: 0px;
    }
  }
}
</style>