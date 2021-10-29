<template>
  <div class="skeleton"><div class="item"></div></div>
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
  padding: 30px 0px 20px 0px;
  box-sizing: border-box;
  .item {
    width: 264px;
    height: 16px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
}
</style>