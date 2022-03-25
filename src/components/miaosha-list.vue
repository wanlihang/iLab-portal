<template>
  <div class="ms-comp" v-if="ms.data">
    <div class="mask" v-if="status">
      <div class="dialog-login-box">
        <div class="tabs">
          <div class="item-tab active">秒杀活动</div>
          <img
            class="btn-close"
            @click="cancel()"
            src="../assets/img/commen/icon-close.png"
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
    <div class="ms-content">
      <div class="sp-mask"></div>
      <div class="sp-transform"></div>
      <div class="original_charge">原价￥{{ ms.data.original_charge }}</div>
      <div class="charge">
        <span class="ms-text">限时秒杀价:</span>
        <span class="charge-text">
          <span class="unit">￥</span>{{ ms.data.charge }}
        </span>
      </div>
      <div class="price" v-if="ms.data.is_over">
        <div class="end">已售罄</div>
      </div>
      <div class="price" v-else-if="ms.data.is_start">
        <div class="ms-time start">
          距秒杀结束剩余<count-down
            :timestamp="ms.data.expired_seconds"
          ></count-down>
        </div>
        <i class="line"></i>
        <div class="ms-time">库存剩余{{ ms.data.over_num }}件</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import CountDown from "./count-down.vue";
export default {
  components: {
    CountDown,
  },
  props: ["ms", "status"],
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  data() {
    return {
      loading: false,
      captcha: {
        key: null,
        img: null,
      },
      form: {
        captcha: null,
      },
    };
  },
  watch: {
    status() {
      this.getCaptcha();
      this.form.captcha = null;
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    goPay(id) {
      this.$router.push({
        name: "order",
        query: {
          course_id: this.ms.data.goods_id,
          course_type: this.ms.data.goods_type,
          goods_type: "ms",
          goods_charge: this.ms.data.charge,
          goods_label: "秒杀",
          goods_name: this.ms.data.goods_title,
          goods_id: id,
          goods_thumb: this.ms.data.goods_thumb,
        },
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
      this.$api.MiaoSha.Join(this.ms.data.id, {
        captcha: this.form.captcha,
        captcha_key: this.captcha.key,
      })
        .then((res) => {
          this.$message.success("抢购成功，请尽快支付");
          let orderId = res.data.id;
          this.$emit("cancel");
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
  },
};
</script>

<style lang="less" scoped>
.ms-comp {
  width: 100%;
  height: auto;
  float: left;
  background: #ffffff;
  flex-direction: row;
  box-sizing: border-box;
  padding: 0px 30px 30px 30px;
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
  .ms-content {
    width: 100%;
    height: 80px;
    background: linear-gradient(90deg, #fa1b1b 0%, #ff7946 100%);
    border-radius: 4px;
    color: #fff;
    box-sizing: border-box;
    padding: 15px 50px;
    position: relative;
    display: flex;
    flex-direction: column;
    .sp-mask {
      width: 522px;
      height: 80px;
      border-radius: 4px 0px 0px 4px;
      background: rgb(#ffffff, 0.15);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
    }
    .sp-transform {
      width: 0;
      height: 0;
      border-bottom: 80px solid #fb412c;
      border-left: 80px solid transparent;
      position: absolute;
      left: 442px;
      top: 0;
      z-index: 11;
    }
    .original_charge {
      width: auto;
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      text-decoration: line-through;
      opacity: 0.6;
    }
    .end {
      font-size: 16px;
      width: 100%;
      font-weight: 400;
      color: #ffffff;
      line-height: 16px;
    }
    .charge {
      width: auto;
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
      width: auto;
      height: 16px;
      display: flex;
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
      .ms-time {
        width: auto;
        height: 14px;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .end {
        width: auto;
        height: 14px;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
      }
    }
  }
}
</style>
