<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="16"></nav-member>
      <div class="right-box">
        <div class="exchange-box">
          <div class="tit">我的积分</div>
          <div class="credit">{{ user.credit1 }}</div>
        </div>
        <div class="project-box">
          <div class="btn-title">积分记录</div>
          <template v-if="list.length > 0">
            <div
              class="project-item"
              v-for="(item, index) in list"
              :key="index"
            >
              <div class="title">{{ item.remark }}</div>
              <div class="info">
                <span>{{ item.created_at | changeTime }}</span>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
          <div id="page" v-show="list.length > 0">
            <page-box
              :totals="total"
              @current-change="changepage"
              :pageSize="pagination.size"
              :tab="false"
            ></page-box>
          </div>
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

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
  },
  data() {
    return {
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
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
    getData() {
      this.$api.Member.Credit1Records(this.pagination).then((res) => {
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
  },
};
</script>
<style lang='less' scoped>
.content {
  width: 100%;
  .box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    .right-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      box-sizing: border-box;
      .exchange-box {
        width: 999px;
        height: 100px;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 30px;
        .tit {
          height: 14px;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          line-height: 14px;
          margin-right: 30px;
        }
        .credit {
          height: 20px;
          font-size: 20px;
          font-weight: 500;
          color: #e1a500;
          line-height: 20px;
        }
      }

      .project-box {
        display: flex;
        flex-direction: column;
        width: 999px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;
        .btn-title {
          width: 80px;
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
          margin-bottom: 34px;
        }
        .project-item {
          width: 100%;
          height: 14px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          .title {
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            line-height: 14px;
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
          &:not(:last-of-type) {
            margin-bottom: 28px;
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
}
</style>