<template>
  <div class="content">
    <div class="pay-box" v-if="payment === 'wechat'">
      <div class="pay-info">
        <div class="pay-top">
          <div class="icon">
            <img src="../../assets/img/commen/icon-wexinpay.png" />微信扫码支付
          </div>
          <div class="close" @click="closeCode()">取消支付</div>
        </div>
        <div class="paycode">
          <div id="qrcode" ref="qrcode"></div>
          <div class="info">
            <div class="orderNum">订单号：{{ orderId }}</div>
            <div class="price">
              <span>需支付</span
              ><span class="red"
                >￥<strong>{{ price }}</strong></span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="btn-confirm" @click="confirm()">已完成支付</div>
    </div>
    <div class="pay-box" v-if="payment === 'handPay'">
      <div class="pay-info">
        <div class="pay-top">
          <div class="icon">
            <img src="../../assets/img/commen/icon-card.png" />手动支付
          </div>
          <div class="close" @click="closeCode()">取消支付</div>
        </div>
        <div class="paycode2">
          <div class="hand-box">
            <div class="tit">收款信息及说明</div>
            <div class="text" v-html="text"></div>
          </div>
          <div class="orderNum">订单号：{{ orderId }}</div>
          <div class="price">
            <span>需支付</span
            ><span class="red"
              >￥<strong>{{ price }}</strong></span
            >
          </div>
        </div>
      </div>
      <div class="btn-confirm" @click="confirm()">已完成支付</div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import QRCode from "qrcodejs2";
