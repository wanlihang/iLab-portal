<template>
  <div class="page-wrapper clearfix">
    <div class="page-info fl hidden">
      <span class="item-count h50"
        >总共<span>{{ totals }}</span
        >条，</span
      >
      <span class="h50"
        ><span>{{ totalPages }}</span
        >页</span
      >
    </div>
    <div class="page-tab fl clearfix" v-if="totalPages > 1">
      <!-- <button
        class="fl h50 cursor"
        :class="{ canNot: currentPage == 1 }"
        @click="firstPage"
        :disabled="preDisabled"
      >
        首页
      </button> -->
      <button
        class="fl h50 cursor"
        :class="{ canNot: currentPage == 1 }"
        @click="prePage"
        :disabled="preDisabled"
      >
        <img
          v-if="currentPage == 1"
          class="btn-icon"
          src="../assets/img/commen/icon-back.png"
        />
        <img
          v-else
          class="btn-icon"
          src="../assets/img/commen/icon-back-h.png"
        />
      </button>
      <ul class="fl">
        <li
          v-for="(item, index) in itemArr"
          :key="index"
          class="cursor"
          @click="changePage(item)"
          :class="{ activePage: currentPage == item }"
        >
          {{ item }}
        </li>
      </ul>
      <button
        class="fl h50 cursor"
        @click="nextPage"
        :class="{ canNot: currentPage == totalPages }"
        :disabled="nextDisabled"
      >
        <img
          v-if="currentPage == totalPages"
          class="btn-icon"
          src="../assets/img/commen/icon-forward.png"
        />
        <img
          v-else
          class="btn-icon"
          src="../assets/img/commen/icon-forward-h.png"
        />
      </button>
      <!-- <button
        class="fl h50 cursor"
        :class="{ canNot: currentPage == totalPages }"
        :disabled="nextDisabled"
        @click="lastPage"
      >
        尾页
      </button> -->
    </div>
    <!-- <div class="items-choose fl clearfix hidden">
      <span class="fl h50">每页</span>
      <div class="items-show fl" @click="handleChooseNumClick">
        <input v-model="pageNum" class="chooseNum" @blur="blur" readonly />
        <div class="per-page-items">
          <ul class="items-num" v-show="itemsShow">
            <li
              v-for="(item, index) in pageSizeSettings"
              :key="index"
              @click.stop="chooseNum(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div> -->
  </div>
</template>
<style lang="less" scoped>
ul,
li {
  list-style: none;
}

.clearfix:after {
  content: ".";
  height: 0;
  display: block;
  visibility: hidden;
  clear: both;
  overflow: hidden;
}

.cursor {
  cursor: pointer;
}
.cursor:hover {
  opacity: 0.8;
}

.clearfix {
  zoom: 1;
}

.page-wrapper .fl {
  float: left;
}
.page-wrapper {
  font-size: 14px;
  color: #333;
}
.h50 {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  padding: 0 12px;
}

.page-wrapper .page-tab li {
  float: left;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  box-sizing: border-box;
}

.page-wrapper .page-info {
  margin-right: 6px;
}

.page-wrapper .page-info .h50 {
  border: none;
  padding: 0;
}

.items-choose .h50 {
  padding: 0;
  border: none 0;
  border-top: 1px solid #eaedf1;
  border-bottom: 1px solid #eaedf1;
  box-sizing: border-box;
  padding: 0 6px;
}

.items-choose .items-show {
  height: 30px;
  width: 74px;
  position: relative;
  box-sizing: border-box;
  border: 1px solid #eaedf1;
  position: relative;
}
.items-choose .items-show input {
  height: 100%;
  width: 100%;
  text-align: center;
}
.items-choose .items-show:after {
  content: "";
  position: absolute;
  height: 0;
  border: 4px solid transparent;
  border-top: 6px solid #c4ccc5;
  top: 50%;
  right: 10px;
  transform: translate3d(-50, -50, 0);
  cursor: pointer;
}

.items-choose .items-num {
  width: 100%;
  position: absolute;
  bottom: 42px;
  border: 1px solid #eaedf1;
  z-index: 100;
  background: #f5f7fa;
  z-index: 999;
}

