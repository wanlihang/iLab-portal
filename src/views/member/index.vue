<template>
  <div class="content">
    <div class="mask" v-if="openmask">
      <div class="popup borderbox">
        <div class="text">是否确认解除绑定？</div>
        <div class="button">
          <div class="cancel" style="cursor: pointer" @click="cancel()">
            取消
          </div>
          <div class="confirm" style="cursor: pointer" @click="submitHandle()">
            确认
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <nav-member :cid="0" :news="newStatus"></nav-member>
      <div class="project-box">
        <template v-if="loading">
          <skeletonMember></skeletonMember>
        </template>
        <template v-else-if="list">
          <div class="user-box">
            <div class="avatar">
              <img :src="list.avatar" />
            </div>
            <div class="user-info">
              <div class="user-top">
                <div class="nickname">{{ list.nick_name }}</div>
                <div class="role" v-if="list.role_id !== 0 && list.role">
                  {{ list.role.name }}
                </div>
                <div class="normal" v-else>普通会员</div>
              </div>
              <div
                class="expiration-time"
                v-if="list.role_id !== 0 && list.role_expired_at"
              >
                会员有效期至{{ list.role_expired_at }}
              </div>
            </div>
            <div class="value-box">
              <div class="item">
                <div class="value">{{ list.credit1 }}</div>
                <div class="name">我的积分</div>
              </div>
              <div class="item">
                <div class="value">{{ list.invite_people_count }}</div>
                <div class="name">成功邀请(人)</div>
              </div>
              <div class="item">
                <div class="value">{{ list.invite_balance }}</div>
                <div class="name">邀请余额(元)</div>
              </div>
            </div>
          </div>

          <div class="user-profile">
            <div class="tit">绑定账号</div>
            <div class="bind-box">
              <img src="../../assets/img/commen/icon-mobile.png" />
              <div class="name">手机号码</div>
              <div class="value" v-if="list.is_bind_mobile === 1">
                {{ list.mobile.substr(0, 3) + "****" + list.mobile.substr(7) }}
              </div>
              <div class="start-bind" v-else @click="goBindMobile()">
                点击绑定
              </div>
              <div
                class="reset-bind"
                v-if="list.is_bind_mobile === 1"
                @click="goChangeMobile()"
              >
                重新绑定
              </div>
            </div>
            <div class="bind-box" v-if="config.socialites.qq === 1">
              <img src="../../assets/img/commen/icon-qq.png" />
              <div class="name">绑定QQ</div>
              <div class="value" v-if="list.is_bind_qq === 1">已绑定</div>
              <div
                class="start-bind"
                v-if="list.is_bind_qq === 0"
                @click="goBindQQ()"
              >
                点击绑定
              </div>
              <div
                class="reset-bind"
                v-if="list.is_bind_qq === 1"
                @click="cancelBindQQ()"
              >
                取消绑定
              </div>
            </div>
            <div class="bind-box" v-if="config.socialites.wechat_scan === 1">
              <img src="../../assets/img/commen/icon-wechat.png" />
              <div class="name">绑定微信</div>
              <div class="value" v-if="list.is_bind_wechat === 1">已绑定</div>
              <div
                class="start-bind"
                v-if="list.is_bind_wechat === 0"
                @click="goBindWeixin()"
              >
                点击绑定
              </div>
              <div
                class="reset-bind"
                v-if="list.is_bind_wechat === 1"
                @click="cancelBindWeixin()"
              >
                取消绑定
              </div>
            </div>
            <!-- <div
            class="myProfile"
            @click="$router.push({ name: 'MemberProfile' })"
          >
            查看我的资料
          </div> -->
          </div>
        </template>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import Utils from "@/js/utils";
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import NavMember from "../../components/navmember.vue";
import SkeletonMember from "../../components/skeleton/skeletonMember.vue";
export default {
  components: {
    NavFooter,
    NavMember,
    SkeletonMember,
  },
  data() {
    return {
      loading: false,
      newStatus: false,
      bindWeixin: 0,
      bindQQ: 0,
      list: [],
      openmask: false,
      app: null,
      error: this.$route.query.error,
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "sucbind", "config"]),
  },
  watch: {
    sucbind() {
      this.refresh();
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations([
      "loginHandle",
      "showLoginDialog",
      "changeDialogType",
      "saveDialogMobile",
      "removeBind",
      "setConfig",
    ]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    refresh() {
      this.getData();
      this.getConfig();
      this.removeBind();
    },
    getInviteInfo() {
      this.$api.MultiLevelShare.User().then((res) => {
        this.invite.count = res.data.invite_count;
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Member.Detail().then((res) => {
        this.loading = false;
        this.list = res.data;
        if (this.error) {
          this.$message.error(this.error);
        }
      });
    },
    getConfig() {
      this.$api.Other.Config().then((res) => {
        this.setConfig(res.data);
      });
    },
    goBindMobile() {
      this.changeDialogType(9);
      this.showLoginDialog();
    },
    goChangeMobile() {
      this.saveDialogMobile(this.list.mobile);
      this.changeDialogType(6);
      this.showLoginDialog();
    },
    goBindQQ() {
      let host = window.location.href;
      let token = Utils.getToken();
      let redirect = encodeURIComponent(host);
      window.location.href =
        this.config.url +
        "/api/v2/member/socialite/qq?token=" +
        token +
        "&redirect_url=" +
        redirect;
    },
    cancel() {
      this.app = null;
      this.openmask = false;
    },
    cancelBindQQ() {
      this.app = "qq";
      this.openmask = true;
    },
    goBindWeixin() {
      this.changeDialogType(7);
      this.showLoginDialog();
    },
    submitHandle() {
      this.$api.Member.CancelBind(this.app).then((res) => {
        this.$message.success("解绑成功");
        this.cancel();
        this.getData();
      });
    },
    cancelBindWeixin() {
      this.app = "wechat";
      this.openmask = true;
    },
  },
};
</script>
<style lang='less' scoped>
.content {
  width: 100%;
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .popup {
      width: 295px;
      height: 151px;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      .text {
        width: 100%;
        height: 104px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        border-bottom: 1px solid #f5f5f5;
      }
      .button {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        .cancel {
          width: 146px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #171923;
          border-right: 1px solid #f5f5f5;
        }
        .confirm {
          width: 147px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #3ca7fa;
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
    .project-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      .user-box {
        width: 100%;
        height: 140px;
        background: #3ca7fa;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;
        margin-bottom: 30px;
        display: flex;
        flex-direction: row;
        margin-right: 30px;
        .avatar {
          width: 80px;
          height: 80px;
          overflow: hidden;
          border-radius: 50%;
          margin-right: 20px;
          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
        }
        .user-info {
          width: 403px;
          display: flex;
          flex-direction: column;
          .user-top {
            width: 403px;
            margin-top: 8px;
            height: 28px;
            display: flex;
            flex-direction: row;
            align-items: center;
            .nickname {
              margin-right: 15px;
              height: 24px;
              font-size: 24px;
              font-weight: 600;
              color: #ffffff;
              line-height: 24px;
            }
            .normal {
              width: 72px;
              height: 28px;
              background: #ffffff;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              line-height: 14px;
              font-weight: 400;
              color: #3ca7fa;
            }
            .role {
              background: #fff566;
              border-radius: 4px;
              font-size: 14px;
              font-weight: 400;
              color: #3ca7fa;
              line-height: 14px;
              padding: 7px 8px;
            }
          }
          .expiration-time {
            width: 403px;
            margin-top: 20px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            line-height: 14px;
          }
        }
        .value-box {
          width: 406px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          box-sizing: border-box;
          padding-top: 10px;
          .item {
            display: flex;
            flex-direction: column;
            .value {
              text-align: center;
              height: 30px;
              font-size: 30px;
              font-weight: 600;
              color: #ffffff;
              line-height: 30px;
              margin-bottom: 16px;
            }
            .name {
              text-align: center;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #ffffff;
              line-height: 14px;
            }
          }
        }
      }
      .user-profile {
        width: 100%;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;
        position: relative;
        .tit {
          width: 100%;
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
          margin-bottom: 30px;
        }
        .bind-box {
          width: 100%;
          height: 40px;
          display: flex;
          flex-direction: row;
          align-items: center;
          position: relative;
          margin-bottom: 30px;
          &:last-child {
            margin-bottom: 0px;
          }
          .reset-bind {
            position: absolute;
            right: 0;
            top: 13px;
            width: 56px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            line-height: 14px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
          img {
            width: 40px;
            height: 40px;
            margin-right: 15px;
          }
          .name {
            width: 56px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 14px;
            margin-right: 64px;
          }
          .value {
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 14px;
          }
          .start-bind {
            width: 56px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #3ca7fa;
            line-height: 14px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
        .myProfile {
          position: relative;
          width: 114px;
          height: 38px;
          border-radius: 4px;
          border: 1px solid #3ca7fa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
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
}
</style>