import NavFooter from "../../components/footer.vue";
export default {
  components: {
    NavFooter,
  },
  data() {
    return {
      timer: null,
      loading: false,
      qrcode: null,
      orderId: this.$route.query.orderId,
      price: this.$route.query.price,
      payment: this.$route.query.payment,
      text: null,
      goods_type: this.$route.query.type,
      id: this.$route.query.id,
      course_id: this.$route.query.course_id,
      course_type: this.$route.query.course_type,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.initData();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    checkOrder() {
      this.$api.Order.CheckOrderStatus({ order_id: this.orderId }).then(
        (res) => {
          let status = res.data.status;
          if (status === 9) {
            this.$message.success("已成功支付");
            setTimeout(() => {
              this.goBack();
            }, 300);
          } else if (status === 7) {
            this.$message.error("已取消");
            setTimeout(() => {
              this.goBack();
            }, 300);
          }
        }
      );
    },
    initData() {
      this.timer = setInterval(this.checkOrder, 2000);
      if (this.payment === "wechat") {
        this.$api.Order.PayWechatScan({
          order_id: this.orderId,
        })
          .then((res) => {
            this.qrcode = res.data.code_url;
            this.$nextTick(() => {
              this.crateQrcode();
            });
          })
          .catch((e) => {
            this.$message.error(e.message);
            this.$router.push({ name: "index" });
          });
      } else if (this.payment === "handPay") {
        this.$api.Order.HandPay({
          order_id: this.orderId,
        })
          .then((res) => {
            this.text = res.data.text;
          })
          .catch((e) => {
            this.$message.error(e.message);
            this.$router.push({ name: "index" });
          });
      }
    },
    crateQrcode() {
      this.qr = new QRCode("qrcode", {
        width: 200,
        height: 200, // 高度
        text: this.qrcode, // 二维码内容
      });
    },
    closeCode() {
      this.goBack();
    },
    confirm() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.goBack();
    },
    goBack() {
      if (this.goods_type === "role") {
        this.$router.push({
          name: "Member",
        });
      } else if (this.goods_type === "vod") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "live") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "video") {
        this.$router.push({
          name: "coursesVideo",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "book") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "topic") {
        this.$router.push({
          name: "topicDetail",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "tg") {
        if (this.course_type === "course") {
          this.$router.push({
            name: "coursesDetail",
            query: {
              id: this.course_id,
            },
          });
        } else if (this.course_type === "live") {
          this.$router.push({
            name: "liveDetail",
            query: {
              id: this.course_id,
            },
          });
        } else if (this.course_type === "book") {
          this.$router.push({
            name: "bookDetail",
            query: {
              id: this.course_id,
            },
          });
        } else if (this.course_type === "learnPath") {
          this.$router.push({
            name: "learnPathDetail",
            query: {
              id: this.course_id,
            },
          });
        } else {
          this.$router.push({
            name: "tgDetail",
            query: {
              id: this.course_id,
            },
          });
        }
      } else if (this.goods_type === "ms") {
        if (this.course_type === "course") {
          this.$router.push({
            name: "coursesDetail",
            query: {
              id: this.course_id,
            },
          });
        } else if (this.course_type === "live") {
          this.$router.push({
            name: "liveDetail",
            query: {
              id: this.course_id,
            },
          });
        } else if (this.course_type === "book") {
          this.$router.push({
            name: "bookDetail",
            query: {
              id: this.course_id,
            },
          });
        } else if (this.course_type === "learnPath") {
          this.$router.push({
            name: "learnPathDetail",
            query: {
              id: this.course_id,
            },
          });
        } else {
          this.$router.push({
            name: "tgDetail",
            query: {
              id: this.course_id,
            },
          });
        }
      } else if (this.goods_type === "paper") {
        this.$router.push({
          name: "ExamPapersDetail",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "mockpaper") {
        this.$router.push({
          name: "ExamMockpaperDetail",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "practice") {
        this.$router.push({
          name: "ExamPracticeDetail",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "path") {
        this.$router.push({
          name: "learnPathDetail",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "k12") {
        this.$router.push({
          name: "K12Detail",
          query: {
            id: this.id,
          },
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .pay-box {
    width: 1200px;
    height: 495px;
    background: #ffffff;
    border-radius: 8px;
    margin: 0 auto;
    margin-top: 30px;
    box-sizing: border-box;
    padding: 50px 30px 30px 30px;
    .pay-info {
      width: 1140px;
      height: 315px;
      border-radius: 4px;
      border: 1px solid #e5e5e5;
      box-sizing: border-box;
      padding: 30px;
      position: relative;
      display: flex;
      flex-direction: column;
      .pay-top {
        width: 100%;
        height: 48px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 7px;
        .icon {
          height: 40px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 24px;
          display: flex;
          flex-direction: row;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }
        }
        .close {
          width: 104px;
          height: 48px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #999999;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .paycode2 {
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        .hand-box {
          width: 1080px;
          background: #e8f6ff;
          border-radius: 8px;
          padding: 15px;
          box-sizing: border-box;
          .tit {
            width: 100%;
            height: 16px;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 30px;
          }
          .text {
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            line-height: 24px;
          }
        }
        .orderNum {
          width: 1080px;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
          margin-bottom: 30px;
          margin-top: 30px;
        }
        .price {
          width: 1080px;
          display: flex;
          flex-direction: row;
          span {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            line-height: 16px;
            &.red {
              color: #ff5068;
              strong {
                font-size: 24px;
              }
            }
          }
        }
      }
      .paycode {
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: row;
        .hand-box {
          width: 1080px;
          background: #e8f6ff;
          border-radius: 8px;
          padding: 15px;
          box-sizing: border-box;
        }
        #qrcode {
          margin-right: 30px;
        }
        .info {
          widows: 850px;
          height: 200px;
          position: relative;
          display: flex;
          flex-direction: column;
          .orderNum {
            width: 100%;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 14px;
            margin-top: 50px;
            margin-bottom: 50px;
          }
          .price {
            width: 100%;
            display: flex;
            flex-direction: row;
            span {
              font-size: 16px;
              font-weight: 600;
              color: #333333;
              line-height: 16px;
              &.red {
                color: #ff5068;
                strong {
                  font-size: 24px;
                }
              }
            }
          }
        }
      }
    }
    .btn-confirm {
      width: 140px;
      height: 50px;
      background: #ff5068;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 400;
      color: #ffffff;
      margin-top: 50px;
      margin-left: 30px;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
