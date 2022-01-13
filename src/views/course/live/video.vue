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
              'background-image': 'url(' + course.poster + ') no-repeat',
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
          <div class="replybox">
            <input
              class="reply-content"
              type="text"
              :disabled="video.status === 2"
              v-model="message.content"
              placeholder="按回车键可直接发送"
              @keyup.enter="submitMessage()"
            />
            <div class="submit" @click="submitMessage()">发布</div>
          </div>
        </div>
        <div class="chat-item">
          <div class="tit">聊天互动</div>
          <div class="chat-box" ref="chatBox">
            <div
              class="bullet-chat"
              v-for="(item, index) in chatRecords"
              :key="index"
            >
              <template v-if="item.local">
                <div class="alert-message">
                  <span class="text-block">{{ item.content }}</span>
                </div>
              </template>

              <template v-else>
                <div class="nickname">{{ item.user.nick_name }}：</div>
                <div class="chat-content">{{ item.content }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <remote-script
      src="https://cdn.aodianyun.com/dms/rop_client.js"
      @load="initADY"
      v-if="enabledChat"
    ></remote-script>

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
import { mapState } from "vuex";

export default {
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
      chatRecords: [],
      chatChannel: null,
      chatUser: null,
      ADYParams: {
        pub_key: null,
        sub_key: null,
        channel: null,
        user: {
          id: null,
          name: null,
          avatar: null,
        },
      },
      isWebrtc: false,
      vodPlayerStatus: false,
      record_exists: 0,
      record_duration: 0,
      timeValue: 0,
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
  watch: {
    chatRecords() {
      this.chatBoxScrollBottom();
    },
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    this.livePlayer && this.livePlayer.destroy(true);
    this.vodPlayer && this.vodPlayer.destroy();

    // 断开聊天室
    if (window.ROP) {
      window.ROP.Leave();
    }
  },
  methods: {
    getData() {
      this.$api.Live.Play(this.id)
        .then((res) => {
          let resData = res.data;

          // 网页标题
          document.title = resData.video.title;

          // 初始化聊天服务
          if (typeof resData.chat !== "undefined") {
            this.chatChannel = resData.chat.channel;
            this.chatUser = resData.chat.user;

            this.ADYParams.sub_key = resData.chat.aodianyun.sub_key;
            this.ADYParams.pub_key = resData.chat.aodianyun.pub_key;
            this.ADYParams.channel = resData.chat.channel;
            this.ADYParams.user.id = resData.chat.user.id;
            this.ADYParams.user.name = resData.chat.user.name;
            this.ADYParams.user.avatar = resData.chat.user.avatar;
          }

          // 倒计时
          this.curStartTime = resData.video.published_at;

          this.course = resData.course;
          this.video = resData.video;
          this.playUrl = resData.play_url;
          this.record_exists = resData.record_exists;
          this.record_duration = resData.record_duration;
          this.webrtc_play_url = resData.web_rtc_play_url;

          // 聊天记录
          this.getChatRecords();

          // 初始化播放器
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
      this.livePlayer.on("timeupdate", function () {
        this.playRecord(parseInt(this.livePlayer.currentTime));
      });
      this.livePlayer.on("ended", () => {
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
        listener: function (msg) {
          if (msg.type == "timeupdate") {
            that.playLiveRecord(parseInt(msg.timeStamp));
          } else if (msg.type == "ended") {
            that.playLiveRecord(parseInt(msg.timeStamp), true);
          }
        },
      });
    },
    initADY() {
      let pubKey = this.ADYParams.pub_key;
      let subKey = this.ADYParams.sub_key;
      let channel = this.ADYParams.channel;
      let id = this.ADYParams.user.id;
      let nickname = this.ADYParams.user.name;
      let avatar = this.ADYParams.user.avatar;

      if (pubKey === null) {
        return;
      }

      window.ROP.Enter(pubKey, subKey, id, true);
      window.ROP.On("enter_suc", () => {
        window.ROP.Subscribe(channel);
        // 发送新用户上线消息
        window.ROP.Publish(
          JSON.stringify({
            t: "connect",
            v: "",
            u: {
              id: id,
              nickname: nickname,
              avatar: avatar,
            },
          }),
          channel
        );
      });
      window.ROP.On("enter_fail", (err) => {
        this.chanEvt("connect-fail", err);
      });
      window.ROP.On("offline", (err) => {
        this.chanEvt("connect-off", err);
      });
      window.ROP.On("losed", () => {
        this.chanEvt("connect-lose");
      });
      window.ROP.On("reconnect", () => {
        this.chanEvt("connect-reconnect");
      });
      window.ROP.On("connectold", () => {
        this.chanEvt("connect-repeat");
      });
      window.ROP.On("publish_data", (data, topic) => {
        if (topic !== channel) {
          return;
        }
        let message = JSON.parse(data);
        if (message.t === "message") {
          this.chatRecords.push({
            content: message.v,
            user: {
              nick_name: message.u.name,
            },
          });
        } else if (message.t === "connect") {
          this.chatRecords.push({
            local: 1,
            content: message.u.nickname + "已加入",
          });
        }
      });
    },
    chanEvt(e, data) {
      const mesMap = {
        "connect-success": "已加入聊天室",
        enter_fail: "无法加入聊天室",
        offline: "已断开连接",
        losed: "已断开连接",
        reconnect: "已重新连接",
        connectold: "异地登录",
        "connect-repeat": "异地登录",
        "connect-lose": "已断开链接",
      };

      this.chatRecords.push({
        local: 1,
        content: mesMap[e],
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
          text: this.user.mobile,
          size: "15px",
          color: "red",
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
        this.$api.Live.Record(this.video.course_id, this.video.id).then(
          () => {}
        );
      }
    },
    playLiveRecord(duration, isEnd) {
      if (duration - this.timeValue >= 10000 || isEnd === true) {
        this.timeValue = duration;
        this.$api.Live.Record(this.video.course_id, this.video.id).then(
          () => {}
        );
      }
    },
    getChatRecords() {
      this.$api.Live.ChatRecords(this.course.id, this.video.id, {
        page: 1,
        size: 2000,
      }).then((res) => {
        this.chatRecords.push(...res.data.data);
      });
    },
    saveChat(content) {
      let curDuration =
        this.livePlayer === null ? 0 : this.livePlayer.video.currentTime;
      this.$api.Live.SendMessage(this.course.id, this.video.id, {
        content: content,
        duration: curDuration,
      }).catch((e) => {
        this.$msg.error(e.message);
      });
    },
    submitMessage() {
      if (!this.message.content) {
        return;
      }
      this.saveChat(this.message.content);
      this.message.content = null;
    },
    chatBoxScrollBottom() {
      setTimeout(() => {
        this.$refs["chatBox"].scrollTop = this.$refs["chatBox"].scrollHeight;
      }, 150);
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
    height: 100%;
    padding-top: 50px;
    box-sizing: border-box;
    padding-bottom: 270px;
    background: url(../../../assets/img/commen/bg-zhibo.png) no-repeat;
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    .live-box {
      width: 1200px;
      height: 689px;
      margin: 0 auto;
      background-color: #fff;
      display: flex;
      flex-direction: row;
      .live-item {
        width: 950px;
        height: 689px;
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
          }
        }
      }
      .chat-item {
        width: 250px;
        height: 689px;
        box-sizing: border-box;
        padding: 15px 0 0 0;
        position: relative;
        display: flex;
        flex-direction: column;

        .tit {
          width: 100%;
          height: 16px;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          margin-bottom: 15px;
          box-sizing: border-box;
          padding: 0 15px 30px 15px;
        }
        .chat-box {
          width: 100%;
          height: 610px;
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 0 15px;

          .bullet-chat {
            width: 100%;
            display: flex;
            flex-direction: row;
            margin-bottom: 30px;

            &:last-child {
              margin-bottom: 15px;
            }

            .alert-message {
              width: 100%;
              height: auto;
              float: left;

              .text-block {
                width: auto;
                height: 26px;
                padding: 7px 12px;
                background: #cccccc;
                border-radius: 15px;
                display: inline-block;
                font-size: 12px;
                line-height: 12px;
                font-weight: 400;
                color: #ffffff;
              }
            }

            .nickname {
              font-size: 13px;
              font-weight: 400;
              color: #3ca7fa;
              line-height: 18px;
            }

            .chat-content {
              flex: 1;
              font-size: 13px;
              font-weight: 400;
              color: #333333;
              line-height: 18px;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}
</style>
