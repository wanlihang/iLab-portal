<template>
  <div class="content">
    <div class="box">
      <div class="tit">订阅信息</div>
      <div class="goods-box">
        <div class="goods-thumb" v-if="hasThumb">
          <thumb-bar
            v-if="goods.type === 'book'"
            :value="goods.icon"
            :border="4"
            :width="90"
            :height="120"
          ></thumb-bar>
          <thumb-bar
            v-else
            :value="goods.icon"
            :border="4"
            :width="160"
            :height="120"
          ></thumb-bar>
        </div>
        <div class="goods-info">
          <div class="goods-name">{{ goods.name }}</div>
          <div class="goods-label">{{ goods.label }}</div>
        </div>
        <div class="goods-charge"><span class="small">￥</span>{{ total }}</div>
      </div>
      <div class="tit">优惠码/邀请码</div>
      <div class="promocode-box">
        <input class="input" type="text" v-model="promoCode" />
        <div class="btn-confirm" @click="checkPromoCode()">验证</div>
        <div class="tip" v-if="configTip === 0">
          此邀请码无效，请重新输入验证
        </div>
        <div class="tip" v-if="configTip === 1">
          此邀请码有效，已减免{{ discount }}元
        </div>
      </div>
      <div class="tit">支付方式</div>
      <div class="credit2-box" v-if="payments">
        <template v-for="item in payments">
          <div
            class="payment-item"
            @click="setPayment(item.sign)"
            :key="item.sign"
            :class="{ active: item.sign === payment }"
          >
            <img
              src="../../assets/img/commen/icon-zfb.png"
              v-if="item.sign === 'alipay'"
            />
            <img
              src="../../assets/img/commen/icon-wepay.png"
              v-else-if="item.sign === 'wechat'"
            />
            <img
              src="../../assets/img/commen/icon-crad.png"
              v-else-if="item.sign === 'handPay'"
            />
          </div>
        </template>
      </div>
      <div class="line"></div>
      <div class="price-box">
        <span>优惠码已减</span><span class="red">{{ discount }}</span>
        <span>元，需支付</span>
        <span class="red"
          >￥<span class="big">{{ totalVal }}</span></span
        >
      </div>
      <div class="order-tip">请在15分钟内支付完成</div>
      <div class="btn-submit" @click="payHandler()">立即支付</div>
    </div>
  </div>
