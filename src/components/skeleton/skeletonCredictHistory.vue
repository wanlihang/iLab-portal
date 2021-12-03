<template>
  <div class="skeleton">
    <div class="item">
      <div class="thumb"></div>
      <div class="body">
        <div class="title"></div>
        <div class="info"></div>
      </div>
    </div>
    <div class="item">
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
  width: 100%;
  height: 828px;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .item {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0px;
    }
    .thumb {
      width: 130px;
      height: 100px;
      overflow: hidden;
      border-radius: 8px;
      margin-right: 20px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .body {
      width: 188px;
      display: flex;
      flex-direction: column;
      .title {
        width: 188px;
        height: 18px;
        margin-top: 20px;
        margin-bottom: 28px;
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
        width: 100px;
        height: 18px;
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
