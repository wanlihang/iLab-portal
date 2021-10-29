<template>
  <div class="skeleton">
    <div class="banner"></div>
    <div class="tips">
      <div class="notice"></div>
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
  .banner {
    width: 1200px;
    height: 400px;
    margin: 0 auto;
    margin-top: 30px;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .tips {
    width: 1200px;
    height: 16px;
    margin: 0 auto;
    .notice {
      width: 327px;
      height: 16px;
      margin-left: 30px;
      margin-top: 15px;
      margin-bottom: 15px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
  }
}
</style>