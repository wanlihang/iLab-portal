<template>
  <div class="skeleton">
    <div class="box1">
      <div class="avatar"></div>
      <div class="user-info">
        <div class="name"></div>
        <div class="time"></div>
      </div>
      <div class="value-box">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
      </div>
    </div>

    <div class="box2">
      <div class="tit"></div>
      <div class="bind">
        <div class="icon"></div>
        <div class="value"></div>
      </div>
      <div class="bind">
        <div class="icon"></div>
        <div class="value"></div>
      </div>
      <div class="bind">
        <div class="icon"></div>
        <div class="value"></div>
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
  .box1 {
    width: 100%;
    height: 140px;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 30px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: row;
    margin-right: 30px;
    .avatar {
      width: 80px;
      height: 80px;
      overflow: hidden;
      border-radius: 50%;
      margin-right: 20px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
    }
    .user-info {
      width: 403px;
      display: flex;
      flex-direction: column;
      .name {
        width: 160px;
        height: 24px;
        margin-top: 8px;
        background: linear-gradient(
          90deg,
          #f2f2f2 25%,
          #e6e6e6 37%,
          #f2f2f2 63%
        );
        background-size: 400% 100%;
        animation: el-skeleton-loading 1.4s ease infinite;
      }
      .time {
        width: 160px;
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
    }
    .value-box {
      width: 406px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      box-sizing: border-box;
      .item {
        width: 60px;
        height: 60px;
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
  .box2 {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 30px;
    position: relative;
    display: flex;
    flex-direction: column;
    .tit {
      width: 59px;
      height: 16px;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: el-skeleton-loading 1.4s ease infinite;
      margin-bottom: 30px;
    }
    .bind {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 0px;
      }
      .icon {
        width: 40px;
        height: 40px;
        margin-right: 15px;
        border-radius: 50%;
        background: linear-gradient(
          90deg,
          #f2f2f2 25%,
          #e6e6e6 37%,
          #f2f2f2 63%
        );
        background-size: 400% 100%;
        animation: el-skeleton-loading 1.4s ease infinite;
      }
      .value {
        width: 854px;
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