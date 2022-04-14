<template>
  <div class="content">
    <div class="mask" v-if="inputStatus">
      <div class="dialog-login-box">
        <div class="tabs">
          <div class="item-tab active">秒杀活动</div>
          <img
            class="btn-close"
            @click="cancel()"
            src="../../assets/img/commen/icon-close.png"
          />
        </div>
        <div class="box">
          <div class="input-item">
            <input
              type="text"
              placeholder="请输入图形验证码"
              autocomplete="off"
              v-model="form.captcha"
              class="input-short"
              required=""
            />
            <div class="captcha">
              <img
                class="captcha-img"
                :src="captcha.img"
                mode="widthFix"
                @click="getCaptcha"
              />
            </div>
          </div>
          <div class="btn-box" style="margin-bottom: 0px !important">
            <button type="submit" class="submit" @click="confirm">
              立即秒杀
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <template v-if="loading">
        <skeletonDetail></skeletonDetail>
      </template>
      <template v-else-if="ms">
        <div class="nav">
          <a @click="$router.push({ name: 'index' })">首页</a> /
          <a @click="$router.push({ name: 'ms' })">秒杀</a> /
          <span>{{ ms.goods_title }}</span>
        </div>
        <div class="book-info">
          <div class="book-info-box">
            <div class="book-thumb">
              <thumb-bar
                :value="ms.goods_thumb"
                :width="320"
                :height="240"
              ></thumb-bar>
            </div>
            <div class="info">
              <div class="book-info-title">{{ ms.goods_title }}</div>
              <div class="ms-button">
                <div class="original_charge">
                  原价￥{{ ms.original_charge }}
                </div>
                <div class="charge">
                  <span class="ms-text">秒杀价:</span>
                  <span class="charge-text">
                    <span class="unit">￥</span>{{ ms.charge }}
                  </span>
                </div>
                <div class="price" v-if="ms.is_over">
                  <div class="end">已售罄</div>
                </div>
                <div class="price" v-else-if="ms.is_start">
                  <div class="ms-time start">
                    距秒杀结束剩余{{ remainingTime.day }}天{{
                      remainingTime.hr
                    }}时{{ remainingTime.min }}分{{ remainingTime.sec }}秒
                  </div>
                  <i class="line"></i>
                  <div class="ms-time">库存剩余{{ ms.over_num }}件</div>
                </div>
              </div>
              <div class="btn-box">
                <div class="isOver" v-if="ms.is_over">已售罄</div>
                <div
                  class="buy-button"
                  v-if="order.length === 0 && !ms.is_over"
                  @click="goOrder()"
                >
                  立即抢购￥{{ ms.charge }}
                </div>

                <div
                  class="unpaid"
                  @click="goPay(order.id)"
                  v-if="order && order.status === 0"
                >
                  已获得资格，请尽快支付
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="book-desc" v-if="ms" v-show="currentTab === 2">
          <div class="new-content" v-html="ms.desc"></div>
        </div>
      </template>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import SkeletonDetail from "../../components/skeleton/skeletonDetail.vue";

