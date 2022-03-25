<template>
  <div class="content">
    <div class="nav">
      <a @click="$router.push({ name: 'Exam' })">在线考试</a> /
      <a @click="$router.push({ name: 'ExamPractice' })">练习模式</a> /
      <span> {{ list.name }} </span>
    </div>
    <div class="contanier">
      <div class="banner-box">
        <template v-if="loading">
          <skeletonPaperInfo></skeletonPaperInfo>
        </template>
        <template v-else>
          <div class="title">{{ list.name }}</div>
          <div class="info">
            <div class="info-item">
              已练习：{{
                practiceUserRecord ? practiceUserRecord.submit_count : 0
              }}/{{ list.question_count }}
            </div>
          </div>
          <div class="btn-box">
            <div
              v-if="!can_join && list.charge > 0"
              class="button charge"
              @click="payOrder()"
            >
              购买练习 ￥{{ list.charge }}
            </div>
            <div v-if="can_join" class="button join" @click="join()">
              立即练习
            </div>
          </div>
        </template>
      </div>
      <div class="records-nox">
        <template v-if="loading">
          <skeletonPaper></skeletonPaper>
        </template>
        <template v-else>
          <div
            class="record-item"
            v-for="chapter in chapters"
            :key="chapter.id"
            @click="goPracticeChapter(chapter)"
          >
            <div class="item-name">
              {{ chapter.name }}
            </div>
            <div class="item-progress">
              <span
                >已练习{{ chapterSubmitCount(chapter) }}/{{
                  chapter.question_count
                }}</span
              >
            </div>
          </div>
        </template>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../../components/footer.vue";
import SkeletonPaper from "../../../components/skeleton/skeletonPaper.vue";
import SkeletonPaperInfo from "../../../components/skeleton/skeletonPaperInfo.vue";

export default {
  components: {
    NavFooter,
    SkeletonPaper,
    SkeletonPaperInfo,
  },
  data() {
    return {
      id: this.$route.query.id,
      list: [],
      chapters: [],
      userChapterRecords: [],
      practiceUserRecord: [],
      loading: false,
      can_join: false,
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
      this.$api.Exam.PracticeDetail(this.id).then((res) => {
        this.loading = false;
        this.list = res.data.practice;
        this.chapters = res.data.chapters;
        document.title = res.data.practice.name;
        this.can_join = res.data.can;
        this.practiceUserRecord = res.data.practice_user_record;
        this.userChapterRecords = res.data.user_chapter_records;
      });
    },
    chapterProgress(chapter) {
      if (typeof this.userChapterRecords[chapter.id] === "undefined") {
        return 0;
      }
      return parseInt(
        (this.userChapterRecords[chapter.id].submit_count /
          chapter.question_count) *
          100
      );
    },
    chapterSubmitCount(chapter) {
      if (typeof this.userChapterRecords[chapter.id] === "undefined") {
        return 0;
      }
      return this.userChapterRecords[chapter.id].submit_count;
    },
    goPracticeChapter(chapter) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (chapter.question_count === 0) {
        this.$message.error("无试题");
        return;
      }
      if (this.can_join === false) {
        this.$message.error("无权限参与");
        return;
      }
      this.$router.push({
        name: "ExamPracticePlay",
        query: {
          practiceId: this.list.id,
          chapterId: chapter.id,
        },
      });
    },
    join() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (this.can_join === false) {
        this.$message.error("无权限参与");
        return;
      }
      this.$router.push({
        name: "ExamPracticePlay",
        query: {
          day: 1,
          practiceId: this.list.id,
        },
      });
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
      this.$router.push({
        name: "order",
        query: {
          goods_type: "practice",
          goods_id: this.id,
          goods_charge: this.list.charge,
          goods_name: this.list.name,
          goods_label: "练习",
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
      background: linear-gradient(315deg, #f7b433 0%, #ed8917 100%);
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
            color: #f4a429;
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
            color: #f4a429;
          }
        }
      }
    }
    .records-nox {
      width: 100%;
      display: flex;
      flex-direction: column;
      .record-item {
        width: 100%;
        height: 116px;
        background: #ffffff;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 50px 30px;
        margin-bottom: 10px;
        cursor: pointer;
        &:last-child {
          margin-bottom: 0px;
        }
        &:hover {
          box-shadow: 0px 2px 4px 0px rgba(102, 102, 102, 0.1);
        }
        .item-time {
          width: 138px;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
        }
        .item-name {
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
        }
        .item-progress {
          height: 30px;
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 30px;
        }

        .item-type {
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
</style>
