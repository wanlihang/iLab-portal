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
      <div class="user-box">
        <div class="user" v-if="user">
          <div class="avatar">
            <img :src="user.avatar" />
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.nick_name }}</div>
            <div class="share-box">
              <input class="input" v-model="inviteUrl" />
              <div class="btn-copy" @click="copy()">复制邀请链接</div>
            </div>
          </div>
        </div>
        <div class="item-box">
          <div class="value">{{ invite.count }}</div>
          <div class="tit">邀请人数</div>
        </div>
        <div class="item-box">
          <div class="value">
            <span>{{ invite.balance }}</span>
          </div>
          <div class="tit">邀请余额</div>
        </div>
        <div class="withdraw-button" @click="showWithdrawDialog()">提现</div>
      </div>
      <div class="bottom-box">
        <div class="project-box">
          <div class="btns">
            <div
              class="btn-title"
              :class="{ active: projectType === 1 }"
              @click="setPoject(1)"
            >
              分销课程
              <div class="baseline" v-if="projectType === 1"></div>
            </div>
            <div
              class="btn-title"
              :class="{ active: projectType === 2 }"
              @click="setPoject(2)"
            >
              资金明细
              <div class="baseline" v-if="projectType === 2"></div>
            </div>
          </div>
          <template v-if="projectType === 1 && course.length > 0">
            <div
              class="goods-box"
              :class="{
                first: pagination2.size <= total2,
              }"
            >
              <div class="goods-item" v-for="item in course" :key="item.id">
                <div class="goods-thumb">
                  <img :src="item.goods_thumb" />
                </div>

                <div class="goods-info">
                  <div class="goods-title">{{ item.goods_title }}</div>
                  <div class="goods-charge">
                    <div class="reward">成功邀请得{{ item.reward }}元</div>
                    <div class="poster-button" @click="goPoster(item)">
                      复制链接
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="projectType === 2 && list.length > 0">
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
          <none v-else type="white"></none>
          <div id="page" v-show="projectType === 1 && course.length > 0">
            <page-box
              :key="pagination2.page"
              :page="pagination2.page"
              :totals="total2"
              @current-change="changepage2"
              :pageSize="pagination2.size"
              :tab="false"
            ></page-box>
          </div>
          <div id="page" v-show="projectType === 2 && list.length > 0">
            <page-box
              :key="pagination.page"
              :page="pagination.page"
              :totals="total"
              @current-change="changepage"
              :pageSize="pagination.page_size"
              :tab="false"
            ></page-box>
          </div>
        </div>
        <div class="info-box">
          <div class="tit">分销课程说明</div>
          <div class="line"></div>
          <div class="desc" v-if="rules" v-html="rules"></div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import PageBox from "../../components/page.vue";
import None from "../../components/none.vue";

