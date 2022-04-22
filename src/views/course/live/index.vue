<template>
  <div class="content page-main-body-box">
    <filter-two-class
      v-show="!navLoading"
      :categories="categories"
      :cid="cid"
      :child="child"
      @change="filterChange"
    ></filter-two-class>
    <template v-if="navLoading">
      <skeletonNav></skeletonNav>
    </template>
    <template v-if="loading">
      <div style="margin-top: 30px">
        <skeletonCourseList></skeletonCourseList>
      </div>
    </template>
    <template v-else-if="list.length > 0">
      <div class="contanier">
        <div
          class="live-course-item"
          v-for="course in list"
          :key="course.id"
          @click="goLiveDetail(course)"
        >
          <div class="live-course-thumb">
            <div class="thumb-bar">
              <thumb-bar
                :value="course.thumb"
                :width="264"
                :height="198"
              ></thumb-bar>
            </div>
          </div>
          <div class="live-course-body">
            <div class="live-course-title">
              {{ course.title }}
            </div>
            <div class="live-course-info">
              <div class="live-course-sub">{{ course.category.name }}</div>
              <div class="live-course-charge">
                <span class="charge-text" v-if="course.charge > 0">
                  <template>
                    <span class="unit">￥</span>{{ course.charge }}
                  </template>
                </span>
                <span class="free-text" v-else> 免费 </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <none v-else></none>
    <div id="page" v-show="list.length > 0 && total > pagination.size">
      <page-box
        :key="pagination.page"
        :page="pagination.page"
        :totals="total"
        @current-change="changepage"
        :pageSize="pagination.size"
        :tab="false"
      ></page-box>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import None from "../../../components/none.vue";
import FilterTwoClass from "../../../components/filter-two-class.vue";
import PageBox from "../../../components/page.vue";
import NavFooter from "../../../components/footer.vue";
import SkeletonCourseList from "../../../components/skeleton/skeletonCourseList.vue";
import SkeletonNav from "../../../components/skeleton/skeletonNav.vue";

export default {
  components: {
    FilterTwoClass,
    PageBox,
    NavFooter,
    None,
    SkeletonCourseList,
    SkeletonNav,
  },
  data() {
    return {
      pageName: "live-list",
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 16,
        cid: 0,
      },
      cid: this.$route.query.cid || 0,
      child: this.$route.query.child || 0,
      categories: [],
      over: false,
      loading: false,
      navLoading: false,
    };
  },
  mounted() {
    this.navLoading = true;
    this.getData();
  },
  activated() {
    this.changefilter();
    this.$utils.scrollTopSet(this.pageName);
  },
  beforeRouteLeave(to, from, next) {
    this.$utils.scrollTopRecord(this.pageName);
    next();
  },
  methods: {
    changefilter() {
      let cid1 = this.cid;
      let cid2 = this.child;
      if (parseInt(cid1) === 0) {
        this.$router.push({
          path: this.$route.path,
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            cid: cid1,
            child: cid2,
          },
        });
      }
    },
    goLiveDetail(item) {
      this.$router.push({ name: "liveDetail", query: { id: item.id } });
    },
    filterChange(cid1, cid2) {
      if (parseInt(cid1) === 0) {
        this.$router.push({
          path: this.$route.path,
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            cid: cid1,
            child: cid2,
          },
        });
      }
      this.resetData();
      this.getData();
    },
    resetData() {
      this.list = [];
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
      window.scrollTo(0, 0);
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.cid = this.$route.query.cid || 0;
      this.child = this.$route.query.child || 0;
      if (parseInt(this.child) === 0) {
        this.pagination.cid = this.cid;
      } else {
        this.pagination.cid = this.child;
      }
      this.$api.Live.List(this.pagination).then((res) => {
        this.loading = false;
        this.navLoading = false;
        let list = res.data.data.data;
        this.categories = res.data.categories;
        this.total = res.data.data.total;
        if (list.length > 0) {
          this.list = list;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  .contanier {
    width: 1200px;
    min-height: 500px;
    margin: 0 auto;
    display: grid;
    row-gap: 30px;
    column-gap: 48px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    overflow: hidden;
    padding-top: 30px;
    .live-course-item {
      width: 100%;
      height: 273px;
      display: flex;
      cursor: pointer;
      flex-direction: column;
      border-radius: 8px;
      &:hover {
        box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
        .live-course-thumb {
          .thumb-bar {
            transform: scale(1.1, 1.1);
          }
        }
      }
      .live-course-thumb {
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

      .live-course-body {
        box-sizing: border-box;
        width: 100%;
        height: auto;
        background-color: #fff;
        border-radius: 0px 0px 8px 8px;
        padding: 15px 15px 15px 10px;

        .live-course-title {
          width: 100%;
          height: 20px;
          float: left;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 20px;
        }

        .live-course-info {
          width: 100%;
          height: 20px;
          float: left;
          display: flex;
          align-items: center;

          .live-course-sub {
            flex: 1;
            text-align: left;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            line-height: 14px;
          }

          .live-course-charge {
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
  }
  #page {
    width: 1200px;
    margin: 0 auto;
    margin-top: 70px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
