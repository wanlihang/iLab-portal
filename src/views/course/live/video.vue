<template>
  <div class="content" v-if="video">
    <div class="navheader">
      <div class="top">
        <img
          @click="$router.back()"
          class="icon-back"
          src="../../../assets/img/commen/icon-back-h.png"
        />
        <span @click="$router.back()">{{ video.title }}</span>
      </div>
    </div>
    <div class="live-banner">
      <div class="live-box" v-if="isLogin && video">
        <div class="live-item">
          <div class="live-item-title">
            <span class="name">{{ video.title }}</span>
            <span class="time">
              <span v-if="video.status === 0">
                开播时间 {{ video.published_at }}
              </span>
              <span v-else-if="video.status === 1">直播中</span>
              <span v-else-if="video.status === 2">已结束</span>
            </span>
          </div>
          <div
            class="live-item-video"
            :style="{
              'background-image': 'url(' + course.poster + ')',
              'background-size': '100% 100%',
            }"
          >
            <div class="play" v-if="video.status === 1">
              <div
                id="meedu-live-player"
                style="width: 100%; height: 100%"
              ></div>
            </div>
            <div class="alert-message" v-else-if="video.status === 0">
              <div class="message">
                直播倒计时：{{ day }}天{{ hour }}小时{{ min }}分{{ second }}秒
              </div>
            </div>
            <template v-else-if="video.status === 2">
              <template v-if="!vodPlayerStatus">
                <div class="alert-message">
                  <div
                    class="play-button"
                    @click="showVodPlayer()"
                    v-if="record_exists === 1"
                  >
                    回看直播 {{ record_hour }}{{ record_minute }}:{{
                      record_second
                    }}
                  </div>
                </div>
              </template>
              <div class="play" v-if="record_exists === 1 && vodPlayerStatus">
                <div
                  id="meedu-vod-player"
                  style="width: 100%; height: 100%"
                ></div>
              </div>
            </template>
          </div>
          <div class="replybox" v-if="video.status !== 2">
            <input
              class="reply-content"
              type="text"
              :disabled="video.status === 2 || messageDisabled"
              v-model="message.content"
              :placeholder="
                messageDisabled
                  ? '禁言状态下无法发布消息'
                  : '按回车键可直接发送'
              "
              @keyup.enter="submitMessage()"
            />
            <div
              class="submit"
              :class="{
                disabled: messageDisabled,
              }"
              @click="submitMessage()"
            >
              发布
            </div>
          </div>
        </div>
        <div class="chat-item">
          <chat-box
            :chat="chat"
            :enabledChat="enabledChat"
            :status="video.status"
            :disabled="userDisabled"
            :cid="course.id"
            :vid="video.id"
            @change="getStatus"
          ></chat-box>
        </div>
      </div>
    </div>
    <template v-if="video.status === 1">
      <template v-if="webrtc_play_url">
        <remote-script
          src="https://web.sdk.qcloud.com/player/tcplayerlite/release/v2.4.1/TcPlayer-2.4.1.js"
          @load="initLiveTencentPlayer"
        ></remote-script>
      </template>
      <template v-else>
        <remote-script src="/js/xg/index.js"></remote-script>
        <remote-script
          src="/js/xg/hls.min.js"
          @load="initLivePlayer"
        ></remote-script>
      </template>
    </template>
  </div>
</template>
<script>
import ChatBox from "../../../components/chat-box.vue";
import { mapState } from "vuex";

