<template>
  <div class="mask" v-if="status && isLogin">
    <div class="dialog-box">
      <div class="tabs">
        <div class="tit">
          问题分类<span class="notice_article_type">*</span>
        </div>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="qa-group-input-box">
        <div class="qa-group-item">
          <div class="body-wrap" v-if="categories">
            <div
              class="category"
              v-for="item in categories"
              :key="item.id"
              :class="{ active: item.id === form.category_id }"
              @click="selectConfirm(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="qa-group-item">
          <div class="body">
            <div class="title">
              问题标题<span class="notice_article_type">*</span>
            </div>
            <input
              type="text"
              class="input"
              v-model="form.title"
              maxlength="64"
              placeholder="请填写问题标题（不超过64个字）"
            />
          </div>
        </div>
        <div class="qa-group-item">
          <div class="body">
            <div class="title">
              问题内容<span class="notice_article_type">*</span>
            </div>
            <textarea
              placeholder="请填写问题具体内容"
              v-model="form.original_content"
              class="textarea"
            ></textarea>
          </div>
        </div>
        <div class="qa-group-item">
          <div class="body">
            <div class="title">插入图片</div>
            <div class="img-wrap">
              <upload-images @update="imageUpdate"></upload-images>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-item">
        <div class="body">
          <div class="title">悬赏积分</div>
          <div class="credit1">
            <input
              type="text"
              class="input2"
              v-model="form.credit1"
              :disabled="user.credit1 === 0"
              placeholder="设置悬赏积分"
            />

            <div class="help" v-if="user">积分余额：{{ user.credit1 }}积分</div>
            <div
              :class="{
                active:
                  form.original_content.length > 0 &&
                  form.title.length > 0 &&
                  form.category_id > 0,
              }"
              class="confirm-button"
              @click="confirm"
            >
              发布问题
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import UploadImages from "./upload-images";
export default {
  components: {
    UploadImages,
  },
  props: ["status"],
  data() {
    return {
      form: {
        title: "",
        category_id: 0,
        original_content: "",
        render_content: "",
        images: [],
        credit1: null,
      },
      selectedCategory: null,
      categories: [],
      showSelectStatus: false,
      uploadImgLoading: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  watch: {
    "form.original_content"() {
      this.form.render_content = this.form.original_content;
    },
  },
  mounted() {
    this.getCreateParams();
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    getCreateParams() {
      this.$api.Wenda.Create().then((res) => {
        this.categories = res.data.categories;
      });
    },
    selectConfirm(id) {
      this.form.category_id = parseInt(id);
    },
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg =
        /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    },
    confirm() {
      if (this.form.category_id === 0) {
        this.$message.error("请选择问题分类");
        return;
      }
      if (this.form.title.trim() === "") {
        this.$message.error("请填写问题标题");
        return;
      }
      if (this.form.original_content.trim() === "") {
        this.$message.error("请填写问题具体内容");
        return;
      }
      let credit1 = parseInt(this.form.credit1);
      if (credit1 > 0 && !this.isNumber(credit1)) {
        this.$message.error("请输入数字");
        return;
      }
      if (credit1 > 0 && credit1 > this.user.credit1) {
        this.$message.error("积分余额不足");
        return;
      }
      this.$api.Wenda.Store(this.form)
        .then((res) => {
          this.form.title = "";
          this.form.category_id = 0;
          this.form.original_content = "";
          this.form.render_content = "";
          this.form.images = [];
          this.form.credit1 = null;
          this.$message.success("发布成功");
          this.$emit("success", res.data.id, credit1 || 0);
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    imageUpdate(thumbs) {
      this.form.images = thumbs;
    },
  },
};
</script>
<style lang="less" scoped>
.mask {
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  .dialog-box {
    width: 700px;
    height: 584px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 30px;
    animation: scaleBig 0.3s;
    .tabs {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      padding-left: 30px;
      padding-right: 30px;
      box-sizing: border-box;
      align-items: center;
      position: relative;
      justify-content: space-between;
      margin-bottom: 10px;
      overflow: hidden;
      .tit {
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 18px;
        .notice_article_type {
          margin: 0 8px;
          font-size: 16px;
          color: #fc5531;
        }
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
    .qa-group-input-box {
      width: 100%;
      height: 443px;
      position: relative;
      overflow-y: auto;
      padding-left: 30px;
      padding-right: 0px;
      box-sizing: border-box;
      .qa-group-item {
        width: 100%;
        position: relative;
        .body-wrap {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin-bottom: 30px;
          flex-flow: row wrap;
          .title {
            width: 64px;
            height: 18px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 18px;
            margin-right: 30px;
          }
          .category {
            padding: 10px 15px;
            height: 34px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            margin-right: 20px;
            margin-top: 10px;
            &.active {
              border: 1px solid #3ca7fa;
              background: #3ca7fa;
              color: #fff;
            }
          }
        }
        .body {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin-bottom: 30px;

          .title {
            width: 88px;
            height: 18px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 18px;
            margin-right: 6px;
            .notice_article_type {
              margin: 0 8px;
              font-size: 16px;
              color: #fc5531;
            }
          }
          .img-wrap {
            width: 546px;
            display: flex;
            flex-direction: row;
            flex-flow: row wrap;
          }
          .input {
            width: 546px;
            height: 54px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            outline: none;
            padding-left: 15px;
            font-size: 16px;
          }

          .textarea {
            width: 546px;
            height: 102px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            padding: 15px;
            outline: none;
            resize: none;
          }
        }
      }
    }
    .bottom-item {
      width: 100%;
      height: 70px;
      position: relative;
      padding-left: 30px;
      padding-right: 30px;
      box-sizing: border-box;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
      z-index: 102;
      .body {
        width: 100%;
        height: 70px;
        display: flex;
        flex-direction: row;
        flex-flow: row wrap;
        align-items: center;
        .title {
          width: 64px;
          height: 18px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 18px;
          margin-right: 30px;
        }
        .credit1 {
          width: 546px;
          display: flex;
          flex-direction: row;
          align-items: center;

          .input2 {
            width: 164px;
            height: 48px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            outline: none;
            padding-left: 15px;
            font-size: 16px;
          }
          .help {
            height: 16px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 16px;
            margin-left: 24px;
          }
          .confirm-button {
            position: absolute;
            bottom: 10px;
            right: 36px;
            width: 132px;
            height: 48px;
            background: #cccccc;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 400;
            color: #ffffff;
            &.active {
              background: #3ca7fa;
            }
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
}
</style>
