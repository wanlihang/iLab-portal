<template>
  <div id="app">
    <nav-header v-if="!this.$route.meta.hideHeader"></nav-header>
    <Login-Dialog :dialogType="loginDialogType" :status="loginDialogStatus" :mobile="dialogMobile" :notCancel="cancelStatus" @hideLoginDialog="hideLoginDialog" @changeType="changeType"></Login-Dialog>
    <keep-alive>
      <router-view v-if="config && this.$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="config && !this.$route.meta.keepAlive"></router-view>

    <back-top v-show="backTopStatus"></back-top>

  </div>
</template>
<script>
const _ = require("lodash");

import { mapState, mapMutations } from "vuex";
import NavHeader from "./components/navheader.vue";
import LoginDialog from "./components/logindialog.vue";
import BackTop from "./components/back-top.vue";

export default {
  components: {
    NavHeader,
    LoginDialog,
    BackTop
  },
  data() {
    return {
      cancelStatus: false,
      backTopStatus: false,
    };
  },
  watch: {
    "$route.query.token"(val) {
      if (val) {
        this.$utils.saveToken(val);
        this.getUser();
      }
    },
    "$route.query.msv"(val) {
      if (val) {
        this.$utils.saveMsv(val);
      }
    },
    "$route"(to,from){
      this.backTopStatus=false;
    },
  },
  computed: {
    ...mapState([
      "loginDialogStatus",
      "loginDialogType",
      "dialogMobile",
      "config",
      "isLogin",
      "configFunc",
    ]),
  },
  mounted() {
    this.MeEduInit();
    window.addEventListener("scroll", this.getHeight, true);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.getHeight, true);
  },
  methods: {
    ...mapMutations([
      "loginHandle",
      "hideLoginDialog",
      "changeDialogType",
      "setConfig",
      "showLoginDialog",
      "updateFuncConfig",
    ]),
    changeType(val) {
      this.changeDialogType(val);
    },
    getHeight() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let bodyHeight = document.body.clientHeight;
      if (scrollTop >= 2000) {
        this.backTopStatus = true;
      } else {
        this.backTopStatus = false;
      }
    },
    MeEduInit() {
      this.getConfig();
      if (this.$utils.getToken()) {
        this.getUser();
      }
    },
    async getUser() {
      try {
        let res = await this.$api.User.Detail();
        this.loginHandle(res.data);

        // 强制绑定手机号
        if (
          res.data.is_bind_mobile === 0 &&
          this.config.member.enabled_mobile_bind_alert === 1
        ) {
          this.changeDialogType(9);
          this.showLoginDialog();
          this.cancelStatus = true;
        }
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    async getConfig() {
      let res = await this.$api.Other.Config();
      let config = res.data;

      // 保存全局配置
      this.setConfig(config);

      // 插件功能开启/关闭
      let funcTable = this.configFunc;
      funcTable["live"] = _.indexOf(config.enabled_addons, "Zhibo") !== -1;
      funcTable["book"] = _.indexOf(config.enabled_addons, "MeeduBooks") !== -1;
      funcTable["topic"] =
        _.indexOf(config.enabled_addons, "MeeduTopics") !== -1;
      funcTable["paper"] = _.indexOf(config.enabled_addons, "Paper") !== -1;
      funcTable["practice"] = _.indexOf(config.enabled_addons, "Paper") !== -1;
      funcTable["mockPaper"] = _.indexOf(config.enabled_addons, "Paper") !== -1;
      funcTable["wrongBook"] = _.indexOf(config.enabled_addons, "Paper") !== -1;
      funcTable["wenda"] = _.indexOf(config.enabled_addons, "Wenda") !== -1;
      funcTable["share"] =
        _.indexOf(config.enabled_addons, "MultiLevelShare") !== -1;
      funcTable["codeExchanger"] =
        _.indexOf(config.enabled_addons, "CodeExchanger") !== -1;
      funcTable["snapshort"] =
        _.indexOf(config.enabled_addons, "Snapshot") !== -1;
      funcTable["ke"] = _.indexOf(config.enabled_addons, "XiaoBanKe") !== -1;
      funcTable["promoCode"] =
        _.indexOf(config.enabled_addons, "MultiLevelShare") === -1;

      this.updateFuncConfig(funcTable);
    },
  },
};
</script>

<style>

</style>
