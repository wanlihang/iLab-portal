<template>
  <div class="content">
    <div class="mask" v-show="dialogStatus">
      <div class="dialog-box">
        <div class="dialog-title">提现</div>
        <div class="info">
          <div class="tit">支付宝账户</div>
          <input
            class="input"
            type="text"
            placeholder="支付宝账户"
            v-model="withdrawForm.channel_account"
          />
          <div class="tit">真实姓名</div>
          <input
            class="input"
            type="text"
            placeholder="真实姓名"
            v-model="withdrawForm.channel_name"
          />
          <div class="tit">提现金额</div>
          <input
            class="input"
            type="text"
            placeholder="提现金额"
            v-model="withdrawForm.total"
          />
        </div>
        <div class="btn-box">
          <div class="btn-cancel" @click="cancel()">取消</div>
          <div class="btn-submit" @click="withdraw()">申请提现</div>
        </div>
      </div>
    </div>
    <div class="box">
      <nav-member :cid="14"></nav-member>
      <div class="right-box">
        <div class="user-box" v-if="user">
          <div class="item-box">
            <div class="tit">我的邀请码</div>
            <div class="value" v-if="invite.code">{{ invite.code }}</div>
            <div class="tip" v-else>邀请码不对当前用户开放</div>
          </div>
          <div class="item-box">
            <div class="tit">奖励余额</div>
            <div class="value">
              <span>{{ user.invite_balance }}元</span>
              <div
                v-if="user.invite_balance !== 0"
                class="withdraw-button"
                @click="showWithdrawDialog()"
              >
                提现
              </div>
            </div>
          </div>
          <div class="item-box">
            <div class="tit">已成功邀请</div>
            <div class="value">{{ user.invite_people_count }}人</div>
          </div>
        </div>
        <div class="info-box" v-if="!noPromoCode">
          <div class="tit">使用说明</div>
          <p>1.使用该邀请码下单的用户立减2元折扣</p>
          <p>2.同时用户使用您的邀请码支付完成后，您也将获得1元奖励</p>
          <p>
            3.使用您的邀请码支付完成后将自动成为您的下级，TA的每一笔已支付订单您都将享有30%的分成
          </p>
        </div>
        <div class="project-box">
          <div class="btn-title">资金明细</div>
          <template v-if="list.length > 0">
            <div
              class="project-item"
              v-for="(item, index) in list"
              :key="index"
            >
              <div class="title">{{ item.desc }}</div>
              <div class="price">{{ item.total }}元</div>
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
      noPromoCode: false,
      dialogStatus: false,
      list: [],
      invite: {
        code: null,
      },
      total: null,
      pagination: {
        page: 1,
        size: 10,
      },
      withdrawForm: {
        channel: "Alipay",
        channel_name: null,
        channel_account: null,
        total: null,
      },
      loading: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.initData();
    this.getData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType", "loginHandle"]),
    initData() {
      this.getPromoCode();
    },
    showWithdrawDialog() {
      this.dialogStatus = true;
    },
    cancel() {
      this.resetDialog();
      this.dialogStatus = false;
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
      this.$api.Member.InviteBalanceRecords(this.pagination).then((res) => {
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    getInviteInfo() {
      this.$api.User.Detail().then((res) => {
        this.loginHandle(res.data);
      });
    },
    getPromoCode() {
      this.$api.Member.PromoCode().then((res) => {
        let code = res.data.code;
        if (!code) {
          this.createPromoCode();
        } else {
          this.invite.code = res.data.code;
        }
      });
    },
    createPromoCode() {
      this.$api.Member.PromoCodeCreate()
        .then((res) => {
          this.getPromoCode();
        })
        .catch((e) => {
          this.noPromoCode = true;
        });
    },
    resetDialog() {
      this.withdrawForm.channel_account = null;
      this.withdrawForm.channel_name = null;
      this.withdrawForm.total = null;
    },
    withdraw() {
      if (this.loading) {
        return;
      }
      if (!this.withdrawForm.channel_account) {
        this.$message.error("请输入支付宝账户");
        return;
      }
      if (!this.withdrawForm.channel_name) {
        this.$message.error("请输入真实姓名");
        return;
      }
      if (!this.withdrawForm.total) {
        this.$message.error("请输入提现金额");
        return;
      }
      if (this.withdrawForm.total > this.user.invite_balance) {
        this.$message.error("提现金额不得大于余额");
        return;
      }
      this.loading = true;
      this.$api.Member.Withdraw(this.withdrawForm)
        .then((res) => {
          this.loading = false;
          this.$message.success("提现成功");
          this.getInviteInfo();
          this.getData();
          this.cancel();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
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
    .dialog-box {
      width: 400px;
      height: 360px;
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
        margin-bottom: 10px;
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
        .input {
          width: 100%;
          height: 40px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          outline: none;
          padding-left: 15px;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
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
      .user-box {
        width: 999px;
        height: 120px;
        box-sizing: border-box;
        display: grid;
        grid-column-gap: 10px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin-bottom: 10px;
        .item-box {
          width: 326px;
          height: 120px;
          background: #ffffff;
          border-radius: 8px;
          box-sizing: border-box;
          padding: 30px;
          position: relative;
          .tip {
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 14px;
          }
          .tit {
            width: 100%;
            height: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 16px;
            margin-bottom: 30px;
          }
          .value {
            width: 100%;
            height: 14px;
            display: flex;
            flex-direction: row;
            align-items: center;
            span {
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 14px;
            }
            .withdraw-button {
              width: 28px;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #3ca7fa;
              line-height: 14px;
              margin-left: 30px;
              cursor: pointer;
            }
          }
        }
      }
      .info-box {
        width: 999px;
        height: 176px;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        padding: 30px;
        .tit {
          width: 100%;
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
          margin-bottom: 30px;
        }
        p {
          width: 100%;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
          margin-bottom: 14px;
        }
      }

      .project-box {
        display: flex;
        width: 999px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        flex-direction: column;
        padding: 30px;
        .btn-title {
          width: 80px;
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
          margin-bottom: 10px;
        }
        .project-item {
          width: 100%;
          height: 14px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          &:first-child {
            margin-top: 0px;
          }
          .title {
            width: 60%;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 14px;
          }
          .price {
            width: 20%;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 14px;
          }
          .info {
            width: 20%;
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
