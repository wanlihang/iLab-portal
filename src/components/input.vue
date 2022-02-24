<template>
  <div class="choice-item">
    <div v-if="previewImage" class="preview-image borderbox">
      <img
        class="back-detail"
        @click="backDetail()"
        src="../assets/img/icon-back-n.png"
      />
      <div class="pic-item">
        <div
          class="pic"
          :style="{ 'background-image': 'url(' + thumb + ')' }"
        ></div>
      </div>
    </div>
    <div class="info" :class="{ spcolor: spcolor }">
      <span class="tit"
        >{{ num }}.{{ question.type_text }}（{{ question.score }}分）</span
      >
    </div>
    <div class="question-content" :class="{ spcolor: spcolor }">
      <div
        @click="PreviewImage($event)"
        class="content-render"
        v-html="question.content"
      ></div>
    </div>
    <div class="choice-box" :class="{ spcolor: spcolor }">
      <div
        class="input-input-item"
        v-for="(item, index) of inputVal"
        :key="index"
      >
        <div class="name">填空{{ index + 1 }}：</div>
        <div class="input-box">
          <input
            :class="{ spcolor: spcolor }"
            :disabled="isOver"
            type="text"
            class="input"
            v-model="inputVal[index]"
            placeholder="请输入你的答案"
            @blur="change"
          />
        </div>
      </div>
    </div>
    <template v-if="isOver">
      <div class="analysis-box" :class="{ spcolor: spcolor }">
        <div class="pop-box">
          <div class="status" v-if="!wrongBook">
            <span class="success" v-if="isCorrect">正确</span>
            <span class="error" v-else>错误</span>
            <span class="score">得分：{{ score }}分</span>
          </div>
          <div class="answer">
            <div class="input-answer-name">答案：</div>
            <div class="input-answer-body">
              <div
                class="input-answer-body-item"
                v-for="(item, index) in questionAnswerRows"
                :key="index"
              >
                <div class="input-answer-body-item-name">
                  填空{{ index + 1 }}：
                </div>
                <div class="input-answer-body-item-content">{{ item }}</div>
              </div>
            </div>
          </div>
          <div class="remark" v-if="question.remark">
            <div>解析：</div>
            <div v-html="question.remark"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: [
    "question",
    "reply",
    "isCorrect",
    "isOver",
    "score",
    "wrongBook",
    "spcolor",
    "num",
  ],
  data() {
    return {
      inputVal: [],
      previewImage: false,
      thumb: null,
    };
  },
  computed: {
    inputLength() {
      if (typeof this.question.input_length !== "undefined") {
        return this.question.input_length;
      }

      if (typeof this.question.answer !== "undefined" && this.question.answer) {
        return this.question.answer.split(",").length;
      }

      return 0;
    },
    questionAnswerRows() {
      if (typeof this.question === "undefined") {
        return [];
      }

      if (typeof this.question.answer === "undefined") {
        return [];
      }

      return this.question.answer.split(",");
    },
  },
  mounted() {
    let replyContent = this.reply || "";
    let replyRows = replyContent.split(",");

    for (let i = 0; i < this.inputLength; i++) {
      if (typeof replyRows[i] !== "undefined") {
        this.inputVal.push(replyRows[i]);
      } else {
        this.inputVal.push(null);
      }
    }
  },
  methods: {
    change() {
      if (this.isOver) {
        return;
      }
      let val = this.inputVal.join(",");
      this.$emit("update", this.question.id, val);
    },
    backDetail() {
      this.previewImage = false;
    },
    PreviewImage($event) {
      if ($event.target.src) {
        this.thumb = $event.target.src;
        this.previewImage = true;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.spcolor {
  background: #f4fafe !important;
}
.choice-item {
  background-color: #f1f2f6;
  width: 100%;
  .preview-image {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 400;
    padding: 15px;
    background-color: #000000;
    display: flex;
    align-items: center;
    .back-detail {
      position: absolute;
      top: 15px;
      left: 15px;
      width: 19px;
      height: 19px;
      cursor: pointer;
    }
    .pic-item {
      width: 100%;
      height: 100%;
      .pic {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
    }
  }
  .info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 30px 0px 30px;
    background-color: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    /* Firefox */
    -webkit-box-sizing: border-box;
    /* Safari */
    .tit {
      height: 18px;
      font-size: 18px;
      font-weight: 500;
      color: #666666;
      line-height: 18px;
    }
  }
  .question-content {
    width: 100%;
    height: auto;
    font-size: 15px;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    padding: 30px 30px 0px 30px;
    background-color: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    /* Firefox */
    -webkit-box-sizing: border-box;
    /* Safari */
  }
  .choice-box {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding: 30px;
    background-color: #fff;
    .input-input-item {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 0px;
      }
      .name {
        height: 16px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
        margin-right: 10px;
      }
      .input-box {
        width: 200px;
        height: 40px;
        .input {
          width: 200px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid #e5e5e5;
          padding-left: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 24px;

          outline: none;
          background-color: #fff !important;
        }
        .input::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
}
</style>
