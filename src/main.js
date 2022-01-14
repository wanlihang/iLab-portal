import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "./js/request/request";
import config from "./js/config";

import Message from "vue-m-message";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "vue-m-message/dist/index.css";

import "swiper/css/swiper.css";

import utils from "./js/utils";
import VCharts from "v-charts";
import { highlight } from "vue-words-highlight";

import "@/js/remote-js.js";
// 注册指令
import "@/js/directives";
// 全局样式
import "./assets/commen/variable.less";
// 全局组件
import ThumbBar from "@/components/thumb-bar";

Vue.config.productionTip = false;

Vue.prototype.$api = api;
Vue.prototype.$config = config;
Vue.prototype.$utils = utils;
Vue.prototype.$message = Message;
Vue.use(VueAwesomeSwiper);
Vue.use(VCharts);
Vue.use(highlight, {
  name: "highlight",
  className: "red",
  style: "color: #FF5068",
  caseSensitive: false,
});
Vue.component("ThumbBar", ThumbBar);

utils.copyright();

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "";
  next();
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
