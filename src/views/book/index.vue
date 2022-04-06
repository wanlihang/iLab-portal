<template>
  <div class="content page-main-body-box">
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
          <skeletonBookList></skeletonBookList>
        </template>
        <template v-else-if="list.length > 0">
          <div class="book-item" v-for="item in list" :key="item.id">
            <book-item
              :name="item.name"
              :thumb="item.thumb"
              :charge="item.charge"
              :short-desc="item.short_desc"
              :user-count="item.user_count"
              :cid="item.id"
              :view-times="item.view_times"
              :published-at="item.published_at"
              :is-vip-free="item.is_vip_free"
            ></book-item>
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
      </div>

      <div class="right-contanier">
        <template v-if="loading2">
          <div style="margin-top: 74px">
            <skeletonBookHotList></skeletonBookHotList>
          </div>
        </template>
        <template v-else>
          <div class="right-list">
            <div class="tit">推荐阅读</div>
            <template v-if="HotList.length > 0">
              <div class="right-box">
                <div class="book-item" v-for="item in HotList" :key="item.id">
                  <div class="book-item-comp" @click="goDetail(item.id)">
                    <div class="book-thumb">
                      <div class="thumb-bar">
                        <thumb-bar
                          :value="item.thumb"
                          :width="90"
                          :height="120"
                        ></thumb-bar>
                      </div>
                    </div>
                    <div class="book-body">
                      <div class="book-title">{{ item.name }}</div>
                      <div class="book-charge">
                        <div class="charge-text" v-if="item.charge !== 0">
                          <span class="unit">￥</span>{{ item.charge }}
                        </div>
                        <div class="free-text" v-else>免费</div>
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
import BookItem from "../../components/book-item.vue";
import NavFooter from "../../components/footer.vue";
import SkeletonBookList from "../../components/skeleton/skeletonBookList.vue";
import SkeletonBookHotList from "../../components/skeleton/skeletonBookHotList.vue";
import SkeletonNav from "../../components/skeleton/skeletonNav.vue";

export default {
  components: {
    FilterBox,
    NavFooter,
    PageBox,
    BookItem,
    None,
    SkeletonBookList,
    SkeletonBookHotList,
    SkeletonNav,
  },
  data() {
    return {
      pageName: "book-list",
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
        scene: "default",
        cid: this.$route.query.category_id || 0,
      },
      HotList: [],
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
  activated() {
    this.changefilter();
    this.$utils.scrollTopSet(this.pageName);
  },
  beforeRouteLeave(to, from, next) {
    this.$utils.scrollTopRecord(this.pageName);
    next();
  },
  methods: {
    changefilter() {
      let cid = this.pagination.cid;
      if (cid === 0) {
        this.$router.push({
          path: this.$route.path,
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            category_id: cid,
          },
        });
      }
    },
    filterChange(scene, cid) {
      this.pagination.scene = scene;
      if (cid === 0) {
        this.$router.push({
          path: this.$route.path,
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            category_id: cid,
          },
        });
      }
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
    getHotData() {
      if (this.loading2) {
        return;
      }
      this.loading2 = true;
      this.$api.Book.HotList().then((res) => {
        this.loading2 = false;
        this.HotList = res.data;
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.pagination.cid = this.$route.query.category_id || 0;
      this.$api.Book.List(this.pagination).then((res) => {
        this.loading = false;
        this.navLoading = false;
        this.categories = res.data.categories;
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    goDetail(id) {
      this.$router.push({
        name: "bookDetail",
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
      .book-item {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0px;
        }
      }
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
          .book-item {
            width: 100%;
            margin-bottom: 30px;
            &:last-child {
              margin-bottom: 0px;
            }
            .book-item-comp {
              width: 100%;
              height: 120px;
              float: left;
              background: #ffffff;
              border-radius: 8px;
              display: flex;
              cursor: pointer;
              box-sizing: border-box;
              &:hover {
                .book-thumb {
                  .thumb-bar {
                    transform: scale(1.1, 1.1);
                  }
                }
              }
              .book-body {
                flex: 1;
                box-sizing: border-box;
                padding-top: 15px;

                .book-title {
                  width: 187px;
                  height: auto;
                  float: left;
                  margin-bottom: 15px;
                  font-size: 18px;
                  font-weight: 600;
                  color: #333333;
                  line-height: 18px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .book-info {
                  width: 100%;
                  height: 14px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  margin-bottom: 40px;
                  .read-count {
                    width: 100%;
                    height: 14px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 14px;
                  }
                }
                .book-charge {
                  width: 100%;
                  float: left;
                  font-size: 20px;
                  line-height: 20px;
                  font-weight: 600;
                  margin-top: 20px;

                  .charge-text {
                    color: #ff5858;

                    .unit {
                      font-size: 14px;
                    }
                  }

                  .free-text {
                    font-size: 14px;
                    font-weight: 600;
                    color: #04c877;
                  }
                }
              }

              .book-thumb {
                width: 90px;
                height: 120px;
                border-radius: 8px;
                overflow: hidden;
                margin-right: 30px;
                .thumb-bar {
                  width: 100%;
                  height: 100%;
                  transition: all 0.3s;
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
