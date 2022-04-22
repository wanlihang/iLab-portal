<template>
  <div class="content">
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
    <div class="box">
      <template v-if="loading">
        <skeletonDetail></skeletonDetail>
      </template>
      <template v-else-if="course">
        <historyRecord
          :id="course.id"
          :title="course.title"
          type="live"
        ></historyRecord>
        <div class="nav">
          <a @click="$router.push({ name: 'index' })">首页</a> /
          <a @click="$router.push({ name: 'live' })">直播课</a> /
          <span>{{ course.title }}</span>
        </div>
        <div class="course-info">
          <div class="course-info-box">
            <div class="course-thumb">
              <thumb-bar
                :value="course.thumb"
                :width="320"
                :height="240"
              ></thumb-bar>
              <div class="status">
                <span>{{ course.status_text }}</span>
              </div>
            </div>
            <div class="info">
              <div class="course-info-title">{{ course.title }}</div>
              <div
                class="collect-button"
                :class="{ active: isLike }"
                @click="likeHit"
              >
                <img
                  v-if="isLike"
                  class="like-icon"
                  src="../../../assets/img/commen/icon-collect-h.png"
                />
                <img
                  v-else
                  class="like-icon"
                  src="../../../assets/img/commen/icon-collect-n.png"
                />
              </div>
              <p class="desc">{{ course.short_description }}</p>
              <div class="btn-box">
                <template v-if="!isBuy && course.charge !== 0">
                  <template v-if="msData && msData.data">
                    <div
                      class="buy-button"
                      @click="goMsOrder(msData.order.id)"
                      v-if="msData.order && msData.order.status === 0"
                    >
                      已获得秒杀资格，请尽快支付
                    </div>
                    <div
                      class="buy-button"
                      v-else-if="!msData.data.is_over"
                      @click="openMsDialog()"
                    >
                      立即秒杀￥{{ msData.data.charge }}
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="buy-button"
                      v-if="course.charge > 0"
                      @click="buyCourse()"
                    >
                      订阅直播￥{{ course.charge }}
                    </div>
                    <div
                      class="role-button"
                      v-if="course.vip_can_view === 1"
                      @click="goRole()"
                    >
                      会员免费看
                    </div>
                  </template>
                  <template
                    v-if="
                      tgData &&
                        tgData.goods &&
                        (!tgData.join_item || tgData.join_item.length === 0)
                    "
                  >
                    <div class="role-button" @click="goPay(0)">
                      单独开团￥{{ tgData.goods.charge }}
                    </div>
                  </template>
                </template>
                <template v-if="course.charge === 0">
                  <div class="has-button">本课程免费</div>
                </template>
                <template v-if="course.charge !== 0 && isBuy">
                  <div class="has-button">课程已购买</div>
                </template>
              </div>
            </div>
          </div>
          <template v-if="!isBuy && msData">
            <miaosha-list
              :ms="msData"
              :status="msDialogStatus"
              @cancel="closeMsDialog"
            ></miaosha-list>
          </template>
          <template v-if="!isBuy && tgData">
            <tuangou-list :tg="tgData"></tuangou-list>
          </template>
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
        <div class="course-teacher-box" v-if="course" v-show="currentTab === 2">
          <div class="teacher" v-if="course.teacher">
            <img class="avatar" :src="course.teacher.avatar" />
            <a>{{ course.teacher.name }}</a>
          </div>
          <p class="teacher-desc">
            {{ course.teacher.short_desc }}
          </p>
        </div>
        <div class="coursr-desc" v-if="course" v-show="currentTab === 2">
          <div class="new-content" v-html="course.render_desc"></div>
        </div>
        <div class="course-chapter-box" v-show="currentTab === 3">
          <template v-if="chapters.length > 0">
            <div
              class="chapter-item"
              v-for="chapter in chapters"
              :key="chapter.id"
            >
              <div class="chapter-name">{{ chapter.name }}</div>
              <div class="chapter-videos-box">
                <div
                  class="video-item"
                  @click="goPlay(video)"
                  v-for="video in chapter.videos"
                  :key="video.id"
                >
                  <img
                    v-if="isBuy"
                    class="play-icon"
                    src="../../../assets/img/commen/icon-unlock.png"
                  />
                  <img
                    class="play-icon"
                    v-else
                    src="../../../assets/img/commen/icon-lock.png"
                  />
                  <div class="video-title">
                    <span class="text">{{ video.title }}</span>
                  </div>
                  <div class="video-info">
                    <template v-if="video.status === 0">
                      <span style="color: #3ca7fa">{{
                        video.published_at | dateFormat
                      }}</span>
                    </template>
                    <template v-else-if="video.status === 1">
                      <span style="color: #04c877">直播中</span>
                    </template>
                    <template v-else-if="video.status === 2">
                      <span>已结束 </span>
                      <duration
                        v-if="video.duration !== 0"
                        :seconds="video.duration"
                      ></duration>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <template v-if="videos[0] && videos[0].length > 0">
              <div class="chapter-item">
                <div class="chapter-name">无章节内容</div>
                <div class="chapter-videos-box">
                  <div
                    class="video-item"
                    @click="goPlay(video)"
                    v-for="video in videos[0]"
                    :key="video.id"
                  >
                    <img
                      v-if="isBuy"
                      class="play-icon"
                      src="../../../assets/img/commen/icon-unlock.png"
                    />
                    <img
                      class="play-icon"
                      v-else
                      src="../../../assets/img/commen/icon-lock.png"
                    />
                    <div class="video-title">
                      <span class="text">{{ video.title }}</span>
                    </div>
                    <div class="video-info">
                      <template v-if="video.status === 0">
                        <span style="color: #3ca7fa">{{
                          video.published_at | dateFormat
                        }}</span>
                      </template>
                      <template v-else-if="video.status === 1">
                        <span style="color: #04c877">直播中</span>
                      </template>
                      <template v-else-if="video.status === 2">
                        <span>已结束 </span>
                        <duration
                          v-if="video.duration !== 0"
                          :seconds="video.duration"
                        ></duration>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="chapter-item">
              <div class="chapter-videos-box active">
                <div
                  class="video-item"
                  @click="goPlay(video)"
                  v-for="video in videos[0]"
                  :key="video.id"
                >
                  <img
                    v-if="isBuy"
                    class="play-icon"
                    src="../../../assets/img/commen/icon-unlock.png"
                  />
                  <img
                    class="play-icon"
                    v-else
                    src="../../../assets/img/commen/icon-lock.png"
                  />
                  <div class="video-title">
                    <span class="text">{{ video.title }}</span>
                  </div>
                  <div class="video-info">
                    <template v-if="video.status === 0">
                      <span style="color: #3ca7fa">{{
                        video.published_at | dateFormat
                      }}</span>
                    </template>
                    <template v-else-if="video.status === 1">
                      <span style="color: #04c877">直播中</span>
                    </template>
                    <template v-else-if="video.status === 2">
                      <span>已结束 </span>
                      <duration
                        v-if="video.duration !== 0"
                        :seconds="video.duration"
                      ></duration>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="course-comments-box" v-show="currentTab === 4">
          <div class="comment-divider">全部评论</div>
          <div class="line"></div>
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
          <div class="comment-top">
            <template v-if="comment.list.length > 0">
              <div
                class="comment-item"
                v-for="commentItem in comment.list"
                :key="commentItem.id"
              >
                <div class="user-avatar">
                  <img :src="comment.users[commentItem.user_id].avatar" />
                </div>
                <div class="comment-content">
                  <div class="comment-info">
                    <div class="nickname">
                      {{ comment.users[commentItem.user_id].nick_name }}
                    </div>
                    <div class="comment-time">
                      {{ commentItem.created_at | changeTime }}
                    </div>
                  </div>

                  <div class="comment-text" v-html="commentItem.content"></div>
                </div>
              </div>
            </template>
            <none v-else type="white"></none>
          </div>
          <div id="page" v-show="comment.list.length > 0 && total > 20">
            <page-box
              :key="comment.pagination.page"
              :page="comment.pagination.page"
              :totals="total"
              @current-change="changepage"
              :pageSize="comment.pagination.size"
              :tab="false"
            ></page-box>
          </div>
        </div>
      </template>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../../components/footer.vue";
