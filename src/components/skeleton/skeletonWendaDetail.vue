<template>
  <div class="skeleton">
    <div class="title"></div>
    <div class="content"></div>
    <div class="thumbs-box">
      <div class="thumb-item"></div>
    </div>
    <div class="stat"></div>
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
  .title {
    width: 300px;
    height: 20px;
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .content {
    width: 100%;
    height: 20px;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .thumbs-box {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .thumb-item {
      width: 320px;
      height: 180px;
      margin-right: 30px;
      margin-bottom: 20px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
  }
  .stat {
    margin-top: 10px;
    width: 200px;
    height: 14px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
}
</style>