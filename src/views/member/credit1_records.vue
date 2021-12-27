<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="16"></nav-member>
      <div class="right-box">
        <div class="exchange-box">
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
          <div class="exchange-content" v-if="user">
            <div class="tit">我的积分：</div>
            <div class="credit">{{ user.credit1 }}积分</div>
          </div>
        </div>
        <div class="goods-box" v-if="currentTab === 1">
          <template v-if="list.length > 0">
            <div
              class="goods-item"
              v-for="(item, index) in list"
              :key="index"
              @click="goDetail(item)"
            >
              <div
                class="item-thumb"
                :style="{ 'background-image': 'url(' + item.thumb + ')' }"
              ></div>
              <div class="item-body">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-info">
                  <div class="item-value">{{ item.charge }}积分</div>
                  <div class="item-type">
                    <span class="type">{{
                      statusType(item.is_v, item.v_type)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
          <div id="page" v-show="list.length > 0">
            <page-box
              :totals="total"
              @current-change="changepage"
              :pageSize="pagination.size"
              :tab="false"
            ></page-box>
          </div>
        </div>
        <div class="rules" v-if="currentTab === 2">
          <div class="project-box">
            <div class="btn-title">积分明细</div>
            <template v-if="list.length > 0">
              <div
                class="project-item"
                v-for="(item, index) in list"
                :key="index"
              >
                <div class="title">{{ item.remark }}</div>
                <div class="value">
                  <span v-if="item.sum > 0">+{{ item.sum }}</span>
                  <span v-else>{{ item.sum }}</span>
                </div>
                <div class="info">
                  <span>{{ item.created_at | changeTime }}</span>
                </div>
              </div>
            </template>
            <none type="white" v-else></none>
            <div id="page" v-show="list.length > 0">
              <page-box
                :totals="total"
                @current-change="changepage"
                :pageSize="pagination2.page_size"
                :tab="false"
              ></page-box>
            </div>
          </div>
          <div class="rules-content">
            <div class="btn-title">积分获取</div>
            <div class="rules-item" v-for="(item, index) in rules" :key="index">
              <p>{{ item.value }}</p>
            </div>
          </div>
        </div>
        <div class="orders-box" v-if="currentTab === 3">
          <template v-if="list.length > 0">
            <div class="item" v-for="item in list" :key="item.id">
              <div class="top">
                <div class="id">兑换流水号：{{ item.id }}</div>
                <div class="button">
                  <template v-if="item.goods_is_v === 0">
                    <div class="orderId" v-if="item.is_send === 1">
                      运单号：{{ item.express_number }}
                    </div>
                    <div
                      class="showDetail"
                      v-if="item.is_send === 1"
                      @click="copy(item.express_number)"
                    >
                      复制
                    </div>
                    <div class="orderId" v-else-if="item.is_send === 0">
                      发货中
                    </div>
                  </template>
                  <template v-else-if="item.goods_is_v === 1">
                    <div class="orderId" v-if="item.is_send === 1">
                      已发放成功
                    </div>
                    <div
                      class="showDetail"
                      v-if="item.is_send === 1"
                      @click="goDetail(item.goods_v_type, item.goods_v_id)"
                    >
                      立即查看
                    </div>
                    <div class="orderId" v-else-if="item.is_send === 0">
                      发货中
                    </div>
                  </template>
                </div>
              </div>
              <div class="body">
                <div
                  class="left"
                  :style="{
                    'background-image': 'url(' + item.goods_thumb + ')',
                  }"
                ></div>
                <div class="right">
                  <div class="title">
                    {{ item.goods_title }}
                  </div>
                  <div class="info">
                    <div class="date">
                      {{ item.created_at | diffForHumans }}
                    </div>
                    <div class="value">{{ item.total_charge }}积分</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
          <div id="page" v-show="list.length > 0">
            <page-box
              :totals="total"
              @current-change="changepage"
              :pageSize="pagination.size"
              :tab="false"
            ></page-box>
          </div>
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

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
  },
  data() {
    return {
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
      },
      pagination2: {
        page: 1,
        page_size: 10,
      },
      currentTab: 1,
      loading: false,
      tabs: [
        {
          name: "积分商城",
          id: 1,
        },
        {
          name: "明细规则",
          id: 2,
        },
        {
          name: "积分订单",
          id: 3,
        },
      ],
      rules: [
        {
          value: "1.注册登录 +2 积分",
        },
        {
          value: "2.看完视频 +3 积分",
        },
        {
          value: "3.看完课程 +4 积分",
        },
        {
          value: "4.下单成功 +20 积分",
        },
        {
          value: "5.邀请好友注册 +10 积分",
        },
        {
          value: "6.可以回答积分悬赏问题获取积分",
        },
      ],
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getMall();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    statusType(is_v, type) {
      if (is_v === 0) {
        return "发实物";
      } else if (is_v === 1) {
        if (type === "vod" || type === "live" || type === "book") {
          return "换课程";
        } else if (type === "vip") {
          return "换会员";
        }
      }
    },
    tabChange(key) {
      this.currentTab = key;
      if (this.currentTab === 1) {
        this.resetData();
        this.getMall();
      } else if (this.currentTab === 2) {
        this.resetData();
        this.getData();
      } else if (this.currentTab === 3) {
        this.resetData();
        this.getOrders();
      }
    },
    resetData() {
      this.list = [];
      this.total = null;
      this.pagination.size = 10;
      this.pagination.page = 1;
      this.pagination2.page_size = 10;
      this.pagination2.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination2.page_size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.pagination2.page = item.currentPage;
      if (this.currentTab === 1) {
        this.getMall();
      } else if (this.currentTab === 2) {
        this.getData();
      } else if (this.currentTab === 3) {
        this.getOrders();
      }
    },
    getMall() {
      this.$api.CreditMall.List(this.pagination).then((res) => {
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    getData() {
      this.$api.Member.Credit1Records(this.pagination2).then((res) => {
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    getOrders() {
      this.$api.CreditMall.Orders(this.pagination).then((res) => {
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
    .right-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      box-sizing: border-box;
      .exchange-box {
        width: 999px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        margin-bottom: 10px;
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
        .exchange-content {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          .tit {
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            margin-right: 0px;
          }
          .credit {
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            color: #ff4d4f;
          }
        }
      }
      .orders-box {
        width: 999px;
        height: auto;
        display: flex;
        flex-direction: column;
        .item {
          width: 100%;
          height: 154px;
          background: #ffffff;
          border-radius: 8px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 20px 30px;
          .top {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
      }
      .goods-box {
        display: grid;
        width: 999px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;
        gap: 26px;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        overflow: hidden;
        .goods-item {
          width: 100%;
          height: 261px;
          border-radius: 6px;
          border: 1px solid #e5e5e5;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
          .item-thumb {
            width: 100%;
            height: 168px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center center;
          }
          .item-body {
            width: 100%;
            height: 93px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 10px;
            .item-title {
              width: 100%;
              height: 40px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              font-size: 15px;
              font-weight: 500;
              color: #171923;
              line-height: 20rpx;
            }
            .item-info {
              width: 100%;
              height: 20px;
              margin-top: 12px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              .item-value {
                display: inline-block;
                width: auto;
                height: 14px;
                font-size: 14px;
                font-weight: 600;
                color: #ff5068;
                line-height: 14px;
              }
              .item-type {
                display: inline-block;
                width: auto;
                height: auto;
                background: #ff5068;
                border-radius: 2px;
                padding: 4px;
                font-size: 12px;
                font-weight: 400;
                color: #ffffff;
                line-height: 12px;
              }
            }
          }
        }
      }
      .rules {
        display: flex;
        flex-direction: row;
        width: 999px;
        height: auto;

        .project-box {
          display: flex;
          flex-direction: column;
          width: 644px;
          height: auto;
          background: #ffffff;
          border-radius: 8px;
          box-sizing: border-box;
          padding: 30px;
          margin-right: 10px;
          .btn-title {
            width: 80px;
            height: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 16px;
          }
          .project-item {
            width: 100%;
            height: 14px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-top: 30px;
            .title {
              width: 300px;
              height: 14px;
              font-size: 14px;
              font-weight: 500;
              color: #333333;
              line-height: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .value {
              margin-left: 30px;
              width: 100px;
              height: 14px;
              font-size: 14px;
              font-weight: 600;
              color: #ff5068;
            }
            .info {
              flex: 1;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 14px;
              text-align: right;
            }
          }
          #page {
            width: 100%;
            display: flex;
            justify-content: center;
          }
        }
        .rules-content {
          display: flex;
          flex-direction: column;
          width: 345px;
          height: auto;
          background: #ffffff;
          border-radius: 8px;
          box-sizing: border-box;
          padding: 30px;
          .btn-title {
            width: 80px;
            height: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 16px;
            margin-bottom: 15px;
          }
          .rules-item {
            width: 100%;
            margin-top: 15px;
            height: auto;
            p {
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
