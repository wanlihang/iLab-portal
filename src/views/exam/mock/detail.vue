<template>
  <div class="content">
    <div class="nav">
      <a @click="$router.push({ name: 'Exam' })">在线考试</a> /
      <a @click="$router.push({ name: 'ExamMockPapers' })">模拟考试</a> /
      <span> {{ list.title }} </span>
    </div>
    <div class="contanier">
      <div class="banner-box">
        <template v-if="loading">
          <skeletonPaperInfo></skeletonPaperInfo>
        </template>
        <template v-else>
          <div class="title">{{ list.title }}</div>
          <div class="info">
            <div class="info-item">总分：{{ list.score }}分</div>
            <i></i>
            <div class="info-item">及格分：{{ list.pass_score }}分</div>
            <i></i>
            <div class="info-item">题数：{{ sumQuestion }}道</div>
            <i></i>
            <div class="info-item">可考试次数：不限</div>
          </div>
          <div class="btn-box">
            <div
              v-if="!can_join && list.charge > 0"
              class="button charge"
              @click="payOrder()"
            >
              购买试卷 ￥{{ list.charge }}
            </div>
            <div v-if="can_join" class="button join" @click="join()">
              立即考试
            </div>
          </div>
        </template>
      </div>
      <div class="records-nox">
        <div class="tit">考试记录</div>
        <div class="records">
          <template v-if="loading">
            <skeletonPaperDetail></skeletonPaperDetail>
          </template>
          <template v-else-if="joinRecords.length > 0">
            <div class="record-item" v-for="item in joinRecords" :key="item.id">
              <div class="item-type">
                <span v-if="item.status === 1">{{ item.get_score }}分</span>
                <!-- <span v-else-if="item.status === 3">已完成</span> -->
                <span v-else class="red">未完成</span>
              </div>
              <div class="item-pro">
                <span v-if="item.status === 1">已结束</span>
                <span v-else>考试中</span>
              </div>
              <div class="item-status" @click="join(item)">
                <span v-if="item.status === 1">考试详情</span>
                <span class="red" v-else>继续考试</span>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </div>
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
import SkeletonPaperInfo from "../../../components/skeleton/skeletonPaperInfo.vue";

export default {
  components: {
    NavFooter,
    None,
    SkeletonPaperDetail,
    SkeletonPaperInfo,
  },
  data() {
    return {
      id: this.$route.query.id,
      list: [],
      join_count: 0,
      requiredCourses: [],
      joinRecords: [],
      questions: [],
      loading: false,
      can_join: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
    sumQuestion: function () {
      let val = 0;
      if (this.questions.num && this.questions.num.choice) {
        val = val + parseInt(this.questions.num.choice);
      }
      if (this.questions.num && this.questions.num.select) {
        val = val + parseInt(this.questions.num.select);
      }
      if (this.questions.num && this.questions.num.input) {
        val = val + parseInt(this.questions.num.input);
      }
      if (this.questions.num && this.questions.num.qa) {
        val = val + parseInt(this.questions.num.qa);
      }
      if (this.questions.num && this.questions.num.judge) {
        val = val + parseInt(this.questions.num.judge);
      }
      if (this.questions.num && this.questions.num.cap) {
        val = val + parseInt(this.questions.num.cap);
      }
      return val;
    },
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
      this.$api.Exam.MockPaper.Detail(this.id).then((res) => {
        this.loading = false;
        this.list = res.data.paper;
        document.title = res.data.paper.title;
        this.questions = JSON.parse(res.data.paper.rule);
        this.joinRecords = res.data.user_papers;
        this.can_join = res.data.can;
        this.requiredCourses = res.data.required_courses;
      });
    },
    join(userPaper) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (this.can_join === false) {
        this.$message.error("无权限参与");
        return;
      }
      if (typeof userPaper !== "undefined") {
        this.$router.push({
          name: "ExamMockpaperPlay",
          query: {
            id: this.id,
            pid: userPaper.id,
          },
        });
      } else {
        this.$api.Exam.MockPaper.Join(this.id)
          .then((res) => {
            let record_id = res.data.recordId;
            this.$router.push({
              name: "ExamMockpaperPlay",
              query: {
                id: this.id,
                pid: record_id,
              },
            });
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      }
    },
    payVIP() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "vip",
      });
    },
    payOrder() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (this.list.charge === 0) {
        this.$message.error("当前试卷无法购买");
        return;
      }
      if (this.list.enabled_invite === 1) {
        this.$message.error("当前试卷仅限邀请用户参与");
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "mockpaper",
          goods_id: this.id,
          goods_charge: this.list.charge,
          goods_name: this.list.title,
          goods_label: "模拟试卷",
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
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
  .contanier {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
    .banner-box {
      width: 100%;
      height: 262px;
      background: linear-gradient(135deg, #00baa6 0%, #00baa6 0%, #00dbcf 100%);
      box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
      border-radius: 8px;
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
      .title {
        width: 100%;
        text-align: center;
        height: 28px;
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        line-height: 28px;
        margin-top: 50px;
        margin-bottom: 30px;
      }
      .info {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-bottom: 50px;
        .info-item {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          line-height: 14px;
        }
        i {
          width: 1px;
          height: 14px;
          background: #ffffff;
          margin-left: 10px;
          margin-right: 10px;
        }
      }
      .btn-box {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
          &.join {
            width: 104px;
            height: 40px;
            background: #ffffff;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 400;
            color: #00bba7;
          }
          &.vip-free {
            width: 104px;
            height: 40px;
            border-radius: 4px;
            border: 1px solid #ffffff;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            margin-right: 30px;
          }
          &.charge {
            padding-left: 20px;
            padding-right: 20px;
            height: 40px;
            background: #ffffff;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 400;
            color: #00bba7;
          }
        }
      }
    }
    .records-nox {
      width: 100%;
      min-height: 360px;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 30px;
      .tit {
        width: 100%;
        height: 16px;
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 16px;
        margin-bottom: 30px;
      }
      .records {
        width: 100%;
        display: flex;
        flex-direction: column;
        .record-item {
          width: 100%;
          height: 14px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          &:last-child {
            margin-bottom: 0px;
          }
          .item-time {
            width: 138px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 14px;
          }

          .item-type {
            width: 138px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 14px;
            &.red {
              color: #ff5068;
            }
          }
          .item-pro {
            width: 138px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 14px;
            &.red {
              color: #ff5068;
            }
          }
          .item-status {
            width: 56px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #3ca7fa;
            line-height: 14px;
            cursor: pointer;
            &.red {
              color: #ff5068;
            }
          }
        }
      }
    }
  }
}
</style>
