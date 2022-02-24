<template>
  <div class="content">
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
        <div class="learn-item" v-for="item in list" :key="item.id">
          <learn-path-item
            :cid="item.id"
            :charge="item.charge"
            :original-charge="item.original_charge"
            :name="item.name"
            :thumb="item.thumb"
            :courses-count="item.courses_count"
            :steps-count="stepsCount(item)"
            :desc="item.desc"
          ></learn-path-item>
        </div>
      </div>
    </template>
    <none v-else></none>
    <div id="page" v-show="list.length > 0 && total > pagination.size">
      <page-box
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
import None from "../../components/none.vue";
import PageBox from "../../components/page.vue";
import LearnPathItem from "../../components/learn-path-item.vue";
import NavFooter from "../../components/footer.vue";
import FilterTwoClass from "../../components/filter-two-class.vue";
import SkeletonCourseList from "../../components/skeleton/skeletonCourseList.vue";
import SkeletonNav from "../../components/skeleton/skeletonNav.vue";

export default {
  components: {
    NavFooter,
    PageBox,
    LearnPathItem,
    None,
    SkeletonCourseList,
    FilterTwoClass,
    SkeletonNav,
  },
  data() {
    return {
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 16,
        category_id: 0,
      },
      cid: this.$route.query.cid || 0,
      child: this.$route.query.child || 0,
      steps: [],
      loading: false,
      navLoading: false,
      categories: [],
    };
  },
  mounted() {
    this.navLoading = true;
    this.params();
    this.getData();
  },
  methods: {
    filterChange(cid1, cid2) {
      if (cid2 !== 0) {
        this.pagination.category_id = cid2;
      } else {
        this.pagination.category_id = cid1;
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
    params() {
      this.$api.LearnPath.Create().then((res) => {
        this.navLoading = false;
        this.categories = res.data;
        this.filterChange(this.cid, this.child);
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.LearnPath.List(this.pagination).then((res) => {
        this.loading = false;
        this.steps = res.data.steps;
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    stepsCount(item) {
      let id = item.id;
      if (typeof this.steps[id] === "undefined") {
        return 0;
      }
      return this.steps[id].length;
    },
    goDetail(id) {
      this.$router.push({
        name: "learnPathDetail",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .contanier {
    width: 1200px;
    min-height: 500px;
    margin: 0 auto;
    overflow: hidden;
    display: grid;
    grid-row-gap: 30px;
    grid-column-gap: 48px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    flex-direction: row;
    box-sizing: border-box;
    padding-top: 30px;
    padding-bottom: 20px;
    .learn-item {
      width: 264px;
    }
  }
  #page {
    width: 1200px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
