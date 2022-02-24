<template>
  <div class="content">
    <div class="filter">
      <div class="box">
        <img class="icon" src="../../assets/img/commen/icon-market@2x.png" />
        <span class="tit">积分商城</span>
        <span class="credict" v-if="user"
          >我的积分：<strong>{{ user.credit1 }}</strong></span
        >
      </div>
    </div>
    <div class="contanier">
      <div class="left-contanier">
        <template v-if="loading">
          <skeletonCredictList></skeletonCredictList>
        </template>
        <template v-else-if="list.length > 0">
          <div class="left-list">
            <div
              class="list-item"
              v-for="item in list"
              :key="item.id"
              @click="goDetail(item.id)"
            >
              <div class="thumb">
                <thumb-bar
                  :value="item.thumb"
                  :width="216"
                  :height="162"
                ></thumb-bar>
                <div class="status">发实物</div>
              </div>
              <div class="body">
                <div class="name">{{ item.title }}</div>
                <div class="value">
                  <div class="cre">
                    <span>{{ item.view_times }}</span> 积分
                  </div>
                  <div class="type">包邮</div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <none type="white" v-else></none>
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
        <div class="right-list">
          <div class="tit">积分获取说明</div>
          <div class="line"></div>
          <div class="right-box">
            <p>1.注册登录<span> +2 </span>积分</p>
            <p>2.看完视频<span> +3 </span>积分</p>
            <p>3.看完课程<span> +4 </span>积分</p>
            <p>4.下载成功<span> +20 </span>积分</p>
            <p>5.邀请好友注册登陆<span> +10 </span>积分</p>
            <p>6.可以回答积分悬赏问题获取积分</p>
          </div>
        </div>
        <template v-if="loading2">
          <div style="margin-top: 20px">
            <skeletonCredictHistory></skeletonCredictHistory>
          </div>
        </template>
        <template v-else>
          <div class="right-list">
            <div class="tit">历史兑换订单</div>
            <div class="line"></div>
            <template v-if="history.length > 0">
              <div class="right-box">
                <div
                  class="right-item"
                  v-for="hisItem in history"
                  :key="hisItem.id"
                  @click="goDetail(hisItem.id)"
                >
                  <div class="thumb">
                    <div class="thumb-bar">
                      <thumb-bar
                        :value="hisItem.thumb"
                        :width="107"
                        :height="80"
                      ></thumb-bar>
                    </div>
                  </div>
                  <div class="body">
                    <div class="name">{{ hisItem.title }}</div>
                    <div class="status red" v-if="hisItem.status === 1">
                      发货中
                    </div>
                    <div class="status" v-else-if="hisItem.status === 2">
                      已完成
                    </div>
                    <div class="status" v-else>运单号：6432321234</div>
                    <div class="value">
                      <div class="time">
                        {{ hisItem.created_at | changeTime }}
                      </div>
                      <div class="cre">{{ hisItem.view_times }}积分</div>
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
import { mapState, mapMutations } from "vuex";
import None from "../../components/none.vue";
import PageBox from "../../components/page.vue";
import NavFooter from "../../components/footer.vue";
import SkeletonCredictList from "../../components/skeleton/skeletonCredictList.vue";
import SkeletonCredictHistory from "../../components/skeleton/skeletonCredictHistory.vue";