export default {
  components: {
    ChatBox,
  },
  data() {
    return {
      id: this.$route.query.id,
      playUrl: null,
      webrtc_play_url: null,
      message: {
        content: null,
      },
      video: [],
      course: [],
      curStartTime: null,
      day: "0",
      hour: "00",
      min: "00",
      second: "00",
      livePlayer: null,
      vodPlayer: null,
      chat: null,
      isWebrtc: false,
      vodPlayerStatus: false,
      record_exists: 0,
      record_duration: 0,
      timeValue: 0,
      curDuration: 0,
      messageDisabled: false,
      userDisabled: null,
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "config"]),
    enabledChat() {
      if (typeof this.video.status === "undefined") {
        return false;
      }
      return this.video.status === 0 || this.video.status === 1;
    },
    record_hour() {
      let h = parseInt(this.record_duration / 3600);
      if (h === 0) {
        return "";
      } else {
        return h >= 10 ? h + ":" : "0" + h + ":";
      }
    },
    record_minute() {
      let m = parseInt((this.record_duration % 3600) / 60);
      return m >= 10 ? m : "0" + m;
    },
    record_second() {
      let s = (this.record_duration % 3600) % 60;
      return s >= 10 ? s : "0" + s;
    },
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    this.livePlayer && this.livePlayer.destroy(true);
    this.vodPlayer && this.vodPlayer.destroy();
  },
  methods: {
    getStatus(status) {
      this.messageDisabled = status;
    },
    getData() {
      this.$api.Live.Play(this.id)
        .then((res) => {
          let resData = res.data;

          // 网页标题
          document.title = resData.video.title;
          this.chat = resData.chat;
          this.curStartTime = resData.video.published_at;
          this.course = resData.course;
          this.video = resData.video;
          this.playUrl = resData.play_url;
          this.record_exists = resData.record_exists;
          this.record_duration = resData.record_duration;
          this.webrtc_play_url = resData.web_rtc_play_url;
          if (resData.room_is_ban === 1) {
            this.userDisabled = 1;
            this.messageDisabled = true;
          }
          if (resData.user_is_ban === 1) {
            this.userDisabled = 2;
            this.messageDisabled = true;
          }
          // 倒计时
          if (this.video.status === 0) {
            this.countTime();
          }
        })
        .catch((e) => {});
    },
    showVodPlayer() {
      if (this.record_exists === 1 && this.playUrl.length > 0) {
        this.vodPlayerStatus = true;
        this.$nextTick(() => {
          this.initVodPlayer(this.playUrl, this.course.poster);
        });
      } else {
        this.$message.error("暂无回放");
      }
    },
    countTime() {
      let date = new Date();
      let now = date.getTime();
      let endDate = new Date(this.curStartTime);
      let end = endDate.getTime();
      let leftTime = end - now;
      if (leftTime >= 0) {
        // 天
        this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        // 时
        let h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        this.hour = h < 10 ? "0" + h : h;
        // 分
        let m = Math.floor((leftTime / 1000 / 60) % 60);
        this.min = m < 10 ? "0" + m : m;
        // 秒
        let s = Math.floor((leftTime / 1000) % 60);
        this.second = s < 10 ? "0" + s : s;
      } else {
        this.day = 0;
        this.hour = "00";
        this.min = "00";
        this.second = "00";
      }
      if (
        Number(this.hour) === 0 &&
        Number(this.day) === 0 &&
        Number(this.min) === 0 &&
        Number(this.second) === 0
      ) {
        this.video.status = 1;
        return;
      } else {
        setTimeout(this.countTime, 1000);
      }
    },
    initLivePlayer() {
      this.livePlayer = new window.HlsJsPlayer({
        id: "meedu-live-player",
        url: this.playUrl,
        isLive: true,
        autoplay: true,
        poster: this.course.poster || this.config.player.cover,
        height: 535,
        width: 950,
        closeVideoTouch: true,
        closeVideoClick: true,
      });
      this.livePlayer.on("timeupdate", () => {
        this.curDuration = parseInt(this.livePlayer.currentTime);
        this.playRecord(parseInt(this.livePlayer.currentTime));
      });
      this.livePlayer.on("ended", () => {
        this.curDuration = parseInt(this.livePlayer.currentTime);
        this.playRecord(parseInt(this.livePlayer.currentTime), true);
      });
    },
    initLiveTencentPlayer() {
      const that = this;
      this.livePlayer = new window.TcPlayer("meedu-live-player", {
        m3u8: this.webrtc_play_url,
        autoplay: true,
        poster: this.course.poster || this.config.player.cover,
        width: 950,
        height: 535,
        listener: function(msg) {
          if (msg.type == "timeupdate") {
            that.curDuration = parseInt(msg.timeStamp / 1000);
            that.playRecord(parseInt(msg.timeStamp / 1000));
          } else if (msg.type == "ended") {
            that.curDuration = parseInt(msg.timeStamp / 1000);
            that.playRecord(parseInt(msg.timeStamp / 1000), true);
          }
        },
      });
    },

    initVodPlayer(url, poster) {
      let dplayerUrls = [];
      url.forEach((item) => {
        dplayerUrls.push({
          name: item.name,
          url: item.url,
        });
      });
      let bulletSecretFontSize = !this.config.player.bullet_secret.size
        ? 14
        : this.config.player.bullet_secret.size;
      this.vodPlayer = new window.DPlayer({
        container: document.getElementById("meedu-vod-player"),
        autoplay: false,
        video: {
          quality: dplayerUrls,
          defaultQuality: 0,
          pic: poster || this.config.player.cover,
        },
        bulletSecret: {
          enabled: parseInt(this.config.player.enabled_bullet_secret) === 1,
          text: this.config.player.bullet_secret.text
            .replace("${user.mobile}", this.user.mobile)
            .replace("${mobile}", this.user.mobile)
            .replace("${user.id}", this.user.id),
          size: bulletSecretFontSize + "px",
          color: !this.config.player.bullet_secret.color
            ? "red"
            : this.config.player.bullet_secret.color,
          opacity: this.config.player.bullet_secret.opacity,
        },
      });
      this.vodPlayer.on("timeupdate", () => {
        this.playRecord(parseInt(this.vodPlayer.video.currentTime));
      });
      this.vodPlayer.on("ended", () => {
        this.playRecord(parseInt(this.vodPlayer.video.currentTime), true);
      });
    },
    playRecord(duration, isEnd) {
      if (duration - this.timeValue >= 10 || isEnd === true) {
        this.timeValue = duration;
        this.$api.Live.Record(this.video.course_id, this.video.id).then(() => {
          // todo
        });
      }
    },
    saveChat(content) {
      this.$api.Live.SendMessage(this.course.id, this.video.id, {
        content: content,
        duration: this.curDuration,
      }).catch((e) => {
        this.$msg.error(e.message);
      });
    },
    submitMessage() {
      if (!this.message.content) {
        return;
      }
      if (this.messageDisabled) {
        return;
      }
      this.saveChat(this.message.content);
      this.message.content = null;
    },
  },
};
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #dddddd;
}
::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 0px;
}
.content {
  width: 100%;
  height: 100%;
  position: relative;
  margin: 0;
  .navheader {
    width: 100%;
    height: 70px;
    background: #ffffff;
    .top {
      width: 1200px;
      height: 70px;
      margin: 0 auto;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .icon-back {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        cursor: pointer;
      }
      span {
        cursor: pointer;
      }
    }
  }
  .live-banner {
    width: 100%;
    height: 100vh;
    padding-top: 50px;
    box-sizing: border-box;
    padding-bottom: 270px;
    background: url(../../../assets/img/commen/bg-zhibo.png) no-repeat;
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    .live-box {
      width: 1200px;
      height: auto;
      margin: 0 auto;
      background-color: #fff;
      display: flex;
      flex-direction: row;
      .live-item {
        width: 950px;
        height: auto;
        position: relative;
        display: flex;
        flex-direction: column;
        .live-item-title {
          width: 100%;
          height: 76px;
          background: #000000;
          box-sizing: border-box;
          padding: 30px;
          .name {
            height: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            line-height: 16px;
            margin-right: 30px;
          }
          .time {
            height: 16px;
            font-size: 16px;
            font-weight: 400;
            color: #3ca7fa;
            line-height: 16px;
          }
        }
        .live-item-video {
          width: 100%;
          height: 535px;
          background-color: #000000;

          .play {
            width: 100%;
            height: 100%;
            background-color: #000000;
          }

          .alert-message {
            width: 100%;
            height: 535px;
            display: flex;
            align-items: center;
            justify-content: center;
            .play-button {
              width: auto;
              height: auto;
              background: #3ca7fa;
              border-radius: 32px;
              display: inline-block;
              margin-top: -76px;
              cursor: pointer;
              font-size: 14px;
              box-sizing: border-box;
              padding: 15px 20px;
              font-weight: 400;
              line-height: 14px;
              color: #ffffff;
              &:hover {
                opacity: 0.8;
              }
            }

            .message {
              background: rgba(255, 255, 255, 0.3);
              padding: 20px 30px;
              font-size: 24px;
              font-weight: 400;
              color: #ffffff;
              line-height: 24px;
              border-radius: 32px;
              span {
                color: #3ca7fa;
                cursor: pointer;
              }
            }
          }
        }
        .replybox {
          width: 100%;
          height: 78px;
          background: #ffffff;
          box-sizing: border-box;
          padding: 15px 30px;
          position: relative;

          input {
            width: 400px;
            height: 48px;
            box-sizing: border-box;
            background: #f1f3f5;
            border-radius: 24px;
            outline: none;
            padding-left: 20px;
            padding-right: 64px;
            float: right;
            font-size: 14px;
            font-weight: 400;
          }

          .submit {
            position: absolute;
            width: 48px;
            height: 48px;
            background: #3ca7fa;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            top: 15px;
            right: 30px;
            z-index: 10;
            &:hover {
              opacity: 0.8;
            }
            &.disabled {
              background: #cccccc;
            }
          }
        }
      }
      .chat-item {
        width: 250px;
        height: auto;
        float: left;
      }
    }
  }
}
</style>
