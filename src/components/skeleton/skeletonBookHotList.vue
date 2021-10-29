<template>
  <div class="skeleton">
    <div class="name"></div>
    <div class="item">
      <div class="thumb"></div>
      <div class="body">
        <div class="title"></div>
        <div class="desc"></div>
        <div class="info"></div>
      </div>
    </div>
    <div class="item">
      <div class="thumb"></div>
      <div class="body">
        <div class="title"></div>
        <div class="desc"></div>
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
  height: 828px;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .name {
    width: 100px;
    height: 18px;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
  .item {
    width: 100%;
    height: 120px;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0px;
    }
    .thumb {
      width: 90px;
      height: 120px;
      overflow: hidden;
      border-radius: 8px;
      margin-right: 20px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .body {
      width: 220px;
      display: flex;
      flex-direction: column;
      .title {
        width: 220px;
        height: 18px;
        margin-top: 20px;
        background: linear-gradient(
          90deg,
          #f2f2f2 25%,
          #e6e6e6 37%,
          #f2f2f2 63%
        );
        background-size: 400% 100%;
        animation: el-skeleton-loading 1.4s ease infinite;
      }
      .desc {
        width: 81px;
        height: 14px;
        margin-top: 40px;
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
        width: 50px;
        height: 18px;
        margin-top: 20px;
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