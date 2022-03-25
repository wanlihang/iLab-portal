<template>
  <div class="topic-item-comp" @click="goDetail">
    <div class="topic-thumb">
      <div class="thumb-bar">
        <thumb-bar :value="thumb" :width="133" :height="100"></thumb-bar>
      </div>
    </div>
    <div class="topic-body">
      <div class="topic-title">{{ title }}</div>
      <div class="topic-info">
        <div class="category">{{ category }}</div>
        <span class="read-count">{{ viewTimes }}次阅读</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "cid",
    "category",
    "title",
    "thumb",
    "viewTimes",
    "updatedAt",
    "commentTimes",
    "charge",
    "isVipFree",
    "isNeedLogin",
    "voteCount",
    "commentCount",
  ],
  methods: {
    goDetail() {
      this.$router.push({
        name: "topicDetail",
        query: {
          id: this.cid,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.topic-item-comp {
  width: 100%;
  height: 140px;
  float: left;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  cursor: pointer;
  box-sizing: border-box;
  padding: 20px 30px;

  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
    .topic-thumb {
      .thumb-bar {
        transform: scale(1.1, 1.1);
      }
    }
  }
  &:last-child {
    margin-bottom: 10px;
  }

  .topic-body {
    flex: 1;
    box-sizing: border-box;
    padding-top: 15px;

    .topic-title {
      width: 556px;
      height: 20px;
      float: left;
      margin-bottom: 28px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .topic-info {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      .category {
        padding: 5px 8px;
        background: rgba(255, 80, 104, 0.1);
        border-radius: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #ff5068;
        line-height: 14px;
        margin-right: 30px;
      }
      .read-count {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }
    }
  }

  .topic-thumb {
    width: 133px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 20px;
    .thumb-bar {
      width: 100%;
      height: 100%;
      transition: all 0.3s;
    }
  }
}
</style>
