<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="19" :news="newStatus"></nav-member>
      <div class="project-box">
        <div class="btn-title">秒杀订单</div>
        <div class="project-content">
          <template v-if="loading">
            <skeletonMemberOrder></skeletonMemberOrder>
          </template>
          <template v-else-if="list.length > 0">
            <template v-for="item in list">
              <div
                class="project-item"
                :key="item.id"
                v-if="item.goods && item.goods.goods_type"
              >
                <div
                  class="item-thumb"
                  v-if="item.goods && item.goods.goods_thumb"
                >
                  <div class="spback"></div>
                  <img :src="item.goods.goods_thumb" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods.goods_type === 'course'"
                >
                  <img src="../../assets/img/commen/default-lesson.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods.goods_type === 'live'"
                >
                  <img src="../../assets/img/commen/default-live.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods.goods_type === 'learnPath'"
                >
                  <img src="../../assets/img/commen/default-steps.png" />
                </div>
                <div
                  class="item-thumb"
                  v-else-if="item.goods.goods_type === 'book'"
                >
                  <img src="../../assets/img/commen/default-ebook.png" />
                </div>
                <div class="item-info">
                  <div class="item-top">
                    <div class="item-name">
                      {{ item.goods.goods_title }}
                    </div>
                    <div class="order-num">
                      类型：{{ item.goods.goods_type_text }}
                    </div>
                    <div class="item-time">
                      {{ item.created_at | changeTime }}
                    </div>
                  </div>
                  <div class="item-bottom">
                    <div class="item-price">实付款：￥{{ item.charge }}</div>
                    <div
                      class="item-status act"
                      @click="goMsOrder(item)"
                      v-if="item.status === 0"
                    >
                      未支付，点击立即支付
                    </div>
                    <div class="item-status" v-else-if="item.status === 1">
                      已支付
                    </div>
                    <div class="item-status" v-else-if="item.status === 3">
                      已取消
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <none type="white" v-else></none>
        </div>
        <div id="page">
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
import SkeletonMemberOrder from "../../components/skeleton/skeletonMemberOrder.vue";
export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
    SkeletonMemberOrder,
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
      loading: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    resetData() {
      this.list = [];
      this.pagination.page_size = 10;
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.page_size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Member.Miaosha(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data;
        this.total = res.data.total;
      });
    },
    goMsOrder(item) {
      this.$router.push({
        name: "order",
        query: {
          course_id: item.goods.goods_id,
          course_type: item.goods.goods_type,
          goods_type: "ms",
          goods_charge: item.charge,
          goods_label: "秒杀",
          goods_name: item.goods.goods_title,
          goods_id: item.id,
          goods_thumb: item.goods.goods_thumb,
        },
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
      .btn-title {
        width: 56px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
        cursor: pointer;
        margin-bottom: 30px;
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
          .item-thumb {
            width: 133px;
            height: 100px;
            background: #f0f0f8;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            overflow: hidden;
            margin-right: 30px;
            position: relative;
            .spback {
              position: absolute;
              left: 20px;
              top: 10px;
              width: 93px;
              height: 80px;
              background: #d2e1ef;
              border-radius: 8px;
            }
            img {
              z-index: 10;
              height: 100px;
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
              height: 22px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 16px;
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
              .order-num {
                height: 12px;
                font-size: 12px;
                font-weight: 400;
                color: #666666;
                line-height: 12px;
                margin-right: 30px;
                margin-left: auto;
              }
              .item-time {
                height: 12px;
                font-size: 12px;
                font-weight: 400;
                color: #666666;
                line-height: 12px;
              }
            }
            .item-bottom {
              width: 100%;
              height: 14px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 30px;
              .item-price {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                line-height: 14px;
              }
              .item-status {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                line-height: 14px;
                margin-left: auto;
                &.act {
                  color: #ff5068;
                  cursor: pointer;
                  &:hover {
                    opacity: 0.8;
                  }
                }
              }
            }
          }
        }
      }
      #page {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
