<template>
  <div class="content">
    <div class="mask" v-if="openmask">
      <div class="popup borderbox">
        <div class="tabs">
          <div class="item-tab">确认信息</div>
          <img
            class="btn-close"
            @click="cancel()"
            src="../../../assets/img/commen/icon-close.png"
          />
        </div>
        <div class="text">是否确认删除？</div>
        <div class="button">
          <div class="confirm" style="cursor: pointer" @click="submitHandle()">
            确认
          </div>
          <div class="cancel" style="cursor: pointer" @click="cancel()">
            取消
          </div>
        </div>
      </div>
    </div>
    <div class="navheader">
      <div class="top">
        <div class="left-top" @click="$router.back()">
          <img
            class="icon-back"
            src="../../../assets/img/commen/icon-back-h.png"
          />试题错题本
        </div>
        <div class="right-top">
          <div class="prev-button" @click="prevPage()">上一题</div>
          <div class="next-button" @click="nextPage()">下一题</div>
        </div>
      </div>
    </div>
    <div class="project-box">
      <div class="left-box">
        <NumberSheet
          v-if="qidArr"
          type="wrongbook"
          :activeNum="activeQid"
          :qidArr="qidArr"
          :configkey="configkey"
          @change="changeQid"
        ></NumberSheet>
      </div>
      <div class="right-box">
        <template v-if="loading">
          <skeletonPaperQuestion></skeletonPaperQuestion>
        </template>
        <template v-else-if="question">
          <div class="delete-icon" @click="removeAnswer()">
            <img src="../../../assets/img/icon-delete-h.png" />
          </div>
          <div class="wrongbook-join-box">
            <div class="question-content">
              <!-- 单选 -->
              <question-choice
                :num="activeQid"
                v-if="question.type === 1"
                :wrongBook="true"
                :question="question"
                :is-correct="false"
                @update="questionUpdate"
                :score="question.score"
                :is-over="showAnswer"
                :reply="null"
              ></question-choice>

              <!-- 多选 -->
              <question-select
                :num="activeQid"
                v-else-if="question.type === 2"
                :wrongBook="true"
                :question="question"
                :is-correct="false"
                @update="questionUpdate"
                :score="question.score"
                :is-over="showAnswer"
                :reply="''"
              ></question-select>

              <!-- 填空 -->
              <question-input
                :num="activeQid"
                v-else-if="question.type === 3"
                :wrongBook="true"
                :question="question"
                :is-correct="false"
                @update="questionUpdate"
                :score="question.score"
                :is-over="showAnswer"
                :reply="''"
              ></question-input>

              <!-- 问答 -->
              <question-qa
                :num="activeQid"
                v-else-if="question.type === 4"
                :wrongBook="true"
                :question="question"
                :is-correct="false"
                @update="questionUpdate"
                :show-image="false"
                :score="question.score"
                :is-over="showAnswer"
              ></question-qa>

              <!-- 判断 -->
              <question-judge
                :num="activeQid"
                v-else-if="question.type === 5"
                :wrongBook="true"
                :question="question"
                :is-correct="false"
                :score="question.score"
                @update="questionUpdate"
                :is-over="showAnswer"
                :reply="null"
              ></question-judge>

              <!-- 题帽题 -->
              <question-cap
                :num="activeQid"
                v-else-if="question.type === 6"
                :wrongBook="true"
                :question="question"
                :is-correct="false"
                :score="question.score"
                :show-image="false"
                @update="questionUpdate"
                :is-over="showAnswer"
              ></question-cap>
            </div>
          </div>
        </template>
        <div
          class="buttons-box"
          v-if="
            question &&
            (question.type === 2 ||
              question.type === 3 ||
              question.type === 4 ||
              question.type === 6)
          "
        >
          <div class="see-answer" @click="seeAnswer()">{{ showText }}</div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import QuestionChoice from "../../../components/choice.vue";
import QuestionSelect from "../../../components/select.vue";
import QuestionInput from "../../../components/input.vue";
import QuestionQa from "../../../components/qa.vue";
import QuestionJudge from "../../../components/judge.vue";
import QuestionCap from "../../../components/cap.vue";
import NumberSheet from "../../../components/numbersheet.vue";
import NavFooter from "../../../components/footer.vue";
import SkeletonPaperQuestion from "../../../components/skeleton/skeletonPaperQuestion.vue";

