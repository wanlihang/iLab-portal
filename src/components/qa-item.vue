<template>
  <div class="qa-item-comp" @click="goDetail">
    <div class="icon">
      <img src="../assets/img/commen/icon-question.png" />
    </div>
    <template v-if="status === 1">
      <div class="status-label">{{ statusText }}</div>
    </template>
    <div class="body">
      <div class="title">
        {{ title }}
      </div>
      <div class="stat">
        <span class="answer-count">{{ answerCount }}个回答</span>
        <span class="view-times">{{ viewTimes }}次浏览</span>

        <template v-if="credit1 > 0">
          <span class="credit1-label">{{ credit1 }}积分</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "cid",
    "title",
    "answerCount",
    "category",
    "credit1",
    "images",
    "isHot",
    "isRec",
    "lastAnswerAt",
    "money",
    "statusText",
    "status",
    "user-nickname",
    "user-avatar",
    "voteCount",
    "viewTimes",
  ],
  methods: {
    goDetail() {
      this.$router.push({
        name: "wendaDetail",
        query: {
          id: this.cid,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.qa-item-comp {
  float: left;
  display: flex;
  flex-direction: row;
  width: 769px;
  height: 134px;
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  cursor: pointer;
  padding: 20px;
  position: relative;
  .status-label {
    position: absolute;
    right: 30px;
    bottom: 16px;
    background: #04c877;
    color: white;
    padding: 5px 10px;
    border-radius: 2px;
    line-height: 12px;
    font-size: 12px;
  }
  &:last-child {
    margin-bottom: 10px;
  }
  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
  }

  .icon {
    width: 30px;
    margin-right: 30px;
    img {
      width: 30px;
      height: 30px;
    }
  }
  .body {
    width: 659px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      width: 100%;
      font-size: 20px;
      font-weight: 600;
      color: #333333;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .stat {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      .answer-count {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        margin-right: 30px;
      }
      .view-times {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        margin-right: 30px;
      }

      .credit1-label {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #04c877;
        line-height: 14px;
      }
    }
  }
}
</style>
