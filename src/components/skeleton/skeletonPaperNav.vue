<template>
  <div class="skeleton">
    <div class="filter">
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
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .filter {
    width: 1200px;
    height: auto;
    background: #ffffff;
    border-radius: 8px;
    padding: 15px 30px;
    box-sizing: border-box;
    .info {
      width: 760px;
      height: 34px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
  }
}
</style>