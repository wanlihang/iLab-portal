<template>
  <div class="mask" v-if="status">
    <div class="dialog-box">
      <div class="tabs">
        <div class="item-tab">
          请选择收件地址（选择地址后不支持修改）
        </div>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="list-box">
        <div class="item"></div>
      </div>
      <div class="btn-box">
        <div class="btn-new" @click="newAddress()">
          新建收货地址
        </div>
        <div
          class="btn-confirm"
          :class="{ active: checked }"
          @click="confirm()"
        >
          确认下单（将直接扣除积分）
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["status"],
  data() {
    return {
      checked: null,
    };
  },
  methods: {
    resetDialog() {
      this.checked = null;
    },
    cancel() {
      this.resetDialog();
      this.$emit("hide");
    },
    confirm() {
      this.resetDialog();
      this.$emit("confirm", this.checked);
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
    max-height: 266px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 30px;
    animation: scaleBig 0.3s;
    .tabs {
      width: 100%;
      height: 24px;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      position: relative;
      margin-bottom: 44px;
      .item-tab {
        width: auto;
        height: 18px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 18px;
        position: relative;
      }
      .btn-close {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 3px;
        top: 2px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
          animation: rotate360 1s;
        }
      }
    }
    .list-box {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    .btn-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      .btn-new {
        width: 100%;
        height: 54px;
        border-radius: 4px;
        border: 1px solid #3ca7fa;
        font-size: 18px;
        font-weight: 400;
        color: #3ca7fa;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
        &:hover {
          opacity: 0.8;
        }
      }
      .btn-confirm {
        width: 100%;
        height: 54px;
        border-radius: 4px;
        background: #cccccc;
        font-size: 18px;
        font-weight: 400;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          opacity: 0.8;
        }
        &.active {
          background: #3ca7fa;
        }
      }
    }
  }
}
</style>
