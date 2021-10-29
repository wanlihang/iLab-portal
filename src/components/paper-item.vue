<template>
  <div class="paper-item-comp" @click="goDetail">
    <div class="status" v-if="records[cid]">已参考</div>
    <div class="title">{{ title }}</div>
    <div class="info" v-if="type === 'paper'">
      <span>共{{ questionsCount }}道题</span>
      <span class="item">|</span>
      <span>{{ expiredMinutes }}分钟</span>
    </div>
    <div class="info" v-if="type === 'mock'">
      <span>总{{ score }}分</span>
      <span class="item">|</span>
      <span>{{ passScore }}分及格</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: [
    "type",
    "cid",
    "records",
    "questionsCount",
    "title",
    "thumb",
    "score",
    "expiredMinutes",
    "tryTimes",
    "isVipFree",
    "charge",
    "isFree",
    "requiredCourses",
    "enabledInvite",
    "passScore",
  ],
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    goDetail() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (this.type === "paper") {
        this.$router.push({
          name: "ExamPapersDetail",
          query: {
            id: this.cid,
          },
        });
      }
      if (this.type === "mock") {
        this.$router.push({
          name: "ExamMockpaperDetail",
          query: {
            id: this.cid,
          },
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.paper-item-comp {
  width: 100%;
  height: 116px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 50px;
  margin-bottom: 10px;
  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
  }
  .status {
    width: 62px;
    height: 30px;
    background: #3ca7fa;
    border-radius: 8px 0px 8px 0px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
  }

  .title {
    height: 16px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 16px;
  }

  .info {
    height: 30px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 30px;

    .item {
      height: 14px;
      margin-left: 15px;
      margin-right: 15px;
    }
  }
}
</style>