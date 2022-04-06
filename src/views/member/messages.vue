<template>
  <div class="content">
    <div class="box">
      <nav-member v-if="renderComponent" :cid="7"></nav-member>
      <div class="messages-box">
        <div class="btn-read" @click="readAll()">全部已读</div>
        <template v-if="loading">
          <skeletonMessages></skeletonMessages>
        </template>
        <div class="messages-content" v-else>
          <template v-if="list.length > 0">
            <div
              class="message-item"
              @click="read(item)"
              :class="{ readed: item.read_at }"
              v-for="item in list"
              :key="item.id"
            >
              <div class="point" v-if="!item.read_at"></div>
              <div class="cont">{{ item.data.message }}</div>
              <div class="date">{{ item.created_at | changeTime }}</div>
            </div>
          </template>
          <none type="white" v-else></none>
        </div>
        <div id="page">
          <page-box
            :key="pagination.page"
            :page="pagination.page"
            :totals="total"
            @current-change="changepage"
            :pageSize="pagination.page_size"
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
import SkeletonMessages from "../../components/skeleton/skeletonMessages.vue";

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    SkeletonMessages,
    None,
  },
  data() {
    return {
      list: [],
      total: null,
      renderComponent: true,
      pagination: {
        page: 1,
        page_size: 20,
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
    ...mapMutations(["showLoginDialog", "changeDialogType", "saveUnread"]),
    forceRerender() {
      this.renderComponent = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    resetData() {
      this.list = [];
      this.pagination.page_size = 20;
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
      this.$api.Member.Messages(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    readAll() {
      this.$api.Member.ReadMessageAll().then(() => {
        this.getData();
        this.forceRerender();
        this.saveUnread();
      });
    },
    read(item) {
      if (item.read_at) {
        return;
      }
      this.$api.Member.ReadMessage(item.id).then(() => {
        item.read_at = 1;
        this.saveUnread();
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
    .messages-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 30px;
      .btn-read {
        width: 56px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
        cursor: pointer;
        margin-bottom: 20px;
        &:hover {
          color: #3ca7fa;
        }
      }
      .messages-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        .message-item {
          width: 100%;
          height: auto;
          background: #ffffff;
          display: flex;
          flex-direction: row;
          position: relative;
          padding-right: 20px;
          box-sizing: border-box;
          cursor: pointer;
          margin-bottom: 30px;
          &:last-child {
            margin-bottom: 0px;
          }
          .point {
            position: absolute;
            width: 8px;
            height: 8px;
            top: 6px;
            left: 0;
            background: #ff5068;
            border-radius: 50%;
          }
          .cont {
            width: 855px;
            max-height: 40px;
            margin-left: 25px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 20px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .date {
            position: absolute;
            top: 4px;
            right: 0;
            font-size: 12px;
            font-weight: 400;
            color: #999999;
            line-height: 12px;
          }
          &.readed {
            .cont {
              color: #666666;
              font-weight: 400;
            }
          }
        }
      }
      #page {
        width: 100%;
        margin-top: 70px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
