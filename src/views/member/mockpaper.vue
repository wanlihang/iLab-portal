<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="11" :news="newStatus"></nav-member>
      <div class="project-box">
        <template v-if="loading">
          <skeletonMemberPaper></skeletonMemberPaper>
        </template>
        <template v-else-if="list.length > 0">
          <div
            class="paper-item-comp"
            v-for="(item, index) in list"
            :key="index"
            @click="goDetail(item.id)"
          >
            <div class="title">{{ item.title }}</div>
            <div class="info">
              <span>总{{ item.score }}分</span>
            </div>
          </div>
        </template>
        <none type="white" v-else></none>
        <div id="page" v-show="list.length > 0">
          <page-box
            :key="pagination.page"
            :page="pagination.page"
            :totals="total"
            @current-change="changepage"
            :pageSize="pagination.size"
            :tab="false"
          ></page-box>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import NavMember from "../../components/navmember.vue";
import PageBox from "../../components/page.vue";
import None from "../../components/none.vue";
import SkeletonMemberPaper from "../../components/skeleton/skeletonMemberPaper.vue";

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
    SkeletonMemberPaper,
  },
  data() {
    return {
      loading: false,
      newStatus: false,
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
      },
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
    resetData() {
      this.list = [];
      this.total = null;
      this.pagination.size = 10;
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
    },
    goDetail(id) {
      this.$router.push({
        name: "ExamMockpaperDetail",
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
      this.$api.Exam.UserMockPaper(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    .project-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 30px;
      .paper-item-comp {
        width: 100%;
        height: 16px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .title {
          width: 700px;
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .info {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
          .item {
            height: 14px;
            margin-left: 10px;
            margin-right: 10px;
          }
        }
        &:hover {
          color: #3ca7fa;
        }
        &:hover .info {
          color: #3ca7fa;
        }
        &:not(:last-of-type) {
          margin-bottom: 50px;
        }
      }
      #page {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
