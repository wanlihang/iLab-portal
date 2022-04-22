<template>
  <div class="chat-box">
    <div class="tit">聊天互动</div>
    <div class="tip" v-if="messageDisabled && userDisabled">
      您已被禁言
    </div>
    <div class="tip" v-if="messageDisabled && !userDisabled">
      全员已禁言
    </div>
    <div
      class="chat-box"
      ref="chatBox"
      :class="{
        end: status === 2,
      }"
    >
      <template v-if="chatRecords.length > 0">
        <div class="bullet-chat active" v-if="!over">
          <div class="addmore" @click="getMoreChatRecords()">加载更多</div>
        </div>
      </template>
      <div
        class="bullet-chat"
        v-for="(item, index) in chatRecords"
        :key="index"
        :id="item.id"
      >
        <template v-if="item.local">
          <div class="alert-message">
            <span class="text-block">{{ item.content }}</span>
          </div>
        </template>

        <template v-else>
          <div class="nickname" :class="{ teacher: item.msg_body.tec }">
            {{ item.msg_body.nick_name }}
          </div>
          <div class="message-content">
            <div class="chat-content">{{ item.msg_body.content }}</div>
          </div>
        </template>
      </div>
    </div>
    <remote-script
      src="https://cdn.aodianyun.com/dms/rop_client.js"
      @load="initADY"
      v-if="enabledChat"
    ></remote-script>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["chat", "enabledChat", "status", "cid", "vid", "disabled"],
  data() {
    return {
      chatChannel: null,
      chatUser: null,
      ADYParams: {
        sub_key: null,
        pub_key: null,
        channel: null,
        user: {
          id: null,
          name: null,
          avatar: null,
        },
      },
      chatRecords: [],
      pagination: {
        page: 1,
        size: 100,
      },
      pageLoading: false,
      over: false,
      total: 0,
      enabledScrollBottom: false,
      newId: null,
      messageDisabled: false,
      userDisabled: false,
    };
  },
  watch: {
    chatRecords() {
      if (this.enabledScrollBottom) {
        this.chatBoxScrollBottom();
      }
    },
    disabled(val) {
      if (val === 2) {
        this.messageDisabled = true;
        this.userDisabled = true;
      } else if (val === 1) {
        this.messageDisabled = true;
        this.userDisabled = false;
      }
    },
    chat(data) {
      // 初始化聊天服务
      if (typeof data !== "undefined") {
        this.chatChannel = data.channel;
        this.chatUser = data.user;
        this.ADYParams.sub_key = data.aodianyun.sub_key;
        this.ADYParams.pub_key = data.aodianyun.pub_key;
        this.ADYParams.channel = data.channel;
        this.ADYParams.user.id = data.user.id;
        this.ADYParams.user.name = data.user.name;
        this.ADYParams.user.avatar = data.user.avatar;
      }
      this.enabledScrollBottom = true;
      this.getChatRecords();
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  beforeDestroy() {
    // 断开聊天室
    if (window.ROP) {
      window.ROP.Leave();
    }
  },
  mounted() {},
  methods: {
    getMoreChatRecords() {
      this.enabledScrollBottom = false;
      this.pagination.page++;
      this.getChatRecords();
    },
    getChatRecords() {
      if (this.pageLoading || this.over) {
        return;
      }
      this.pageLoading = true;
      this.$api.Live.ChatRecords(this.cid, this.vid, this.pagination)
        .then((res) => {
          this.total = res.data.total;
          if (res.data.data[0]) {
            this.newId = res.data.data[0].id;
          }
          let chatData = res.data.data.reverse();
          this.chatRecords.unshift(...chatData);
          if (this.pagination.size !== res.data.data.length) {
            this.over = true;
          }
          this.pageLoading = false;
          if (this.pagination.page > 1) {
            this.moveScroll();
          }
        })
        .catch((e) => {
          this.pageLoading = false;
          this.$message.error(e.message);
        });
    },
    moveScroll() {
      setTimeout(() => {
        this.$refs["chatBox"].scrollTop = document.getElementById(
          this.newId
        ).offsetTop;
      }, 150);
    },
    chatBoxScrollBottom() {
      setTimeout(() => {
        this.$refs["chatBox"].scrollTop = this.$refs["chatBox"].scrollHeight;
      }, 150);
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
        this.enabledScrollBottom = true;
        let message = JSON.parse(data);
        if (message.t === "message") {
          let msgV = JSON.parse(message.v);
          this.chatRecords.push({
            msg_body: msgV,
          });
        } else if (message.t === "connect") {
          this.chatRecords.push({
            local: 1,
            content: message.u.nickname + "已加入",
          });
        } else if (message.t === "room-ban") {
          this.userDisabled = false;
          this.messageDisabled = true;
          this.$emit("change", this.messageDisabled);
        } else if (
          message.t === "room-user-ban" &&
          message.params[0] === this.user.id
        ) {
          this.userDisabled = true;
          this.messageDisabled = true;
          this.$emit("change", this.messageDisabled);
        } else if (
          message.t === "room-un-ban" ||
          message.t === "room-user-un-ban" ||
          (message.t === "room-user-ban" && message.params[0] !== this.user.id)
        ) {
          this.userDisabled = false;
          this.messageDisabled = false;
          this.$emit("change", this.messageDisabled);
        } else if (message.t === "room-over") {
          this.$message.success("当前直播已结束");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      });
    },
    chanEvt(e, data) {
      this.enabledScrollBottom = true;
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
  },
};
</script>
<style lang="less" scoped>
.chat-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 15px 0 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  .tip {
    width: 80px;
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    line-height: 12px;
    background: #faad14;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 28px;
    left: 89px;
  }
  .tit {
    width: 100%;
    height: auto;
    font-size: 16px;
    line-height: 16px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 15px;
    box-sizing: border-box;
    padding: 15px 15px 0px 15px;
  }
  .chat-box {
    width: 100%;
    height: 628px;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0 15px;
    &.end {
      height: 549px;
    }

    .bullet-chat {
      width: 100%;
      height: auto;
      float: left;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 15px;
      }
      &.active {
        display: flex;
        justify-content: center;
      }
      .addmore {
        display: inline-block;
        width: auto;
        height: auto;
        font-size: 13px;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }

      .alert-message {
        width: 100%;
        height: auto;
        float: left;
        text-align: center;

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
        width: 100%;
        height: auto;
        float: left;
        font-size: 13px;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
        margin-bottom: 5px;
        &.teacher {
          width: auto;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          line-height: 12px;
          padding: 5px 10px;
          background: #3ca7fa;
          border-radius: 2px;
        }
      }

      .message-content {
        width: 100%;
        height: auto;
        float: left;
        display: flex;
        justify-content: space-between;
        .chat-content {
          width: auto;
          height: auto;
          float: left;
          background: #e1f1fd;
          box-sizing: border-box;
          padding: 8px 10px;
          border-radius: 8px;
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
</style>
