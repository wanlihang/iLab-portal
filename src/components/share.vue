<template>
  <div class="share">
    <span>分享到</span>
    <a class="qq" v-if="qq.url" target="_blank" :href="qq.url"
      ><img
        class="qq-icon"
        width="40"
        height="40"
        src="../assets/img/commen/icon-qq.png"
    /></a>
    <!--<a
      class="wechat"
      v-if="config && config.h5_url"
      @mouseenter="enter()"
      @mouseleave="leave()"
    >
      <img
        class="wechat-icon"
        width="40"
        height="40"
        src="../assets/img/commen/icon-weixin.png"
      />
    </a>-->
    <a class="sina" v-if="sina.url" target="_blank" :href="sina.url"
      ><img
        class="sina-icon"
        width="40"
        height="40"
        src="../assets/img/commen/icon-weibo.png"
    /></a>
    <div class="seen" v-show="seen">
      <div id="qrcode"></div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import QRCode from "qrcodejs2";
export default {
  props: ["title", "thumb", "cid"],
  data() {
    return {
      seen: false,
      qq: {
        url: null,
      },
      sina: {
        url: null,
      },
    };
  },
  computed: {
    ...mapState(["config"]),
  },
  watch: {
    cid() {
      this.getData();
    },
  },
  mounted() {},
  methods: {
    search() {
      if (this.config && this.config.h5_url) {
        let host = this.config.h5_url;
        let url = "";
        let link = "";
        if (host.substr(host.length - 1, 1) !== "/") {
          host = host + "/";
        }
        url = encodeURIComponent(
          this.config.url +
            "/addons/MeeduTopics/app-view/dist/index.html#/?id=" +
            this.cid
        );
        link =
          host +
          "pages/webview/webview?url=" +
          url +
          "&title=" +
          encodeURIComponent(this.title);
        var qrcode = new QRCode("qrcode", {
          text: link, //表示内容，可以是地址或者是文字'55566'或者参数
          colorDark: "#000000", //前景色
          colorLight: "#ffffff", //背景色
          correctLevel: QRCode.CorrectLevel.Q, //容错级别
        });
      }
    },
    enter() {
      this.seen = true;
    },
    leave() {
      this.seen = false;
    },
    getData() {
      this.qq.url =
        "https://connect.qq.com/widget/shareqq/index.html?url=https%3A%2F%2Fall.meedu.tech%2Ftopic%2Fdetail%3Fid%3D" +
        this.cid +
        "&title=" +
        this.title +
        "&summary=" +
        this.title +
        "&pics=" +
        this.thumb +
        "&site=MeEdu测试站";

      this.sina.url =
        "https://service.weibo.com/share/share.php?url=https%3A%2F%2Fall.meedu.tech%2Ftopic%2Fdetail%3Fid%3D" +
        this.cid +
        "&title=" +
        this.title +
        "&pic=" +
        this.thumb;
      this.search();
    },
  },
};
</script>
<style lang="less" scoped>
.share {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  span {
    height: 14px;
    font-size: 14px;
    margin-right: 30px;
    font-weight: 400;
    color: #666666;
    line-height: 14px;
  }
  .seen {
    position: absolute;
    top: 40px;
    left: 52px;
    width: 220px;
    height: 224px;
    background-image: url("../assets/img/commen/share-wechat.png");
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    #qrcode {
      width: 120px;
      height: 120px;
    }
  }
  a {
    cursor: pointer;
    width: 40px;
    height: 40px;

    &.qq {
      margin-right: 26px;
    }
    &.wechat {
      margin-right: 26px;
    }
  }
}
</style>
