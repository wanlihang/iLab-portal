<template>
  <div class="content">
    <div class="first-box">
      <div class="tit">考试大厅</div>
      <div class="model">
        <div class="left-model" @click="goPaper()">
          <div class="title">考试中心</div>
          <div class="info">在线真题考试</div>
          <img class="icon" src="../../assets/img/commen/test.png" />
        </div>
        <div class="right-model">
          <div class="small-model mockpaper" @click="goMock()">
            <div class="title">模拟考试</div>
            <div class="info">模拟卷考试</div>
            <img class="icon" src="../../assets/img/commen/virtual-test.png" />
          </div>
          <div class="small-model wrongbook" @click="goWrong()">
            <div class="title">考试错题本</div>
            <div class="info">真题模拟考试错题都在这里</div>
            <img class="icon" src="../../assets/img/commen/wrong-book.png" />
          </div>
        </div>
      </div>
    </div>
    <div class="second-box">
      <div class="tit">强化练习</div>
      <div class="model">
        <div class="small-model practice" @click="goPractice()">
          <div class="title">练习模式</div>
          <div class="info">一边练习一边对答案</div>
          <img class="icon" src="../../assets/img/commen/practice.png" />
        </div>
        <div class="small-model collect" @click="goCollect()">
          <div class="title">收藏习题</div>
          <div class="info">收藏练习题随时巩固</div>
          <img class="icon" src="../../assets/img/commen/collect-paper.png" />
        </div>
      </div>
    </div>
    <!--<div class="second-box">
      <div class="tit">试题库</div>
      <div class="model">
        <div class="normal-model questionbank" @click="goQuestionBank()">
          <div class="title">试题库</div>
          <div class="info">海量试题全部练习</div>
          <img class="icon" src="../../assets/img/commen/storehouse.png" />
        </div>
      </div>
    </div>-->
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
export default {
  components: {
    NavFooter,
  },
  data() {
    return {
      loading: false,
      list: [],
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {},
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    goPaper() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({ name: "ExamPapers" });
    },
    goWrong() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({ name: "ExamWrongBook" });
    },
    goMock() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({ name: "ExamMockPapers" });
    },
    goPractice() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({ name: "ExamPractice" });
    },
    goCollect() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({ name: "ExamCollection" });
    },
    goQuestionBank() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({ name: "ExamQuestionbank" });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  .first-box {
    width: 1200px;
    margin: 0 auto;
    height: 506px;
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 27px 30px 30px 30px;
    margin-top: 30px;

    .tit {
      width: 100%;
      height: 22px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
      margin-bottom: 27px;
    }
    .model {
      width: 100%;
      height: 400px;
      display: flex;
      flex-direction: row;
      box-sizing: border-box;
      .left-model {
        width: 555px;
        height: 400px;
        background: linear-gradient(315deg, #33baf7 0%, #1784ed 100%);
        border-radius: 8px;
        box-sizing: border-box;
        cursor: pointer;
        margin-right: 30px;
        position: relative;
        padding: 0px 30px;
        box-sizing: border-box;
        .title {
          margin-top: 26px;
          width: 100%;
          height: 33px;
          font-size: 24px;
          font-weight: 600;
          color: #ffffff;
          line-height: 33px;
          letter-spacing: 1px;
        }
        .info {
          width: 100%;
          height: 22px;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          line-height: 22px;
          margin-top: 20px;
        }
        .icon {
          width: 100px;
          height: 100px;
          position: absolute;
          top: 30px;
          right: 50px;
        }
        &:hover {
          box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
        }
      }
      .right-model {
        width: 555px;
        height: 400px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .small-model {
          width: 555px;
          height: 185px;
          border-radius: 8px;
          cursor: pointer;
          position: relative;
          padding: 0px 30px;
          box-sizing: border-box;
          .title {
            margin-top: 26px;
            width: 100%;
            height: 33px;
            font-size: 24px;
            font-weight: 600;
            color: #ffffff;
            line-height: 33px;
            letter-spacing: 1px;
          }
          .info {
            width: 100%;
            height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            line-height: 22px;
            margin-top: 20px;
          }
          .icon {
            width: 100px;
            height: 100px;
            position: absolute;
            top: 30px;
            right: 50px;
          }
          &.mockpaper {
            background: linear-gradient(
              135deg,
              #00baa6 0%,
              #00baa6 0%,
              #00dbcf 100%
            );
            margin-bottom: 30px;
          }
          &.wrongbook {
            background: linear-gradient(315deg, #ff7474 0%, #ff4040 100%);
          }
          &:hover {
            box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
          }
        }
      }
    }
  }
  .second-box {
    width: 1200px;
    margin: 0 auto;
    height: 291px;
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 27px 30px 30px 30px;
    margin-top: 30px;
    .tit {
      width: 100%;
      height: 22px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
      margin-bottom: 27px;
    }
    .model {
      width: 100%;
      height: 185px;
      display: flex;
      flex-direction: row;
      box-sizing: border-box;
      .normal-model {
        width: 100%;
        height: 185px;
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        padding: 0px 30px;
        box-sizing: border-box;
        background: linear-gradient(90deg, #ff4c72 0%, #ff9996 100%);
        .title {
          margin-top: 26px;
          width: 100%;
          height: 33px;
          font-size: 24px;
          font-weight: 600;
          color: #ffffff;
          line-height: 33px;
          letter-spacing: 1px;
        }
        .info {
          width: 100%;
          height: 22px;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          line-height: 22px;
          margin-top: 20px;
        }
        .icon {
          width: 100px;
          height: 100px;
          position: absolute;
          top: 30px;
          right: 50px;
        }
        &:hover {
          box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
        }
      }
      .small-model {
        width: 555px;
        height: 185px;
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        padding: 0px 30px;
        box-sizing: border-box;
        .title {
          margin-top: 26px;
          width: 100%;
          height: 33px;
          font-size: 24px;
          font-weight: 600;
          color: #ffffff;
          line-height: 33px;
          letter-spacing: 1px;
        }
        .info {
          width: 100%;
          height: 22px;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          line-height: 22px;
          margin-top: 20px;
        }
        .icon {
          width: 100px;
          height: 100px;
          position: absolute;
          top: 30px;
          right: 50px;
        }
        &.practice {
          background: linear-gradient(315deg, #f7b433 0%, #ed8917 100%);
          margin-right: 30px;
        }
        &.collect {
          background: linear-gradient(270deg, #c48df1 0%, #9254de 100%);
        }
        &:hover {
          box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
        }
      }
    }
  }
}
</style>
