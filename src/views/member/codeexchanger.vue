<template>
  <div class="content">
    <div class="mask" v-show="dialogStatus">
      <div class="dialog-box">
        <div class="dialog-title">兑换课程</div>
        <div class="info">
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
        </div>
        <div class="btn-box">
          <div class="btn-cancel" @click="cancel()">取消</div>
          <div class="btn-submit" @click="withdraw()">兑换</div>
        </div>
      </div>
    </div>
    <div class="box">
      <nav-member :cid="15"></nav-member>
      <div class="right-box">
        <div class="exchange-box">
          <div class="tit">兑换课程</div>
          <input
            class="input"
            type="text"
            placeholder="请输入兑换码"
            v-model="exchangeCode"
          />
          <button class="btn-exchange" @click="exchange()">兑换课程</button>
        </div>
        <div class="project-box">
          <div class="btn-title">兑换记录</div>
          <template v-if="list.length > 0">
            <div
              class="project-item"
              v-for="(item, index) in list"
              :key="index"
            >
              <div class="title">{{ item.goods_title }}</div>
              <div class="info">
                <span>{{ item.created_at | changeTime }}</span>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
          <div id="page" v-show="list.length > 0 && total > pagination.size">
            <page-box
              :key="pagination.page"
              :page="pagination.page"
              :totals="total"
              @current-change="changepage"
              :pageSize="pagination.size"
              :tab="false"
            ></page-box>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import NavMember from "../../components/navmember.vue";
import PageBox from "../../components/page.vue";
import None from "../../components/none.vue";

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
  },
  data() {
    return {
      dialogStatus: false,
      exchangeCode: null,
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
      },
      loading: false,
      form: {
        captcha: null,
      },
      captcha: {
        key: null,
        img: null,
      },
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    cancel() {
      this.dialogStatus = false;
    },
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
    resetData() {
      this.list = [];
      this.total = null;
      this.pagination.size = 10;
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
    },
    getData() {
      this.$api.CodeExchanger.Records(this.pagination).then((res) => {
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    withdraw() {
      if (this.loading) {
        return;
      }
      if (!this.form.captcha) {
        this.$message.error("请输入图形验证码");
        return;
      }
      this.loading = true;
      this.$api.CodeExchanger.Exchange({
        code: this.exchangeCode,
        captcha: this.form.captcha,
        captcha_key: this.captcha.key,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success("兑换成功");
          this.dialogStatus = false;
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    exchange() {
      this.getCaptcha();
      if (!this.exchangeCode) {
        this.$message.error("请输入兑换码");
        return;
      }
      this.dialogStatus = true;
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
    .dialog-box {
      width: 400px;
      height: 260px;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 30px;
      .dialog-title {
        width: 100%;
        height: 16px;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        line-height: 16px;
        margin-bottom: 30px;
        text-align: center;
      }
      .info {
        width: 100%;

        .tit {
          width: 100%;
          height: 14px;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          line-height: 14px;
          margin-bottom: 10px;
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
            background: #f4fafe;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
            padding-left: 20px;
            outline: none;
          }
          .input-short {
            width: 310px;
            height: 54px;
            background: #f4fafe;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
            padding-left: 20px;
            margin-right: 20px;
            outline: none;
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
        }
      }
      .btn-box {
        width: 100%;
        height: 70px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 15px;
        .btn-cancel {
          width: 88px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid #e5e5e5;
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
        .btn-submit {
          width: 88px;
          height: 40px;
          border-radius: 4px;
          background-color: #3ca7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          font-weight: 400;
          color: #fff;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    .right-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      box-sizing: border-box;
      .exchange-box {
        width: 999px;
        height: 100px;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 30px;
        .tit {
          height: 14px;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          line-height: 14px;
          margin-right: 30px;
        }
        .input {
          width: 300px;
          height: 40px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          outline: none;
          padding-left: 15px;
          margin-right: 30px;
        }
        .btn-exchange {
          width: 104px;
          height: 40px;
          background: #e1a500;
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

      .project-box {
        display: flex;
        flex-direction: column;
        width: 999px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;
        .btn-title {
          width: 80px;
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
          margin-bottom: 34px;
        }
        .project-item {
          width: 100%;
          height: 14px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          &:last-child {
            margin-bottom: 0px;
          }
          .title {
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            line-height: 14px;
          }
          .info {
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 14px;
            .item {
              height: 14px;
              margin-left: 10px;
              margin-right: 10px;
            }
          }
        }
        #page {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
