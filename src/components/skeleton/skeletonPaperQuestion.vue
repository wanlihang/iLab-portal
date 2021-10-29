<template>
  <div class="skeleton">
    <div class="title"></div>
    <div class="item"></div>
    <div class="text"></div>
    <div class="text"></div>
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
  height: 260px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 30px;
  background-color: #fff;
  .title {
    width: 200px;
    height: 18px;
    box-sizing: border-box;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .item {
    width: 100%;
    height: 16px;
    box-sizing: border-box;
    margin-top: 30px;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .text {
    width: 100%;
    height: 16px;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
}
</style>