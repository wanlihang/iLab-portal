<template>
  <div class="top">
    <div id="header">
      <nav class="border-n">
        <div class="nav lg:w-auto lg:mx-auto">
          <div class="py-4 flex items-center relative">
            <div class="flex-initial">
              <div v-if="loading" class="skeletonLogo"></div>
              <a v-else-if="config" href="/" class="logo">
                <img :src="require('../assets/img/commen/logo.png')" />
              </a>
            </div>

            <div class="flex-1 pr-12 flex justify-end">
              <div class="search-form-box">
                <div class="relative">
                  <input
                    type="text"
                    name="keywords"
                    class="search-input"
                    autocomplete="off"
                    v-model="search.keywords"
                    placeholder="请输入关键字"
                    @keyup.enter="goSearch"
                  />
                  <button type="submit" class="btn-search" @click="goSearch()">
                    <img
                      src="../assets/img/commen/icon-search.png"
                      width="20"
                      height="20"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex-initial flex items-center">
              <a
                v-if="isLogin"
                @click="$router.push({ name: 'MemberMessages' })"
                style="opacitiy: 0.8"
                class="relative rounded mr-12 text-gray-500 text-center hover:text-gray-900"
              >
                <img
                  src="../assets/img/commen/icon-message.png"
                  width="20"
                  height="20"
                  style="margin: 0 auto"
                />
                <div class="text-sm mt-1 text-center">
                  <span>我的消息</span>
                </div>
                <div
                  v-if="newStatus"
                  class="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0"
                ></div>
              </a>

              <a
                v-if="!isLogin"
                @click="goLogin()"
                class="text-sm py-2 text-gray-500 hover:text-blue-600"
                >登录</a
              >
              <span v-if="!isLogin" class="text-gray-300 mx-2">|</span>
              <a
                v-if="!isLogin"
                @click="goRegister()"
                class="text-sm py-2 text-gray-500 hover:text-blue-600"
                >注册</a
              >
              <div
                v-if="isLogin && user"
                class="inline-block relative nav-menu"
                @mouseover="memberContinue()"
                @mouseout="clMemberContinue()"
              >
                <a @click="$router.push({ name: 'Member' })" class="userAvatar">
                  <img class="avatar" :src="user.avatar" />
                </a>
                <div
                  v-show="memberCan"
                  class="absolute z-50 right-0 top-full pt-n10 children"
                >
                  <div
                    class="float-left shadow-xl bg-white border border-gray-100 rounded"
                  >
                    <a
                      class="block w-32 text-center float-left px-5 py-2 text-sm text-gray-800 hover:text-blue-600 hover:font-medium rounded-tl rounded-tr"
                      @click="$router.push({ name: 'Member' })"
                    >
                      用户中心
                    </a>
                    <a
                      class="block w-32 text-center float-left px-5 py-2 text-sm text-gray-800 hover:text-blue-600 hover:font-medium rounded-tl rounded-tr"
                      @click="$router.push({ name: 'MemberProfile' })"
                    >
                      我的资料
                    </a>
                    <a
                      class="block w-32 text-center float-left px-5 py-2 text-sm text-gray-800 hover:text-blue-600 hover:font-medium rounded-bl rounded-br"
                      @click="logoutSubmit()"
                    >
                      安全退出
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template v-if="list">
            <ul class="nav-li py-n">
              <li
                v-for="(item, index) in list"
                :key="index"
                class="inline-block relative px-5 nav-menu"
                @click="checkNav(item.url, item.blank)"
                @mouseover="menu(item.children, index)"
                @mouseout="clMenu()"
                :class="{
                  active: hash.match(item.url) && item.url !== '/',
                  isIndex: '#' + item.url === hash,
                }"
              >
                {{ item.name }}
                <div
                  v-if="item.children"
                  v-show="menuCan && index === showKey"
                  class="hidden-menu absolute z-50 left-1/2 -ml-24"
                >
                  <div
                    class="menu-item float-left shadow-xl bg-white border border-gray-100"
                    v-for="child in item.children"
                    :key="child.id"
                  >
                    <a
                      class="overflow-hidden"
                      @click.stop="goChildPage(child.url, child.blank)"
                      >{{ child.name }}</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </div>
      </nav>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      loading: false,
      showKey: null,
      hash: document.location.hash.split("?")[0],
      memberCan: false,
      menuCan: false,
      newStatus: false,
      list: null,
      search: {
        keywords: null,
      },
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "freshUnread", "config", "configFunc"]),
  },
  watch: {
    $route(to, from) {
      this.checkNav();
    },
    freshUnread() {
      if (this.freshUnread) {
        this.getUnread();
      }
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations([
      "logout",
      "showLoginDialog",
      "changeDialogType",
      "removeUnread",
    ]),
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Home.HeaderNav().then((res) => {
        this.loading = false;
        this.list = res.data;
      });
    },
    getUnread() {
      this.$api.Member.UnReadNum().then((res) => {
        let num = res.data;
        if (num === 0) {
          this.newStatus = false;
        } else {
          this.newStatus = true;
        }
        this.removeUnread();
      });
    },
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    goRegister() {
      this.changeDialogType(2);
      this.showLoginDialog();
    },
    goSearch() {
      if (!this.search.keywords) {
        this.$message.error("请输入关键字后再搜索");
        return;
      }
      this.$router.push({
        name: "Search",
        query: {
          keywords: this.search.keywords,
        },
      });
      this.search.keywords = null;
    },
    logoutSubmit() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Auth.Logout()
        .then((res) => {
          this.loading = false;
          this.logout();
          this.$message.success("安全退出成功");
          this.memberCan = false;
          this.menuCan = false;
          this.$router.push({ name: "index" });
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error("网络错误");
        });
    },
    checkNav(url, blank) {
      this.hash = document.location.hash.split("?")[0];
      if (url) {
        if (blank === 0) {
          if (url.match("https:") || url.match("http:")) {
            window.location.href = url;
          } else {
            this.$router.push({ path: url });
          }
        } else {
          if (url.match("https:") || url.match("http:")) {
            window.open(url);
          } else {
            this.$router.resolve({ path: url });
          }
        }
      }
    },
    goChildPage(url, blank) {
      if (blank === 0) {
        if (url.match("https:") || url.match("http:")) {
          window.location.href = url;
        } else {
          this.$router.push({ path: url });
        }
      } else {
        if (url.match("https:") || url.match("http:")) {
          window.open(url);
        } else {
          this.$router.resolve({ path: url });
        }
      }
    },
    menu(val, index) {
      if (val && val.length > 0) {
        this.menuCan = true;
        this.showKey = index;
      } else {
        this.menuCan = false;
        this.showKey = null;
      }
    },
    clMenu() {
      this.menuCan = false;
    },
    memberContinue() {
      this.memberCan = true;
    },
    clMemberContinue() {
      this.memberCan = false;
    },
    goExchanger() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({ path: "/exchanger" });
    },
    goShare() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({ path: "/share" });
    },
  },
};
</script>
<style lang="less" scoped>
@keyframes el-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  to {
    background-position: 0 50%;
  }
}
.logo {
  width: auto;
  height: 50px;
  img {
    width: auto;
    height: 50px;
  }
}
.skeletonLogo {
  width: 187px;
  height: 50px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: el-skeleton-loading 1.4s ease infinite;
}
.userAvatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.nav {
  width: 1200px;
  .flex-initial {
    a:hover {
      opacity: 0.8;
    }
  }
  .search-form-box {
    width: 250px;
    height: 40px;
    .search-input {
      width: 250px;
      border-radius: 20px;
      padding: 13px 20px;
      border: 1px solid #d4d4e3;
      outline: none;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
    }
    .btn-search {
      width: 20px;
      height: 20px;
      outline: none;
    }
  }
  .nav-li {
    .nav-menu {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      cursor: pointer;
      &:first-child {
        padding-left: 0px;
      }
      &:hover {
        color: #3ca7fa;
      }
      &.isIndex {
        color: #3ca7fa;
        font-weight: 500;
      }
      &.active {
        color: #3ca7fa;
        font-weight: 500;
      }
    }
    .hidden-menu {
      width: 194px;
      height: auto;
      box-shadow: 0px 2px 8px 0px rgba(85, 102, 119, 0.1);
      .menu-item {
        width: 194px;
        border: none;
        &:first-child {
          border-radius: 4px 4px 0px 0px;
        }
        &:last-child {
          border-radius: 0px 0px 4px 4px;
        }
        overflow: hidden;
        a {
          border: none;
          background-color: #fff;
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 400;
          font-size: 16px;
          color: rgba(75, 85, 99);
          cursor: pointer;
          &:hover {
            background-color: rgba(243, 244, 246);
          }
        }
      }
    }
  }
}
</style>
