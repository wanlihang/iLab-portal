<template>
  <div class="content">
    <div class="box">
      <template v-if="loading">
        <skeletonDetail></skeletonDetail>
      </template>
      <template v-else-if="learn">
        <div class="nav">
          <a @click="$router.push({ name: 'index' })">首页</a> /
          <a @click="$router.push({ name: 'learnPath' })">学习路径</a> /
          <span>{{ learn.name }}</span>
        </div>
        <div class="book-info">
          <div class="book-info-box">
            <div class="book-thumb">
              <thumb-bar
                :value="learn.thumb"
                :width="320"
                :height="240"
              ></thumb-bar>
            </div>
            <div class="info">
              <div class="book-info-title">{{ learn.name }}</div>
              <p class="desc" v-html="learn.desc"></p>
              <div class="btn-box">
                <template v-if="isBuy">
                  <div class="has-button">已购买</div>
                </template>
                <template v-else>
                  <div class="has-button" v-if="learn.charge === 0">
                    本路径免费
                  </div>
                  <template v-if="msData && msData.data">
                    <div
                      class="buy-button"
                      @click="goMsOrder(msData.order.id)"
                      v-if="
                        learn.charge > 0 &&
                        msData.order &&
                        msData.order.status === 0
                      "
                    >
                      已获得秒杀资格，请尽快支付
                    </div>
                    <div
                      class="buy-button"
                      v-else-if="learn.charge > 0 && !msData.data.is_over"
                      @click="openMsDialog()"
                    >
                      立即秒杀￥{{ msData.data.charge }}
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="buy-button"
                      v-if="learn.charge > 0"
                      @click="buy()"
                    >
                      购买套餐￥{{ learn.charge }}（共{{
                        learn.courses_count
                      }}课程）
                    </div>
                  </template>
                  <template
                    v-if="
                      tgData &&
                      tgData.goods &&
                      (!tgData.join_item || tgData.join_item.length === 0)
                    "
                  >
                    <div class="role-button" @click="goPay(0)">
                      单独开团￥{{ tgData.goods.charge }}
                    </div>
                  </template>
                  <div class="original">原价:￥{{ learn.original_charge }}</div>
                </template>
              </div>
            </div>
          </div>
          <template v-if="!isBuy && msData">
            <miaosha-list
              :ms="msData"
              :status="msDialogStatus"
              @cancel="closeMsDialog"
            ></miaosha-list>
          </template>
          <template v-if="!isBuy && tgData">
            <tuangou-list
              style="margin-bottom: 30px"
              :tg="tgData"
            ></tuangou-list>
          </template>
        </div>
        <div class="book-chapter-box">
          <template v-if="steps.length > 0">
            <div class="steps-box">
              <div class="step-item" v-for="item in steps" :key="item.id">
                <div class="left-item">
                  <img
                    class="icon"
                    src="../../assets/img/commen/icon-guidepost.png"
                  />
                  <div class="column"></div>
                </div>
                <div class="right-item">
                  <div class="step-title">
                    {{ item.name }}
                  </div>
                  <div class="step-desc">{{ item.desc }}</div>
                  <div
                    class="courses-box"
                    :scroll-x="true"
                    v-if="item.courses.length > 0"
                  >
                    <div
                      class="course-item"
                      @click="goDetail(courseItem)"
                      v-for="courseItem in item.courses"
                      :key="courseItem.id"
                    >
                      <div class="course-thumb">
                        <div class="spback"></div>
                        <div
                          class="thumb-bar"
                          :class="{ active: courseItem.type === 'book' }"
                          v-if="courseItem.type === 'book'"
                        >
                          <thumb-bar
                            :value="courseItem.thumb"
                            :width="75"
                            :height="100"
                            :border="4"
                          ></thumb-bar>
                        </div>
                        <div class="thumb-bar" v-else>
                          <thumb-bar
                            :value="courseItem.thumb"
                            :width="133"
                            :height="100"
                            :border="4"
                          ></thumb-bar>
                        </div>
                      </div>
                      <div class="course-body">
                        <div class="course-name">{{ courseItem.name }}</div>
                        <div class="course-type">
                          {{ courseItem.type_text }}
                        </div>
                        <div class="course-free" v-if="courseItem.charge === 0">
                          免费
                        </div>
                        <div class="course-charge" v-else>
                          原价:￥{{ courseItem.charge }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
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
import TuangouList from "../../components/tuangou-list.vue";
import MiaoshaList from "../../components/miaosha-list.vue";

export default {
  components: {
    NavFooter,
    SkeletonDetail,
    TuangouList,
    MiaoshaList,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      learn: [],
      currentTab: 3,
      steps: [],
      tgData: null,
      isBuy: false,
      msData: null,
      msDialogStatus: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "configFunc"]),
  },
  mounted() {
    this.getDetail();
  },
  beforeDestroy() {},
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goPay(gid = 0) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "tg",
          goods_charge: this.tgData.goods.charge,
          goods_label: "团购",
          goods_name: this.tgData.goods.goods_title,
          goods_id: this.tgData.goods.id,
          goods_thumb: this.tgData.goods.goods_thumb,
          tg_gid: gid,
          course_id: this.tgData.goods.other_id,
          course_type: this.tgData.goods.goods_type,
        },
      });
    },
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    buy() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "path",
          goods_charge: this.learn.charge,
          goods_label: "学习路径",
          goods_name: this.learn.name,
          goods_id: this.learn.id,
          goods_thumb: this.learn.thumb,
        },
      });
    },
    goRole() {
      this.$router.push({
        name: "vip",
      });
    },
    goDetail(item) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      let page = "";
      if (item.type === "course") {
        page = "coursesDetail";
      } else if (item.type === "book") {
        page = "bookDetail";
      } else if (item.type === "live") {
        page = "liveDetail";
      } else if (item.type === "paper_practice") {
        page = "ExamPracticeDetail";
      } else if (item.type === "paper_paper") {
        page = "ExamPapersDetail";
      }
      this.$router.push({
        name: page,
        query: {
          id: item.other_id,
        },
      });
    },
    getDetail() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.LearnPath.Detail(this.id).then((res) => {
        this.loading = false;
        this.learn = res.data.data;
        this.steps = res.data.steps;
        this.isBuy = res.data.is_buy;
        document.title = res.data.data.name;
        if (!this.isBuy && this.configFunc["miaosha"]) {
          this.getMsDetail();
        } else if (!this.isBuy && this.configFunc["tuangou"]) {
          this.getTgDetail();
        }
      });
    },
    getTgDetail() {
      if (this.steps.charge === 0) {
        return;
      }
      this.$api.TuanGou.Detail(0, {
        course_id: this.id,
        course_type: "learnPath",
      }).then((res) => {
        this.tgData = res.data;
      });
    },
    getMsDetail() {
      if (this.steps.charge === 0) {
        return;
      }
      this.$api.MiaoSha.Detail(0, {
        course_id: this.id,
        course_type: "learnPath",
      }).then((res) => {
        this.msData = res.data;
        if (!this.msData.data && !this.isBuy && this.configFunc["tuangou"]) {
          this.getTgDetail();
        }
      });
    },
    goMsOrder(id) {
      this.$router.push({
        name: "order",
        query: {
          course_id: this.msData.data.goods_id,
          course_type: this.msData.data.goods_type,
          goods_type: "ms",
          goods_charge: this.msData.data.charge,
          goods_label: "秒杀",
          goods_name: this.msData.data.goods_title,
          goods_id: id,
          goods_thumb: this.msData.data.goods_thumb,
        },
      });
    },
    openMsDialog() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.msDialogStatus = true;
    },
    closeMsDialog() {
      this.msDialogStatus = false;
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
      display: flex;
      width: 1200px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      flex-direction: column;
      .book-info-box {
        width: 100%;
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
          .collect-button {
            width: 29px;
            height: 29px;
            position: absolute;
            right: 0;
            top: 18px;
            cursor: pointer;
          }
          .desc {
            margin-top: 14px;
            width: 750px;
            height: 90px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            overflow: hidden;
          }
          .btn-box {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: auto;
            float: left;
            display: flex;
            flex-direction: row;
            .has-button {
              background: #f4fafe;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #999999;
              line-height: 16px;
              box-sizing: border-box;
              cursor: pointer;
            }
            .see-button {
              background: #3ca7fa;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              box-sizing: border-box;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
            .buy-button {
              background: #ff5068;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              box-sizing: border-box;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
            .role-button {
              background: #e1a500;
              border-radius: 4px;
              padding: 20px;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
              line-height: 16px;
              box-sizing: border-box;
              margin-left: 20px;
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
            .original {
              padding: 20px 0;
              font-size: 16px;
              font-weight: 400;
              color: #999999;
              line-height: 16px;
              box-sizing: border-box;
              text-decoration: line-through;
              margin-left: 30px;
            }
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
          display: flex;
          flex-direction: row;
          &:not(:last-child) {
            margin-bottom: 50px;
          }
          .left-item {
            width: 20px;
            height: auto;
            float: left;
            display: flex;
            flex-direction: column;
            align-items: center;
            .icon {
              width: 20px;
              height: 20px;
            }
            .column {
              width: 1px;
              height: 100%;
              flex: 1;
              margin-top: 10px;
              background: #e5e5e5;
            }
          }
          .right-item {
            width: 1090px;
            height: auto;
            float: left;
            margin-left: 30px;
            .step-title {
              width: 100%;
              height: 20px;
              font-size: 20px;
              font-weight: 600;
              color: #9355de;
              line-height: 20px;
              margin-bottom: 10px;
            }
            .step-desc {
              width: 100%;
              height: auto;
              max-height: 56px;
              font-size: 16px;
              font-weight: 400;
              color: #333333;
              line-height: 28px;
              overflow: hidden;
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
                  background: #f0f0f8;
                  border-radius: 4px;
                  margin-right: 30px;
                  display: flex;
                  justify-content: center;
                  overflow: hidden;
                  .spback {
                    position: absolute;
                    left: 20px;
                    top: 10px;
                    width: 93px;
                    height: 80px;
                    background: #d2e1ef;
                    border-radius: 8px;
                  }
                  .thumb-bar {
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    border-radius: 4px;
                    overflow: hidden;
                  }
                  .active {
                    width: 75px;
                  }
                }
                .course-body {
                  width: 927px;
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
                    margin-bottom: 18px;
                  }
                  .course-name {
                    width: 100%;
                    height: 14px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333333;
                    line-height: 14px;
                    margin-top: 10px;
                    margin-bottom: 15px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  .course-charge {
                    height: 14px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #999999;
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
}
</style>
