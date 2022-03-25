<template>
  <div class="choice-item">
    <div v-if="previewImage" class="preview-image borderbox">
      <img
        class="back-detail"
        @click="backDetail()"
        src="../assets/img/icon-back-n.png"
      />
      <img
        @click="deleteImage()"
        v-if="!isOver && !prew"
        class="delete-img"
        src="../assets/img/icon-delete.png"
      />
      <div class="pic-item">
        <div
          class="pic"
          :style="{ 'background-image': 'url(' + image.thumb + ')' }"
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
        @click="PreviewImage2($event)"
        class="content-render"
        v-html="question.content"
      ></div>
    </div>
    <div class="choice-box" :class="{ spcolor: spcolor }">
      <div class="input-title">我的作答</div>
      <textarea
        :disabled="isOver"
        v-model="val"
        placeholder="请输入你的答案"
        @blur="change"
        class="input"
        maxlength="-1"
      ></textarea>
      <div class="images-box" v-if="showImage">
        <div
          class="image-item"
          v-for="(item, imageIndex) in localThumbs"
          :key="imageIndex"
        >
          <div
            class="image-view"
            @click="PreviewImage(item, imageIndex)"
            :style="{ 'background-image': 'url(' + item + ')' }"
          ></div>
        </div>

        <label class="upload-image-button" v-if="isOver === false">
          <img src="../assets/img/icon-handin.png" />
          <input
            id="file_input"
            type="file"
            accept="image/*"
            @change="uploadImage"
          />
        </label>
      </div>
    </div>
    <template v-if="isOver">
      <div
        class="analysis-box"
        v-if="question.remark"
        :class="{ spcolor: spcolor }"
      >
        <div class="pop-box">
          <div class="status" v-if="!wrongBook">
            <span class="score" style="margin-left: 0px !important"
              >本题得分：{{ score }}分</span
            >
          </div>
          <!-- <div class="answer" v-if="question.answer">
            答案：{{ question.answer }}
          </div> -->
          <div class="remark" style="padding-top: 20px">
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
    "thumbs",
    "score",
    "showImage",
    "wrongBook",
    "spcolor",
    "num",
  ],
  data() {
    return {
      qid: null,
      val: null,
      localThumbs: [],
      previewImage: false,
      image: {
        thumb: null,
        index: null,
      },
      prew: false,
    };
  },
  mounted() {
    if (this.thumbs) {
      this.localThumbs = this.thumbs;
    }
    this.val = this.reply;
  },
  watch: {
    reply() {
      this.val = this.reply;
    },
  },
  methods: {
    change() {
      if (this.isOver) {
        return;
      }
      this.emitCall();
    },
    uploadImage(e) {
      if (this.isOver) {
        return;
      }
      if (this.localThumbs.length >= 9) {
        this.$message.error("最多上传9张图片");
        return;
      }
      let files = e.target.files;
      if (!files[0].type.match(/.jpg|.png|.jpeg/i)) {
        this.$message.error("图片格式错误,请上传png/jpg/jpeg格式的图片");
        return;
      }
      let formData = new FormData();
      formData.append("file", files[0]);
      this.$api.Exam.UploadPaperImages(formData)
        .then((res) => {
          let url = res.data.url;
          this.localThumbs.push(url);
          this.emitCall();
        })
        .catch((e) => {
          this.$message.error("上传图片出现错误");
        });
    },
    backDetail() {
      this.previewImage = false;
    },
    deleteImage() {
      if (this.isOver) {
        return;
      }
      this.localThumbs.splice(this.image.index, 1);
      this.previewImage = false;
      this.emitCall();
    },
    PreviewImage(val, index) {
      this.previewImage = true;
      this.prew = false;
      this.image.thumb = val;
      this.image.index = index;
    },
    PreviewImage2($event) {
      if ($event.target.src) {
        this.prew = true;
        this.image.thumb = $event.target.src;
        this.previewImage = true;
      }
    },
    emitCall() {
      this.$emit("update", this.question.id, this.val, this.localThumbs);
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
    .delete-img {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 24px;
      height: 24px;
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
    .input-title {
      width: 100%;
      height: 15px;
      font-size: 15px;
      font-weight: 500;
      color: #333333;
      line-height: 15px;
      margin-bottom: 20px;
    }
    .input {
      width: 100%;
      height: 200px;
      border-radius: 4px;
      border: 1px solid #e5e5e5;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 24px;
      outline: none;
      resize: none;
      padding: 15px;
      background-color: #fff;
    }
    .input::-webkit-input-placeholder {
      color: #ccc;
    }
    .images-box {
      width: 100%;
      height: auto;
      float: left;
      box-sizing: border-box;
      margin-top: 20px;
      display: grid;
      gap: 15px;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      .image-item {
        width: 165px;
        height: 124px;
        text-align: center;
        .image-view {
          width: 165px;
          height: 124px;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center center;
        }
      }
      .upload-image-button {
        width: 165px;
        height: 124px;
        background-color: #f1f2f6;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        img {
          width: 50px;
          height: 50px;
        }
        #file_input {
          position: absolute;
          top: 0;
          left: 0;
          width: 165px;
          height: 124px;
          opacity: 0;
        }
      }
    }
  }
}
</style>
