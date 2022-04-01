<template>
  <div class="book-item-comp" @click="goDetail">
    <div class="book-thumb">
      <div class="thumb-bar">
        <thumb-bar :value="thumb" :width="120" :height="160"></thumb-bar>
      </div>
    </div>
    <div class="book-body">
      <div class="book-info">
        <div class="book-name">{{ name }}</div>
        <!--<div class="book-user-count">{{ userCount }}订阅</div>-->
      </div>
      <div class="book-desc">{{ shortDesc }}</div>

      <div class="book-charge">
        <div class="charge-text" v-if="charge !== 0">
          <span class="unit">￥</span>{{ charge }}
        </div>
        <div class="free-text" v-else>免费</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "cid",
    "name",
    "thumb",
    "view-times",
    "shortDesc",
    "publishedAt",
    "charge",
    "userCount",
    "isVipFree",
  ],
  data() {
    return {};
  },
  methods: {
    goDetail() {
      this.$router.push({
        name: "bookDetail",
        query: {
          id: this.cid,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.book-item-comp {
  width: 100%;
  height: 200px;
  background: #ffffff;
  border-radius: 8px;
  float: left;
  display: flex;
  cursor: pointer;
  box-sizing: border-box;
  padding: 20px 30px;
  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
    .book-thumb {
      .thumb-bar {
        transform: scale(1.1, 1.1);
      }
    }
  }

  .book-thumb {
    width: 120px;
    height: 160px;
    overflow: hidden;
    border-radius: 8px;
    margin-right: 20px;
    .thumb-bar {
      width: 100%;
      height: 100%;
      transition: all 0.3s;
    }
  }

  .book-body {
    flex: 1;
    box-sizing: border-box;
    padding-top: 20px;

    .book-desc {
      width: 569px;
      height: 60px;
      float: left;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }

    .book-info {
      width: 569px;
      height: 20px;
      float: left;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 20px;
      .book-name {
        max-width: 450px;
        height: 20px;
        line-height: 20px;
        float: left;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .book-user-count {
        margin-left: 30px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
      }
    }
    .book-charge {
      width: 569px;
      font-size: 20px;
      line-height: 20px;
      font-weight: 600;

      .charge-text {
        color: #ff5858;

        .unit {
          font-size: 14px;
        }
      }

      .free-text {
        font-size: 14px;
        font-weight: 600;
        color: #04c877;
      }
    }
  }
}
</style>
