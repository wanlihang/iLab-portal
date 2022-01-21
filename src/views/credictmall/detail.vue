<template>
  <div class="content">
    <credict-payment
      :status="openDialog"
      @hide="hideDialog"
      @confirm="submit"
    ></credict-payment>
    <div class="box">
      <template v-if="loading">
        <skeletonDetail></skeletonDetail>
      </template>
      <template v-else-if="goods">
        <div class="nav">
          <a @click="$router.push({ name: 'index' })">首页</a> /
          <a @click="$router.push({ name: 'Credictmall' })">积分商城</a> /
          <span>{{ goods.title }}</span>
        </div>
        <div class="book-info">
          <div class="book-info-box">
            <div class="book-thumb">
              <img :src="goods.thumb" />
            </div>
            <div class="info">
              <div class="count">库存：剩余1232件</div>
              <div class="book-info-title">
                <div class="value">{{ goods.title }}</div>
                <div class="type">包邮</div>
                <div class="status">发实物</div>
              </div>
              <div class="desc" v-html="goods.free_content_render"></div>

              <template v-if="isBuy">
                <div class="see-button" @click="startLearn">已购买</div>
              </template>
              <template v-else>
                <div
                  class="buy-button"
                  v-if="goods.charge > 0"
                  @click="buyGoods()"
                >
                  立即购买{{ goods.charge }}积分
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="book-desc" v-if="goods">
          <div class="new-content" v-html="goods.free_content_render"></div>
        </div>
      </template>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import SkeletonDetail from "../../components/skeleton/skeletonDetail.vue";
import CredictPayment from "../../components/credict-payment.vue";

export default {
  components: {
    NavFooter,
    SkeletonDetail,
    CredictPayment,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      goods: [],
      total: null,
      isBuy: false,
      openDialog: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    buyGoods() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.openDialog = true;
    },
    startLearn() {
      console.log("已购买");
    },
    hideDialog() {
      this.openDialog = false;
    },
    submit(val) {
      this.openDialog = false;
      console.log(val);
    },
    getDetail() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Topic.Detail(this.id).then((res) => {
        this.loading = false;
        this.goods = res.data.topic;
        this.isBuy = res.data.is_buy;
        document.title = this.goods.title;
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
    .nav {
      width: 100%;
      height: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      color: #999999;
      line-height: 14px;
      margin-top: 30px;
      margin-bottom: 30px;
      a {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        margin-right: 6px;
        &:not(:first-of-type) {
          margin-left: 6px;
        }
      }
      span {
        height: 14px;
        margin-left: 6px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }
    }
    .book-info {
      width: 1200px;
      height: 300px;
      background: #ffffff;
      border-radius: 8px;
      .book-info-box {
        width: 1200px;
        height: 300px;
        box-sizing: border-box;
        padding: 30px;
        position: relative;
        display: flex;
        flex-direction: row;

        .book-thumb {
          width: 320px;
          height: 240px;
          background: #f4fafe;
          border-radius: 8px;
          margin-right: 50px;
          overflow: hidden;
          position: relative;
          display: flex;
          justify-content: center;
          img {
            width: auto;
            height: 240px;
            border-radius: 8px;
          }
          .status {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: rgba(60, 167, 250);
            color: #fff;
            font-size: 14px;
            padding: 4px;
            border-radius: 4px;
          }
        }
        .info {
          width: 770px;
          height: 240px;
          position: relative;
          .count {
            position: absolute;
            top: 24px;
            right: 0;
            height: 16px;
            font-size: 16px;
            font-weight: 400;
            color: #999999;
            line-height: 16px;
          }
          .book-info-title {
            width: 100%;
            height: 32px;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 20px;
            .value {
              max-width: 400px;
              height: 24px;
              font-size: 24px;
              font-weight: 500;
              color: #333333;
              line-height: 24px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .type {
              background: linear-gradient(90deg, #ff5068 0%, #ff92a1 100%);
              border-radius: 4px;
              font-size: 12px;
              font-weight: 400;
              color: #ffffff;
              line-height: 12px;
              padding: 10px 21px;
              margin-left: 30px;
            }
            .status {
              background: linear-gradient(270deg, #0ae6af 0%, #04c877 100%);
              border-radius: 4px;
              font-size: 12px;
              font-weight: 400;
              color: #ffffff;
              padding: 10px 15px;
              line-height: 12px;
              margin-left: 15px;
            }
          }
          .desc {
            margin-top: 20px;
            width: 770px;
            height: 95px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            overflow: hidden;
            p {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
            }
          }
          .see-button {
            position: absolute;
            background: #3ca7fa;
            border-radius: 4px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 0;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
          .buy-button {
            position: absolute;
            background: #ff5068;
            border-radius: 4px;
            padding: 20px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 0;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
    .book-desc {
      padding: 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 400;
      color: #121212;
      line-height: 28px;
    }
  }
}
</style>