export default {
  components: {
    NavFooter,
    PageBox,
    None,
  },
  data() {
    return {
      noPromoCode: false,
      dialogStatus: false,
      list: [],
      course: [],
      invite: {
        count: 0,
        balance: 0,
      },
      total: null,
      total2: null,
      pagination: {
        page: 1,
        page_size: 10,
      },
      pagination2: {
        page: 1,
        size: 9,
      },
      withdrawForm: {
        channel: "Alipay",
        channel_name: null,
        channel_account: null,
        total: null,
      },
      projectType: 1,
      inviteUrl: null,
      loading: false,
      rules: null,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    initData() {
      this.getInviteInfo();
      this.getData();
      this.getGoods();
      this.getShareConfig();
    },
    showWithdrawDialog() {
      if (this.invite.balance === 0) {
        this.$message.error("余额为0时不可提现");
        return;
      }
      this.dialogStatus = true;
    },
    cancel() {
      this.resetDialog();
      this.dialogStatus = false;
    },
    resetData() {
      this.list = [];
      this.course = [];
      this.total = null;
      this.total2 = null;
      this.pagination.page_size = 10;
      this.pagination.page = 1;
      this.pagination2.size = 9;
      this.pagination2.page = 1;
    },
    changepage(item) {
      this.pagination.page_size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
      window.scrollTo(0, 0);
    },
    changepage2(item) {
      this.pagination2.size = item.pageSize;
      this.pagination2.page = item.currentPage;
      this.getGoods();
    },
    getData() {
      this.$api.Member.InviteBalanceRecords(this.pagination).then((res) => {
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    getGoods() {
      this.$api.MultiLevelShare.Goods(this.pagination2).then((res) => {
        this.course = res.data.data.data;
        this.total2 = res.data.data.total;
      });
    },
    getShareConfig() {
      this.$api.MultiLevelShare.Config().then((res) => {
        this.rules = res.data.rules;
      });
    },
    getInviteInfo() {
      this.$api.MultiLevelShare.User()
        .then((res) => {
          this.invite.count = res.data.invite_count;
          this.invite.balance = res.data.invite_balance;
          this.inviteUrl = this.$utils.getShareHost() + "?msv=" + this.user.id;
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    setPoject(val) {
      this.projectType = val;
    },
    copy() {
      var input = document.createElement("input");
      input.value = this.inviteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
      this.$message.success("复制成功");
    },
    goPoster(goods) {
      let shareLink;
      if (goods.goods_type === "practice") {
        shareLink =
          this.$utils.getShareHost() +
          "exam/practice/detail?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      } else if (goods.goods_type === "paper") {
        shareLink =
          this.$utils.getShareHost() +
          "exam/papers/detail?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      } else if (goods.goods_type === "topic") {
        shareLink =
          this.$utils.getShareHost() +
          "topic/detail?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      } else if (goods.goods_type === "learnPath") {
        shareLink =
          this.$utils.getShareHost() +
          "learnPath/detail?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      } else if (goods.goods_type === "book") {
        shareLink =
          this.$utils.getShareHost() +
          "book/detail?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      } else if (goods.goods_type === "live") {
        shareLink =
          this.$utils.getShareHost() +
          "live/detail?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      } else if (goods.goods_type === "video") {
        shareLink =
          this.$utils.getShareHost() +
          "courses/video?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      } else if (goods.goods_type === "vip") {
        shareLink = this.$utils.getShareHost() + "vip" + "?msv=" + this.user.id;
      } else if (goods.goods_type === "ms") {
        shareLink =
          this.$utils.getShareHost() +
          "ms/detail?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      } else if (goods.goods_type === "tg") {
        shareLink =
          this.$utils.getShareHost() +
          "tg/detail?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      } else {
        shareLink =
          this.$utils.getShareHost() +
          "courses/detail?id=" +
          goods.goods_id +
          "&msv=" +
          this.user.id;
      }

      var input = document.createElement("input");
      input.value = shareLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
      this.$message.success("复制成功");
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
      if (this.withdrawForm.total > this.invite.balance) {
        this.$message.error("提现金额不得大于余额");
        return;
      }
      this.loading = true;
      this.$api.Member.Withdraw(this.withdrawForm)
        .then((res) => {
          this.loading = false;
          this.$message.success("提现成功");
          this.getInviteInfo();
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
    flex-direction: column;
    margin-top: 30px;
    .user-box {
      width: 100%;
      height: 180px;
      background: linear-gradient(270deg, #3ca7fa 0%, #1483e6 100%);
      border-radius: 8px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      padding: 47px 50px;
      margin-bottom: 30px;
      .user {
        width: 460px;
        height: 86px;
        display: flex;
        flex-direction: row;
        .avatar {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 30px;
          img {
            width: 86px;
            height: 86px;
            border-radius: 50%;
          }
        }
        .user-info {
          width: 344px;
          height: 86px;
          display: flex;
          flex-direction: column;
          .user-name {
            margin-top: 5px;
            width: 100%;
            height: 16px;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            line-height: 16px;
            margin-bottom: 26px;
          }
          .share-box {
            width: 344px;
            height: 34px;
            display: flex;
            flex-direction: row;
            .input {
              width: 240px;
              height: 34px;
              border-radius: 4px 0px 0px 4px;
              border: 1px solid #ffffff;
              background: linear-gradient(270deg, #3ca7fa 0%, #1483e6 80%);
              outline: none;
              padding-left: 15px;
              font-size: 14px;
              font-weight: 400;
              color: #ffffff;
            }
            .btn-copy {
              width: 104px;
              height: 34px;
              background: #ffffff;
              border-radius: 0px 4px 4px 0px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              font-size: 14px;
              font-weight: 400;
              color: #3ca7fa;
              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
      }
      .item-box {
        height: 86px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .value {
          margin-top: 5px;
          height: 32px;
          font-size: 32px;
          font-weight: 600;
          color: #ffffff;
          line-height: 32px;
          margin-bottom: 30px;
          display: flex;
          justify-content: center;
        }
        .tit {
          width: 56px;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          line-height: 14px;
        }
      }
      .withdraw-button {
        width: 104px;
        height: 48px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        margin-top: 19px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    .bottom-box {
      width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      display: inline-block;
      float: left;
      .info-box {
        width: 400px;
        height: auto;
        float: left;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        margin-left: 30px;
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
          margin-bottom: 15px;
        }
        .line {
          width: 100%;
          height: 1px;
          background: #e5e5e5;
          margin-bottom: 30px;
        }
        .desc {
          width: 100%;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 30px;
          p {
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 30px;
          }
        }
      }

      .project-box {
        width: 770px;
        float: left;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 15px 30px 30px 30px;
        .btns {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 33px;
          .btn-title {
            width: 56px;
            height: 33px;
            cursor: pointer;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            margin-right: 50px;
            &:last-child {
              margin-right: 0px;
            }
            &.active {
              color: #3ca7fa;
              font-weight: 600;
              .baseline {
                width: 56px;
                height: 4px;
                background: #3ca7fa;
              }
            }
            &:hover {
              color: #3ca7fa;
            }
          }
        }
        .goods-box {
          width: 100%;
          display: grid;
          margin-top: 30px;
          margin-bottom: 30px;
          gap: 30px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          &.first {
            margin-bottom: 0px;
          }
          .goods-item {
            width: 216px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            &:hover {
              box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
              .goods-thumb {
                img {
                  transform: scale(1.1, 1.1);
                }
              }
            }
            .goods-thumb {
              width: 216px;
              height: 162px;
              background: #f4fafe;
              border-radius: 8px 8px 0px 0px;
              overflow: hidden;
              display: flex;
              justify-content: center;
              img {
                height: 162px;
                transition: all 0.5s;
              }
            }
            .goods-info {
              width: 216px;
              height: 86px;
              background: #ffffff;
              border-radius: 0px 0px 8px 8px;
              border: 1px solid #e5e5e5;
              box-sizing: border-box;
              padding: 15px 10px;
              .goods-title {
                width: 100%;
                height: 16px;
                font-size: 16px;
                font-weight: 600;
                color: #333333;
                line-height: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 10px;
              }
              .goods-charge {
                width: 100%;
                height: 30px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .reward {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #ff5068;
                  line-height: 14px;
                }
                .poster-button {
                  width: 72px;
                  height: 30px;
                  background: #ff5068;
                  border-radius: 4px;
                  cursor: pointer;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 14px;
                  font-weight: 400;
                  color: #ffffff;
                  &:hover {
                    opacity: 0.8;
                  }
                }
              }
            }
          }
        }
        .project-item {
          width: 100%;
          height: 14px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          margin-top: 20px;

          .title {
            width: 300px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 14px;
          }
          .price {
            height: 14px;
            font-size: 14px;
            font-weight: 400;
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
