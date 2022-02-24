<template>
  <div class="content">
    <div class="navheader">
      <div class="top">
        <div
          class="top-left"
          @click="
            $router.push({
              name: 'bookDetail',
              query: { id: book.id },
            })
          "
        >
          <img
            v-if="book"
            class="icon-back"
            src="../../assets/img/commen/icon-back-h.png"
          />{{ book.name }}
        </div>
        <div class="top-right">
          <div class="button" @click="showIndex">{{ indexText }}</div>
          <div
            class="button"
            v-if="prevId !== 0"
            @click="switchArticle(prevId)"
          >
            上一节
          </div>
          <div
            class="button"
            v-if="nextId !== 0"
            @click="switchArticle2(nextId)"
          >
            下一节
          </div>
        </div>
      </div>
    </div>
    <div class="read-box">
      <div class="left-box" v-if="indexStaus">
        <div class="chapter-list-box">
          <template v-if="chapters.length > 0">
            <div
              class="chapter"
              v-for="chapterItem in chapters"
              :key="chapterItem.id"
            >
              <div class="title">{{ chapterItem.name }}</div>
              <div class="chapter-articles-box" v-if="articles[chapterItem.id]">
                <div
                  class="article-item"
                  :class="{ active: list.id === articleItem.id }"
                  v-for="articleItem in articles[chapterItem.id]"
                  :key="articleItem.id"
                  @click="goRead(articleItem)"
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
            <div class="chapter">
              <div class="chapter-articles-box">
                <div
                  class="article-item"
                  :class="{ active: list.id === articleItem.id }"
                  v-for="articleItem in articles[0]"
                  :key="articleItem.id"
                  @click="goRead(articleItem)"
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
      </div>
      <div class="right-box">
        <template v-if="loading">
          <skeletonBookDetail></skeletonBookDetail>
        </template>
        <template v-else-if="canSee">
          <div class="read" v-if="list">
            <div class="title">{{ list.title }}</div>
            <div class="line"></div>
            <div
              v-code
              v-html="list.render_content"
              class="u-content md-content"
            ></div>
          </div>
        </template>
        <template v-else-if="!canSee && isBuy === false">
          <div class="title">{{ list.title }}</div>
          <div class="buy-button" v-if="book.charge > 0" @click="buyBook()">
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
      </div>
    </div>
    <div class="book-comments-box">
      <div
        class="book-comments"
        :class="{
          active: this.indexStaus,
        }"
      >
        <div v-if="isLogin && canSee" class="replybox">
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
              发布
            </div>
          </div>
        </div>
        <div class="tit">全部评论</div>
        <div class="line"></div>
        <div class="comment-top">
          <template v-if="comment.list.length > 0">
            <div
              class="comment-item"
              v-for="(commentItem, index) in comment.list"
              :key="commentItem.id"
            >
              <div class="user-avatar">
                <img :src="commentItem.user.avatar" />
              </div>
              <div class="comment-content">
                <div class="comment-info">
                  <div class="nickname">
                    {{ commentItem.user.nick_name }}
                  </div>
                  <div class="comment-time">
                    {{ commentItem.created_at | changeTime }}
                  </div>
                </div>

                <div class="comment-text" v-html="commentItem.content"></div>
                <div class="reply-answer-box">
                  <div
                    :class="{ trans: configInput[index] === true }"
                    class="reply-answer"
                    v-if="canSee"
                    @click="showReply(index)"
                  >
                    回复
                  </div>
                  <div
                    class="reply-answer"
                    :class="{ trans: configkey[index] === true }"
                    @click="getAnswer(index, commentItem.id)"
                    v-if="commentItem.children_count !== 0"
                  >
                    {{ commentItem.children_count }}回复
                  </div>
                </div>
                <div
                  v-if="configInput[index] === true"
                  class="one-class-replybox"
                >
                  <input
                    type="text"
                    class="input-box"
                    v-model="reply.content"
                    :placeholder="'回复' + commentItem.user.nick_name"
                  />
                  <div
                    class="confirm-button"
                    @click="
                      ReplyAnswer(
                        commentItem.id,
                        commentItem.reply_id,
                        commentItem.user.nick_name,
                        index
                      )
                    "
                    :class="{ active: reply.content }"
                  >
                    发表回复
                  </div>
                </div>
                <div class="reply-list-box" v-if="configkey[index] === true">
                  <template v-if="replyAnswers.length > 0">
                    <div
                      class="reply-list-item"
                      v-for="(replyItem, index2) in replyAnswers[index]"
                      :key="index2"
                    >
                      <div class="reply-avatar">
                        <img
                          v-if="replyItem.user"
                          :src="replyItem.user.avatar"
                        />
                      </div>
                      <div class="reply-content">
                        <div class="top-info">
                          <div class="reply-nickname" v-if="replyItem.user">
                            {{ replyItem.user.nick_name }}
                            <template v-if="replyItem.reply != null">
                              回复：{{ replyItem.reply.user.nick_name }}
                            </template>
                          </div>
                          <div class="reply-nickname red" v-else>
                            用户不存在
                          </div>
                          <div class="reply-diff">
                            {{ replyItem.created_at | changeTime }}
                          </div>
                        </div>
                        <div class="reply-text">
                          <div v-html="replyItem.content"></div>
                        </div>
                        <div
                          v-if="canSee"
                          class="answer-item"
                          @click="showReply2(index2)"
                        >
                          回复
                        </div>
                        <div
                          v-if="configInput2[index2] === true"
                          class="Two-class-replybox"
                        >
                          <input
                            type="text"
                            class="input-box"
                            v-model="reply.content"
                            :placeholder="'回复' + replyItem.user.nick_name"
                          />
                          <div
                            class="confirm-button"
                            @click="
                              ReplyAnswer(
                                commentItem.id,
                                replyItem.id,
                                replyItem.user.nick_name,
                                index
                              )
                            "
                            :class="{ active: reply.content }"
                          >
                            发表回复
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
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
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import NavFooter from "../../components/footer.vue";
import None from "../../components/none.vue";
import PageBox from "../../components/page.vue";
import SkeletonBookDetail from "../../components/skeleton/skeletonBookDetail.vue";
export default {
  components: {
    NavFooter,
    None,
    SkeletonBookDetail,
    PageBox,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      indexStaus: false,
      indexText: "展开目录",
      list: [],
      articles: [],
      chapters: [],
      book: [],
      canSee: false,
      isBuy: false,
      prevId: null,
      nextId: null,
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
      reply: {
        content: null,
      },
      total: null,
      pagination: {
        page: 1,
        page_size: 10000,
        parent_id: null,
      },
      configkey: [],
      configInput: [],
      configInput2: [],
      replyAnswers: [],
      answerId: null,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  mounted() {
    this.getData();
    this.getComments();
  },
  methods: {
    clearData() {
      this.list = [];
      this.book = [];
      this.chapters = [];
      this.articles = [];
      this.isBuy = false;
      this.canSee = false;
      this.prevId = 0;
      this.nextId = 0;
    },
    goRead(item) {
      if (item.id === this.list.id) {
        return;
      }
      this.id = item.id;
      history.replaceState(
        null,
        null,
        document.location.href.split("?")[0] + "?id=" + item.id
      );
      this.getData();
      this.resetComments();
      this.getComments();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // this.$router.push({
      //   name: "bookRead",
      //   query: { id: item.id },
      // });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Book.ArticleRead(this.id).then((res) => {
        this.loading = false;
        this.list = res.data.article;
        document.title = res.data.article.title;
        this.book = res.data.book;
        this.chapters = res.data.chapters;
        this.articles = res.data.articles;
        this.isBuy = res.data.is_buy;
        this.canSee = res.data.can_see;
        this.prevId = parseInt(res.data.prev_id);
        this.nextId = parseInt(res.data.next_id);
        this.$nextTick(() => {
          // 公式渲染
          window.renderMathInElement(document.body, {
            tex: {
              // 行内公式标志
              inlineMath: [["$", "$"]],
              // 块级公式标志
              displayMath: [["$$", "$$"]],
              processEnvironments: true,
              processRefs: true,
            },
            options: {
              // 跳过渲染的标签
              skipHtmlTags: ["noscript", "style", "textarea", "pre", "code"],
              // 跳过mathjax处理的元素的类名，任何元素指定一个类 tex2jax_ignore 将被跳过，多个累=类名'class1|class2'
              ignoreHtmlClass: "tex2jax_ignore",
            },
            svg: {
              fontCache: "global",
            },
          });
        });
      });
    },
    showIndex() {
      if (!this.indexStaus) {
        this.indexText = "收起目录";
      } else {
        this.indexText = "展开目录";
      }
      this.indexStaus = !this.indexStaus;
    },
    switchArticle(articleId) {
      if (articleId === this.id) {
        return;
      }
      if (this.prevId === 0) {
        this.$message.error("没有上一节");
        return;
      }
      this.id = articleId;
      history.replaceState(
        null,
        null,
        document.location.href.split("?")[0] + "?id=" + articleId
      );
      this.getData();
      this.resetComments();
      this.getComments();
      document.body.scrollTop = document.documentElement.scrollTop = 0;

      // this.$router.push({
      //   name: "bookRead",
      //   query: { id: articleId },
      // });
    },
    switchArticle2(articleId) {
      if (articleId === this.id) {
        return;
      }
      if (this.nextId === 0) {
        this.$message.error("没有下一节");
        return;
      }
      this.id = articleId;
      history.replaceState(
        null,
        null,
        document.location.href.split("?")[0] + "?id=" + articleId
      );
      this.getData();
      this.replyAnswers = [];
      this.configkey = [];
      this.configInput = [];
      this.configInput2 = [];
      this.resetComments();
      this.getComments();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    buyBook() {
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
    showReply(index) {
      this.$set(this.configInput, index, !this.configInput[index]);
    },
    showReply2(index2) {
      this.$set(this.configInput2, index2, !this.configInput2[index2]);
    },
    getAnswer(index, id) {
      this.$set(this.configkey, index, !this.configkey[index]);
      this.pagination.parent_id = id;
      this.$api.Book.AnswerComments(this.id, this.pagination).then((res) => {
        this.$set(this.replyAnswers, index, res.data.data.data);
      });
    },
    getComments() {
      if (this.comment.loading) {
        return;
      }
      this.comment.loading = true;
      this.$api.Book.Comments(this.id, this.comment.pagination)
        .then((res) => {
          this.comment.loading = false;
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
      this.getComments();
    },
    resetComments() {
      this.comment.loading = false;
      this.comment.pagination.page = 1;
      this.comment.list = [];
      this.configkey = [];
      this.configInput = [];
      this.configInput2 = [];
      this.replyAnswers = [];
      this.comment.content = "";
      this.reply.content = "";
    },
    submitComment() {
      if (this.comment.content.length === 0) {
        return;
      }
      this.$api.Book.SubmitComment(this.id, {
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
    ReplyAnswer(parentId, id, nick_name, index) {
      if (!nick_name) {
        this.$message.error("回复的用户不存在");
        return;
      }
      this.answerId = id;
      this.$api.Book.SubmitComment(this.id, {
        parent_id: parentId,
        content: this.reply.content,
        reply_id: this.answerId,
      })
        .then((res) => {
          this.configInput = [];
          this.configInput2 = [];
          this.$message.success("回复成功");
          let item;
          if (this.answerId !== 0) {
            item = {
              id: res.data.comment_id,
              parent_id: parentId,
              content: this.reply.content,
              children_count: 0,
              reply: {
                user: { nick_name: nick_name },
              },
              created_at: "1秒前",
              user: {
                avatar: this.user.avatar,
                nick_name: this.user.nick_name,
              },
            };
          } else {
            item = {
              id: res.data.comment_id,
              parent_id: parentId,
              content: this.reply.content,
              children_count: 0,
              reply_comment: null,
              created_at: "1秒前",
              user: {
                avatar: this.user.avatar,
                nick_name: this.user.nick_name,
              },
            };
          }
          let old;
          if (this.replyAnswers[index]) {
            old = this.replyAnswers[index];
            old.unshift(item);
          } else {
            old = [];
          }
          this.$set(this.replyAnswers, index, old);
          this.comment.list[index].children_count =
            this.comment.list[index].children_count + 1;
          this.reply.content = "";
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
  .navheader {
    top: 0;
    position: sticky;
    width: 100%;
    height: 70px;
    background: #ffffff;
    z-index: 20;
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
      justify-content: space-between;
      .top-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        .icon-back {
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
      }
      .top-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        .button {
          width: 104px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          &:hover {
            opacity: 0.8;
          }
          &:not(:last-child) {
            margin-right: 30px;
          }
        }
      }
    }
  }
  .read-box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 30px;
    box-sizing: border-box;
    position: relative;
    .left-box {
      position: relative;
      width: 304px;
      height: auto;
      margin-right: 30px;
      .chapter-list-box {
        position: fixed;
        width: 304px;
        max-height: 582px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        z-index: 10;
        .chapter {
          width: 100%;
          &:not(:last-child) {
            margin-bottom: 50px;
          }
          .title {
            width: 100%;
            height: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 16px;
            margin-bottom: 26px;
          }
          .chapter-articles-box {
            width: 100%;
            height: auto;
            .article-item {
              width: 100%;
              height: 22px;
              display: flex;
              flex-direction: row;
              align-items: center;
              position: relative;
              cursor: pointer;
              margin-bottom: 26px;
              &:hover .video-title .text {
                color: #3ca7fa;
              }
              &.active .video-title .text {
                color: #3ca7fa;
              }
              &:last-child {
                margin-bottom: 0px;
              }
              .video-title {
                height: 22px;
                display: flex;
                align-items: center;
                .text {
                  display: block;
                  width: 200px;
                  height: 14px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #333333;
                  line-height: 14px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
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
                }
              }
            }
          }
        }
      }
    }
    .right-box {
      width: 866px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 30px;
      .read {
        width: 100%;
        height: auto;
        float: left;
        .title {
          display: block;
          width: 100%;
          height: auto;
          font-size: 30px;
          font-weight: 600;
          color: #333333;
          line-height: 48px;
          margin-bottom: 30px;
        }
        .line {
          width: 100%;
          height: 1px;
          background: #e5e5e5;
          margin-bottom: 30px;
        }
        .u-content {
          width: 100%;
          font-size: 16px;
          font-weight: 400;
          color: #121212;
          line-height: 28px;
          p {
            font-size: 16px;
            font-weight: 400;
            color: #121212;
            line-height: 28px;
          }
        }
      }
      .buy-button {
        width: 440px;
        height: 56px;
        margin: 0 auto;
        background: #ff5068;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 50px;
        margin-top: 150px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
      .role-button {
        width: 440px;
        height: 56px;
        margin: 0 auto;
        background: #e1a500;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 50px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .book-comments-box {
    width: 1200px;
    margin: 0 auto;
    .book-comments {
      width: 866px;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 30px 0px 30px 0px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      &.active {
        margin-left: 334px;
      }
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
      .line {
        width: 806px;
        height: 1px;
        background: #e5e5e5;
        margin: 0 auto;
        margin-bottom: 30px;
      }
      #page {
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
            width: 728px;
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
              width: 728px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            }
            .reply-answer-box {
              width: 728px;
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
              width: 728px;
              height: 48px;
              margin-top: 30px;
              display: flex;
              flex-direction: row;
              align-items: center;
              .input-box {
                width: 614px;
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
              width: 728px;
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
                  width: 610px;
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
                  width: 610px;
                  float: left;
                  font-size: 14px;
                  font-weight: 400;
                  color: #333333;
                  line-height: 14px;
                }
                .answer-item {
                  margin-top: 15px;
                  width: 610px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #999999;
                  cursor: pointer;
                }
                .Two-class-replybox {
                  width: 610px;
                  height: 48px;
                  margin-top: 30px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  .input-box {
                    width: 496px;
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
        padding: 20px 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 30px;
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
            width: 614px;
            height: 48px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            padding-left: 10px;
            margin-right: 30px;
            outline: none;
            outline: none;
          }
          .btn-submit {
            width: 104px;
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
