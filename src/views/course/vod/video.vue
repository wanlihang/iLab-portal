<template>
  <div class="content">
    <course-dialog
      :courseCharge="dialog.courseCharge"
      :videoCharge="dialog.videoCharge"
      :vipFree="dialog.vipFree"
      :configText="dialog.configText"
      :status="dialog.status"
      :is_ban_sell="dialog.is_ban_sell"
      @payOrder="paySelect"
      @hideDialog="hideDialog"
    ></course-dialog>

    <div class="fix-nav" v-show="isfixTab">
      <div class="tabs">
        <div
          class="item-tab"
          v-for="(item, index) in tabs"
          :key="index"
          :class="{ active: currentTab === item.id }"
          @click="tabChange(item.id)"
          :is-scroll="false"
        >
          {{ item.name }}
          <div class="actline" v-if="currentTab === item.id"></div>
        </div>
      </div>
    </div>

    <div class="box" v-if="course">
      <historyRecord
        :id="video.id"
        :title="video.title"
        type="video"
      ></historyRecord>
      <div class="nav">
        <a @click="$router.push({ name: 'index' })">首页</a> /
        <a @click="$router.push({ name: 'courses' })">点播课</a> /
        <a
          v-if="course"
          @click="
            $router.push({ name: 'coursesDetail', query: { id: course.id } })
          "
          >{{ course.title }}</a
        >
        <p v-if="course">/</p>
        <span>{{ video.title }}</span>
      </div>
      <div class="course-info">
        <div class="video-box">
          <div
            class="play-box"
            style="background-size: cover"
            :style="{ backgroundImage: 'url(' + config.player.cover + ')' }"
          >
            <div
              class="goCurrent"
              v-if="
                showtip &&
                video_watched_progress &&
                video_watched_progress[video.id]
              "
            >
              <span
                >上次观看到
                {{
                  $utils.getHMS(video_watched_progress[video.id].watch_seconds)
                }}</span
              ><span
                class="link"
                @click="toWatch(video_watched_progress[video.id].watch_seconds)"
                >立即跳转</span
              >
            </div>
            <div v-if="!playendedStatus && (isWatch || video.free_seconds > 0)">
              <div
                class="iframe-player-box"
                v-if="isIframe"
                v-html="playUrl"
              ></div>
              <div
                v-else
                class="meedu-player-container"
                id="meedu-player-container"
              ></div>
            </div>
            <template v-else>
              <div class="alert-message" v-if="isLogin">
                <div v-if="playendedStatus">
                  <div class="subscribe-info" v-if="isWatch === false">
                    试看结束，购买课程观看所有视频
                  </div>
                  <template v-else-if="!isLastpage">
                    <div class="next-page" @click="goNextVideo(lastVideoid)">
                      播放下一节课程
                    </div>
                    <div class="last-video">
                      {{ totalTime }}秒后开始自动播放下一节
                    </div>
                  </template>
                  <div class="last-video" v-else>恭喜你看完本套课程！</div>
                </div>
                <div
                  class="subscribe-button"
                  v-if="course.charge > 0 && isWatch === false"
                  @click="paySelect(1)"
                >
                  <span>订阅课程 ￥{{ course.charge }}</span>
                </div>
                <div
                  class="subscribe-button2"
                  v-if="
                    video.charge > 0 &&
                    video.is_ban_sell === 0 &&
                    isWatch === false
                  "
                  @click="paySelect(3)"
                >
                  <span>或点击此处单独购买本节视频￥{{ video.charge }}</span>
                </div>
              </div>
              <div class="alert-message" v-else>请登录后观看</div>
            </template>
          </div>
          <div class="course-chapter-box">
            <template v-if="chapters.length > 0">
              <div
                class="chapter-item"
                v-for="chapter in chapters"
                :key="chapter.id"
              >
                <div class="chapter-name">{{ chapter.title }}</div>
                <div class="chapter-videos-box">
                  <div
                    class="video-item"
                    :class="{ selChapter: videoItem.id === video.id }"
                    @click="goPlay(videoItem)"
                    v-for="videoItem in videos[chapter.id]"
                    :key="videoItem.id"
                  >
                    <img
                      class="play-icon"
                      v-if="
                        isBuy ||
                        course.is_free === 1 ||
                        videoItem.charge === 0 ||
                        buyVideos.indexOf(videoItem.id) !== -1
                      "
                      src="../../../assets/img/commen/icon-unlock.png"
                    />
                    <img
                      class="play-icon"
                      v-else
                      src="../../../assets/img/commen/icon-lock.png"
                    />
                    <div class="video-title">
                      <div
                        :class="{
                          active: videoItem.id === video.id,
                        }"
                        class="text"
                        v-if="
                          course.is_free !== 1 &&
                          (videoItem.charge === 0 || videoItem.free_seconds > 0)
                        "
                      >
                        {{ videoItem.title }}
                      </div>
                      <div
                        :class="{
                          active: videoItem.id === video.id,
                        }"
                        class="text2"
                        v-else
                      >
                        {{ videoItem.title }}
                      </div>
                      <div
                        class="free"
                        v-if="
                          course.is_free !== 1 && videoItem.free_seconds > 0
                        "
                      >
                        试看
                      </div>
                    </div>
                    <!-- <div class="video-info">
                      <img
                        v-if="videoItem.id === video.id"
                        class="active-icon"
                        src="../../../assets/img/commen/icon-learning.png"
                      />
                      <template
                        v-if="
                          videoItem.id === video.id &&
                          video_watched_progress.length > 0
                        "
                      >
                        <span
                          v-if="
                            video_watched_progress[video.id].watch_seconds <
                            videoItem.duration
                          "
                          >已学习{{
                            (
                              (video_watched_progress[video.id].watch_seconds *
                                100) /
                              videoItem.duration
                            ).toFixed(0)
                          }}%</span
                        >
                        <span v-else>已学习100%</span>
                      </template>
                      <template v-else-if="videoItem.id !== video.id">
                        <duration :seconds="videoItem.duration"></duration>
                      </template>
                      <template v-else>
                        <span>已学习0%</span>
                      </template>
                    </div> -->
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="video-item"
                @click="goPlay(video)"
                v-for="video in videos[0]"
                :key="video.id"
              >
                <img
                  class="play-icon"
                  v-if="
                    isBuy ||
                    course.is_free === 1 ||
                    video.charge === 0 ||
                    buyVideos.indexOf(videoItem.id) !== -1
                  "
                  src="../../../assets/img/commen/icon-unlock.png"
                />
                <img
                  class="play-icon"
                  v-else
                  src="../../../assets/img/commen/icon-lock.png"
                />
                <div class="video-title">
                  <div
                    class="text"
                    v-if="
                      course.is_free !== 1 &&
                      (video.charge === 0 || video.free_seconds > 0)
                    "
                  >
                    {{ video.title }}
                  </div>
                  <div class="text2" v-else>
                    {{ video.title }}
                  </div>
                  <div
                    class="free"
                    v-if="course.is_free !== 1 && video.free_seconds > 0"
                  >
                    试看
                  </div>
                </div>
                <!-- <div class="video-duration">
                  <duration :seconds="video.duration"></duration>
                </div> -->
              </div>
            </template>
          </div>
        </div>
        <div class="tabs" id="NavBar">
          <div
            class="item-tab"
            v-for="(item, index) in tabs"
            :key="index"
            :class="{ active: currentTab === item.id }"
            @click="tabChange(item.id)"
            :is-scroll="false"
          >
            {{ item.name }}
            <div class="actline" v-if="currentTab === item.id"></div>
          </div>
        </div>
      </div>
      <div class="course-comments-box" v-show="currentTab === 4">
        <template v-if="isLogin">
          <div v-if="isBuy" class="replybox">
            <div class="reply">
              <img class="user-avatar" :src="user.avatar" />
              <input
                type="text"
                class="reply-input"
                placeholder="此处填写你的评论"
                v-model="comment.content"
              />
              <div
                class="btn-submit"
                :class="{ active: comment.content.length > 0 }"
                @click="submitComment"
              >
                评论
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="replybox">
            <div class="text" @click="goLogin()">未登录，请登录后再评论</div>
          </div>
        </template>
        <div class="comment-divider">全部评论</div>
        <div class="line"></div>

        <div class="comment-top">
          <template v-if="comments.length > 0">
            <div
              class="comment-item"
              v-for="comment in comments"
              :key="comment.id"
            >
              <div class="user-avatar">
                <img :src="commentUsers[comment.user_id].avatar" />
              </div>
              <div class="comment-content">
                <div class="comment-info">
                  <div class="nickname">
                    {{ commentUsers[comment.user_id].nick_name }}
                  </div>
                  <div class="comment-time">
                    {{ comment.created_at | changeTime }}
                  </div>
                </div>

                <div class="comment-text" v-html="comment.render_content"></div>
              </div>
            </div>
          </template>
          <none v-else type="white"></none>
        </div>
      </div>
      <div v-if="attach" class="attach-list-box" v-show="currentTab === 5">
        <template v-if="attach.length > 0">
          <div class="attach-item" v-for="item in attach" :key="item.id">
            <div class="attach-name">{{ item.name }}</div>
            <a @click="download(item.id)" class="download-attach">下载附件</a>
          </div>
        </template>
        <none v-else type="white"></none>
      </div>
    </div>
    <snap-shot
      :cid="video.id"
      resource-type="vod"
      v-if="configFunc.snapshort && isWatch"
      :duration="playDuration"
    ></snap-shot>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import Utils from "@/js/utils";
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../../components/footer.vue";
import CourseDialog from "../../../components/coursedialog.vue";
import None from "../../../components/none.vue";
import HistoryRecord from "../../../components/history-record.vue";
import SnapShot from "../../../components/snapshort.vue";

