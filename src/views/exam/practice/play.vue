<template>
  <div class="content">
    <div class="navheader">
      <div class="top">
        <div class="left-top" @click="$router.back()">
          <img
            class="icon-back"
            src="../../../assets/img/commen/icon-back-h.png"
          />{{ list.name }}
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
          type="practice"
          :activeNum="activeQid"
          :qidArr="qidArr"
          @change="changeQid"
          :configkey="configkey"
        ></NumberSheet>
      </div>
      <div class="right-box">
        <template v-if="loading">
          <skeletonPaperQuestion></skeletonPaperQuestion>
        </template>
        <template v-else-if="list && question">
          <div class="delete-icon" @click="collectAnswer()">
            <img
              v-if="isCollected"
              src="../../../assets/img/commen/icon-collect-h.png"
            />
            <img v-else src="../../../assets/img/commen/icon-collect-n.png" />
          </div>
          <div class="practice-join-box">
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
      id: this.$route.query.practiceId,
      day: this.$route.query.day || 0,
      chapterId: this.$route.query.chapterId,
      list: [],
      isCollected: false,
      question: [],
      qidArr: [],
      activeQid: 1,
      showAnswer: false,
      showText: "对答案",
      loading: false,
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
      if (parseInt(this.day) === 1) {
        this.$api.Exam.PracticeDayPlay(this.id)
          .then((res) => {
            this.loading = false;
            this.list = res.data.practice;
            this.question = res.data.first_question;
            this.qidArr = res.data.qid_arr;
            document.title = res.data.practice.name;
            this.collectStatus();
            for (var i = 0; i < this.qidArr.length; i++) {
              this.configkey.push(false);
            }
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else {
        this.$api.Exam.PracticePlay(this.id, this.chapterId)
          .then((res) => {
            this.loading = false;
            this.list = res.data.practice;
            this.question = res.data.first_question;
            this.qidArr = res.data.qid_arr;
            document.title = res.data.practice.name;
            this.collectStatus();
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
      this.$api.Exam.PracticeQuestion(this.list.id, questionId)
        .then((res) => {
          this.loading = false;
          let question = res.data.question;
          question.answer_content = "";
          this.$nextTick(() => {
            this.question = question;
            this.collectStatus();
          });
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    collectStatus() {
      this.loading = true;
      this.$api.Exam.Practice.CollectStatus({ question_id: this.question.id })
        .then((res) => {
          this.loading = false;
          if (res.data.status === 1) {
            this.isCollected = true;
          } else {
            this.isCollected = false;
          }
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    collectAnswer() {
      this.$api.Exam.Practice.Collect({ question_id: this.question.id }).then(
        () => {
          if (this.isCollected) {
            this.$message.success("已取消收藏");
          } else {
            this.$message.success("已收藏试题");
          }
          this.isCollected = !this.isCollected;
        }
      );
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
      this.$api.Exam.PracticeQuestionAnswerFill(
        this.list.id,
        questionId,
        {}
      ).then((res) => {
        //
      });
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