export default {
  components: {
    QuestionChoice,
    QuestionSelect,
    QuestionInput,
    QuestionQa,
    QuestionJudge,
    QuestionCap,
    NumberSheet,
    NavFooter,
    SkeletonPaperQuestion,
  },
  data() {
    return {
      id: this.$route.query.id,
      mode: this.$route.query.mode,
      question: [],
      qidArr: [],
      activeQid: 1,
      showAnswer: false,
      showText: "对答案",
      loading: false,
      openmask: false,
      configkey: [],
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    activeQid() {
      this.showAnswer = false;
      this.showText = "对答案";
      this.getQuestion();
    },
  },
  methods: {
    changeQid(val) {
      this.activeQid = val;
    },
    prevPage() {
      if (this.activeQid === 1) {
        this.$message.error("没有上一题了");
      } else {
        this.activeQid--;
      }
    },
    nextPage() {
      if (this.activeQid === this.qidArr.length) {
        this.$message.error("没有下一题了");
      } else {
        this.activeQid++;
      }
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      if (this.id) {
        this.$api.Exam.PracticeQuestion(0, this.id)
          .then((res) => {
            this.loading = false;
            let question = res.data.question;
            this.question = question;
            this.qidArr.push(this.question.id);
            for (var i = 0; i < this.qidArr.length; i++) {
              this.configkey.push(false);
            }
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      }
      if (this.mode === "order") {
        this.$api.Exam.WrongBook.OrderMode()
          .then((res) => {
            this.loading = false;
            this.question = res.data.first_question;
            this.qidArr = res.data.qid_arr;
            for (var i = 0; i < this.qidArr.length; i++) {
              this.configkey.push(false);
            }
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.mode === "random") {
        this.$api.Exam.WrongBook.RandomMode()
          .then((res) => {
            this.loading = false;
            this.question = res.data.first_question;
            this.qidArr = res.data.qid_arr;
            for (var i = 0; i < this.qidArr.length; i++) {
              this.configkey.push(false);
            }
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      }
    },
    getQuestion() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.question = null;
      let questionId = this.qidArr[this.activeQid - 1];
      this.$api.Exam.PracticeQuestion(0, questionId)
        .then((res) => {
          this.loading = false;
          let question = res.data.question;
          question.answer_content = "";
          this.$nextTick(() => {
            this.question = question;
          });
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    cancel() {
      this.openmask = false;
    },
    submitHandle() {
      this.$api.Exam.WrongBook.RemoveQuestion(this.question.id)
        .then(() => {
          this.openmask = false;
          this.$message.success("操作成功，下次进入将不会看到该试题");
        })
        .catch((e) => {
          this.openmask = false;
          this.$message.error(e.message);
        });
    },
    removeAnswer() {
      this.openmask = true;
    },
    seeAnswer() {
      let questionId = this.qidArr[this.activeQid - 1];
      this.$set(this.configkey, this.activeQid - 1, true);
      if (this.showAnswer === true) {
        this.showText = "对答案";
      } else {
        this.showText = "收起答案";
      }
      this.showAnswer = !this.showAnswer;
      this.$api.Exam.PracticeQuestionAnswerFill(0, questionId, {}).then(
        (res) => {
          //
        }
      );
    },
    questionUpdate() {
      if (
        this.question &&
        (this.question.type === 1 || this.question.type === 5)
      ) {
        this.seeAnswer();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .popup {
      width: 500px;
      height: 300px;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      animation: scaleBig 0.3s;
      .tabs {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        position: relative;
        padding: 23px 23px 0px 30px;
        overflow: hidden;
        .item-tab {
          width: 72px;
          height: 18px;
          font-size: 18px;
          font-weight: 500;
          color: #333333;
          line-height: 18px;
          margin-top: 7px;
        }
        .btn-close {
          width: 19px;
          height: 19px;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
            animation: rotate360 1s;
          }
        }
      }
      .text {
        width: 100%;
        height: 178px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
      }
      .button {
        width: 100%;
        height: 74px;
        background: #ffffff;
        box-shadow: 0px -1px 5px 0px rgba(0, 0, 0, 0.1);
        border-radius: 0px 0px 8px 8px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        .cancel {
          width: 88px;
          height: 44px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          cursor: pointer;
          margin-right: 30px;
          &:hover {
            opacity: 0.8;
          }
        }
        .confirm {
          width: 88px;
          height: 44px;
          background: #3ca7fa;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          cursor: pointer;
          margin-right: 30px;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .navheader {
    position: sticky;
    top: 0;
    z-index: 20;
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
      justify-content: space-between;
      .left-top {
        height: 70px;
        display: flex;
        align-items: center;
        flex-direction: row;
        cursor: pointer;
        .icon-back {
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
      }
      .right-top {
        height: 70px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .prev-button {
          width: 84px;
          height: 40px;
          background: #3ca7fa;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          margin-right: 30px;
        }
        .next-button {
          width: 84px;
          height: 40px;
          background: #3ca7fa;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
  .project-box {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    .left-box {
      width: 300px;
      height: 1178px;
      background: #ffffff;
      margin-right: 30px;
      overflow-y: auto;
    }
    .right-box {
      position: relative;
      margin-top: 30px;
      width: 872px;
      border-radius: 8px;
      box-sizing: border-box;
      .delete-icon {
        position: absolute;
        width: 28px;
        height: 28px;
        cursor: pointer;
        right: 30px;
        top: 30px;
        z-index: 10;
      }
      .buttons-box {
        width: 100%;
        padding: 30px;
        margin-top: 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        .see-answer {
          width: 104px;
          height: 40px;
          background: #ff5068;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