</template>
<script>
import Utils from "@/js/utils";
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: false,
      hasThumb: false,
      goods_type: this.$route.query.goods_type,
      goods: {
        id: this.$route.query.goods_id,
        icon: this.$route.query.goods_thumb,
        name: this.$route.query.goods_name,
        charge: this.$route.query.goods_charge,
        label: this.$route.query.goods_label,
        type: this.$route.query.goods_type,
        tgGid: this.$route.query.tg_gid || 0,
      },
      configTip: false,
      aliStatus: false,
      weStatus: false,
      handStatus: false,
      discount: 0,
      total: parseInt(this.$route.query.goods_charge),
      promoCode: null,
      promoCodeBoxStatus: false,
      promoCodeModel: null,
      paymentScene: "pc",
      course_id: this.$route.query.course_id,
      course_type: this.$route.query.course_type,
      payment: null,
    };
  },
  computed: {
    ...mapState(["user", "config", "configFunc"]),
    totalVal() {
      let val = this.total - this.discount;
      val = val < 0 ? 0 : val;
      return val;
    },
    payments() {
      let payments = [];
      if (this.aliStatus) {
        payments.push({
          name: "支付宝",
          sign: "alipay",
        });
      }
      if (this.weStatus) {
        payments.push({
          name: "微信支付",
          sign: "wechat",
        });
      }
      if (this.handStatus) {
        payments.push({
          name: "手动打款",
          sign: "handPay",
        });
      }
      return payments;
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    setPayment(sign) {
      this.payment = sign;
    },
    checkPromoCode() {
      if (this.loading) {
        return;
      }
      if (!this.promoCode) {
        return;
      }
      if (
        this.configFunc.share &&
        (this.promoCode.substr(0, 1) === "u" ||
          this.promoCode.substr(0, 1) === "U")
      ) {
        this.configTip = 0;
        return;
      }
      this.loading = true;
      this.$api.Order.PromoCodeCheck(this.promoCode)
        .then((res) => {
          this.loading = false;
          if (res.data.can_use !== 1) {
            this.configTip = 0;
          } else {
            this.configTip = 1;
            this.promoCodeModel = res.data.promo_code;
            this.discount = parseInt(this.promoCodeModel.invited_user_reward);
          }
        })
        .catch((e) => {
          this.loading = false;
          this.configTip = false;
          this.$message.error(e.message);
        });
    },
    initData() {
      if (this.goods_type === "role") {
        this.hasThumb = false;
      } else if (this.goods_type === "vod") {
        this.hasThumb = true;
      } else if (this.goods_type === "live") {
        this.hasThumb = true;
      } else if (this.goods_type === "video") {
        this.hasThumb = true;
      } else if (this.goods_type === "book") {
        this.hasThumb = true;
      } else if (this.goods_type === "topic") {
        this.hasThumb = true;
      } else if (this.goods_type === "path") {
        this.hasThumb = true;
      } else if (this.goods_type === "tg") {
        this.hasThumb = true;
      } else if (this.goods_type === "ms") {
        this.hasThumb = true;
      } else if (this.goods_type === "k12") {
        this.hasThumb = true;
      } else if (this.goods_type === "paper") {
        this.hasThumb = false;
      }
      this.params();
    },
    params() {
      this.$api.Order.Payments({
        scene: "pc",
      }).then((res) => {
        let payments = res.data;
        for (let i = 0; i < payments.length; i++) {
          this.payment = payments[0].sign;
          if (payments[i].sign === "alipay") {
            this.aliStatus = true;
          } else if (payments[i].sign === "wechat") {
            this.weStatus = true;
          } else if (payments[i].sign === "handPay") {
            this.handStatus = true;
          }
        }
      });
    },
    payHandler() {
      if (!this.payment) {
        this.$message.error("请选择支付方式");
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      if (this.goods.type === "vod") {
        // 实验课程
        this.$api.Order.CreateCourseOrder({
          course_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "video") {
        // 视频
        this.$api.Order.CreateVideoOrder({
          video_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "role") {
        this.$api.Order.CreateRoleOrder({
          role_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "live") {
        this.$api.Live.CreateOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "book") {
        this.$api.Book.CreateOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "paper") {
        this.$api.Exam.CreatePaperOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "practice") {
        this.$api.Exam.CreatePracticeOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "mockpaper") {
        this.$api.Exam.CreateMockpaperOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "path") {
        this.$api.LearnPath.CreateOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "tg") {
        this.$api.TuanGou.CreateOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
          gid: this.goods.tgGid,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "ms") {
        this.$api.MiaoSha.CreateOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "topic") {
        this.$api.Topic.CreateOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "k12") {
        this.$api.K12.CreateOrder(this.goods.id, {
          goods_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      }
    },
    orderCreatedHandler(order) {
      this.loading = false;
      // 判断是否继续走支付平台支付
      if (order.status_text === "已支付") {
        // 优惠全部抵扣
        this.$message.success("支付成功");

        setTimeout(() => {
          this.$router.back();
        }, 1000);
      } else {
        if (this.payment === "alipay") {
          let host = this.$utils.getAppUrl();
          let redirect = encodeURIComponent(host + "/order/success");
          let indexUrl = encodeURIComponent(host + "/");
          window.location.href =
            this.config.url +
            "/api/v2/order/pay/redirect?order_id=" +
            order.order_id +
            "&payment_scene=" +
            this.paymentScene +
            "&scene=" +
            this.paymentScene +
            "&payment=" +
            this.payment +
            "&token=" +
            Utils.getToken() +
            "&redirect=" +
            redirect +
            "&cancel_redirect=" +
            indexUrl;
        } else if (this.payment === "handPay" || this.payment === "wechat") {
          this.$router.push({
            name: "orderPay",
            query: {
              orderId: order.order_id,
              price: this.totalVal,
              payment: this.payment,
              type: this.goods.type,
              id: this.goods.id,
              course_id: this.$route.query.course_id,
              course_type: this.$route.query.course_type,
            },
          });
        } else {
          this.payFailure();
        }
      }
    },
    payFailure(e) {
      this.$message.error("无法支付");
      this.loading = false;
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  padding-top: 30px;
  box-sizing: border-box;
  padding-bottom: 102px;
  .box {
    width: 1200px;
    margin: 0 auto;
    height: 811px;
    position: relative;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 8px;
    padding: 30px;
    .tit {
      width: 100%;
      height: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 24px;
      margin-bottom: 30px;
    }
    .goods-box {
      width: 100%;
      height: 120px;
      border-radius: 2px;
      display: flex;
      flex-direction: row;
      position: relative;
      margin-bottom: 50px;
      .goods-thumb {
        width: 160px;
        height: 120px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 50px;
      }
      .goods-info {
        display: flex;
        flex-direction: column;
        .goods-name {
          height: 24px;
          font-size: 24px;
          font-weight: 500;
          color: #333333;
          line-height: 24px;
          letter-spacing: 1px;
          margin-top: 15px;
          margin-bottom: 30px;
        }
        .goods-label {
          width: 87px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          border: 1px solid #ff5068;
          font-size: 16px;
          font-weight: 400;
          color: #ff5068;
        }
      }
      .goods-charge {
        position: absolute;
        top: 15px;
        right: 30px;
        height: 24px;
        font-size: 24px;
        font-weight: 600;
        color: #ff5068;
        line-height: 24px;
        .small {
          font-size: 16px;
        }
      }
    }
    .promocode-box {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      position: relative;
      align-items: center;
      margin-bottom: 50px;
      .input {
        width: 450px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid #e5e5e5;
        padding-left: 15px;
        outline: none;
        margin-right: 20px;
      }
      .btn-confirm {
        cursor: pointer;
        width: 72px;
        height: 40px;
        background: #3ca7fa;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        margin-right: 30px;
      }
      .tip {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #ff5068;
        line-height: 14px;
      }
    }
    .credit2-box {
      width: 100%;
      height: 100px;
      display: flex;
      flex-direction: row;
      position: relative;
      margin-bottom: 55px;
      .payment-item {
        width: 230px;
        height: 100px;
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #e5e5e5;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 30px;
        &.active {
          border: 2px solid #ff4040;
        }
        img {
          width: 170px;
          height: 60px;
        }
      }
    }
    .line {
      width: 100%;
      height: 1px;
      background: #e5e5e5;
    }
    .price-box {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 50px;
      span {
        display: inline-block;
        height: 16px;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
        &.red {
          color: #ff4040;
        }
        .big {
          color: #ff4040;
          font-size: 24px;
        }
      }
    }
    .order-tip {
      width: 100%;
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: #ff5068;
      line-height: 14px;
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .btn-submit {
      width: 140px;
      height: 50px;
      background: #ff5068;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      font-weight: 500;
      color: #ffffff;
      float: right;
    }
  }
}
</style>
