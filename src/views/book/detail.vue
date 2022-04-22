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
      <template v-else-if="book">
        <historyRecord
          :id="book.id"
          :title="book.name"
          type="book"
        ></historyRecord>
        <div class="nav">
          <a @click="$router.push({ name: 'index' })">首页</a> /
          <a @click="$router.push({ name: 'book' })">电子书</a> /
          <span>{{ book.name }}</span>
        </div>
        <div class="book-info">
          <div class="book-info-box">
            <div class="book-thumb">
              <thumb-bar
                :value="book.thumb"
                :width="240"
                :height="320"
              ></thumb-bar>
            </div>
            <div class="info">
              <div class="book-info-title">{{ book.name }}</div>
              <div
                class="collect-button"
                :class="{ active: isLike }"
                @click="likeHit"
              >
                <img
                  v-if="isLike"
                  class="like-icon"
                  src="../../assets/img/commen/icon-collect-h.png"
                />
                <img
                  v-else
                  class="like-icon"
                  src="../../assets/img/commen/icon-collect-n.png"
                />
              </div>
              <p class="desc">{{ book.short_desc }}</p>
              <div class="btn-box">
                <template v-if="isBuy">
                  <div class="see-button" @click="startLearn">开始阅读</div>
                </template>
                <template v-else>
                  <template v-if="msData && msData.data">
                    <div
                      class="buy-button"
                      @click="goMsOrder(msData.order.id)"
                      v-if="
                        book.charge > 0 &&
                        msData.order &&
                        msData.order.status === 0
                      "
                    >
                      已获得秒杀资格，请尽快支付
                    </div>
                    <div
                      class="buy-button"
                      v-else-if="book.charge > 0 && !msData.data.is_over"
                      @click="openMsDialog()"
                    >
                      立即秒杀￥{{ msData.data.charge }}
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="buy-button"
                      v-if="book.charge > 0"
                      @click="buyBook()"
                    >
                      订阅电子书￥{{ book.charge }}
                    </div>
                    <div
                      class="role-button"
                      v-if="book.charge > 0 && book.is_vip_free === 1"
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
        <div class="book-desc" v-if="book" v-show="currentTab === 2">
          <div class="new-content" v-html="book.render_desc"></div>
        </div>
        <div class="book-chapter-box" v-show="currentTab === 3">
          <template v-if="chapters.length > 0">
            <div
              class="chapter-item"
              v-for="chapter in chapters"
              :key="chapter.id"
            >
              <div class="chapter-name">{{ chapter.name }}</div>
              <div class="chapter-videos-box" v-if="articles[chapter.id]">
                <div
                  class="book-item"
                  @click="goRead(articleItem)"
                  v-for="articleItem in articles[chapter.id]"
                  :key="articleItem.id"
                >
                  <div class="video-title">
                    <div class="text">{{ articleItem.title }}</div>
                    <div
                      class="free"
                      v-if="
                        !isBuy && book.charge > 0 && articleItem.charge === 0
                      "
                    >
                      试读
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="chapter-item">
              <div class="chapter-videos-box">
                <div
                  class="book-itemsp"
                  @click="goRead(articleItem)"
                  v-for="articleItem in articles[0]"
                  :key="articleItem.id"
                >
                  <div class="video-title">
                    <div class="text">{{ articleItem.title }}</div>
                    <div
                      class="free"
                      v-if="
                        !isBuy && book.charge > 0 && articleItem.charge === 0
                      "
                    >
                      试读
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="book-comments-box" v-show="currentTab === 4">
          <div class="tit">全部评论</div>
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

                  <div class="comment-text" v-html="comment.content"></div>
                </div>
              </div>
            </template>
            <none v-else type="white"></none>
          </div>
          <div id="page" v-show="comments.length > 0 && total > 20">
            <page-box
              :key="pagination.page"
              :page="pagination.page"
              :totals="total"
              @current-change="changepage"
              :pageSize="pagination.size"
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
import NavFooter from "../../components/footer.vue";
import None from "../../components/none.vue";
import PageBox from "../../components/page.vue";
import HistoryRecord from "../../components/history-record.vue";
import SkeletonDetail from "../../components/skeleton/skeletonDetail.vue";
import TuangouList from "../../components/tuangou-list.vue";
import MiaoshaList from "../../components/miaosha-list.vue";

