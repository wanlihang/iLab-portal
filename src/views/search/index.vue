<template>
  <div class="content">
    <div class="top-content">
      <div class="input-box">
        <input
          type="text"
          class="input"
          v-model="pagination.keywords"
          placeholder="请输入关键字"
          @keyup.enter="search"
        />
        <button class="submit" @click="search()">搜索</button>
      </div>
      <div class="type-box">
        <div
          class="item"
          :class="{ active: pagination.type === item.key }"
          @click="setType(item.key)"
          v-for="item in types"
          :key="item.key"
        >
          {{ item.name }}
          <div class="actline" v-if="pagination.type === item.key"></div>
        </div>
      </div>
    </div>
    <div class="contanier">
      <div class="search-box">
        <div class="left-contanier">
          <template v-if="loading">
            <skeletonSearch></skeletonSearch>
          </template>
          <template v-else-if="list.length > 0 || loading">
            <ul
              class="search-item"
              v-for="item in list"
              :key="item.id"
              @click="goDetail(item.resource_type, item.resource_id)"
            >
              <li
                class="item-top"
                v-highlight="{ keyword: pagination.keywords, separator: ' ' }"
              >
                【{{ change(item.resource_type) }}】{{ item.title }}
              </li>

              <li
                class="item-content"
                v-if="item.short_desc"
                v-html="item.short_desc"
              ></li>
            </ul>

            <div id="page" v-show="total > pagination.size">
              <page-box
                :totals="total"
                @current-change="changepage"
                :pageSize="pagination.size"
                :tab="false"
              ></page-box>
            </div>
          </template>
          <none type="white" v-else></none>
        </div>
      </div>
    </div>
    <nav-footer :white="true"></nav-footer>
  </div>
</template>
<script>
import None from "../../components/none.vue";
import PageBox from "../../components/page.vue";
import NavFooter from "../../components/footer.vue";
import SkeletonSearch from "../../components/skeleton/skeletonSearch.vue";

export default {
  components: {
    NavFooter,
    PageBox,
    None,
    SkeletonSearch,
  },
  data() {
    return {
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
        type: 0,
        keywords: this.$route.query.keywords,
      },
      types: [
        {
          key: 0,
          name: "全部",
        },
        {
          key: "vod",
          name: "录播课",
        },
        {
          key: "video",
          name: "录播视频",
        },
        {
          key: "live",
          name: "直播课",
        },
        {
          key: "book",
          name: "电子书",
        },
        {
          key: "topic",
          name: "图文",
        },
        {
          key: "paper",
          name: "试卷",
        },
        {
          key: "practice",
          name: "练习",
        },
      ],
      loading: false,
    };
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    change(val) {
      if (val === "video") {
        return "录播视频";
      } else if (val === "vod") {
        return "录播课";
      } else if (val === "live") {
        return "直播课";
      } else if (val === "topic") {
        return "图文";
      } else if (val === "book") {
        return "电子书";
      } else if (val === "paper") {
        return "试卷";
      } else if (val === "practice") {
        return "练习";
      } else {
        return "其它";
      }
    },
    setType(key) {
      this.pagination.type = key;
      this.resetData();
      this.getData();
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
      window.scrollTo(0, 0);
    },
    resetData() {
      this.pagination.page = 1;
      this.list = [];
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Search.Index(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    search() {
      if (!this.pagination.keywords) {
        this.$message.error("请输入关键字后再搜索");
        return;
      }
      this.resetData();
      this.getData();
    },
    goDetail(val, id) {
      if (val === "video") {
        this.$router.push({
          name: "coursesVideo",
          query: {
            id: id,
          },
        });
      } else if (val === "vod") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: id,
          },
        });
      } else if (val === "live") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: id,
          },
        });
      } else if (val === "topic") {
        this.$router.push({
          name: "topicDetail",
          query: {
            id: id,
          },
        });
      } else if (val === "book") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: id,
          },
        });
      } else if (val === "paper") {
        this.$router.push({
          name: "ExamPapersDetail",
          query: {
            id: id,
          },
        });
      } else if (val === "practice") {
        this.$router.push({
          name: "ExamPracticeDetail",
          query: {
            id: id,
          },
        });
      } else {
        return;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .top-content {
    width: 100%;
    height: 131px;
    padding-top: 30px;
    box-sizing: border-box;
    .input-box {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 48px;
      .input {
        width: 800px;
        height: 48px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #cccccc;
        outline: none;
        padding-left: 15px;
        font-size: 18px;
      }
      .submit {
        width: 132px;
        height: 48px;
        background: #3ca7fa;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        margin-left: 30px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    .type-box {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 34px;
      margin-top: 20px;
      .item {
        min-width: 56px;
        height: 34px;
        cursor: pointer;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        margin-right: 50px;
        &:last-child {
          margin-right: 0px;
        }
        &.active {
          color: #3ca7fa;
          font-weight: 600;
          .actline {
            width: 56px;
            height: 4px;
            background: #3ca7fa;
          }
        }
        &:hover {
          color: #3ca7fa;
        }
      }
    }
  }
  .contanier {
    width: 100%;
    background-color: #fff;
    overflow: hidden;
    box-sizing: border-box;
    padding-bottom: 150px;
    .search-box {
      width: 1200px;
      margin: 0 auto;
      .left-contanier {
        width: 800px;
        min-height: 500px;
        display: flex;
        flex-direction: column;
        .search-item {
          width: 100%;
          height: auto;
          cursor: pointer;
          margin-top: 50px;
          &:hover {
            .item-top {
              color: #3ca7fa;
              text-decoration: underline;
              strong {
                color: #3ca7fa;
              }
            }
          }
          .item-top {
            width: 100%;
            height: 18px;
            font-size: 18px;
            font-weight: 600;
            color: #666666;
            line-height: 18px;
            display: flex;
            flex-direction: row;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .item-content {
            margin-top: 15px;
            width: 800px;
            height: 48px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 24px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        #page {
          width: 800px;
          margin: 0 auto;
          margin-top: 50px;
          display: flex;
          flex-direction: row;
          justify-content: center;
        }
      }
    }
  }
}
</style>
