<template>
  <div class="skeleton">
    <div class="item">
      <div class="info-box">
        <div class="thumb"></div>
        <div class="body">
          <div class="title"></div>
          <div class="text"></div>
          <div class="text"></div>
          <div class="text"></div>
          <div class="button"></div>
        </div>
      </div>
      <div class="tabs"></div>
    </div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
    <div class="info"></div>
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
  margin-top: 30px;
  .item {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;
    .info-box {
      width: 100%;
      height: 300px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: row;
      .thumb {
        width: 320px;
        height: 240px;
        margin-right: 50px;
        position: relative;
        background: linear-gradient(
          90deg,
          #f2f2f2 25%,
          #e6e6e6 37%,
          #f2f2f2 63%
        );
        background-size: 400% 100%;
        animation: el-skeleton-loading 1.4s ease infinite;
      }
      .body {
        width: 770px;
        height: 240px;
        .title {
          width: 275px;
          height: 34px;
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
        .text {
          width: 100%;
          height: 18px;
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
        .button {
          width: 146px;
          height: 56px;
          margin-top: 35px;
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
    .tabs {
      width: 516px;
      height: 34px;
      margin-top: 20px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
  }
  .info {
    width: 1140px;
    height: 16px;
    margin-top: 20px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: el-skeleton-loading 1.4s ease infinite;
  }
}
</style>