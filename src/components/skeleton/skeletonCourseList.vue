<template>
  <div class="skeleton">
    <div class="item" v-for="item in 8" :key="item">
      <div class="thumb"></div>
      <div class="body">
        <div class="title"></div>
        <div class="info"></div>
      </div>
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
  display: grid;
  row-gap: 30px;
  column-gap: 48px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  .item {
    width: 264px;
    height: auto;
    display: flex;
    flex-direction: column;
    .thumb {
      width: 100%;
      height: 198px;
      border-radius: 8px 8px 0px 0px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .body {
      box-sizing: border-box;
      width: 100%;
      height: 75px;
      padding: 15px;
      .title {
        width: 100px;
        height: 16px;
        margin-bottom: 9px;
        background: linear-gradient(
          90deg,
          #f2f2f2 25%,
          #e6e6e6 37%,
          #f2f2f2 63%
        );
        background-size: 400% 100%;
        animation: el-skeleton-loading 1.4s ease infinite;
      }
      .info {
        width: 60px;
        height: 14px;
        background: linear-gradient(
          90deg,
          #f2f2f2 25%,
          #e6e6e6 37%,
          #f2f2f2 63%
        );
        background-size: 400% 100%;
        animation: el-skeleton-loading 1.4s ease infinite;
      }
    }
  }
}
</style>