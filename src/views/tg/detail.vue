<template>
  <div class="content">
    <div class="box">
      <template v-if="loading">
        <skeletonDetail></skeletonDetail>
      </template>
      <template v-else-if="goods">
        <div class="nav">
          <a @click="$router.push({ name: 'index' })">首页</a> /
          <a @click="$router.push({ name: 'tg' })">团购</a> /
          <span>{{ goods.goods_title }}</span>
        </div>
        <div class="book-info">
          <div class="book-info-box">
            <div class="book-thumb">
              <thumb-bar
                :value="goods.goods_thumb"
                :width="320"
                :height="240"
              ></thumb-bar>
            </div>
            <div class="info">
              <div class="book-info-title">{{ goods.goods_title }}</div>
              <div class="ms-button">
                <div class="original_charge">
                  原价￥{{ goods.original_charge }}
                </div>
                <div class="charge">
                  <span class="ms-text">拼团价</span>
                  <span class="charge-text">
                    <span class="unit">￥</span>{{ goods.charge }}
                  </span>
                </div>
                <template v-if="joinItem">
                  <div class="price" v-if="isOver">
                    <div class="ms-time">
                      已参与，{{ joinItem.status_text }}
                    </div>
                    <i class="line"></i>
                    <div class="ms-time" v-if="joinItem.over_people_num > 0">
                      ，还差{{ joinItem.over_people_num }}人完成
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="price" v-if="isOver">
                    <div class="end">已结束</div>
                  </div>
                  <div class="price" v-else-if="isStart">
                    <div class="ms-time start">
                      距团购结束剩余{{ remainingTime.day }}天{{
                        remainingTime.hr
                      }}时{{ remainingTime.min }}分{{ remainingTime.sec }}秒
                    </div>
                    <i class="line" v-if="items.length > 0"></i>
                    <div class="ms-time" v-if="items.length > 0">
                      {{ items.length }}人在拼单，可直接参与
                    </div>
                  </div>
                  <div class="price" v-else>
                    <div class="ms-time start">
                      距团购开始剩余<count-down
                        :timestamp="goods.started_count_down"
                      ></count-down>
                    </div>
                  </div>
                </template>
              </div>

              <div
                v-if="!joinItem && !isOver"
                class="buy-button"
                @click="goPay(0)"
              >
                {{ goods.people_num }}人团/立即开团
              </div>
              <div class="has-button" v-if="joinItem">商品已购买</div>
              <div class="isOver" v-if="!joinItem && isOver">已结束</div>
            </div>
          </div>
          <div class="tg-box" v-if="!joinItem && items.length > 0">
            <div class="tg-items">
              <div class="tg-items-content">
                <div class="item-item" v-for="item in items" :key="item.id">
                  <div class="user">
                    <div class="avatar">
                      <img :src="item.create_user_avatar" />
                    </div>
                    <div class="nickname">
                      {{ item.create_user_name }}
                    </div>
                  </div>

                  <div class="date">
                    <div class="text">还差{{ item.over_people_num }}人</div>
                  </div>
                  <div class="countdown">
                    距离结束
                    <count-down :timestamp="item.count_down"></count-down>
                  </div>
                  <div class="join-button" @click="goPay(item.id)">
                    加入拼团
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="book-desc" v-if="goods">
          <div class="new-content" v-html="goods.desc"></div>
        </div>
      </template>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import CountDown from "../../components/count-down.vue";
import SkeletonDetail from "../../components/skeleton/skeletonDetail.vue";

