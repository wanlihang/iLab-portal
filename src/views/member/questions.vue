<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="13"></nav-member>
      <div class="project-box">
        <div class="tabs">
          <div
            class="item-tab"
            v-for="(item, index) in tabs"
            :key="index"
            :class="{ active: currentTab === item.id }"
            @click="tabChange(item.id)"
            :is-scroll="false"
          >
            {{ item.name }}
            <div class="actline" v-if="currentTab === item.id"></div>
          </div>
        </div>
        <template v-if="loading">
          <skeletonMemberPaper></skeletonMemberPaper>
        </template>
        <template v-if="!loading && currentTab === 1">
          <template v-if="list.length > 0">
            <div
              class="paper-item-comp"
              v-for="(item, index) in list"
              :key="index"
              @click="goDetail(item.id)"
            >
              <div class="title">{{ item.title }}</div>
              <div class="info">
                <span v-if="item.status === 0">未解决</span>
                <span class="green" v-if="item.status === 1">已解决</span>
                <span class="item">|</span>
                <span>{{ item.answer_count }} 回答</span>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </template>
        <div id="page" v-show="currentTab === 1 && list.length > 0">
          <page-box
            :key="pagination.page"
            :page="pagination.page"
            :totals="total1"
            @current-change="changepage"
            :pageSize="pagination.size"
            :tab="false"
          ></page-box>
        </div>
        <template v-if="!loading && currentTab === 2 && list2.length > 0">
          <template v-if="list2.length > 0">
            <div
              class="paper-item-comp"
              v-for="(item, index) in list2"
              :key="index"
              @click="goDetail(item.question_id)"
            >
              <div
                class="title"
                v-html="
                  item.render_content.length > 51
                    ? item.render_content.slice(0, 51) + '...'
                    : item.render_content
                "
              ></div>
              <div class="info">
                <span v-if="item.status === 0">未解决</span>
                <span class="green" v-if="item.is_correct === 1">被采纳</span>
                <span class="item" v-if="item.is_correct === 1">|</span>
                <span>积分+{{ item.vote_count }}</span>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </template>
        <div id="page" v-show="currentTab === 2 && list2.length > 0">
          <page-box
            :key="pagination2.page"
            :page="pagination2.page"
            :totals="total2"
            @current-change="changepage"
            :pageSize="pagination2.size"
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
      list: [],
      list2: [],
      total1: null,
      total2: null,
      pagination: {
        page: 1,
        size: 10,
      },
      pagination2: {
        page: 1,
        size: 10,
      },
      currentTab: 1,
      loading: false,
      tabs: [
        {
          name: "我的问题",
          id: 1,
        },
        {
          name: "我的回答",
          id: 2,
        },
      ],
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
    this.getData2();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    resetData() {
      this.list = [];
      this.total1 = null;
      this.total2 = null;
      this.pagination.size = 10;
      this.pagination.page = 1;
      this.pagination2.size = 10;
      this.pagination2.page = 1;
    },
    tabChange(key) {
      this.currentTab = key;
      if (this.currentTab === 1) {
        this.getData();
      }
      if (this.currentTab === 2) {
        this.getData2();
      }
    },
    changepage(item) {
      if (this.currentTab === 1) {
        this.pagination.size = item.pageSize;
        this.pagination.page = item.currentPage;
        this.getData();
      }
      if (this.currentTab === 2) {
        this.pagination2.size = item.pageSize;
        this.pagination2.page = item.currentPage;
        this.getData2();
      }
    },
    goDetail(id) {
      this.$router.push({
        name: "wendaDetail",
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
      this.$api.Wenda.UserQuestions(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data.data;
        this.total1 = res.data.data.total;
      });
    },
    getData2() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Wenda.UserAnswers(this.pagination2).then((res) => {
        this.loading = false;
        this.list2 = res.data.data.data;
        this.total2 = res.data.data.total;
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
      .tabs {
        width: 100%;
        height: 34px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        padding: 0px;
        margin-bottom: 30px;
        .item-tab {
          width: 56px;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
          margin-right: 50px;
          cursor: pointer;
          position: relative;
          text-align: center;
          &.active {
            font-weight: 600;
            color: #3ca7fa;
          }
          .actline {
            width: 56px;
            height: 4px;
            background: #3ca7fa;
            position: absolute;
            left: 0px;
            top: 29px;
          }
        }
      }
      .paper-item-comp {
        width: 100%;
        height: 16px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .title {
          width: 783px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .name {
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
        }
        .info {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
          .green {
            color: #04c877;
          }
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
