<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="4" :news="newStatus"></nav-member>
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
          <skeletonMemberCourse></skeletonMemberCourse>
        </template>
        <div class="project-content" v-if="!loading && currentTab === 1">
          <template v-if="list.length > 0">
            <template v-for="item in list">
              <div
                class="project-item"
                :key="item.topic.id"
                v-if="item.topic && item.topic.id"
                @click="goItem(item.topic.id)"
              >
                <div class="item-thumb">
                  <img :src="item.topic.thumb" />
                </div>
                <div class="item-info">
                  <div class="item-top">
                    <div class="item-name">
                      {{ item.topic.title }}
                    </div>
                  </div>
                  <div class="item-bottom">
                    <div class="item-progress">
                      订阅时间：{{ item.topic.created_at | changeTime }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <none type="white" v-else></none>
        </div>

        <div class="project-content" v-if="!loading && currentTab === 3">
          <template v-if="collects.length > 0">
            <template v-for="item in collects">
              <div
                class="project-item"
                v-if="item.topic && item.topic.id"
                :key="item.id"
                @click="goItem(item.topic.id)"
              >
                <div class="item-thumb">
                  <img :src="item.topic.thumb" />
                </div>
                <div class="item-info">
                  <div class="item-top">
                    <div class="item-name">
                      {{ item.topic.title }}
                    </div>
                  </div>
                  <div class="item-bottom">
                    <div class="item-progress">
                      订阅时间：{{ item.created_at | changeTime }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <none type="white" v-else></none>
        </div>
        <div class="project-content" v-if="!loading && currentTab === 4">
          <template v-if="votes.length > 0">
            <template v-for="item in votes">
              <div
                class="project-item"
                v-if="item.topic && item.topic.id"
                :key="item.id"
                @click="goItem(item.topic.id)"
              >
                <div class="item-thumb">
                  <img :src="item.topic.thumb" />
                </div>
                <div class="item-info">
                  <div class="item-top">
                    <div class="item-name">
                      {{ item.topic.title }}
                    </div>
                  </div>
                  <div class="item-bottom">
                    <div class="item-progress">
                      订阅时间：{{ item.created_at | changeTime }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <none type="white" v-else></none>
        </div>
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
        <div id="page" v-show="currentTab === 3 && collects.length > 0">
          <page-box
            :key="pagination.page"
            :page="pagination.page"
            :totals="total2"
            @current-change="changepage"
            :pageSize="pagination.size"
            :tab="false"
          ></page-box>
        </div>
        <div id="page" v-show="currentTab === 4 && votes.length > 0">
          <page-box
            :key="pagination.page"
            :page="pagination.page"
            :totals="total3"
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
import SkeletonMemberCourse from "../../components/skeleton/skeletonMemberCourse.vue";

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
    SkeletonMemberCourse,
  },
  data() {
    return {
      newStatus: false,
      list: [],
      collects: [],
      votes: [],
      total1: null,
      total2: null,
      total3: null,
      pagination: {
        page: 1,
        size: 10,
      },
      currentTab: 1,
      loading: false,
      tabs: [
        {
          name: "已购图文",
          id: 1,
        },
        {
          name: "收藏图文",
          id: 3,
        },
        {
          name: "点赞图文",
          id: 4,
        },
      ],
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getCourses();
    this.getCollects();
    this.getVotes();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    tabChange(key) {
      this.currentTab = key;
      if (this.currentTab === 1) {
        this.getCourses();
      }
      if (this.currentTab === 3) {
        this.getCollects();
      }
      if (this.currentTab === 4) {
        this.getVotes();
      }
    },
    resetData() {
      this.list = [];
      this.collects = [];
      this.votes = [];
      this.total = null;
      this.total2 = null;
      this.total3 = null;
      this.pagination.size = 10;
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      if (this.currentTab === 1) {
        this.getCourses();
      }
      if (this.currentTab === 3) {
        this.getCollects();
      }
    },
    goItem(id) {
      this.$router.push({
        name: "topicDetail",
        query: {
          id: id,
        },
      });
    },
    getCourses() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Topic.UserBuyTopics(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data.data;
        this.total1 = res.data.data.total;
      });
    },
    getCollects() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Topic.LikeCourses(this.pagination).then((res) => {
        this.loading = false;
        this.collects = res.data.data.data;
        this.total2 = res.data.data.total;
      });
    },
    getVotes() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Topic.UserVoteTopics(this.pagination).then((res) => {
        this.loading = false;
        this.votes = res.data.data.data;
        this.total3 = res.data.data.total;
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
      .project-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        .project-item {
          width: 100%;
          height: 100px;
          background: #ffffff;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          cursor: pointer;
          &:hover {
            background-color: #f4f5f5;
          }
          .item-thumb {
            width: 133px;
            height: 100px;
            border-radius: 4px;
            text-align: center;
            overflow: hidden;
            margin-right: 30px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }
          }
          .item-info {
            width: 776px;
            height: 100px;
            display: flex;
            flex-direction: column;
            position: relative;
            .item-top {
              width: 100%;
              height: 14px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 20px;
              .item-type {
                padding: 5px 10px;
                background: #04c877;
                border-radius: 2px;
                font-size: 12px;
                font-weight: 400;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
              }
              .item-name {
                height: 14px;
                font-size: 14px;
                font-weight: 600;
                color: #333333;
                line-height: 14px;
              }
            }
            .item-bottom {
              width: 100%;
              height: 14px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 30px;
              .item-progress {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                line-height: 14px;
              }
              .item-charge {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #ff5068;
                line-height: 14px;
              }
              .item-free {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #04c877;
                line-height: 14px;
              }
            }
          }
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
