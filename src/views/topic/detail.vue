<template>
  <div class="content">
    <div class="box">
      <div class="topic-box">
        <div class="nav">
          <a @click="$router.push({ name: 'index' })">首页</a> /
          <a @click="$router.push({ name: 'topic' })">图文</a> /
          <span>{{ topic.title }}</span>
        </div>
        <template v-if="loading">
          <skeletonTopicDetail></skeletonTopicDetail>
        </template>
        <div class="topic" v-else-if="topic">
          <historyRecord
            :id="topic.id"
            :title="topic.title"
            type="topic"
          ></historyRecord>
          <div class="topic-title">{{ topic.title }}</div>
          <div class="topic-stat">
            <span class="div-times">{{ topic.created_at | changeTime }}</span>
            <span class="div-times">{{ topic.view_times }}次阅读</span>
            <span class="div-times">{{ topic.vote_count }}人赞过</span>
          </div>
          <div class="line"></div>
          <div class="topic-content">
            <template v-if="isBuy">
              <div class="u-content md-content">
                <div v-code v-latex v-html="topic.render_content"></div>
              </div>
            </template>
            <template v-else>
              <div class="free-content u-content md-content">
                <div v-code v-latex v-html="topic.free_content_render"></div>
              </div>
              <div class="buttons">
                <div
                  class="login-button"
                  @click="goLogin()"
                  v-if="isLogin === false"
                >
                  请登录后查看
                </div>
                <template v-else>
                  <div
                    class="vip-buy-button"
                    @click="buyVip"
                    v-if="topic.is_vip_free === 1"
                  >
                    会员免费看
                  </div>
                  <template v-if="topic.charge > 0">
                    <div class="buy-button" @click="buy">
                      解锁全文￥{{ topic.charge }}
                    </div>
                  </template>
                </template>
              </div>
            </template>
          </div>
        </div>
        <div class="comments-box">
          <div class="comment-divider">全部评论</div>
          <div class="line"></div>
          <div class="reply-box" v-if="isLogin && isBuy">
            <div class="avatar" v-if="user"><img :src="user.avatar" /></div>
            <input
              type="text"
              class="input-box"
              v-model="comment.content"
              placeholder="此处填写你的评论"
            />
            <div
              class="confirm-button"
              @click="submitComment"
              :class="{ active: comment.content.length > 0 }"
            >
              评论
            </div>
          </div>
          <div class="comments-list-box">
            <template v-if="comment.list.length > 0">
              <div
                class="comment-item"
                v-for="(item, index) in comment.list"
                :key="item.id"
              >
                <div class="avatar">
                  <img :src="item.user.avatar" />
                </div>
                <div class="comment-content">
                  <div class="top-info">
                    <div class="nickname">
                      {{ item.user.nick_name }}
                    </div>
                    <div class="diff">
                      {{ item.created_at | changeTime }}
                    </div>
                  </div>

                  <div class="text">
                    <div v-html="item.content"></div>
                  </div>
                  <div class="reply-answer-box">
                    <div
                      :class="{ trans: configInput[index] === true }"
                      class="reply-answer"
                      v-if="isBuy"
                      @click="showReply(index)"
                    >
                      回复
                    </div>
                    <div
                      class="reply-answer"
                      :class="{ trans: configkey[index] === true }"
                      @click="getAnswer(index, item.id)"
                      v-if="item.children_count !== 0"
                    >
                      {{ item.children_count }}回复
                    </div>
                  </div>
                  <div
                    v-if="isLogin && isBuy && configInput[index] === true"
                    class="one-class-replybox"
                  >
                    <input
                      type="text"
                      class="input-box"
                      v-model="reply.content"
                      :placeholder="'回复' + item.user.nick_name"
                    />
                    <div
                      class="confirm-button"
                      @click="
                        ReplyAnswer(item.id, null, item.user.nick_name, index)
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
                              <template v-if="replyItem.reply_comment != null">
                                回复：{{
                                  replyItem.reply_comment.user.nick_name
                                }}
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
                            v-if="isBuy"
                            class="answer-item"
                            @click="showReply2(index2)"
                          >
                            回复
                          </div>
                          <div
                            v-if="
                              isLogin && isBuy && configInput2[index2] === true
                            "
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
                                  item.id,
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
            <div
              id="page"
              v-show="
                comment.list.length > 0 && total > comment.pagination.size
              "
            >
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
      </div>
      <div class="share-box" v-if="topic">
        <Share
          :cid="topic.id"
          :title="topic.title"
          :thumb="topic.thumb"
        ></Share>
        <div class="vote-button" :class="{ active: isVote }" @click="vote">
          <template v-if="isVote">
            <img
              class="vote-icon"
              width="40"
              height="40"
              src="../../assets/img/commen/icon-vote-h.png"
            />
            <span>已点赞</span>
          </template>
          <template v-else>
            <img
              class="vote-icon"
              width="40"
              height="40"
              src="../../assets/img/commen/icon-vote-n.png"
            />
            <span>点赞</span>
          </template>
        </div>
        <div class="like-button" :class="{ active: isLike }" @click="likeHit">
          <template v-if="isLike">
            <img
              class="like-icon"
              width="40"
              height="40"
              src="../../assets/img/commen/icon-collect-h.png"
            />
            <span>已收藏</span>
          </template>
          <template v-else>
            <img
              class="like-icon"
              width="40"
              height="40"
              src="../../assets/img/commen/icon-collect-n.png"
            />
            <span>收藏</span>
          </template>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import None from "../../components/none.vue";
