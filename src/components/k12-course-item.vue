<template>
  <div class="vod-course-item-comp" @click="goShow">
    <div class="vod-course-thumb">
      <div class="thumb-bar">
        <thumb-bar :value="thumb" :width="264" :height="198"></thumb-bar>
      </div>
    </div>
    <div class="vod-course-body">
      <div class="vod-course-title">
        {{ title }}
      </div>
      <div class="vod-course-info">
        <div class="vod-course-sub">{{ category.name }}</div>
        <div class="vod-course-charge">
          <span class="charge-text" v-if="charge > 0">
            <template> <span class="unit">￥</span>{{ charge }} </template>
          </span>
          <span class="free-text" v-else> 免费 </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: [
    "cid",
    "title",
    "people-count",
    "thumb",
    "charge",
    "category",
    "type",
  ],
  computed: {
    ...mapState(["config"]),
  },
  methods: {
    goShow() {
      this.$router.push({
        name: "K12Detail",
        query: {
          id: this.cid,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.vod-course-item-comp {
  width: 100%;
  height: auto;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  border-radius: 8px;
  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
    .vod-course-thumb {
      .thumb-bar {
        transform: scale(1.1, 1.1);
      }
    }
  }
  .vod-course-thumb {
    width: 264px;
    height: 198px;
    border-radius: 8px 8px 0px 0px;
    overflow: hidden;
    .thumb-bar {
      width: 100%;
      height: 100%;
      transition: all 0.3s;
    }
  }

  .vod-course-body {
    box-sizing: border-box;
    width: 100%;
    height: auto;
    background-color: #fff;
    border-radius: 0px 0px 8px 8px;
    flex: 1;
    padding: 15px 15px 15px 10px;

    .vod-course-title {
      width: 100%;
      height: 16px;
      float: left;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 16px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 20px;
    }

    .vod-course-info {
      width: 100%;
      height: 20px;
      float: left;
      display: flex;
      align-items: center;

      .vod-course-sub {
        flex: 1;
        text-align: left;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
      }

      .vod-course-charge {
        flex: 1;
        text-align: right;
        height: 20px;
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
          color: #04c877;
        }
      }
    }
  }
}
</style>
