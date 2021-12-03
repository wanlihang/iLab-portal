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
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  .item {
    width: 216px;
    height: 237px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    .thumb {
      width: 100%;
      height: 162px;
      border-radius: 8px 8px 0px 0px;
      overflow: hidden;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .body {
      width: 100%;
      height: 75px;
      display: flex;
      flex-direction: column;
      .title {
        width: 100%;
        height: 16px;
        margin-top: 5px;
        margin-bottom: 20px;
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
        width: 150px;
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