export default {
  components: {
    NavFooter,
    SkeletonDetail,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      ms: [],
      order: [],
      currentTab: 2,
      remainingTime: {
        all: 0,
        day: 0,
        hr: 0,
        min: 0,
        sec: 0,
      },
      captcha: {
        key: null,
        img: null,
      },
      form: {
        captcha: null,
      },
      inputStatus: false,
      isfixTab: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    window.addEventListener("scroll", this.handleTabFix, true);
    this.getDetail();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleTabFix, true);
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    //倒计时
    countdown(endTime) {
      const end = Date.parse(endTime);
      const now = Date.parse(new Date());
      const msec = end - now;
      if (msec < 0) {
        return;
      }
      let day = parseInt(msec / 1000 / 60 / 60 / 24);
      let hr = parseInt((msec / 1000 / 60 / 60) % 24);
      let min = parseInt((msec / 1000 / 60) % 60);
      let sec = parseInt((msec / 1000) % 60);
      this.remainingTime.day = day;
      this.remainingTime.hr = hr > 9 ? hr : "0" + hr;
      this.remainingTime.min = min > 9 ? min : "0" + min;
      this.remainingTime.sec = sec > 9 ? sec : "0" + sec;
      const that = this;
      if (min >= 0 && sec >= 0) {
        //倒计时结束关闭订单
        if (min === 0 && sec === 0 && hr === 0) {
          return;
        }
        setTimeout(() => {
          that.countdown(endTime);
        }, 1000);
      }
    },
    handleTabFix() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let navbar = document.querySelector("#NavBar");
      if (navbar) {
        let offsetTop = navbar.offsetTop;
        scrollTop > offsetTop
          ? (this.isfixTab = true)
          : (this.isfixTab = false);
      }
    },

    tabChange(key) {
      this.currentTab = key;
    },
    cancel() {
      this.inputStatus = false;
    },
    goOrder() {
      if (this.ms.is_start === false) {
        this.$message.error("活动未开始");
        return;
      }
      this.getCaptcha();
      this.inputStatus = true;
    },
    goPay(id) {
      this.$router.push({
        name: "order",
        query: {
          course_id: this.ms.id,
          goods_type: "ms",
          goods_charge: this.ms.charge,
          goods_label: "秒杀",
          goods_name: this.ms.goods_title,
          goods_id: id,
          goods_thumb: this.ms.goods_thumb,
        },
      });
    },
    goRole() {
      this.$router.push({
        name: "vip",
      });
    },
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
    confirm() {
      if (!this.form.captcha) {
        this.$message.error("请输入图片验证码");
        return;
      }
      this.$api.MiaoSha.Join(this.ms.id, {
        captcha: this.form.captcha,
        captcha_key: this.captcha.key,
      })
        .then((res) => {
          this.$message.success("抢购成功，请尽快支付");
          let orderId = res.data.id;
          this.inputStatus = false;
          setTimeout(() => {
            this.goPay(orderId);
          }, 600);
        })
        .catch((e) => {
          this.form.captcha = "";
          this.getCaptcha();
          this.$message.error(e.message);
        });
    },
    getDetail() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.MiaoSha.Detail(this.id).then((res) => {
        this.loading = false;
        this.ms = res.data.data;
        this.order = res.data.order;
        document.title = res.data.data.goods_title;
        if (this.ms.is_start) {
          this.countdown(this.ms.end_at);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .mask {
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .dialog-login-box {
      width: 500px;
      height: 300px;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 30px;
      animation: scaleBig 0.3s;
      .tabs {
        width: 100%;
        height: 44px;
        display: flex;
        flex-direction: row;
        position: relative;
        .linkTab {
          position: absolute;
          top: 5px;
          right: 54px;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #3ca7fa;
          line-height: 14px;
        }

        .btn-close {
          width: 24px;
          height: 24px;
          position: absolute;
          right: 5px;
          top: 2px;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
            animation: rotate360 1s;
          }
        }
        .item-tab {
          width: auto;
          height: 20px;
          font-size: 20px;
          font-weight: 500;
          color: #666666;
          line-height: 20px;
          margin-right: 50px;
          cursor: pointer;
          position: relative;
          &.active {
            color: #333333;
          }
          .actline {
            width: 80px;
            height: 4px;
            background: #3ca7fa;
            position: absolute;
            left: 0px;
            top: 40px;
          }
        }
      }
      .box {
        width: 100%;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        .input-item {
          width: 100%;
          margin-bottom: 30px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .input {
            width: 100%;
            height: 54px;
            background: #f4fafe;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
            padding-left: 20px;
            :focus {
              border-color: #3ca7fa;
            }
          }
          .input-short {
            width: 310px;
            height: 54px;
            background: #f4fafe;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
            padding-left: 20px;
            margin-right: 20px;
            :focus {
              border-color: #3ca7fa;
            }
          }
          .captcha {
            width: 110px;
            height: 39px;
            cursor: pointer;
            img {
              width: 110px;
              height: 39px;
            }
          }
          .buttons {
            margin-left: 20px;
            .send-sms-button {
              width: 90px;
              height: 18px;
              font-size: 18px;
              font-weight: 400;
              color: #3ca7fa;
              line-height: 18px;
              cursor: pointer;
            }
          }
        }

        .btn-box {
          width: 100%;
          margin-bottom: 30px;
          button {
            width: 100%;
            height: 54px;
            background: #3ca7fa;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            outline: none;
          }
        }
      }
    }
  }
  .fix-nav {
    width: 100%;
    background-color: #fff;
    position: fixed;
    top: 0;
    z-index: 50;
    .tabs {
      width: 1200px;
      margin: 0 auto;
      height: 72px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      padding: 28px 30px;
      border-radius: 0px 0px 8px 8px;
      .item-tab {
        width: 64px;
        height: 16px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
        margin-right: 80px;
        cursor: pointer;
        position: relative;
        &.active {
          font-weight: 600;
          color: #3ca7fa;
        }
        .actline {
          width: 52px;
          height: 4px;
          background: #3ca7fa;
          position: absolute;
          left: 6px;
          top: 40px;
        }
      }
    }
  }
  .box {
    width: 1200px;
    margin: 0 auto;
    .nav {
      width: 100%;
      height: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      color: #999999;
      line-height: 14px;
      margin-top: 30px;
      margin-bottom: 30px;
      a {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        margin-right: 6px;
        &:not(:first-of-type) {
          margin-left: 6px;
        }
      }
      span {
        height: 14px;
        margin-left: 6px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }
    }
    .book-info {
      width: 1200px;
      height: 300px;
      background: #ffffff;
      border-radius: 8px;
      .book-info-box {
        width: 1200px;
        height: 300px;
        box-sizing: border-box;
        padding: 30px 50px 30px 30px;
        position: relative;
        display: flex;
        flex-direction: row;
        .book-thumb {
          width: 320px;
          height: 240px;
          border-radius: 8px;
          margin-right: 50px;
          position: relative;
          overflow: hidden;
          .status {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: rgba(60, 167, 250);
            color: #fff;
            font-size: 14px;
            padding: 4px;
            border-radius: 4px;
          }
        }
        .info {
          width: 750px;
          height: 240px;
          position: relative;
          .book-info-title {
            width: 710px;
            height: 30px;
            font-size: 24px;
            font-weight: 500;
            color: #333333;
            line-height: 24px;
            margin-top: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .ms-button {
            margin-top: 24px;
            width: 770px;
            height: 80px;
            background: linear-gradient(90deg, #fa1b1b 0%, #ff7946 100%);
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 15px 50px;
            position: relative;
            .original_charge {
              width: 100%;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #ffffff;
              line-height: 14px;
              text-decoration: line-through;
              margin-bottom: 6px;
            }
            .end {
              font-size: 16px;
              width: 100%;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
            }
            .charge {
              width: 100%;
              display: flex;
              flex-direction: row;
              align-items: baseline;
              span {
                font-size: 24px;
                font-weight: 600;
                color: #ffffff;
                line-height: 30px;
                &.ms-text {
                  font-size: 14px;
                  line-height: 14px;
                }
                &.charge-text {
                  font-size: 24px;
                  .unit {
                    font-size: 14px;
                    line-height: 14px;
                  }
                }
              }
            }
            .price {
              position: absolute;
              height: 16px;
              font-size: 16px;
              display: flex;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              flex-direction: row;
              align-items: center;
              top: 31px;
              right: 50px;
              .line {
                width: 1px;
                height: 16px;
                background: #ffffff;
                margin-left: 30px;
                margin-right: 30px;
              }
            }
          }
          .collect-button {
            width: 29px;
            height: 29px;
            position: absolute;
            right: 0;
            top: 15px;
            cursor: pointer;
          }
          .desc {
            margin-top: 20px;
            width: 750px;
            height: 164px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            overflow: hidden;
          }
          .btn-box {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: auto;
            float: left;
            display: flex;
            flex-direction: row;
            .see-button {
              background: #3ca7fa;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              box-sizing: border-box;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
            .isOver {
              background: #999999;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              box-sizing: border-box;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
            .buy-button {
              background: #ff5068;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              box-sizing: border-box;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
            .unpaid {
              background: #ff5068;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              box-sizing: border-box;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
      }
      .tabs {
        width: 1200px;
        height: 72px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        padding: 28px 30px;
        .item-tab {
          width: 64px;
          height: 16px;
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          margin-right: 70px;
          text-align: center;
          cursor: pointer;
          position: relative;
          &.active {
            font-weight: 600;
            color: #3ca7fa;
          }
          .actline {
            width: 52px;
            height: 4px;
            background: #3ca7fa;
            position: absolute;
            left: 6px;
            top: 40px;
          }
        }
      }
    }
    .book-desc {
      padding: 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 400;
      color: #121212;
      line-height: 28px;
    }
    .book-chapter-box {
      width: 1200px;
      padding: 50px 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      .steps-box {
        width: 100%;
        height: auto;
        .step-item {
          width: 100%;
          height: auto;
          &:not(:last-child) {
            margin-bottom: 50px;
          }
          .step-title {
            width: 100%;
            height: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 16px;
            margin-bottom: 30px;
          }
          .courses-box {
            width: 100%;
            height: auto;
            .course-item {
              width: 100%;
              height: 100px;
              display: flex;
              flex-direction: row;
              align-items: center;
              position: relative;
              cursor: pointer;
              &:not(:last-child) {
                margin-bottom: 30px;
              }
              .course-thumb {
                width: 133px;
                height: 100px;
                border-radius: 4px;
                margin-right: 30px;
                display: flex;
                justify-content: center;
                img {
                  width: 133px;
                  height: 100px;
                  border-radius: 4px;
                  &.active {
                    width: 75px;
                  }
                }
              }
              .course-body {
                height: 100px;
                display: flex;
                flex-direction: column;
                .course-type {
                  width: 56px;
                  height: 22px;
                  background: #04c877;
                  border-radius: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: 400;
                  color: #ffffff;
                  margin-bottom: 20px;
                }
                .course-name {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 600;
                  color: #333333;
                  line-height: 14px;
                  margin-bottom: 20px;
                }
                .course-charge {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 500;
                  color: #ff5068;
                  line-height: 14px;
                }
                .course-free {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 500;
                  color: #04c877;
                  line-height: 14px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
