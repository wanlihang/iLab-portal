<template>
  <div class="content">
    <div class="qa-box">
      <div class="nav">
        <a @click="$router.push({ name: 'index' })">首页</a> /
        <a @click="$router.push({ name: 'wenda' })">问答社区</a> /
        <span class="nav-tit">{{ question.title }}</span>
      </div>
      <div class="question-body">
        <div class="credit" v-show="question.credit1 > 0">
          悬赏：{{ question.credit1 }}积分
        </div>
        <template v-if="loading">
          <skeletonWendaDetail></skeletonWendaDetail>
        </template>
        <template v-else>
          <div class="title">
            <div class="icon">
              <img src="../../assets/img/commen/icon-question.png" />
            </div>
            <div class="tit">{{ question.title }}</div>
          </div>
          <div class="question-content">
            <div v-html="question.render_content"></div>
          </div>
          <div class="thumbs-box" ref="imgTooles" v-if="question.images_list">
            <div
              class="thumb-item"
              v-for="(imgItem, index) in question.images_list"
              :key="index"
              @click="showPreviewImage(imgItem)"
            >
              <div
                class="image-view"
                :style="{ 'background-image': 'url(' + imgItem + ')' }"
              ></div>
            </div>
            <image-preview
              :url="showPreviewImageSrc"
              v-if="showPreviewImageStatus"
              @close="closePreviewImage"
            ></image-preview>
          </div>
          <div class="stat">
            <span class="datetime">{{ question.created_at | changeTime }}</span>
            <span class="view-times">{{ question.view_times }}次浏览</span>
            <span class="answer-count">{{ question.answer_count }}回答</span>
          </div>
        </template>
      </div>

      <div class="comments-box">
        <div class="reply-box" v-if="isLogin && question.status !== 1">
          <div class="avatar" v-if="user"><img :src="user.avatar" /></div>
          <input
            type="text"
            class="input-box"
            v-model="comment.content"
            placeholder="此处填写你的回答"
          />
          <div
            class="confirm-button"
            @click="submitComment"
            :class="{ active: comment.content }"
          >
            发布回答
          </div>
          <div class="upload-body">
            <upload-wenda-images
              v-if="isUploadShow"
              @update="imageUpdate"
            ></upload-wenda-images>
          </div>
        </div>
        <div class="comment-divider">全部回答</div>
        <div class="line"></div>
        <div class="comments-list-box">
          <template v-if="answers.length > 0">
            <div
              class="comment-item"
              :class="{ 'correct-answer-item': item.is_correct === 1 }"
              v-for="(item, index) in answers"
              :key="item.id"
            >
              <div class="avatar">
                <img v-if="item.user" :src="item.user.avatar" />
              </div>
              <div class="comment-content">
                <div class="top-info">
                  <div class="nickname" v-if="item.user">
                    {{ item.user.nick_name }}
                  </div>
                  <div class="nickname red" v-else>用户不存在</div>
                  <div class="diff">
                    {{ item.created_at | changeTime }}
                  </div>
                  <template v-if="item.is_correct === 1">
                    <div class="correct-answer">
                      <img
                        src="../../assets/img/commen/icon-adopt.png"
                      />此回答已被题主采纳
                    </div>
                  </template>
                </div>

                <div class="text">
                  <div v-latex v-html="item.render_content"></div>
                </div>
                <div class="thumbs" v-if="item.images_list.length > 0">
                  <div
                    class="img-item"
                    v-for="(imgItem, index) in item.images_list"
                    :key="index"
                    @click="showPreviewImage(imgItem)"
                  >
                    <div
                      class="image-view"
                      :style="{ 'background-image': 'url(' + imgItem + ')' }"
                    ></div>
                  </div>
                  <image-preview
                    :url="showPreviewImageSrc"
                    v-if="showPreviewImageStatus"
                    @close="closePreviewImage"
                  ></image-preview>
                </div>
                <div class="reply-answer-box">
                  <div
                    class="vote-button"
                    @click.stop="questionVote(item)"
                    :class="{
                      act: item.is_vote === 1,
                    }"
                  >
                    <img
                      v-if="item.is_vote === 1"
                      src="../../assets/img/commen/icon-like-h.png"
                    />
                    <img v-else src="../../assets/img/commen/icon-like.png" />
                    {{ item.vote_count }}
                  </div>

                  <div
                    class="reply-answer"
                    :class="{ trans: configkey[index] === true }"
                    @click="getAnswer(index, item.id)"
                    v-if="item.reply_count !== 0"
                  >
                    {{ item.reply_count }}回复
                  </div>
                  <div
                    v-else
                    :class="{ trans: configInput[index] === true }"
                    class="reply-answer"
                    @click="showReply(index)"
                  >
                    回复
                  </div>
                </div>
                <div
                  v-if="
                    configkey[index] === true || configInput[index] === true
                  "
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
                    @click="ReplyAnswer(item.id, 0, item.user.nick_name, index)"
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
                            <template v-if="replyItem.reply_user_id > 0">
                              回复：{{ replyItem.reply_user.nick_name }}
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
                          <div v-html="replyItem.render_content"></div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>

                <div
                  class="set-correct"
                  @click="setCorrect(item)"
                  v-if="question.status === 0 && isAdmin"
                >
                  采纳此回答
                </div>
              </div>
            </div>
          </template>

          <none v-else type="white"></none>
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
import ImagePreview from "../../components/image-preview.vue";
import UploadWendaImages from "../../components/upload-wenda-images";
import SkeletonWendaDetail from "../../components/skeleton/skeletonWendaDetail.vue";
export default {
  components: {
    NavFooter,
    None,
    ImagePreview,
    UploadWendaImages,
    SkeletonWendaDetail,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      total: 0,
      selReply: 0,
      question: [],
      answers: [],
      isUploadShow: true,
      answerId: null,
      isAdmin: false,
      isVote: false,
      comment: {
        images: [],
        content: null,
      },
      reply: {
        content: null,
      },
      configkey: [],
      configInput: [],
      configInput2: [],
      replyAnswers: [],
      pagination: {
        page: 1,
        page_size: 10000,
      },
      showPreviewImageSrc: "",
      showPreviewImageStatus: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    async reload() {
      this.isUploadShow = false;
      await this.$nextTick();
      this.isUploadShow = true;
    },
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Wenda.Detail(this.id).then((res) => {
        this.loading = false;
        this.question = res.data.question;
        this.answers = res.data.answers;
        this.isAdmin = res.data.is_admin;
        this.isVote = res.data.is_vote;

        document.title = res.data.question.title;
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
      this.$api.Wenda.AnswerComments(id, this.pagination).then((res) => {
        this.$set(this.replyAnswers, index, res.data.data.data);
        this.total = res.data.data.total;
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
    setCorrect(answer) {
      this.$api.Wenda.ChoiceAnswer(this.question.id, {
        answer_id: answer.id,
      })
        .then(() => {
          this.$message.success("成功");
          this.getData();
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    questionVote(answerItem) {
      this.$api.Wenda.Vote({
        id: answerItem.id,
        type: 1,
      })
        .then((res) => {
          if (answerItem.is_vote === 1) {
            answerItem.vote_count--;
            answerItem.is_vote = 0;
            this.$message.error("取消点赞");
          } else {
            answerItem.vote_count++;
            answerItem.is_vote = 1;
            this.$message.success("已点赞");
          }
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    ReplyAnswer(id, userId, nick_name, index) {
      if (!nick_name) {
        this.$message.error("回复的用户不存在");
        return;
      }
      this.answerId = id;
      this.$api.Wenda.SubmitComment(this.answerId, {
        original_content: this.reply.content,
        render_content: this.reply.content,
        reply_user_id: userId,
      })
        .then((res) => {
          this.configInput = [];
          this.configInput2 = [];
          this.$message.success("回复成功");
          let item;
          if (userId) {
            item = {
              id: res.data.comment_id,
              parent_id: id,
              render_content: this.reply.content,
              children_count: 0,
              reply_comment: {
                user: { nick_name: nick_name },
              },
              created_at: "刚刚",
              user: {
                avatar: this.user.avatar,
                nick_name: this.user.nick_name,
              },
            };
          } else {
            item = {
              id: res.data.comment_id,
              parent_id: id,
              render_content: this.reply.content,
              children_count: 0,
              reply_comment: null,
              created_at: "刚刚",
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
          this.answers[index].reply_count = this.answers[index].reply_count + 1;
          this.$set(this.replyAnswers, index, old);
          this.reply.content = "";
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    imageUpdate(thumbs) {
      this.comment.images = thumbs;
    },
    submitComment() {
      if (!this.comment.content) {
        return;
      }
      this.$api.Wenda.SubmitAnswer(this.id, {
        original_content: this.comment.content,
        render_content: this.comment.content,
        images: this.comment.images,
      })
        .then(() => {
          this.comment.content = "";
          this.reload();
          this.$message.success("评论成功");
          this.getData();
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    showPreviewImage(src) {
      this.showPreviewImageSrc = src;
      this.showPreviewImageStatus = true;
    },
    closePreviewImage() {
      this.showPreviewImageStatus = false;
    },
  },
};
</script>
<style lang="less" scoped>
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
      display: flex;
      flex-direction: row;
      align-items: center;
      .navTitle {
        width: 1160px;
        height: 24px;
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      .icon-back {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
  .qa-box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
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
      .nav-tit {
        width: 1050px;
        height: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .question-body {
      width: 100%;
      min-height: 100px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 30px;
      position: relative;
      .credit {
        position: absolute;
        top: 30px;
        right: 30px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #04c877;
        line-height: 14px;
      }
      .title {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        margin-bottom: 25px;
        .icon {
          width: 30px;
          margin-right: 10px;
          img {
            width: 30px;
            height: 30px;
          }
        }
        .tit {
          width: 1000px;
          font-size: 20px;
          font-weight: 600;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .question-content {
        width: 100%;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 26px;
        margin-bottom: 30px;
      }
      .thumbs-box {
        width: 100%;
        height: auto;
        display: grid;
        gap: 30px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        .thumb-item {
          width: 555px;
          height: 416px;
          background: #f4fafe;
          cursor: pointer;
          position: relative;
          .image-view {
            width: 100%;
            height: 416px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center center;
          }
        }
      }
      .stat {
        margin-top: 30px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        span {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
          margin-right: 30px;
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
        margin-top: 30px;
      }
      .reply-box {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
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
          width: 948px;
          height: 48px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          padding-left: 15px;
          outline: none;
          margin-right: 10px;
        }
        .upload-body {
          width: 948px;
          flex: 1;
          margin-top: 20px;
          margin-bottom: 50px;
          box-sizing: border-box;
          margin-left: 78px;
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
      .comments-list-box {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        .comment-item {
          position: relative;
          width: 100%;
          height: auto;
          float: left;
          display: flex;
          flex-direction: row;
          margin-top: 50px;
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
            width: 1062px;
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
              .nickname {
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
              .diff {
                height: 12px;
                font-size: 12px;
                font-weight: 400;
                color: #666666;
                line-height: 12px;
              }
              .correct-answer {
                height: 14px;
                font-size: 12px;
                margin-left: 30px;
                font-weight: 400;
                line-height: 14px;
                color: #04c877;
                display: flex;
                align-items: center;
                img {
                  width: 14px;
                  height: 14px;
                  margin-right: 5px;
                }
              }
            }
          }
          .text {
            width: 1062px;
            float: left;
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            line-height: 26px;
          }
          .thumbs {
            width: 1062px;
            float: left;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-top: 15px;
            .img-item {
              width: 200px;
              height: 150px;
              background: #f4fafe;
              margin-right: 30px;
              margin-bottom: 10px;
              cursor: pointer;
              position: relative;
              .image-view {
                width: 100%;
                height: 150px;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center center;
              }
            }
          }
          .reply-answer-box {
            width: 1062px;
            display: flex;
            flex-direction: row;
            .vote-button {
              margin-top: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              line-height: 20px;
              cursor: pointer;
              display: flex;
              align-items: center;
              margin-right: 30px;
              img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
              }
              &.act {
                color: #3ca7fa;
              }
            }
            .reply-answer {
              margin-top: 14px;
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
            #page {
              width: 100%;
              margin: 0 auto;
              margin-top: 20px;
              display: flex;
              flex-direction: row;
              justify-content: center;
            }
          }
          .set-correct {
            width: 90px;
            height: 34px;
            background: #04c877;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
