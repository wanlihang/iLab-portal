<template>
  <div class="content">
    <filter-two-class
      v-show="!navLoading"
      :categories="categories"
      :cid="pagination.cid1"
      :child="pagination.cid2"
      @change="filterChange3"
    ></filter-two-class>
    <filter-box
      v-show="!navLoading"
      :categories1="scenes"
      :cid1="pagination.t"
      @change="filterChange"
    ></filter-box>

    <template v-if="navLoading">
      <skeletonNav></skeletonNav>
      <skeletonNav2></skeletonNav2>
    </template>
    <template v-if="loading">
      <skeletonCourseList></skeletonCourseList>
    </template>
    <template v-else-if="list.length > 0">
      <div class="contanier">
        <div class="vod-course-item" v-for="course in list" :key="course.id">
          <k12-course-item
            :cid="course.id"
            :people-count="course.join_people_num"
            :thumb="course.thumb"
            :category="course.category"
            :title="course.title"
            :charge="course.charge"
            :type="course.type_text"
          ></k12-course-item>
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
import K12CourseItem from "../../../components/k12-course-item.vue";
import FilterBox from "../../../components/filter-box.vue";
import FilterTwoClass from "../../../components/filter-two-class.vue";
import PageBox from "../../../components/page.vue";
import NavFooter from "../../../components/footer.vue";
import SkeletonCourseList from "../../../components/skeleton/skeletonCourseList.vue";
import SkeletonNav from "../../../components/skeleton/skeletonNav.vue";
import SkeletonNav2 from "../../../components/skeleton/skeletonNav2.vue";

export default {
  components: {
    K12CourseItem,
    FilterBox,
    FilterTwoClass,
    PageBox,
    NavFooter,
    None,
    SkeletonCourseList,
    SkeletonNav,
    SkeletonNav2,
  },
  data() {
    return {
      scenes: [
        {
          id: "",
          name: "全部",
        },
        {
          id: "0",
          name: "小班课",
        },
        {
          id: "1",
          name: "大班课",
        },
        {
          id: "2",
          name: "直播课",
        },
        {
          id: "3",
          name: "1v1",
        },
      ],
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 16,
        t: "",
        cid1: this.$route.query.cid || 0,
        cid2: this.$route.query.child || 0,
      },
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
  methods: {
    filterChange3(cid1, cid2) {
      this.pagination.cid1 = cid1;
      this.pagination.cid2 = cid2;
      this.resetData();
      this.getData();
    },
    filterChange(scene) {
      this.pagination.t = scene;
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
      this.$api.K12.List(this.pagination).then((res) => {
        this.navLoading = false;
        this.loading = false;
        this.categories = res.data.categories;
        let list = res.data.data.data;
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
