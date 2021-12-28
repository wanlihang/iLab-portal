<template>
  <div class="mask" v-if="status">
    <div class="dialog-login-box">
      <div class="tabs">
        <div class="item-tab active">收货人姓名</div>
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
            placeholder="请填写收货人姓名"
            autocomplete="off"
            v-model="form.name"
            class="input"
            required=""
          />
        </div>
        <div class="label">收货人手机号</div>
        <div class="input-item">
          <input
            type="number"
            placeholder="请填写收货人手机号码"
            autocomplete="off"
            v-model="form.mobile"
            class="input"
            required=""
          />
        </div>
        <div class="label">收件地址</div>
        <div class="input-item">
          <select
            class="input-short"
            v-model="form.province"
            @change="changeCity"
          >
            <option
              v-for="(val, index) in provinceData"
              :key="index"
              :value="val.label"
            >
              {{ val.label }}
            </option>
          </select>
          <select
            class="input-short"
            v-model="form.city"
            @change="changeCounty"
          >
            <option
              v-for="(name, index) in cityData"
              :key="index"
              :value="name.label"
            >
              {{ name.label }}
            </option>
          </select>
          <select class="input-short" v-model="form.area">
            <option
              v-for="(area, index) in areaData"
              :key="index"
              :value="area.label"
            >
              {{ area.label }}
            </option>
          </select>
        </div>
        <div class="label">详细地址</div>
        <div class="input-item">
          <input
            type="text"
            placeholder="例：阳光小区20栋2020"
            autocomplete="off"
            v-model="form.street"
            class="input"
            required
            @keyup.enter="submitValidate"
          />
        </div>
        <div class="btn-box" style="margin-bottom: 0px !important">
          <button type="submit" class="submit" @click="submitValidate">
            保存地址
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import CityData from "@/js/address";
export default {
  props: ["status"],
  data() {
    return {
      loading: false,
      form: {
        street: "",
        name: "",
        mobile: "",
        area: "",
        city: "",
        province: "",
      },
      cityData: [],
      areaData: [],
    };
  },
  computed: {
    ...mapState(["addressForm"]),
    provinceData() {
      return CityData.data;
    },
  },
  watch: {
    status() {
      this.initData();
    },
    "form.province"() {
      this.changeCity();
    },
    "form.city"() {
      this.changeCounty();
    },
  },
  mounted() {},
  methods: {
    ...mapMutations(["setNewAddress"]),
    changeCity() {
      for (var item in this.provinceData) {
        if (this.provinceData[item].label == this.form.province) {
          this.cityData = this.provinceData[item].children;
        }
      }
    },
    changeCounty() {
      for (var item in this.cityData) {
        if (this.cityData[item].label == this.form.city) {
          this.areaData = this.cityData[item].children;
        }
      }
    },
    initData() {
      if (
        this.addressForm &&
        this.addressForm.name &&
        this.addressForm.mobile &&
        this.addressForm.province &&
        this.addressForm.city &&
        this.addressForm.area &&
        this.addressForm.street
      ) {
        this.form.name = this.addressForm.name;
        this.form.mobile = this.addressForm.mobile;
        this.form.province = this.addressForm.province;
        this.form.city = this.addressForm.city;
        this.form.area = this.addressForm.area;
        this.form.street = this.addressForm.street;
      }
    },
    submitValidate() {
      if (!this.form.name) {
        this.$message.error("请填写收货人姓名");
        return;
      }
      if (!this.form.mobile) {
        this.$message.error("请填写收货人手机号码");
        return;
      }
      if (!this.form.province) {
        this.$message.error("请选择省");
        return;
      }
      if (!this.form.city) {
        this.$message.error("请选择市");
        return;
      }
      if (!this.form.area) {
        this.$message.error("请选择区");
        return;
      }
      if (!this.form.street) {
        this.$message.error("请填写详细地址");
        return;
      }
      this.setNewAddress(this.form);
      this.$message.success("保存成功");
      setTimeout(() => {
        this.$emit("hideDialog");
      }, 500);
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
  .dialog-login-box {
    width: 600px;
    max-height: 620px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 30px;
    animation: scaleBig 0.3s;
    .tabs {
      width: 100%;
      height: 38px;
      display: flex;
      flex-direction: row;
      position: relative;
      overflow: hidden;
      .btn-close {
        width: 19px;
        height: 19px;
        position: absolute;
        right: 3px;
        top: 2px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
          animation: rotate360 1s;
        }
      }
      .item-tab {
        width: auto;
        height: 18px;
        font-size: 18px;
        font-weight: 500;
        color: #666666;
        line-height: 18px;
        cursor: pointer;
        position: relative;
        &.active {
          color: #333333;
        }
      }
    }
    .box {
      width: 100%;
      display: flex;
      flex-direction: column;
      .label {
        width: 100%;
        height: 18px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 18px;
        margin-bottom: 20px;
      }
      .input-item {
        width: 100%;
        margin-bottom: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .input {
          width: 100%;
          height: 54px;
          background: #fff;
          border-radius: 4px;
          border: 1px solid #cccccc;
          padding-left: 20px;
          outline: none;
        }
        .input-short {
          width: 150px;
          height: 54px;
          background: #fff;
          border-radius: 4px;
          border: 1px solid #cccccc;
          padding-left: 20px;
          outline: none;
          margin-right: 20px;
        }
      }
      .btn-box {
        width: 100%;
        margin-bottom: 30px;
        .submit {
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
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
