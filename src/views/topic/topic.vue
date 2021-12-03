<template>
  <div class="content">
    <filter-box
      v-show="!navLoading"
      :categories2="categories"
      :cid1="pagination.scene"
      :cid2="pagination.cid"
      @change="filterChange"
    ></filter-box>
    <template v-if="navLoading">
      <skeletonNav></skeletonNav>
    </template>
    <div class="contanier">
      <div class="left-contanier">
        <template v-if="loading">
          <skeletonTopicList></skeletonTopicList>
        </template>
        <template v-else-if="list.length > 0">
          <div class="topic-item" v-for="item in list" :key="item.id">
            <topic-item
              :cid="item.id"
              :title="item.title"
              :category="item.category.name"
              :view-times="item.view_times"
              :thumb="item.thumb"
              :is-vip-free="item.is_vip_free"
              :is-need-login="item.is_need_login"
              :vote-count="item.vote_count"
              :charge="item.charge"
              :comment-count="item.comment_times"
            ></topic-item>
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
      </div>

      <div class="right-contanier">
        <template v-if="loading2">
          <div style="margin-top: 20px">
            <skeletonTopicHotList></skeletonTopicHotList>
          </div>
        </template>
        <template v-else>
          <div class="right-list">
            <div class="tit">热门文章</div>
            <template v-if="hotList.length > 0">
              <div class="right-box">
                <div class="topic-item" v-for="item in hotList" :key="item.id">
                  <div class="topic-item-comp" @click="goDetail(item.id)">
                    <div class="topic-thumb">
                      <img :src="item.thumb" />
                    </div>
                    <div class="topic-body">
                      <div class="topic-title">{{ item.title }}</div>
                      <div class="topic-info">
                        <div class="category">{{ item.category.name }}</div>
                        <span class="read-count"
                          >{{ item.view_times }}次阅读</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <none type="white" v-else></none>
          </div>
        </template>
      </div>
    </div>

    <nav-footer></nav-footer>
  </div>
</template>
<script>
import None from "../../components/none.vue";
import FilterBox from "../../components/filter-box.vue";
import PageBox from "../../components/page.vue";
import TopicItem from "../../components/topic-item.vue";
import NavFooter from "../../components/footer.vue";
import SkeletonNav from "../../components/skeleton/skeletonNav.vue";
import SkeletonTopicList from "../../components/skeleton/skeletonTopicList.vue";
import SkeletonTopicHotList from "../../components/skeleton/skeletonTopicHotList.vue";

export default {
  components: {
    FilterBox,
    NavFooter,
    PageBox,
    TopicItem,
    None,
    SkeletonNav,
    SkeletonTopicList,
    SkeletonTopicHotList,
  },
  data() {
    return {
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
        scene: "default",
        cid: 0,
      },
      hotList: [],
      categories: [],
      filterShowStatus: false,
      loading: false,
      loading2: false,
      navLoading: false,
    };
  },
  mounted() {
    this.navLoading = true;
    this.getData();
    this.getHotData();
  },
  methods: {
    filterChange(scene, cid) {
      this.pagination.scene = scene;
      this.pagination.cid = cid;
      this.resetData();
      this.getData();
      this.getHotData();
    },
    resetData() {
      this.list = [];
      this.hotList = [];
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
      window.scrollTo(0, 0);
    },
    getHotData() {
      if (this.loading2) {
        return;
      }
      this.loading2 = true;
      this.$api.Topic.HotList().then((res) => {
        this.loading2 = false;
        this.hotList = res.data;
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Topic.List(this.pagination).then((res) => {
        this.loading = false;
        this.navLoading = false;
        if (this.categories.length === 0) {
          this.categories = res.data.categories;
        }
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    goDetail(id) {
      this.$router.push({
        name: "topicDetail",
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
    margin: 0 auto;
    overflow: hidden;
    display: block;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    padding-top: 30px;
    .left-contanier {
      width: 769px;
      min-height: 500px;
      display: flex;
      flex-direction: column;
      margin-right: 30px;
    }
    .right-contanier {
      width: 400px;
      position: relative;
      .right-list {
        display: inline-block;
        width: 400px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        padding: 30px;
        box-sizing: border-box;
        .tit {
          width: 100%;
          height: 18px;
          font-size: 18px;
          font-weight: 600;
          color: #333333;
          line-height: 18px;
          margin-bottom: 30px;
        }
        .right-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          .topic-item {
            width: 100%;
            margin-bottom: 30px;
            &:last-child {
              margin-bottom: 0px;
            }
            .topic-item-comp {
              width: 100%;
              height: 100px;
              float: left;
              background: #ffffff;
              border-radius: 8px;
              display: flex;
              cursor: pointer;
              box-sizing: border-box;
              &:hover {
                .topic-thumb {
                  img {
                    transform: scale(1.1, 1.1);
                  }
                }
              }

              .topic-body {
                flex: 1;
                box-sizing: border-box;
                padding-top: 15px;

                .topic-title {
                  width: 187px;
                  height: auto;
                  float: left;
                  margin-bottom: 28px;
                  font-size: 18px;
                  font-weight: 600;
                  color: #333333;
                  line-height: 18px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .topic-info {
                  width: 100%;
                  height: auto;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  .category {
                    padding: 5px 8px;
                    background: rgba(255, 80, 104, 0.1);
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #ff5068;
                    line-height: 14px;
                    margin-right: 30px;
                  }
                  .read-count {
                    height: 14px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #666666;
                    line-height: 14px;
                  }
                }
              }

              .topic-thumb {
                width: 133px;
                height: 100px;
                border-radius: 8px;
                overflow: hidden;
                margin-right: 20px;
                img {
                  width: 133px;
                  height: 100px;
                  border-radius: 8px;
                  transition: all 0.4s;
                }
              }
            }
          }
        }
      }
    }
  }
  #page {
    width: 769px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