export default {
  components: {
    NavFooter,
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
      articles: [],
      book: [],
      currentTab: 2,
      total: null,
      chapters: [],
      tabs: [
        {
          name: "详情",
          id: 2,
        },
        {
          name: "目录",
          id: 3,
        },
        {
          name: "评论",
          id: 4,
        },
      ],
      isBuy: false,
      comments: [],
      commentUsers: {},
      pagination: {
        page: 1,
        size: 20,
      },
      comment: {
        loading: false,
        content: "",
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
        type: "book",
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
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$api.TemplateOne.LikeHit({
        id: this.id,
        type: "book",
      }).then((res) => {
        this.isLike = !this.isLike;
        if (this.isLike) {
          this.$message.success("已收藏");
        } else {
          this.$message.success("取消收藏");
        }
      });
    },
    tabChange(key) {
      this.currentTab = key;
    },
    buyBook() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "book",
          goods_charge: this.book.charge,
          goods_label: "电子书",
          goods_name: this.book.name,
          goods_id: this.book.id,
          goods_thumb: this.book.thumb,
        },
      });
    },
    goRole() {
      this.$router.push({
        name: "vip",
      });
    },
    startLearn() {
      if (this.articles.length === 0) {
        this.$message.error("当前电子书下暂无文章");
        return;
      }

      let article = null;
      if (this.chapters.length === 0) {
        // 无章节电子书
        article = this.articles[0][0];
      } else {
        for (let i = 0; i < this.chapters.length; i++) {
          article = this.articles[this.chapters[i].id][0];
          if (article) {
            break;
          }
        }
      }

      if (!article) {
        this.$message.error("当前电子书下暂无文章");
        return;
      }

      this.goRead(article);
    },
    goRead(item) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (this.book.charge > 0 && item.charge > 0 && this.isBuy === false) {
        this.buyBook();
        return;
      }
      this.$router.push({
        name: "bookRead",
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
      this.$api.Book.Detail(this.id).then((res) => {
        this.loading = false;
        this.book = res.data.book;
        this.chapters = res.data.chapters;
        this.articles = res.data.articles;
        this.isBuy = res.data.is_buy;
        document.title = res.data.book.name;
        //获取秒杀信息
        if (!this.isBuy && this.configFunc["miaosha"]) {
          this.getMsDetail();
        }
        //获取团购信息
        else if (!this.isBuy && this.configFunc["tuangou"]) {
          this.getTgDetail();
        }
      });
    },
    getTgDetail() {
      if (this.book.charge === 0) {
        return;
      }
      this.$api.TuanGou.Detail(0, {
        course_id: this.id,
        course_type: "book",
      }).then((res) => {
        this.tgData = res.data;
      });
    },
    getMsDetail() {
      if (this.book.charge === 0) {
        return;
      }
      this.$api.MiaoSha.Detail(0, {
        course_id: this.id,
        course_type: "book",
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
      this.$api.Book.BookComments(this.id, this.pagination)
        .then((res) => {
          this.comment.loading = false;
          this.comments = res.data.data.data;
          this.commentUsers = res.data.users;
          this.total = res.data.data.total;
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    changepage(item) {
      this.pagination.size = 20;
      this.pagination.page = item.currentPage;
      this.getComments();
    },
    resetComments() {
      this.comment.loading = false;
      this.pagination.page = 1;
      this.comment.content = "";
      this.comments = [];
      this.commentUsers = [];
    },
    submitComment() {
      if (this.comment.content.length === 0) {
        return;
      }
      this.$api.Book.SubmitBookComment(this.id, {
        content: this.comment.content,
      })
        .then(() => {
          this.$message.success("评论成功");
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
        text-align: center;
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
    .book-info {
      width: 1200px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      .book-info-box {
        width: 1200px;
        height: 380px;
        box-sizing: border-box;
        padding: 30px;
        position: relative;
        display: flex;
        flex-direction: row;
        .book-thumb {
          width: 240px;
          height: 320px;
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
          width: 850px;
          height: 320px;
          position: relative;
          .book-info-title {
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
            width: 850px;
            height: 174px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            overflow: hidden;
            p {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 6;
              overflow: hidden;
            }
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
            .see-button {
              background: #3ca7fa;
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
          margin-right: 70px;
          text-align: center;
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
    .book-desc {
      padding: 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 400;
      color: #121212;
      line-height: 28px;
    }
    .book-chapter-box {
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
          margin-top: 30px;
          &:first-child {
            margin-top: 0px;
            margin-bottom: 0px;
          }
          &:last-child {
            margin-bottom: 0px;
          }
        }
        .chapter-videos-box {
          width: 100%;
          height: auto;
          .book-itemsp {
            width: 100%;
            height: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;
            cursor: pointer;
            margin-bottom: 30px;
            &:last-child {
              margin-bottom: 0px;
            }
            .video-title {
              height: 22px;
              display: flex;
              align-items: center;
              .text {
                display: block;
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                line-height: 14px;
              }
              .free {
                width: 44px;
                height: 22px;
                background: #04c877;
                border-radius: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 400;
                color: #ffffff;
                margin-left: 15px;
              }
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
          .book-item {
            width: 100%;
            height: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;
            cursor: pointer;
            margin-top: 30px;
            .video-title {
              height: 22px;
              display: flex;
              align-items: center;
              .text {
                display: block;
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                line-height: 14px;
              }
              .free {
                width: 44px;
                height: 22px;
                background: #04c877;
                border-radius: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 400;
                color: #ffffff;
                margin-left: 15px;
              }
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
    .book-comments-box {
      display: block;
      width: 1200px;
      height: auto;
      box-sizing: border-box;
      padding: 30px 0px 30px 0px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      .tit {
        widows: 100%;
        padding-left: 30px;
        height: 18px;
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        line-height: 18px;
        margin-bottom: 30px;
      }
      #page {
        display: block;
        width: 100%;
        margin: 0 auto;
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
      .comment-top {
        box-sizing: border-box;
        widows: 100%;
        padding: 0px 30px 0px 30px;
        display: flex;
        flex-direction: column;
        .comment-item {
          widows: 100%;
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
            .reply-answer-box {
              width: 1062px;
              display: flex;
              flex-direction: row;
              .reply-answer {
                margin-top: 15px;
                font-size: 14px;
                font-weight: 400;
                color: #999999;
                cursor: pointer;
                margin-right: 30px;
                &.trans {
                  color: #3ca7fa;
                }
              }
            }
            .one-class-replybox {
              width: 1062px;
              height: 48px;
              margin-top: 30px;
              display: flex;
              flex-direction: row;
              align-items: center;
              .input-box {
                width: 948px;
                height: 48px;
                border-radius: 4px;
                border: 1px solid #cccccc;
                padding-left: 15px;
                outline: none;
                margin-right: 10px;
              }
              .confirm-button {
                width: 104px;
                height: 48px;
                background: #cccccc;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
                font-weight: 400;
                &:hover {
                  opacity: 0.8;
                }
                &.active {
                  background: #3ca7fa;
                }
              }
            }
            .reply-list-box {
              width: 1062px;
              height: auto;
              background: #f4fafe;
              box-sizing: border-box;
              margin-top: 15px;
              padding: 0px 20px 20px 20px;
              display: flex;
              flex-direction: column;
              .reply-list-item {
                position: relative;
                width: 100%;
                height: auto;
                float: left;
                display: flex;
                flex-direction: row;
                margin-top: 30px;
                &:last-child {
                  margin-top: 20px;
                }
                .reply-avatar {
                  width: 48px;
                  height: 48px;
                  background: #d8d8d8;
                  margin-right: 30px;
                  border-radius: 50%;
                  img {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                  }
                }
                .reply-content {
                  width: 944px;
                  display: flex;
                  flex-direction: column;
                  position: relative;
                  .top-info {
                    width: 100%;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    flex-direction: row;
                    margin-bottom: 15px;
                    .reply-nickname {
                      height: 14px;
                      font-size: 14px;
                      font-weight: 400;
                      color: #666666;
                      line-height: 14px;
                      margin-right: 15px;
                      &.red {
                        color: #ff5858;
                      }
                    }
                    .reply-diff {
                      height: 12px;
                      font-size: 12px;
                      font-weight: 400;
                      color: #666666;
                      line-height: 12px;
                    }
                  }
                }
                .reply-text {
                  width: 944px;
                  float: left;
                  font-size: 14px;
                  font-weight: 400;
                  color: #333333;
                  line-height: 14px;
                }
                .answer-item {
                  margin-top: 15px;
                  width: 944px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #999999;
                  cursor: pointer;
                }
                .Two-class-replybox {
                  width: 944px;
                  height: 48px;
                  margin-top: 30px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  .input-box {
                    width: 820px;
                    height: 48px;
                    border-radius: 4px;
                    border: 1px solid #cccccc;
                    padding-left: 15px;
                    outline: none;
                    margin-right: 10px;
                  }
                  .confirm-button {
                    width: 104px;
                    height: 48px;
                    background: #cccccc;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 400;
                    &.active {
                      background: #3ca7fa;
                    }
                  }
                }
              }
            }
          }
        }
      }

      .replybox {
        box-sizing: border-box;
        widows: 100%;
        height: 88px;
        border-top: 1px solid #f4fafe;
        padding: 20px 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 50px;
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
