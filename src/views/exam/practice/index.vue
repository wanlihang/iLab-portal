<template>
  <div class="content">
    <div class="nav">
      <a @click="$router.push({ name: 'Exam' })">在线考试</a> /
      <span> 练习模式 </span>
    </div>
    <filter-box2
      v-show="!navLoading"
      :categories="categories"
      :cid1="pagination.cid1"
      :cid2="pagination.cid2"
      @change="filterChange"
    ></filter-box2>
    <template v-if="navLoading">
      <skeletonPaperNav></skeletonPaperNav>
    </template>
    <template v-if="loading">
      <skeletonPaper></skeletonPaper>
    </template>
    <template v-else-if="list.length > 0">
      <div class="contanier">
        <div class="practice-item" v-for="item in list" :key="item.id">
          <practice-item
            :cid="item.id"
            :title="item.name"
            :charge="item.charge"
            :userCount="item.user_count"
            :category="item.category"
            :records="userpapers"
            :is-free="item.is_free"
            :is-vip-free="item.is_vip_free"
            :questionCount="item.question_count"
          ></practice-item>
        </div>
      </div>
    </template>
    <none v-else></none>
    <div id="page" v-show="list.length > 0 && total > pagination.page_size">
      <page-box
        :totals="total"
        @current-change="changepage"
        :pageSize="pagination.page_size"
        :tab="false"
      ></page-box>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import None from "../../../components/none.vue";
import PracticeItem from "../../../components/practice-item.vue";
import FilterBox2 from "../../../components/filter-box2.vue";
import PageBox from "../../../components/page.vue";
import NavFooter from "../../../components/footer.vue";
import SkeletonPaper from "../../../components/skeleton/skeletonPaper.vue";
import SkeletonPaperNav from "../../../components/skeleton/skeletonPaperNav.vue";

export default {
  components: {
    PracticeItem,
    FilterBox2,
    PageBox,
    NavFooter,
    None,
    SkeletonPaper,
    SkeletonPaperNav,
  },
  data() {
    return {
      list: [],
      total: null,
      categories: [],
      pagination: {
        page: 1,
        page_size: 10,
        cid1: 0,
        cid2: 0,
      },
      userpapers: [],
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
    filterChange(cid1, cid2) {
      this.pagination.cid1 = cid1;
      this.pagination.cid2 = cid2;
      this.resetData();
      this.getData();
    },
    resetData() {
      this.list = [];
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.page_size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Exam.PracticesList(this.pagination).then((res) => {
        this.loading = false;
        this.navLoading = false;
        let categoriesData = [
          {
            id: 0,
            name: "全部",
            children: [
              {
                id: 0,
                name: "全部",
              },
            ],
          },
        ];

        res.data.categories.forEach((item) => {
          let categoryItem = {
            id: item.id,
            name: item.name,
            children: [
              {
                id: 0,
                name: "全部",
              },
            ],
          };

          if (typeof res.data.category_children[item.id] !== "undefined") {
            categoryItem["children"].push(
              ...res.data.category_children[item.id]
            );
          }

          categoriesData.push(categoryItem);
        });
        this.categories = categoriesData;
        let list = res.data.data.data;
        this.total = res.data.data.total;
        if (list.length > 0) {
          this.list = list;
        }
        let papers = res.data.user_papers;
        if (papers) {
          this.userpapers = Object.assign(this.userpapers, papers);
        }
      });
    },
  },
};
</script>
<style lang='less' scoped>
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
    min-height: 500px;
    margin: 0 auto;
    overflow: hidden;
    .practice-item {
      width: 1200px;
      display: flex;
      flex-direction: column;
      padding-top: 30px;
      box-sizing: border-box;
    }
  }
  #page {
    width: 1200px;
    margin: 0 auto;
    margin-top: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>