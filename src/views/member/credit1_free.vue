<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="18"></nav-member>
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
            <div
              id="page"
              v-show="total > pagination2.page_size && list.length > 0"
            >
              <page-box
                :key="pagination2.page"
                :page="pagination2.page"
                :totals="total"
                @current-change="changepage"
                :pageSize="pagination2.page_size"
                :tab="false"
              ></page-box>
            </div>
          </div>
          <div class="rules-content" v-if="config">
            <div class="btn-title">积分获取</div>
            <div class="rules-item" v-if="config.credit1_reward.register !== 0">
              <p>• 注册登录 +{{ config.credit1_reward.register }} 积分</p>
            </div>
            <div
              class="rules-item"
              v-if="config.credit1_reward.watched_video !== 0"
            >
              <p>• 看完视频 +{{ config.credit1_reward.watched_video }} 积分</p>
            </div>
            <div
              class="rules-item"
              v-if="config.credit1_reward.watched_vod_course !== 0"
            >
              <p>
                • 看完课程 +{{ config.credit1_reward.watched_vod_course }} 积分
              </p>
            </div>
            <div
              class="rules-item"
              v-if="config.credit1_reward.paid_order !== 0"
            >
              <p>
                • 下单成功 +金额*{{
                  parseInt(config.credit1_reward.paid_order / 100)
                }}% 积分
              </p>
            </div>
            <div class="rules-item" v-if="config.credit1_reward.invite !== 0">
              <p>• 邀请好友注册 +{{ config.credit1_reward.invite }} 积分</p>
            </div>
            <div class="rules-item">
              <p>• 可以回答积分悬赏问题获取积分</p>
            </div>
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
      pagination2: {
        page: 1,
        page_size: 10,
      },
      currentTab: 1,
      loading: false,
      tabs: [
        {
          name: "我的积分",
          id: 1,
        },
        {
          name: "明细规则",
          id: 2,
        },
      ],
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "config"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    tabChange(key) {
      this.currentTab = key;
      if (this.currentTab === 2) {
        this.resetData();
        this.getData();
      }
    },
    changepage(item) {
      this.pagination2.page_size = item.pageSize;
      this.pagination2.page = item.currentPage;
      if (this.currentTab === 2) {
        this.getData();
      }
    },
    resetData() {
      this.list = [];
      this.total = null;
      this.pagination2.page_size = 10;
      this.pagination2.page = 1;
    },
    getData() {
      this.$api.Member.Credit1Records(this.pagination2).then((res) => {
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
              line-height: 14px;
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
            margin-top: 30px;
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
