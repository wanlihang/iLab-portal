<template>
  <div class="skeleton">
    <div class="box">
      <div class="item"></div>
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
  height: 70px;
  background: #ffffff;
  padding: 18px 0px 8px 0px;
  box-sizing: border-box;
  .box {
    width: 1200px;
    height: auto;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    .item {
      width: 760px;
      height: 34px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
  }
}
</style>