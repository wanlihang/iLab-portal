<template>
  <div class="skeleton">
    <div style="width: 120px; height: 30px" class="title"></div>
    <div class="body">
      <div class="item" v-for="item in 8" :key="item">
        <div class="thumb"></div>
        <div class="tit"></div>
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
  width: 100%;
  margin-top: 40px;
  .title {
    width: 120px;
    height: 30px;
    margin: 0 auto;
    margin-bottom: 50px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .body {
    width: 100%;
    display: grid;
    row-gap: 30px;
    column-gap: 48px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    overflow: hidden;
    margin-bottom: 40px;
    .item {
      width: 264px;
      display: flex;
      flex-direction: column;
      .thumb {
        width: 264px;
        height: 198px;
        border-radius: 8px 8px 0px 0px;
        overflow: hidden;
        background: linear-gradient(
          90deg,
          #f2f2f2 25%,
          #e6e6e6 37%,
          #f2f2f2 63%
        );
        background-size: 400% 100%;
        animation: el-skeleton-loading 1.4s ease infinite;
      }
      .tit {
        width: 100px;
        height: 16px;
        margin-left: 10px;
        margin-top: 15px;
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
        margin-left: 10px;
        margin-top: 15px;
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