export default {
  components: {
    NavFooter,
    PageBox,
    None,
    SkeletonCredictList,
    SkeletonCredictHistory,
  },
  data() {
    return {
      list: [],
      history: [],
      total: null,
      pagination: {
        page: 1,
        size: 15,
      },
      loading: false,
      loading2: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
    this.getHistory();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    resetData() {
      this.list = [];
      this.history = [];
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
      window.scrollTo(0, 0);
    },
    goDetail(id) {
      this.$router.push({
        name: "CredictmallDetail",
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
      this.$api.Topic.List(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    getHistory() {
      if (this.loading2) {
        return;
      }
      this.loading2 = true;
      this.$api.Topic.HotList().then((res) => {
        this.loading2 = false;
        this.history = res.data;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .filter {
    width: 100%;
    height: 60px;
    background: #ffffff;
    .box {
      width: 1200px;
      height: 60px;
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      align-items: center;
      .icon {
        width: 40px;
        height: 40px;
        margin-right: 15px;
      }
      .tit {
        height: 20px;
        font-size: 20px;
        font-weight: 600;
        color: #333333;
        line-height: 20px;
        margin-right: 50px;
      }
      .credict {
        height: 16px;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
        strong {
          color: #ff5068;
        }
      }
    }
  }
  .contanier {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    padding-top: 30px;
    .left-contanier {
      width: 770px;
      height: auto;
      margin-right: 30px;
      position: relative;
      background: #f4fafe;
      .left-list {
        width: 100%;
        height: auto;
        min-height: 500px;
        display: grid;
        gap: 30px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e5e5e5;
        box-sizing: border-box;
        padding: 30px;
        .list-item {
          width: 216px;
          height: 237px;
          border-radius: 8px;
          cursor: pointer;
          background: #fff;
          &:hover {
            .thumb {
              .thumb-bar {
                transform: scale(1.1, 1.1);
              }
            }
          }
          .thumb {
            width: 100%;
            height: 162px;
            border-radius: 8px 8px 0px 0px;
            background: #f4fafe;
            display: flex;
            justify-content: center;
            overflow: hidden;
            position: relative;
            .status {
              position: absolute;
              background: linear-gradient(270deg, #0ae6af 0%, #04c877 100%);
              border-radius: 4px;
              font-size: 12px;
              font-weight: 400;
              line-height: 12px;
              color: #ffffff;
              padding: 10px 15px;
              bottom: 10px;
              right: 10px;
            }
            .thumb-bar {
              width: 100%;
              height: 100%;
              transition: all 0.3s;
            }
          }

          .body {
            width: 100%;
            height: 75px;
            float: left;
            box-sizing: border-box;
            padding: 10px;
            border-radius: 0px 0px 8px 8px;
            border: 1px solid #e5e5e5;
            border-top: none;
            .name {
              width: 100%;
              margin-top: 5px;
              height: 16px;
              font-size: 16px;
              font-weight: 600;
              color: #333333;
              line-height: 16px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-bottom: 20px;
            }
            .value {
              width: 100%;
              height: 14px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              .cre {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                line-height: 14px;
                span {
                  font-weight: 600;
                  color: #ff5068;
                }
              }
              .type {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #ff5068;
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
        margin-top: 50px;
      }
    }
    .right-contanier {
      width: 400px;
      position: relative;
      display: flex;
      flex-direction: column;
      .right-list {
        display: inline-block;
        width: 400px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        padding: 30px;
        box-sizing: border-box;
        margin-bottom: 30px;
        .tit {
          width: 100%;
          height: 18px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
          margin-bottom: 15px;
        }
        .line {
          width: 100%;
          height: 1px;
          background: #e5e5e5;
          margin-bottom: 30px;
        }
        .right-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          p {
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            span {
              color: #ff5068;
            }
          }
          .right-item {
            width: 100%;
            height: 80px;
            display: flex;
            flex-direction: row;
            cursor: pointer;
            margin-bottom: 30px;
            &:last-child {
              margin-bottom: 0px;
            }
            &:hover {
              .thumb {
                .thumb-bar {
                  transform: scale(1.1, 1.1);
                }
              }
            }
            .thumb {
              width: 107px;
              height: 80px;
              border-radius: 4px;
              overflow: hidden;
              margin-right: 15px;
              background: #f4fafe;
              display: flex;
              justify-content: center;
              .thumb-bar {
                width: 100%;
                height: 100%;
                transition: all 0.3s;
              }
            }
            .body {
              width: 218px;
              height: 80px;
              display: flex;
              flex-direction: column;
              .name {
                width: 100%;
                height: 14px;
                font-size: 14px;
                font-weight: 500;
                color: #333333;
                line-height: 14px;
                margin-top: 5px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-bottom: 16px;
              }
              .status {
                width: 100%;
                height: 12px;
                font-size: 12px;
                font-weight: 400;
                color: #333333;
                line-height: 12px;
                margin-bottom: 16px;
                &.red {
                  color: #ff5068;
                }
              }
              .value {
                width: 100%;
                height: 12px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .time,
                .cre {
                  height: 12px;
                  font-size: 12px;
                  font-weight: 400;
                  color: #999999;
                  line-height: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
