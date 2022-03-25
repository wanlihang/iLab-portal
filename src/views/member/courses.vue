<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="1" :news="newStatus"></nav-member>
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
            <div
              class="project-item"
              v-for="item in list"
              :key="item.id"
              @click="goCourse(item.id)"
            >
              <div class="item-thumb">
                <img :src="item.thumb" />
              </div>
              <div class="item-info">
                <div class="item-top">
                  <div class="item-name">
                    {{ item.title }}
                  </div>
                </div>
                <div class="item-bottom">
                  <div class="item-progress">学习进度：0%</div>
                </div>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </div>
        <div class="project-content" v-if="!loading && currentTab === 2">
          <template v-if="list.length > 0">
            <div
              class="project-item"
              v-for="item in list"
              :key="item.id"
              @click="goVideo(item.id)"
            >
              <div class="item-info2">
                <div class="item-top">
                  <div class="item-type">视频</div>
                  <div class="item-name">
                    {{ item.title }}
                  </div>
                </div>
                <div class="item-bottom">
                  <div class="item-progress">所属课程：C语言浅析入门</div>
                </div>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </div>
        <div class="project-content" v-if="!loading && currentTab === 3">
          <template v-if="list.length > 0">
            <div
              class="project-item"
              v-for="item in list"
              :key="item.id"
              @click="goCourse(item.id)"
            >
              <div class="item-thumb">
                <img :src="item.thumb" />
              </div>
              <div class="item-info">
                <div class="item-top">
                  <div class="item-name">
                    {{ item.title }}
                  </div>
                </div>
                <div class="item-bottom">
                  <div v-if="item.charge === 0" class="item-free">免费</div>
                  <div v-if="item.charge > 0" class="item-charge">
                    ￥{{ item.charge }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </div>
        <div id="page" v-show="list.length > 0">
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
      total: null,
      pagination: {
        page: 1,
        page_size: 10,
      },
      currentTab: 1,
      loading: false,
      tabs: [
        {
          name: "已购课程",
          id: 1,
        },
        {
          name: "已购视频",
          id: 2,
        },
        {
          name: "收藏课程",
          id: 3,
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
    this.getVideos();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    tabChange(key) {
      this.resetData();
      if (key === 1) {
        this.getCourses();
      }
      if (key === 2) {
        this.getVideos();
      }
      if (key === 3) {
        this.getCollects();
      }
      this.currentTab = key;
    },
    resetData() {
      this.list = [];
      this.total = null;
      this.pagination.page_size = 10;
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.page_size = item.pageSize;
      this.pagination.page = item.currentPage;
      if (this.currentTab === 1) {
        this.getCourses();
      }
      if (this.currentTab === 2) {
        this.getVideos();
      }
      if (this.currentTab === 3) {
        this.getCollects();
      }
    },
    goCourse(id) {
      this.$router.push({
        name: "coursesDetail",
        query: {
          id: id,
        },
      });
    },
    goVideo(id) {
      this.$router.push({
        name: "coursesVideo",
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
      this.$api.Member.Courses(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    getVideos() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Member.Videos(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    getCollects() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Member.Collects(this.pagination).then((res) => {
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
          .item-info2 {
            width: 100%;
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