import Duration from "../../../components/duration.vue";
import PageBox from "../../../components/page.vue";
import None from "../../../components/none.vue";
import HistoryRecord from "../../../components/history-record.vue";
import SkeletonDetail from "../../../components/skeleton/skeletonDetail.vue";
import TuangouList from "../../../components/tuangou-list.vue";
import MiaoshaList from "../../../components/miaosha-list.vue";

export default {
  components: {
    NavFooter,
    Duration,
    PageBox,
    None,
    HistoryRecord,
    SkeletonDetail,
    TuangouList,
    MiaoshaList,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      isLike: false,
      course: null,
      currentTab: 2,
      total: null,
      chapters: [],
      videos: [],
      tabs: [
        {
          name: "直播详情",
          id: 2,
        },
        {
          name: "直播排课",
          id: 3,
        },
        {
          name: "课程评论",
          id: 4,
        },
      ],
      isBuy: false,
      comment: {
        list: [],
        users: {},
        content: "",
        loading: false,
        pagination: {
          page: 1,
          size: 20,
        },
      },
      isfixTab: false,
      tgData: null,
      msData: null,
      msDialogStatus: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "configFunc"]),
  },
  mounted() {
    window.addEventListener("scroll", this.handleTabFix, true);
    this.getDetail();
    this.getComments();
    this.getLikeStatus();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleTabFix, true);
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goPay(gid = 0) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "tg",
          goods_charge: this.tgData.goods.charge,
          goods_label: "团购",
          goods_name: this.tgData.goods.goods_title,
          goods_id: this.tgData.goods.id,
          goods_thumb: this.tgData.goods.goods_thumb,
          tg_gid: gid,
          course_id: this.tgData.goods.other_id,
          course_type: this.tgData.goods.goods_type,
        },
      });
    },
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    getLikeStatus() {
      this.$api.TemplateOne.LikeStatus({
        id: this.id,
        type: "live",
      }).then((res) => {
        this.isLike = res.data.like;
      });
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
    likeHit() {
      if (this.isLogin) {
        this.$api.TemplateOne.LikeHit({
          id: this.id,
          type: "live",
        }).then((res) => {
          this.isLike = !this.isLike;
          if (this.isLike) {
            this.$message.success("已收藏");
          } else {
            this.$message.success("取消收藏");
          }
        });
      } else {
        this.goLogin();
      }
    },
    tabChange(key) {
      this.currentTab = key;
    },
    buyCourse() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "live",
          goods_charge: this.course.charge,
          goods_label: "直播课程",
          goods_name: this.course.title,
          goods_id: this.course.id,
          goods_thumb: this.course.thumb,
        },
      });
    },
    goRole() {
      this.$router.push({
        name: "vip",
      });
    },
    goPlay(item) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      // if (item.status === 0) {
      //   this.$message.error("直播未开始");
      //   return;
      // }
      if (this.isBuy === false) {
        this.$message.error("请购买课程后观看");
        return;
      }
      if (item.status === 2 && item.duration === 0) {
        return;
      }
      this.$router.push({
        name: "liveVideo",
        query: {
          id: item.id,
        },
      });
    },
    getDetail() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Live.Detail(this.id)
        .then((res) => {
          this.loading = false;
          this.course = res.data.course;
          this.chapters = res.data.chapters;
          this.videos = res.data.videos;
          this.isBuy = res.data.is_buy;
          document.title = res.data.course.title;
          //获取秒杀信息
          if (!this.isBuy && this.configFunc["miaosha"]) {
            this.getMsDetail();
          }
          //获取团购信息
          else if (!this.isBuy && this.configFunc["tuangou"]) {
            this.getTgDetail();
          }
        })
        .catch((e) => {
          this.$message.error("获取课程失败");
        });
    },
    getTgDetail() {
      if (this.course.charge === 0) {
        return;
      }
      this.$api.TuanGou.Detail(0, {
        course_id: this.id,
        course_type: "live",
      }).then((res) => {
        this.tgData = res.data;
      });
    },
    getMsDetail() {
      if (this.course.charge === 0) {
        return;
      }
      this.$api.MiaoSha.Detail(0, {
        course_id: this.id,
        course_type: "live",
      }).then((res) => {
        this.msData = res.data;
        if (!this.msData.data && !this.isBuy && this.configFunc["tuangou"]) {
          this.getTgDetail();
        }
      });
    },
    goMsOrder(id) {
      this.$router.push({
        name: "order",
        query: {
          course_id: this.msData.data.goods_id,
          course_type: this.msData.data.goods_type,
          goods_type: "ms",
          goods_charge: this.msData.data.charge,
          goods_label: "秒杀",
          goods_name: this.msData.data.goods_title,
          goods_id: id,
          goods_thumb: this.msData.data.goods_thumb,
        },
      });
    },
    openMsDialog() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.msDialogStatus = true;
    },
    closeMsDialog() {
      this.msDialogStatus = false;
    },
    getComments() {
      if (this.comment.loading) {
        return;
      }
      this.comment.loading = true;
      this.$api.Live.Comments(this.id, this.comment.pagination)
        .then((res) => {
          let users = res.data.users;
          for (let key in users) {
            this.comment.users[key] = users[key];
          }

          let list = res.data.data.data;
          if (list.length > 0) {
            this.comment.list = list;
          }
          this.total = res.data.data.total;
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    changepage(item) {
      this.comment.pagination.size = 20;
      this.comment.pagination.page = item.currentPage;
      this.submitComment();
    },
    resetComments() {
      this.comment.loading = false;
      this.comment.pagination.page = 1;
      this.comment.list = [];
      this.comment.content = "";
    },
    submitComment() {
      if (this.comment.content.length === 0) {
        return;
      }
      this.$api.Live.SubmitComment(this.id, {
        content: this.comment.content,
      })
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
<style lang="less" scoped>
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
      height: auto;
      background: #ffffff;
      border-radius: 8px;
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
          overflow: hidden;
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
            height: 30px;
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
            top: 18px;
            cursor: pointer;
          }
          .desc {
            margin-top: 14px;
            width: 750px;
            height: 90px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            overflow: hidden;
          }
          .btn-box {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: auto;
            float: left;
            display: flex;
            flex-direction: row;
            .has-button {
              background: #f4fafe;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #999999;
              line-height: 16px;
              box-sizing: border-box;
              cursor: pointer;
            }
            .buy-button {
              background: #ff5068;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              box-sizing: border-box;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
            .role-button {
              background: #e1a500;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              box-sizing: border-box;
              margin-left: 20px;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
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
      background: #ffffff;
      border-radius: 8px;
      margin-top: 30px;
      padding: 50px 30px;
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
      font-size: 16px;
      font-weight: 400;
      color: #121212;
      line-height: 28px;
    }
    .course-chapter-box {
      width: 1200px;
      padding: 50px 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
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
          margin-top: 30px;
          &.active {
            margin-top: 0px;
          }
          .video-item {
            width: 100%;
            height: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;
            margin-bottom: 30px;
            cursor: pointer;
            &:last-child {
              margin-bottom: 0px;
            }
            .play-icon {
              width: 24px;
              height: 24px;
              cursor: pointer;
            }
            .video-title {
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 14px;
              margin-left: 15px;
            }
            .video-info {
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
        }
      }
    }
    .course-comments-box {
      width: 1200px;
      box-sizing: border-box;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      padding: 30px;
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
      #page {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .comment-top {
        box-sizing: border-box;
        width: 100%;
        padding: 0;
        display: flex;
        flex-direction: column;

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
  }
}
</style>