export default {
  components: {
    NavFooter,
    CountDown,
    SkeletonDetail,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      goods: [],
      isOver: false,
      isStart: false,
      items: [],
      joinItem: [],
      currentTab: 2,
      remainingTime: {
        all: 0,
        day: 0,
        hr: 0,
        min: 0,
        sec: 0,
      },
      isfixTab: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    window.addEventListener("scroll", this.handleTabFix, true);
    this.getDetail();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleTabFix, true);
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    countdown(endTime) {
      const end = Date.parse(endTime);
      const now = Date.parse(new Date());
      const msec = end - now;
      if (msec < 0) {
        return;
      }
      let day = parseInt(msec / 1000 / 60 / 60 / 24);
      let hr = parseInt((msec / 1000 / 60 / 60) % 24);
      let min = parseInt((msec / 1000 / 60) % 60);
      let sec = parseInt((msec / 1000) % 60);
      this.remainingTime.day = day;
      this.remainingTime.hr = hr > 9 ? hr : "0" + hr;
      this.remainingTime.min = min > 9 ? min : "0" + min;
      this.remainingTime.sec = sec > 9 ? sec : "0" + sec;
      const that = this;
      if (min >= 0 && sec >= 0) {
        //倒计时结束关闭订单
        if (min === 0 && sec === 0 && hr === 0) {
          return;
        }
        setTimeout(() => {
          that.countdown(endTime);
        }, 1000);
      }
    },
    handleTabFix() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let navbar = document.querySelector("#NavBar");
      if (navbar) {
        let offsetTop = navbar.offsetTop;
        scrollTop > offsetTop
          ? (this.isfixTab = true)
          : (this.isfixTab = false);
      }
    },

    tabChange(key) {
      this.currentTab = key;
    },
    goPay(gid = 0) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "tg",
          goods_charge: this.goods.charge,
          goods_label: "团购",
          goods_name: this.goods.goods_title,
          goods_id: this.goods.id,
          goods_thumb: this.goods.goods_thumb,
          tg_gid: gid,
          course_id: this.goods.id,
        },
      });
    },
    goRole() {
      this.$router.push({
        name: "vip",
      });
    },
    getDetail() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.TuanGou.Detail(this.id).then((res) => {
        this.loading = false;
        this.goods = res.data.goods;
        this.isOver = res.data.is_over;
        this.isStart = res.data.is_start;
        this.items = res.data.items;
        this.joinItem = res.data.join_item;
        document.title = res.data.goods.goods_title;
        if (this.isStart) {
          this.countdown(this.goods.ended_at);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .fix-nav {
    width: 100%;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 50;
    .tabs {
      width: 1200px;
      margin: 0 auto;
      height: 72px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      padding: 28px 30px;
      border-radius: 0px 0px 8px 8px;
      .item-tab {
        width: 64px;
        height: 16px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
        margin-right: 80px;
        cursor: pointer;
        position: relative;
        &.active {
          font-weight: 600;
          color: #3ca7fa;
        }
        .actline {
          width: 52px;
          height: 4px;
          background: #3ca7fa;
          position: absolute;
          left: 6px;
          top: 40px;
        }
      }
    }
  }
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
      min-height: 300px;
      background: #ffffff;
      border-radius: 8px;
      .tg-box {
        width: 1200px;
        background: #ffffff;
        box-sizing: border-box;
        padding: 0px 30px 30px 30px;
        .tg-items {
          width: 100%;
          height: auto;
          background: #f4fafe;
          box-sizing: border-box;
          padding: 20px 30px;
          .tg-items-content {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            .item-item {
              width: 100%;
              height: 48px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              &:not(:last-of-type) {
                margin-bottom: 30px;
              }
              .user {
                width: 340px;
                height: 48px;
                display: flex;
                flex-direction: row;
                align-items: center;
                .avatar {
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  margin-right: 10px;
                  img {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                  }
                }
                .nickname {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #666666;
                  line-height: 14px;
                }
              }
              .date {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                line-height: 14px;
              }
              .countdown {
                width: 300px;
                display: flex;
                flex-direction: row;
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                line-height: 14px;
              }
              .join-button {
                width: 104px;
                height: 48px;
                background: #ff5068;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                cursor: pointer;
                font-weight: 400;
                color: #ffffff;
              }
            }
          }
        }
      }
      .book-info-box {
        width: 1200px;
        height: 300px;
        box-sizing: border-box;
        padding: 30px 50px 30px 30px;
        position: relative;
        display: flex;
        flex-direction: row;
        .book-thumb {
          width: 320px;
          height: 240px;
          border-radius: 8px;
          margin-right: 50px;
          position: relative;
          overflow: hidden;
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
          width: 750px;
          height: 240px;
          position: relative;
          .book-info-title {
            width: 710px;
            height: 30px;
            font-size: 24px;
            font-weight: 500;
            color: #333333;
            line-height: 24px;
            margin-top: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .ms-button {
            margin-top: 24px;
            width: 770px;
            height: 80px;
            background: linear-gradient(90deg, #ff2276 0%, #ff897c 100%);
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 15px 50px;
            position: relative;
            .original_charge {
              width: 100%;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #ffffff;
              line-height: 14px;
              text-decoration: line-through;
              margin-bottom: 6px;
            }
            .end {
              font-size: 16px;
              width: 100%;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
            }
            .charge {
              width: 100%;
              display: flex;
              flex-direction: row;
              align-items: baseline;
              span {
                font-size: 24px;
                font-weight: 600;
                color: #ffffff;
                line-height: 30px;
                &.ms-text {
                  font-size: 14px;
                  line-height: 14px;
                }
                &.charge-text {
                  font-size: 24px;
                  .unit {
                    font-size: 14px;
                    line-height: 14px;
                  }
                }
              }
            }
            .price {
              position: absolute;
              height: 16px;
              font-size: 16px;
              display: flex;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              flex-direction: row;
              align-items: center;
              top: 31px;
              right: 50px;
              .ms-time {
                display: flex;
                flex-direction: row;
              }
              .line {
                width: 1px;
                height: 16px;
                background: #ffffff;
                margin-left: 30px;
                margin-right: 30px;
              }
            }
          }
          .collect-button {
            width: 29px;
            height: 29px;
            position: absolute;
            right: 0;
            top: 15px;
            cursor: pointer;
          }
          .desc {
            margin-top: 20px;
            width: 750px;
            height: 164px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            overflow: hidden;
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
          }
          .has-button {
            position: absolute;
            background: #f4fafe;
            border-radius: 4px;
            padding: 20px;
            font-size: 16px;
            font-weight: 400;
            color: #999999;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 0;
            cursor: pointer;
          }
          .isOver {
            position: absolute;
            background: #999999;
            border-radius: 4px;
            padding: 20px 55px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 0;
            cursor: pointer;
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
          }
          .unpaid {
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
            left: 100px;
            cursor: pointer;
          }
        }
      }
      .tabs {
        width: 1200px;
        height: 72px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        padding: 28px 30px;
        .item-tab {
          width: 64px;
          height: 16px;
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          margin-right: 70px;
          text-align: center;
          cursor: pointer;
          position: relative;
          &.active {
            font-weight: 600;
            color: #3ca7fa;
          }
          .actline {
            width: 52px;
            height: 4px;
            background: #3ca7fa;
            position: absolute;
            left: 6px;
            top: 40px;
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
    .book-chapter-box {
      width: 1200px;
      padding: 50px 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      .steps-box {
        width: 100%;
        height: auto;
        .step-item {
          width: 100%;
          height: auto;
          &:not(:last-child) {
            margin-bottom: 50px;
          }
          .step-title {
            width: 100%;
            height: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 16px;
            margin-bottom: 30px;
          }
          .courses-box {
            width: 100%;
            height: auto;
            .course-item {
              width: 100%;
              height: 100px;
              display: flex;
              flex-direction: row;
              align-items: center;
              position: relative;
              cursor: pointer;
              &:not(:last-child) {
                margin-bottom: 30px;
              }
              .course-thumb {
                width: 133px;
                height: 100px;
                border-radius: 4px;
                margin-right: 30px;
                display: flex;
                justify-content: center;
                img {
                  width: 133px;
                  height: 100px;
                  border-radius: 4px;
                  &.active {
                    width: 75px;
                  }
                }
              }
              .course-body {
                height: 100px;
                display: flex;
                flex-direction: column;
                .course-type {
                  width: 56px;
                  height: 22px;
                  background: #04c877;
                  border-radius: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: 400;
                  color: #ffffff;
                  margin-bottom: 20px;
                }
                .course-name {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 600;
                  color: #333333;
                  line-height: 14px;
                  margin-bottom: 20px;
                }
                .course-charge {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 500;
                  color: #ff5068;
                  line-height: 14px;
                }
                .course-free {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 500;
                  color: #04c877;
                  line-height: 14px;
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
