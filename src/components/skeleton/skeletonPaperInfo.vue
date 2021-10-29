<template>
  <div class="skeleton">
    <div class="title"></div>
    <div class="item"></div>
    <div class="btn-box"></div>
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
  .title {
    width: 100px;
    height: 28px;
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .item {
    width: 300px;
    height: 14px;
    margin: 0 auto;
    margin-bottom: 50px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .btn-box {
    width: 104px;
    height: 40px;
    margin: 0 auto;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
}
</style>