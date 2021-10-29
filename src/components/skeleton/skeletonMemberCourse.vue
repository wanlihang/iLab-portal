<template>
  <div class="skeleton">
    <div class="item">
      <div class="thumb"></div>
      <div class="info">
        <div class="name"></div>
        <div class="num"></div>
      </div>
    </div>
    <div class="item">
      <div class="thumb"></div>
      <div class="info">
        <div class="name"></div>
        <div class="num"></div>
      </div>
    </div>
    <div class="item">
      <div class="thumb"></div>
      <div class="info">
        <div class="name"></div>
        <div class="num"></div>
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
  display: flex;
  flex-direction: column;
  .item {
    width: 939px;
    height: 100px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    &:last-child {
      margin-bottom: 0px;
    }
    .thumb {
      width: 133px;
      height: 100px;
      border-radius: 4px;
      margin-right: 30px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .info {
      width: 200px;
      height: 100px;
      display: flex;
      flex-direction: column;
      position: relative;
      .name {
        width: 200px;
        height: 14px;
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
      .num {
        width: 100px;
        height: 14px;
        margin-top: 30px;
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