export default {
  components: {
    NavFooter,
    CourseDialog,
    None,
    HistoryRecord,
    SnapShot,
  },
  data() {
    return {
      attach: [],
      videoContext: null,
      loading: false,
      showtip: false,
      id: this.$route.query.id,
      video: null,
      course: null,
      isWatch: false,
      currentTab: 4,
      playUrl: "",
      nowTime: Date.parse(new Date()) / 1000,
      buyVideos: null,
      chapters: [],
      tabs: [
        {
          name: "视频评论",
          id: 4,
        },
        {
          name: "课程附件",
          id: 5,
        },
      ],
      comments: [],
      commentUsers: {},
      comment: {
        content: "",
      },
      totalTime: 10,
      video_watched_progress: [],
      isLastpage: false,
      lastVideoid: null,
      playendedStatus: false,
      playDuration: 0,
      isfixTab: false,
      dialog: {
        id: null,
        courseCharge: null,
        videoCharge: null,
        vipFree: null,
        configText: null,
        status: false,
        is_ban_sell: null,
      },
      isIframe: false,
      isBuy: false,
    };
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  computed: {
    ...mapState(["isLogin", "user", "config", "configFunc"]),
  },
  mounted() {
    window.addEventListener("scroll", this.handleTabFix, true);

    this.getDetail();
    this.getComments();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleTabFix, true);

    // 播放器销毁
    window.player && window.player.destroy();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    handleTabFix() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let navbar = document.querySelector("#NavBar");
      if (navbar) {
        let offsetTop = navbar.offsetTop;
        scrollTop > offsetTop
          ? (this.isfixTab = true)
          : (this.isfixTab = false);
      }
    },
    tabChange(key) {
      this.currentTab = key;
    },
    goPlay(item) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (this.isWatch || item.charge === 0 || item.free_seconds > 0) {
        this.$router.push({
          name: "coursesVideo",
          query: {
            id: item.id,
          },
        });
      } else if (this.buyVideos) {
        let hasvideos = this.buyVideos;
        let has = false;
        for (var i = 0; i < hasvideos.length; i++) {
          if (hasvideos[i] === item.id) {
            has = true;
          } else {
            has = false;
          }
        }
        if (has) {
          this.$router.push({
            name: "coursesVideo",
            query: {
              id: item.id,
            },
          });
        } else {
          this.dialog.id = item.id;
          this.dialog.status = true;
          this.dialog.courseCharge = this.course.charge;
          this.dialog.videoCharge = item.charge;
          this.dialog.vipFree = this.course.is_free;
          this.dialog.configText = item.title;
          this.dialog.is_ban_sell = item.is_ban_sell;
        }
      } else {
        this.dialog.id = item.id;
        this.dialog.status = true;
        this.dialog.courseCharge = this.course.charge;
        this.dialog.videoCharge = item.charge;
        this.dialog.vipFree = this.course.is_free;
        this.dialog.configText = item.title;
        this.dialog.is_ban_sell = item.is_ban_sell;
      }
    },
    paySelect(val) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (val === 2) {
        this.goRole();
        return;
      }
      if (val === 1) {
        this.$router.push({
          name: "order",
          query: {
            goods_type: "vod",
            goods_charge: this.course.charge,
            goods_label: "点播课程",
            goods_name: this.course.title,
            goods_id: this.course.id,
            goods_thumb: this.course.thumb,
          },
        });
        return;
      }
      if (val === 3) {
        this.$router.push({
          name: "order",
          query: {
            goods_type: "video",
            goods_charge: this.dialog.videoCharge,
            goods_label: "视频",
            goods_name: this.dialog.configText,
            goods_id: this.dialog.id,
            goods_thumb: this.course.thumb,
          },
        });
        return;
      }
    },
    hideDialog() {
      this.dialog.status = false;
    },
    goNextVideo(id) {
      this.$router.push({
        name: "coursesVideo",
        query: {
          id: id,
        },
      });
    },
    goRole() {
      this.$router.push({
        name: "vip",
      });
    },
    getAttach() {
      this.$api.Course.Detail(this.course.id).then((res) => {
        this.attach = res.data.attach;
        this.isBuy = res.data.isBuy;
      });
    },
    showLink() {
      this.showtip = true;
      setTimeout(() => {
        this.showtip = false;
      }, 15000);
    },
    toWatch(sec) {
      this.showtip = false;
      window.player.seek(sec);
      window.player.play();
    },
    getDetail() {
      this.$api.Course.Video(this.id).then((res) => {
        this.video = res.data.video;
        this.course = res.data.course;
        this.videos = res.data.videos;
        this.isWatch = res.data.is_watch;
        this.chapters = res.data.chapters;
        this.video_watched_progress = res.data.video_watched_progress;
        this.buyVideos = res.data.buy_videos;
        document.title = res.data.course.title;
        let chapteId = parseInt(res.data.video.chapter_id) || 0;

        // 视频排序数组
        let videoBox = [];
        if (chapteId === 0) {
          videoBox = res.data.videos[chapteId];
        } else {
          for (var k = 0; k < this.chapters.length; k++) {
            let chap = parseInt(this.chapters[k].id);
            if (typeof res.data.videos[chap] !== "undefined") {
              videoBox.push(...res.data.videos[chap]);
            }
          }
        }

        // 读取下一个视频
        for (var j = 0; j < videoBox.length; j++) {
          if (res.data.video.id === videoBox[j].id) {
            if (1 + j >= videoBox.length) {
              this.isLastpage = true;
            } else {
              this.lastVideoid = videoBox[j + 1].id;
            }
          }
        }

        // 自动锁定当前视频位置
        this.$nextTick(() => {
          setTimeout(() => {
            if (this.chapters.length > 0) {
              let pos = document.querySelector(".selChapter").offsetTop - 289;
              if (pos > 0) {
                document.querySelector(".course-chapter-box").scrollTop = pos;
              }
            }
          }, 200);
        });

        // 当前用户已购买 || 可以试看
        if (this.isWatch || this.video.free_seconds > 0) {
          this.getPlayInfo();
        }
        //获取附件
        this.getAttach();
        //播放记录跳转
        if (
          this.video_watched_progress &&
          this.video_watched_progress[this.video.id] &&
          this.video_watched_progress[this.video.id].watch_seconds > 0
        ) {
          this.showLink();
        }
      });
    },
    getPlayInfo() {
      let isTrySee = 0;
      if (this.isWatch === false && this.video.free_seconds > 0) {
        isTrySee = 1;
      }

      this.$api.Course.PlayInfo(this.video.id, { is_try: isTrySee })
        .then((res) => {
          if (res.data.urls.length === 0) {
            this.$message.error("无播放地址");
            return;
          }

          let playUrls = res.data.urls;
          let firstPlayUrl = playUrls[0].url;

          if (firstPlayUrl.substr(1, 6) === "iframe") {
            this.isIframe = true;
            this.playUrl = firstPlayUrl.replace(
              ">",
              ' style="width:100%;height:506px" >'
            );
            return;
          }

          this.initDPlayer(playUrls, isTrySee);
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    initDPlayer(playUrls, isTrySee) {
      // 封装DPlayer的播放格式
      let dplayerUrls = [];
      playUrls.forEach((item) => {
        dplayerUrls.push({
          name: item.name,
          url: item.url,
        });
      });

      // 初始化播放器
      window.player = new window.DPlayer({
        container: document.getElementById("meedu-player-container"),
        autoplay: false,
        video: {
          quality: dplayerUrls,
          defaultQuality: 0,
          pic: this.config.player.cover,
        },
        try: isTrySee === 1,
        bulletSecret: {
          enabled: parseInt(this.config.player.enabled_bullet_secret) === 1,
          text: this.user.mobile,
          size: "15px",
          color: "red",
        },
        ban_drag: parseInt(this.video.ban_drag) === 1,
      });

      // 监听播放进度更新evt
      window.player.on("timeupdate", () => {
        this.playTimeUpdate(parseInt(window.player.video.currentTime));
      });
      window.player.on("ended", () => {
        this.playendedStatus = true;
        this.totalTime = 10;
        this.$nextTick(function () {
          if (!this.isLastpage) {
            this.countDown();
          }
        });
        window.player.destroy();
      });
      window.player.on("sub_course", () => {
        this.paySelect(1);
      });
    },
    countDown() {
      let clock = window.setInterval(() => {
        this.totalTime--;
        if (this.totalTime == 0) {
          window.clearInterval(clock);
          this.goNextVideo(this.lastVideoid);
        }
      }, 1000);
    },
    getComments() {
      this.$api.Course.VideoComments(this.id)
        .then((res) => {
          this.comments = res.data.comments;
          this.commentUsers = res.data.users;
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    playUpdate(e) {
      let duration = e.detail.currentTime;
      this.playTimeUpdate(duration);
    },
    playTimeUpdate(duration) {
      if (duration - this.playDuration >= 10) {
        this.playDuration = duration;
        this.$api.Course.VideoRecord(this.video.id, {
          duration: this.playDuration,
        }).then(() => {
          // todo
        });
      }
    },
    resetComments() {
      this.comment.content = "";
      this.comments = [];
      this.commentUsers = [];
    },
    download(id) {
      let token = Utils.getToken();
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      window.open(
        `${this.config.url}/api/v2/course/attach/${id}/download?token=${token}`
      );
    },
    submitComment() {
      if (this.comment.content.length === 0) {
        return;
      }
      this.$api.Course.SubmitVideoComment(this.id, this.comment)
        .then(() => {
          this.$message.success("成功");
          this.resetComments();
          this.getComments();
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
  },
};
</script>
<style lang='less' scoped>
.content {
  width: 100%;
  .fix-nav {
    width: 100%;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 50;
    .tabs {
      width: 1200px;
      margin: 0 auto;
      height: 72px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      padding: 28px 30px;
      border-radius: 0px 0px 8px 8px;
      .item-tab {
        width: 64px;
        height: 16px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
        margin-right: 80px;
        cursor: pointer;
        position: relative;
        &.active {
          font-weight: 600;
          color: #3ca7fa;
        }
        .actline {
          width: 52px;
          height: 4px;
          background: #3ca7fa;
          position: absolute;
          left: 6px;
          top: 40px;
        }
      }
    }
  }
  .box {
    width: 1200px;
    margin: 0 auto;
    .nav {
      width: 100%;
      height: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      color: #999999;
      line-height: 14px;
      margin-top: 30px;
      margin-bottom: 30px;
      a {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        margin-right: 6px;
        &:not(:first-of-type) {
          margin-left: 6px;
        }
      }
      span {
        height: 14px;
        margin-left: 6px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }
    }
    .course-info {
      width: 1200px;
      height: 578px;
      background: #ffffff;
      border-radius: 8px;
      .video-box {
        width: 1200px;
        height: 506px;
        display: flex;
        flex-direction: row;
        .play-box {
          width: 900px;
          height: 506px;
          position: relative;
          .goCurrent {
            position: absolute;
            z-index: 2003;
            width: auto;
            height: auto;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 0px 4px 4px 0px;
            left: 0;
            bottom: 50px;
            display: flex;
            flex-direction: row;
            padding: 15px 20px;
            span {
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 22px;
              &.link {
                cursor: pointer;
                color: #3ca7fa;
                margin-left: 10px;
              }
            }
          }
          .iframe-player-box {
            width: 100%;
            height: 100%;
          }
          .alert-message {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: white;
            .subscribe-button {
              box-sizing: border-box;
              margin: 0 auto;
              width: 200px;
              padding: 15px 20px;
              text-align: center;
              font-size: 15px;
              font-weight: 400;
              border-radius: 4px;
              background-color: #ff5068;
              color: white;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }

            .subscribe-button2 {
              margin-top: 30px;
              font-size: 15px;
              font-weight: 400;
              color: #ff5068;
              line-height: 15px;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }

            .subscribe-info {
              margin-top: -30px;
              margin-bottom: 30px;
            }

            .next-page {
              box-sizing: border-box;
              margin: 0 auto;
              width: 152px;
              height: auto;
              padding: 10px 20px;
              margin-bottom: 20px;
              background: #3ca7fa;
              color: white;
              border-radius: 4px;
              cursor: pointer;
              text-align: center;
              &:hover {
                opacity: 0.8;
              }
            }

            .last-video {
              font-size: 15px;
              font-weight: 400;
              color: #ffffff;
              line-height: 15px;
            }
          }
        }
        .course-chapter-box {
          width: 300px;
          height: 506px;
          padding: 30px 10px 30px 30px;
          background: #ffffff;
          overflow-y: auto;
          .video-item {
            width: 100%;
            height: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;
            margin-top: 30px;
            cursor: pointer;
            overflow: hidden;
            &:first-child {
              margin-top: 0px;
            }
            .play-icon {
              width: 20px;
              height: 20px;
              cursor: pointer;
            }
            .video-title {
              width: 100%;
              height: 22px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 14px;
              margin-left: 10px;
              display: flex;
              flex-direction: row;
              align-items: center;
              .active {
                color: #3ca7fa;
              }
              .text {
                width: 173px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
              }
              .text2 {
                width: 222px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
              }
              .free {
                margin-left: 5px;
                width: 44px;
                height: 22px;
                background: #04c877;
                border-radius: 2px;
                color: #fff;
                font-size: 12px;
                font-weight: 400;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .video-duration {
              position: absolute;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              line-height: 14px;
              top: 5px;
              right: 0;
            }
          }
          .chapter-item {
            width: 100%;
            height: auto;
            margin-top: 50px;
            &:first-child {
              margin-top: 0px;
            }
            .chapter-name {
              width: 100%;
              height: 16px;
              font-size: 16px;
              font-weight: 500;
              color: #333333;
              line-height: 16px;
              margin-bottom: 30px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
              &:first-child {
                margin-bottom: 0px;
              }
              &:last-child {
                margin-bottom: 0px;
              }
            }
            .chapter-videos-box {
              width: 100%;
              height: auto;
              .video-item {
                width: 100%;
                height: 24px;
                display: flex;
                flex-direction: row;
                align-items: center;
                position: relative;
                cursor: pointer;
                margin-top: 30px;
                overflow: hidden;
                .play-icon {
                  width: 20px;
                  height: 20px;
                  cursor: pointer;
                }
                .video-title {
                  height: 22px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #333333;
                  line-height: 14px;
                  margin-left: 10px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  .active {
                    color: #3ca7fa;
                  }
                  .text {
                    width: 173px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  }
                  .text2 {
                    width: 222px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  }
                  .free {
                    margin-left: 5px;
                    width: 44px;
                    height: 22px;
                    background: #04c877;
                    border-radius: 2px;
                    color: #fff;
                    font-size: 12px;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                }
                .video-info {
                  position: absolute;
                  height: 24px;
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                  font-size: 14px;
                  font-weight: 400;
                  color: #999999;
                  line-height: 14px;
                  top: 0px;
                  right: 0;
                  .active-icon {
                    width: 22px;
                    height: 22px;
                    margin-right: 30px;
                  }
                }
              }
            }
          }
        }
      }

      .course-info-box {
        width: 1200px;
        height: 300px;
        box-sizing: border-box;
        padding: 30px 50px 30px 30px;
        position: relative;
        display: flex;
        flex-direction: row;
        .course-thumb {
          width: 320px;
          height: 240px;
          border-radius: 8px;
          margin-right: 50px;
          position: relative;
          img {
            width: 320px;
            height: 240px;
            border-radius: 8px;
          }
          .status {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: rgba(60, 167, 250);
            color: #fff;
            font-size: 14px;
            padding: 4px;
            border-radius: 4px;
          }
        }
        .info {
          width: 750px;
          height: 240px;
          position: relative;
          .course-info-title {
            width: 710px;
            height: 24px;
            font-size: 24px;
            font-weight: 500;
            color: #333333;
            line-height: 24px;
            margin-top: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .collect-button {
            width: 29px;
            height: 29px;
            position: absolute;
            right: 0;
            top: 15px;
            cursor: pointer;
          }
          .desc {
            margin-top: 20px;
            width: 750px;
            height: 120px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            overflow: hidden;
          }
          .buy-button {
            position: absolute;
            background: #ff5068;
            border-radius: 4px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 0;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
          .role-button {
            position: absolute;
            background: #e1a500;
            border-radius: 4px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 176px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
      .tabs {
        width: 1200px;
        height: 72px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        padding: 28px 30px;
        border-radius: 0px 0px 8px 8px;
        .item-tab {
          width: 64px;
          height: 16px;
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          margin-right: 80px;
          cursor: pointer;
          position: relative;
          &.active {
            font-weight: 600;
            color: #3ca7fa;
          }
          .actline {
            width: 52px;
            height: 4px;
            background: #3ca7fa;
            position: absolute;
            left: 6px;
            top: 40px;
          }
        }
      }
    }
    .course-teacher-box {
      width: 1200px;
      height: 270px;
      background: #ffffff;
      border-radius: 8px;
      margin-top: 30px;
      padding: 30px 50px;
      box-sizing: border-box;
      .teacher {
        width: auto;
        height: 80px;
        display: flex;
        align-items: center;
        flex-direction: row;
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-right: 20px;
        }
        a {
          width: 100%;
          height: 24px;
          font-size: 24px;
          font-weight: 600;
          color: #333333;
          line-height: 24px;
        }
      }
      .teacher-desc {
        margin-top: 26px;
        width: 100%;
        height: 64px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        line-height: 32px;
        overflow: hidden;
      }
    }
    .coursr-desc {
      padding: 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
    }

    .course-comments-box {
      width: 1200px;
      box-sizing: border-box;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      padding: 50px 30px 30px 30px;
      .comment-divider {
        width: 100%;
        height: 18px;
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        line-height: 18px;
      }
      .line {
        width: 100%;
        height: 1px;
        background: #e5e5e5;
        margin: 30px 0px;
      }
      .comment-top {
        box-sizing: border-box;
        width: 100%;
        padding: 0px 0px 0px 0px;
        display: flex;
        flex-direction: column;
        #page {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .comment-item {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin-bottom: 50px;
          &:last-child {
            margin-bottom: 0px;
          }
          .user-avatar {
            width: 48px;
            height: 48px;
            background: #d8d8d8;
            border-radius: 50%;
            margin-right: 30px;
            img {
              width: 48px;
              height: 48px;
              border-radius: 50%;
            }
          }
          .comment-content {
            width: 1062px;
            display: flex;
            flex-direction: column;
            .comment-info {
              margin-top: 3px;
              display: flex;
              flex-direction: row;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 14px;
              margin-bottom: 16px;
              .nickname {
                margin-right: 15px;
              }
            }
            .comment-text {
              width: 1062px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            }
          }
        }
      }

      .replybox {
        box-sizing: border-box;
        width: 100%;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 50px;
        .text {
          width: 100%;
          text-align: center;
          cursor: pointer;
          &:hover {
            color: #3ca7fa;
            text-decoration: underline;
          }
        }
        .reply {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          .user-avatar {
            width: 48px;
            height: 48px;
            background: #d8d8d8;
            border-radius: 50%;
            margin-right: 30px;
          }
          .reply-input {
            width: 960px;
            height: 48px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            padding-left: 10px;
            margin-right: 30px;
            outline: none;
          }
          .btn-submit {
            width: 72px;
            height: 48px;
            background: #cccccc;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
            &.active {
              background: #3ca7fa;
            }
          }
        }
      }
    }
    .attach-list-box {
      width: 1200px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 50px 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      .attach-item {
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 50px;
        &:first-child {
          margin-top: 0px;
        }
        .attach-name {
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
        }
        .download-attach {
          margin-left: 30px;
          width: 104px;
          height: 40px;
          background: #3ca7fa;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}

#meedu-player-container {
  width: 900px;
  height: 506px;
  float: left;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #e5e5e5;
}
::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 0px;
}
</style>