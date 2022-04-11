<template>
  <div class="content">
    <div class="pay-success-box">
      <div class="success-info">
        <img src="../../assets/img/commen/icon-adopt.png" />支付成功！
      </div>
      <div class="price">
        实付款：<span class="value"
          >￥<strong>{{ total_amount }}</strong></span
        >
      </div>
      <div class="btn-box">
        <div class="button" @click="goIndex()">返回首页</div>
        <div class="button find" @click="find()">查看订单</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      total_amount: this.$route.query.total_amount || 0,
    };
  },
  methods: {
    goIndex() {
      this.$router.replace({
        name: "index",
      });
    },
    find() {
      this.$router.replace({
        name: "MemberOrders",
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: auto;
  float: left;
  .pay-success-box {
    width: 1200px;
    margin: 0 auto;
    height: 222px;
    background: #ffffff;
    border-radius: 8px;
    margin-top: 30px;
    position: relative;
    box-sizing: border-box;
    padding: 50px;
    .success-info {
      width: 100%;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 24px;
      font-weight: 500;
      color: #333333;
      line-height: 24px;
      img {
        width: 48px;
        height: 48px;
        margin-right: 30px;
      }
    }
    .price {
      width: 100%;
      height: 24px;
      margin-top: 50px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 24px;
      .value {
        color: #ff4d4f;
        strong {
          font-size: 24px;
        }
      }
    }
    .btn-box {
      position: absolute;
      right: 50px;
      top: 86px;
      width: auto;
      height: 50px;
      display: flex;
      .button {
        width: 140px;
        height: 50px;
        border-radius: 4px;
        border: 1px solid #cccccc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 400;
        color: #666666;
        cursor: pointer;
        margin-left: 30px;
        &:hover {
          opacity: 0.8;
        }
        &.find {
          color: #ff4d4f;
          border: 1px solid #ff4d4f;
        }
      }
    }
  }
}
</style>
