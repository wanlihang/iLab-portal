import Vue from "vue";
import Vuex from "vuex";
import Utils from "@/js/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isLogin: false,
    config: null,
    loginDialogStatus: false,
    loginDialogType: 0,
    bindWeixin: 0,
    dialogMobile: null,
    freshUnread: false,
    sucbind: false,
    //收货地址信息
    addressForm: {
      name: null,
      mobile: null,
      province: null,
      city: null,
      area: null,
      street: null,
    },
    configFunc: {
      vip: true,
      live: false,
      book: false,
      topic: false,
      paper: false,
      practice: false,
      mockPaper: false,
      wrongBook: false,
      wenda: false,
      share: false,
      codeExchanger: false,
      snapshort: false,
      ke: false,
      promoCode: false,
      daySignIn: false,
      credit1Mall: false,
      tuangou: false,
      miaosha: false,
    },
  },
  mutations: {
    loginHandle(state, user) {
      state.user = user;
      state.freshUnread = true;
      state.isLogin = true;
    },
    logout(state) {
      state.user = null;
      state.isLogin = false;
      this.keywords = null;
      Utils.clearToken();
    },
    changeUserCredit(state, credit1) {
      state.user.credit1 = credit1;
    },
    saveUnread(state) {
      state.freshUnread = true;
    },
    removeUnread(state) {
      state.freshUnread = false;
    },
    setConfig(state, config) {
      state.config = config;
    },
    hideLoginDialog(state) {
      state.loginDialogType = 0;
      state.loginDialogStatus = false;
    },
    showLoginDialog(state) {
      state.loginDialogStatus = true;
    },
    changeDialogType(state, val) {
      state.loginDialogType = val;
    },
    saveDialogMobile(state, val) {
      state.dialogMobile = val;
    },
    saveBindWeixin(state, val) {
      state.bindWeixin = val;
    },
    bindSuccess(state, val) {
      state.sucbind = true;
    },
    removeBind(state) {
      state.sucbind = false;
    },
    updateFuncConfig(state, func) {
      state.configFunc = func;
    },
    setNewAddress(state, val) {
      state.addressForm = val;
    },
  },
  actions: {},
  modules: {},
});