import NavFooter from "../../components/footer.vue";
import PageBox from "../../components/page.vue";
import Share from "../../components/share.vue";
import HistoryRecord from "../../components/history-record.vue";
import SkeletonTopicDetail from "../../components/skeleton/skeletonTopicDetail.vue";

export default {
  components: {
    NavFooter,
    None,
    PageBox,
    Share,
    HistoryRecord,
    SkeletonTopicDetail,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      total: 0,
      topic: {
        title: "",
        thumb: "",
      },
      isAdmin: false,
      isBuy: false,
      isVote: false,
      isLike: false,
      comment: {
        list: [],
        users: [],
        content: "",
        pagination: {
          page: 1,
          size: 10,
        },
        loading: false,
      },
      pagination: {
        page: 1,
        page_size: 10000,
        comment_id: null,
      },
      reply: {
        content: null,
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
  mounted() {
    this.getData();
    this.getComments();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    likeHit() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$api.Topic.Collect(this.id).then((res) => {
        this.isLike = !this.isLike;
        if (this.isLike) {
          this.$message.success("已收藏");
        } else {
          this.$message.success("取消收藏");
        }
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
      this.pagination.comment_id = id;
      this.$api.Topic.AllComments(this.id, this.pagination).then((res) => {
        this.$set(this.replyAnswers, index, res.data.data.data);
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Topic.Detail(this.id).then((res) => {
        this.loading = false;
        this.author = res.data.author;
        this.isAdmin = res.data.is_admin;
        this.isBuy = res.data.is_buy;
        this.isVote = res.data.is_vote;
        this.topic = res.data.topic;
        this.isLike = res.data.is_collect;
        document.title = res.data.topic.title;
      });
    },
    changepage(item) {
      this.comment.pagination.size = item.pageSize;
      this.comment.pagination.page = item.currentPage;
      this.resetComment();
      this.getComments();
    },
    getComments() {
      if (this.comment.loading) {
        return;
      }
      this.comment.loading = true;
      this.$api.Topic.Comments(this.id, this.comment.pagination).then((res) => {
        this.comment.loading = false;
        // 用户
        for (let key in res.data.users) {
          this.comment.users[key] = res.data.users[key];
        }

        // 评论
        this.comment.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    resetComment() {
      this.comment.loading = false;
      this.comment.pagination.page = 1;
      this.comment.list = [];
      this.configkey = [];
      this.configInput = [];
      this.configInput2 = [];
      this.replyAnswers = [];
      this.comment.content = "";
    },
    submitComment() {
      if (!this.comment.content) {
        return;
      }
      this.$api.Topic.SubmitComment(this.topic.id, {
        content: this.comment.content,
      })
        .then(() => {
          this.$message.success("评论成功");
          this.resetComment();
          this.getComments();
        })
        .catch((e) => {
          this.$message.reeor(e.message);
        });
    },
    ReplyAnswer(parentId, id, nick_name, index) {
      if (!nick_name) {
        this.$message.error("回复的用户不存在");
        return;
      }
      this.answerId = id;
      this.$api.Topic.ReleaseComments(this.id, {
        parent_id: parentId,
        content: this.reply.content,
        reply_comment_id: this.answerId,
      })
        .then((res) => {
          this.configInput = [];
          this.configInput2 = [];
          this.$message.success("回复成功");
          let item;
          if (id) {
            item = {
              id: res.data.comment_id,
              parent_id: parentId,
              content: this.reply.content,
              children_count: 0,
              reply_comment: {
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
    vote() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$api.Topic.Vote(this.topic.id)
        .then((res) => {
          this.isVote = res.data.ok === 1;
          if (this.isVote) {
            this.topic.vote_count++;
            this.$message.success("已点赞");
          } else {
            this.topic.vote_count--;
            this.$message.success("取消点赞");
          }
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    buy() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "topic",
          goods_charge: this.topic.charge,
          goods_label: "文章",
          goods_name: this.topic.title,
          goods_id: this.topic.id,
          goods_thumb: this.topic.thumb,
        },
      });
    },
    buyVip() {
      this.$router.push({
        name: "vip",
      });
    },
    buyCredit() {},
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    position: relative;
    .share-box {
      width: 304px;
      height: 312px;
      background: #ffffff;
      border-radius: 8px;
      margin-top: 74px;
      box-sizing: border-box;
      padding: 30px;
      .share {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        span {
          height: 14px;
          font-size: 14px;
          margin-right: 30px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
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
      .vote-button {
        margin-top: 50px;
        margin-bottom: 30px;
        width: 244px;
        height: 56px;
        border-radius: 8px;
        border: 1px solid #cccccc;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        img {
          margin-right: 30px;
        }
        span {
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
        }
        &.active {
          border: 1px solid #3ca7fa;
          span {
            font-weight: 600;
            color: #3ca7fa;
          }
        }
      }
      .like-button {
        margin-top: 50px;
        margin-bottom: 30px;
        width: 244px;
        height: 56px;
        border-radius: 8px;
        border: 1px solid #cccccc;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        img {
          margin-right: 30px;
        }
        span {
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
        }
        &.active {
          border: 1px solid #e1a500;
          span {
            font-weight: 600;
            color: #e1a500;
          }
        }
      }
    }
    .topic-box {
      width: 866px;
      margin: 0 auto;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      padding-top: 0px;
      margin-right: 30px;
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
      .topic {
        width: 100%;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        padding: 30px;
        .topic-title {
          width: 100%;
          height: auto;
          font-size: 30px;
          font-weight: 600;
          color: #333333;
          line-height: 48px;
          margin-bottom: 10px;
        }
        .topic-stat {
          width: 100%;
          display: flex;
          float: left;
          flex-direction: row;
          align-items: center;
          .div-times {
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 14px;
            margin-right: 30px;
          }
        }
        .line {
          width: 100%;
          height: 1px;
          background: #e5e5e5;
          margin: 30px 0px;
        }
        .topic-content {
          width: 100%;
          position: relative;
          .free-content {
            width: 100%;
            min-height: 72px;
            margin-bottom: 0px;
          }
          .buttons {
            width: 100%;
            height: 83px;
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.5) 0%,
              #ffffff 62%,
              #ffffff 100%
            );
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: 0;
            z-index: 10;
            box-sizing: border-box;
            padding-top: 22px;
            .login-button {
              color: #3ca7fa;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }

            .vip-buy-button {
              width: 146px;
              height: 56px;
              background: #e1a500;
              border-radius: 4px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              margin-right: 30px;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
            .buy-button {
              width: auto;
              height: 56px;
              padding: 20px;
              box-sizing: border-box;
              background: #ff5068;
              border-radius: 4px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              margin-right: 30px;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
      }
      .comments-box {
        width: 100%;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        margin-top: 50px;
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
        .reply-box {
          width: 100%;
          height: 48px;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 50px;
          .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin-right: 30px;
            overflow: hidden;
            img {
              width: 48px;
              height: 48px;
              border-radius: 50%;
            }
          }

          .input-box {
            width: 626px;
            height: 48px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            padding-left: 15px;
            outline: none;
            margin-right: 30px;
          }
          .confirm-button {
            width: 72px;
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
        .comments-list-box {
          width: 100%;
          height: auto;
          display: flex;
          flex-direction: column;
          .comment-item {
            width: 100%;
            height: auto;
            float: left;
            display: flex;
            flex-direction: row;
            margin-top: 50px;
            &:first-child {
              margin-top: 0px;
            }
            .avatar {
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
            .comment-content {
              width: 728px;
              display: flex;
              flex-direction: column;
              .top-info {
                width: 100%;
                height: 14px;
                display: flex;
                align-items: center;
                flex-direction: row;
                margin-bottom: 15px;
                .nickname {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #666666;
                  line-height: 14px;
                  margin-right: 15px;
                }
                .diff {
                  height: 12px;
                  font-size: 12px;
                  font-weight: 400;
                  color: #666666;
                  line-height: 12px;
                }
              }
            }
            .text {
              width: 728px;
              float: left;
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
                margin-top: 20px;
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
                    width: 491px;
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
          #page {
            width: 100%;
            margin: 0 auto;
            margin-top: 50px;
            display: flex;
            flex-direction: row;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
