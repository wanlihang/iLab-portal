<template>
  <div class="content">
    <template v-if="loading">
      <div style="margin-top: 30px">
        <skeletonCourseList></skeletonCourseList>
      </div>
    </template>
    <template v-else-if="list.length > 0">
      <div class="contanier">
        <div class="ms-body">
          <div class="ms-item" v-for="item in list" :key="item.id">
            <ms-item
              :cid="item.id"
              :goods-title="item.goods_title"
              :goods-type="item.goods_type"
              :goods-thumb="item.goods_thumb"
              :charge="item.charge"
              :is_start="item.is_start"
              :is_over="item.is_over"
              :original-charge="item.original_charge"
              :num="item.num"
              :started_at="item.started_at"
              :over-num="item.over_num"
              :end_at="item.end_at"
              :progress="compProgress(item)"
            ></ms-item>
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
import { mapState, mapMutations } from "vuex";
import None from "../../components/none.vue";
import PageBox from "../../components/page.vue";
import MsItem from "../../components/ms-item.vue";
import NavFooter from "../../components/footer.vue";
import SkeletonCourseList from "../../components/skeleton/skeletonCourseList.vue";

export default {
  components: {
    NavFooter,
    PageBox,
    MsItem,
    None,
    SkeletonCourseList,
  },
  data() {
    return {
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 16,
      },
      loading: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
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
    compProgress(item) {
      return parseInt(((item.num - item.over_num) / item.num) * 100);
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.MiaoSha.List(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    goDetail(id) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "msDetail",
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
    display: block;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    padding-top: 30px;
    .ms-body {
      width: 100%;
      display: grid;
      row-gap: 30px;
      column-gap: 48px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      overflow: hidden;
      white-space: nowrap;
      box-sizing: border-box;
      padding-bottom: 40px;
    }
  }
  #page {
    width: 1200px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
