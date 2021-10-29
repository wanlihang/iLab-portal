<template>
  <div class="content">
    <div class="contanier">
      <div class="announcement-box">
        <template v-if="loading">
          <skeletonNotice></skeletonNotice>
        </template>
        <template v-else-if="notice">
          <div class="notice">
            <div class="title">{{ notice.title }}</div>
            <div class="stat">
              <span class="div-times">{{ notice.created_at | changeTime }}</span
              ><span class="div-times">{{ notice.view_times }}次阅读</span>
            </div>
            <div class="line"></div>
            <div class="notice-content" v-html="notice.announcement"></div>
          </div>
        </template>
      </div>
      <div class="announcement-list">
        <div class="tit">历史公告</div>
        <template v-if="loading2">
          <skeletonRightNotice></skeletonRightNotice>
        </template>
        <template v-else>
          <div
            class="announcement-item"
            v-for="item in list"
            :key="item.id"
            :class="{ active: item.id === notice.id }"
            @click="goDetail(item.id)"
          >
            <div class="item-title">
              {{ item.title }}
            </div>
            <div class="item-info">
              <div class="item-time">{{ item.created_at | changeTime }}</div>
              <div class="item-time">{{ item.view_times }}次阅读</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import NavFooter from "../../components/footer.vue";
import SkeletonNotice from "../../components/skeleton/skeletonNotice.vue";
import SkeletonRightNotice from "../../components/skeleton/skeletonRightNotice.vue";

export default {
  components: {
    NavFooter,
    SkeletonNotice,
    SkeletonRightNotice,
  },
  data() {
    return {
      loading: false,
      loading2: false,
      id: this.$route.query.id,
      notice: [],
      list: [],
    };
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  mounted() {
    this.getData();
    this.getList();
  },
  methods: {
    goDetail(id) {
      this.$router.push({
        name: "announcement",
        query: {
          id: id,
        },
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Home.AnnouncementDetail(this.id).then((res) => {
        this.loading = false;
        this.notice = res.data;
        document.title = "公告：" + res.data.title;
      });
    },
    getList() {
      if (this.loading2) {
        return;
      }
      this.loading2 = true;
      this.$api.Home.AnnouncementList().then((res) => {
        this.loading2 = false;
        this.list = res.data.data;
      });
    },
  },
};
</script>
<style lang='less' scoped>
.content {
  width: 100%;
  .contanier {
    width: 1200px;
    min-height: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    padding-top: 30px;
    .announcement-box {
      width: 866px;
      height: auto;
      border-radius: 8px;
      background: #ffffff;
      margin-right: 30px;
      padding: 30px;
      box-sizing: border-box;
      .notice {
        width: 100%;
        display: flex;
        flex-direction: column;
        .title {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          height: auto;
          font-size: 18px;
          font-weight: 600;
          color: #333333;
          line-height: 18px;
          margin-bottom: 30px;
        }
        .stat {
          width: 100%;
          display: flex;
          flex-direction: row;
          height: 14px;
          .div-times {
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 14px;
            &:first-child {
              margin-right: 27px;
            }
          }
        }
        .line {
          width: 100%;
          height: 1px;
          background: #e5e5e5;
          margin: 30px 0px;
        }
        .notice-content {
          width: 100%;
          font-size: 15px;
          font-weight: 400;
          color: #121212;
          line-height: 24px;
        }
      }
    }
    .announcement-list {
      box-sizing: border-box;
      width: 304px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      padding: 30px;
      .tit {
        width: 100%;
        height: 18px;
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        line-height: 18px;
        margin-bottom: 30px;
      }
      .announcement-item {
        width: 100%;
        margin-bottom: 30px;
        &.active {
          .item-title {
            color: #3ca7fa;
          }
        }
        &:last-child {
          margin-bottom: 0px;
        }
        cursor: pointer;
        &:hover {
          .item-title {
            color: #3ca7fa;
          }
        }
        .item-title {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          font-size: 15px;
          font-weight: 400;
          color: #333333;
          line-height: 24px;
          margin-bottom: 10px;
        }
        .item-info {
          width: 100%;
          height: 12px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          .item-time {
            height: 12px;
            font-size: 12px;
            font-weight: 400;
            color: #999999;
            line-height: 12px;
          }
        }
      }
    }
  }
}
</style>