.items-choose .items-num li {
  padding: 10px 0 10px 6px;
  font-size: 14px;
}

.page-wrapper .activePage {
  color: #3ca7fa;
}

.canNot {
  cursor: not-allowed;
}
.btn-icon {
  width: 16px;
  height: 16px;
}
.page-wrapper button {
  font-size: 14px;
  color: #cccccc;
  border: none;
}
.page-wrapper button:focus {
  outline: 0;
}
.chooseNum {
  cursor: pointer;
  font-size: 14px;
  color: #333;
}
</style>
<script>
export default {
  name: "VuePagination",
  props: {
    pageSize: {
      // 每页显示数量
      default: 0,
      type: Number,
    },
    totals: {
      // 总数
      default: 0,
      type: Number,
    },
    tab: {
      type: Boolean,
      default: false,
    },
    pageSizeSettings: {
      // 配置下拉 选pageSize
      type: Array,
      default() {
        return [12, 16];
      },
    },
    page: {
      default: 1,
      type: Number,
    },
  },
  data() {
    return {
      itemsShow: false, // 控制每页条数下拉框
      itemArr: [], // 显示页数,
      nextDisabled: null,
      preDisabled: "disabled",
      totalPages: 1, // 默认页数
      currentPage: this.page,
      size: this.pageSize, // 获取每页数量
    };
  },
  computed: {
    pageNum() {
      // 由于父组件传递过来的属性 子组件的钩子里面不能直接使用 用计算属性代替接收
      let a = this.size;
      return a;
    },
    pageItems() {
      let b = this.totals;
      return b;
    },
  },
  created() {
    this.pages();
  },
  methods: {
    chooseNum(item) {
      // 改变pageSize
      this.itemsShow = false;
      this.size = item;
    },
    handleChooseNumClick() {
      this.itemsShow = !this.itemsShow;
    },
    blur() {
      var that = this;
      setTimeout(function () {
        that.itemsShow = false;
      }, 200);
    },
    changePage(page) {
      // 切换页数
      this.currentPage = page;
      this.pages();
    },
    nextPage() {
      // 下一页
      if (this.currentPage <= this.totalPages - 1) {
        this.currentPage++;
      }
    },
    prePage() {
      // 上一页
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    firstPage() {
      // 首页
      this.currentPage = 1;
    },
    lastPage() {
      // 尾页
      this.currentPage = this.totalPages;
    },
    pages() {
      // 页数改变的逻辑
      this.itemArr = []; // 每次改变得清空数组
      this.totalPages = Math.ceil(this.pageItems / this.pageNum);
      this.preDisabled = this.currentPage === 1 ? "disabled" : null;
      this.nextDisabled =
        this.currentPage === this.totalPages ? "disabled" : null;
      let start = this.currentPage - 2 > 1 ? this.currentPage - 2 : 1;
      let end =
        this.currentPage > 3
          ? this.totalPages - this.currentPage >= 2
            ? this.currentPage + 2
            : this.totalPages
          : 5;
      start = this.totalPages - this.currentPage >= 2 ? start : end - 4;
      if (this.totalPages <= 5) {
        start = 1;
        end = this.totalPages;
      }
      for (let i = start; i <= end; i++) {
        this.itemArr.push(i);
      }
    },
  },
  watch: {
    pageNum() {
      // 每页数量变化后传递出 pageSize 重新请求数据
      this.currentPage = 1;
      this.pages();
      this.$emit("size-change", {
        pageSize: this.pageNum,
      });
    },
    currentPage() {
      // 当前页数变化后 传递出当前页码 重新请求数据
      this.pages();
      this.$emit("current-change", {
        pageSize: this.pageNum,
        currentPage: this.currentPage,
      });
    },
    totals() {
      // 数据是异步加载的 组件刚开始totals是默认的是渲染不了的
      this.pages();
    },
    tab() {
      // 点击切换条件筛选 重置currentPage
      this.currentPage = 1;
    },
  },
};
</script>
