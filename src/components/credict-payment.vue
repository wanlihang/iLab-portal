<template>
  <div class="mask" v-if="status">
    <div class="dialog-box" v-if="newAdd">
      <div class="tabs new">
        <div class="item-tab">
          收货人姓名
        </div>
        <img
          class="btn-close"
          @click="close()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="form">
        <div class="input">
          <input
            type="text"
            class="input-item"
            v-model="form.nick_name"
            placeholder="请填写收货人姓名"
          />
        </div>
        <div class="label">收货人手机号</div>
        <div class="input">
          <input
            type="number"
            class="input-item"
            v-model="form.mobile"
            placeholder="请填写收货人手机号码"
          />
        </div>
        <div class="label">收件地址</div>
        <div class="input">
          省市区
        </div>
        <div class="label">详细地址</div>
        <div class="input">
          <input
            type="text"
            class="input-item"
            v-model="form.address"
            placeholder="例：朝阳小区20栋2032"
          />
        </div>
      </div>
      <div class="btn-box">
        <div class="btn-confirm active" @click="save()">
          保存地址
        </div>
      </div>
    </div>
    <div class="dialog-box" v-else>
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
      <div
        class="list-box"
        :class="{
          scroll: address.length > 3,
        }"
      >
        <div
          class="item"
          v-for="item in address"
          :key="item.id"
          @click="checkHandle(item.id)"
        >
          <div class="checkbox-dot" v-if="item.id === checked">
            <span></span>
          </div>
          <div class="checkbox-circle" v-else></div>
          <div class="body">
            <div class="value">{{ item.value }}</div>
            <div class="info">
              <div class="name">{{ item.nick_name }}</div>
              <div class="mobile">{{ item.mobile }}</div>
            </div>
          </div>
        </div>
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
      newAdd: false,
      address: [
        {
          value: "安徽省合肥市包河区岸上草原24栋2303",
          nick_name: "朱迪迪",
          mobile: "19293892113",
          id: 1,
        },
        {
          value: "安徽省合肥市包河区岸上草原15栋1103",
          nick_name: "王迪",
          mobile: "13866662228",
          id: 2,
        },
        {
          value: "安徽省合肥市包河区岸上草原15栋1103",
          nick_name: "王迪",
          mobile: "13866662228",
          id: 3,
        },
      ],
      form: {
        nick_name: null,
        mobile: null,
        province: null,
        city: null,
        area: null,
        address: null,
      },
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
    checkHandle(id) {
      this.resetDialog();
      this.checked = id;
    },
    newAddress() {
      this.newAdd = true;
    },
    close() {
      this.newAdd = false;
    },
    save() {
      console.log(this.form);
      this.newAdd = false;
    },
    confirm() {
      if (!this.checked) {
        return;
      }
      this.$emit("confirm", this.checked);
      this.resetDialog();
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
    min-height: 266px;
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
      &.new {
        margin-bottom: 17px;
      }
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
    .form {
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .label {
        width: 100%;
        height: 18px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 18px;
        margin-bottom: 20px;
      }
      .input {
        width: 100%;
        height: 54px;
        display: flex;
        flex-direction: row;
        margin-bottom: 30px;
        align-items: center;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        .input-item {
          width: 100%;
          height: 54px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          outline: none;
          padding-left: 15px;
        }
      }
    }
    .list-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      max-height: 298px;
      overflow: hidden;
      margin-bottom: 50px;
      &.scroll {
        overflow-y: auto;
      }
      .item {
        width: 100%;
        height: auto;
        float: left;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        margin-bottom: 50px;
        &:last-child {
          margin-bottom: 0px;
        }
        .checkbox-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid #666666;
        }
        .checkbox-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid #666666;
          box-sizing: border-box;
          padding: 4px;
          span {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #3ca7fa;
          }
        }
        .body {
          margin-left: 30px;
          width: 480px;
          height: auto;
          display: flex;
          flex-direction: column;
          .value {
            width: 100%;
            font-size: 18px;
            font-weight: 600;
            color: #333333;
            line-height: 18px;
            margin-bottom: 30px;
          }
          .info {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: row;
            .name {
              font-size: 18px;
              font-weight: 600;
              color: #333333;
              line-height: 18px;
              margin-right: 30px;
            }
            .mobile {
              font-size: 18px;
              font-weight: 600;
              color: #333333;
              line-height: 18px;
            }
          }
        }
      }
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
