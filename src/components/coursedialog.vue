<template>
  <div class="mask" v-show="status">
    <div class="dialog-box">
      <div class="dialog-title">{{ configText }}</div>
      <div class="info">请订阅后观看哦</div>
      <div class="btn-box">
        <div class="btn-cancel" @click="cancel()">取消</div>
        <div
          class="btn-video"
          v-if="videoCharge > 0 && is_ban_sell !== 1"
          @click="payVideo()"
        >
          订阅此视频￥{{ videoCharge }}
        </div>
        <div class="btn-vip" v-if="vipFree === 1" @click="payVip()">
          会员免费看
        </div>
        <div class="btn-course" v-if="courseCharge > 0" @click="payCourse()">
          订阅此课程￥{{ courseCharge }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    "courseCharge",
    "videoCharge",
    "vipFree",
    "configText",
    "status",
    "is_ban_sell",
  ],
  data() {
    return {};
  },
  methods: {
    payCourse() {
      this.$emit("payOrder", 1);
    },
    payVip() {
      this.$emit("payOrder", 2);
    },
    payVideo() {
      this.$emit("payOrder", 3);
    },
    cancel() {
      this.$emit("hideDialog");
    },
  },
};
</script>
<style lang="less" scoped>
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
  .dialog-box {
    width: 600px;
    height: 252px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    .dialog-title {
      width: 100%;
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
      margin-top: 50px;
      margin-bottom: 50px;
      text-align: center;
    }
    .info {
      width: 100%;
      height: 18px;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      text-align: center;
      margin-bottom: 50px;
    }

    .btn-box {
      width: 100%;
      height: 70px;
      display: flex;
      flex-direction: row;
      box-shadow: 0px -2px 4px 0px rgba(102, 102, 102, 0.05);
      box-sizing: border-box;
      padding: 7px 15px;
      justify-content: center;
      .btn-cancel {
        width: 88px;
        height: 56px;
        border-radius: 4px;
        border: 1px solid #e5e5e5;
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        &:hover {
          opacity: 0.8;
        }
      }
      .btn-video {
        padding: 20px;
        border-radius: 4px;
        border: 1px solid #ff5068;
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        font-weight: 400;
        color: #ff5068;
        line-height: 16px;
        &:hover {
          opacity: 0.8;
        }
      }
      .btn-vip {
        padding: 20px 24px;
        border-radius: 4px;
        background: #e1a500;
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        font-weight: 400;
        color: #fff;
        line-height: 16px;
        &:hover {
          opacity: 0.8;
        }
      }
      .btn-course {
        padding: 20px;
        border-radius: 4px;
        background: #ff5068;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        font-weight: 400;
        color: #fff;
        line-height: 16px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>