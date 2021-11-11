<template>
  <div class="content">
    <div class="nav">
      <a @click="$router.push({ name: 'Exam' })">在线考试</a> /
      <span> 考试错题本 </span>
    </div>
    <div class="banner">
      <div class="tit">考试错题本</div>
      <div class="btn-box">
        <div class="day-play" @click="run('random')">随机练习</div>
        <div class="btn-all-play" @click="run('order')">全部练习</div>
      </div>
    </div>
    <div class="statistics-box">
      <div class="tit">每日错题统计</div>
      <div class="statistics">
        <ve-histogram :data="chartData"> </ve-histogram>
      </div>
    </div>

    <div class="contanier">
      <div class="tit">错题本试题</div>

      <div class="question-box">
        <template v-if="loading">
          <skeletonPaperDetail></skeletonPaperDetail>
        </template>
        <template v-else-if="list.length > 0">
          <div class="question-item" v-for="item in list" :key="item.id">
            <div
              class="question-name"
              v-if="item.type === 6"
              v-html="JSON.parse(item.content).header"
            ></div>
            <div class="question-name" v-else v-html="item.content"></div>
            <div class="question-type">{{ item.type_text }}</div>
            <a class="link-detail" @click="goDetail(item.id)">查看详情</a>
          </div>
        </template>
        <none type="white" v-else></none>
      </div>
    </div>

    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../../components/footer.vue";
import None from "../../../components/none.vue";
import SkeletonPaperDetail from "../../../components/skeleton/skeletonPaperDetail.vue";

export default {
  components: {
    NavFooter,
    None,
    SkeletonPaperDetail,
  },
  data() {
    return {
      list: [],
      chartData: {
        columns: ["日期", "新增"],
        rows: [],
      },
      total: null,
      loading: false,
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
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Exam.WrongBook.Detail().then((res) => {
        this.loading = false;
        let results = res.data.questions;
        this.chartData.rows = res.data.data;
        this.wrong_rate = res.data.wrong_rate.toFixed(2);
        this.wrong_question_count = res.data.wrong_question_count;
        this.user_question_count = res.data.user_question_count;
        let box = [];
        for (let key in results) {
          for (var i = 0; i < results[key].length; i++) {
            box.push(results[key][i]);
          }
        }
        this.list = box;
      });
    },
    goDetail(id) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "ExamWrongBookPlay",
        query: {
          id: id,
        },
      });
    },
    run(mode) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (this.wrong_question_count === 0) {
        this.$message.error("暂无错题");
        return;
      }
      this.$router.push({
        name: "ExamWrongBookPlay",
        query: {
          mode: mode,
        },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.content {
  width: 100%;
  .nav {
    width: 1200px;
    margin: 0 auto;
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
  .banner {
    width: 1200px;
    margin: 0 auto;
    height: 198px;
    background: linear-gradient(315deg, #ff7474 0%, #ff4040 100%);
    box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
    border-radius: 8px;
    margin-bottom: 30px;
    padding-top: 50px;
    box-sizing: border-box;
    .tit {
      width: 100%;
      height: 28px;
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 28px;
      text-align: center;
      margin-bottom: 50px;
    }
    .btn-box {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .day-play {
        width: 104px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        margin-right: 50px;
        &:hover {
          opacity: 0.8;
        }
      }
      .btn-all-play {
        width: 104px;
        height: 40px;
        background: #ffffff;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 400;
        color: #ff5068;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .statistics-box {
    width: 1200px;
    margin: 0 auto;
    height: auto;
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 30px;
    padding: 30px;
    box-sizing: border-box;
    .tit {
      width: 100%;
      height: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
      margin-bottom: 50px;
    }
    .statistics {
      width: 100%;
      height: auto;
    }
  }
  .contanier {
    width: 1200px;
    min-height: 500px;
    margin: 0 auto;
    overflow: hidden;
    background: #ffffff;
    padding: 30px;
    box-sizing: border-box;
    .tit {
      width: 100%;
      height: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
      margin-bottom: 30px;
    }
    .question-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      .question-item {
        width: 100%;
        height: 40%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        &:last-child {
          margin-bottom: 0px;
        }
        .question-name {
          width: 815px;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .question-type {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
        }
        .link-detail {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #3ca7fa;
          line-height: 14px;
        }
      }
    }
  }
}
</style>