<template>
  <div class="content">
    <template v-if="loading">
      <div style="margin-top: 30px">
        <skeletonCourseList></skeletonCourseList>
      </div>
    </template>
    <template v-else-if="list.length > 0">
      <div class="contanier">
        <div class="tg-body">
          <div
            class="tg-item"
            v-for="item in list"
            :key="item.id"
            @click="goTgDetail(item)"
          >
            <div class="tg-course-thumb">
              <div class="thumb-bar">
                <template v-if="item.goods_thumb">
                  <thumb-bar
                    v-if="item.goods_type === 'book'"
                    :value="item.goods_thumb"
                    :border="8"
                    :width="148.5"
                    :height="198"
                  ></thumb-bar>
                  <thumb-bar
                    v-else
                    :value="item.goods_thumb"
                    :width="264"
                    :height="198"
                  ></thumb-bar>
                </template>
              </div>
            </div>
            <div class="tg-type over" v-if="item.is_over">已结束</div>
            <div class="tg-type start" v-else-if="item.is_start">拼团中</div>
            <div class="tg-type" v-else>未开始</div>
            <div class="tg-course-body">
              <div class="tg-course-title">
                {{ item.goods_title }}
              </div>
              <div class="tg-course-info">
                <div
                  class="tg-value"
                  :class="{ active: !item.is_start, end: item.is_over }"
                >
                  <template v-if="item.is_over">已结束</template>
                  <template v-else-if="item.is_start"
                    >{{ item.people_num }}人团</template
                  >
                  <template v-else>
                    {{ item.people_num }}人团
                    <i class="line"></i>
                    {{ countdown(item.started_at) }}距开始剩余{{
                      remainingTime.day
                    }}天{{ remainingTime.hr }}时{{ remainingTime.min }}分{{
                      remainingTime.sec
                    }}秒
                  </template>
                </div>

                <div class="tg-course-charge">
                  <span class="tg-text">拼团价:</span>
                  <span class="charge-text">
                    <span class="unit">￥</span>{{ item.charge }}
                  </span>
                  <span class="original_charge">
                    ￥{{ item.original_charge }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <none v-else></none>

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
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import None from "../../components/none.vue";
import PageBox from "../../components/page.vue";
import NavFooter from "../../components/footer.vue";
import SkeletonCourseList from "../../components/skeleton/skeletonCourseList.vue";

export default {
  components: {
    NavFooter,
    PageBox,
    None,
    SkeletonCourseList,
  },
  data() {
    return {
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 16,
      },
      remainingTime: {
        all: 0,
        day: 0,
        hr: 0,
        min: 0,
        sec: 0,
      },
      loading: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //倒计时
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
    resetData() {
      this.list = [];
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
      window.scrollTo(0, 0);
    },
    goTgDetail(item) {
      if (item.goods_type === "course") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: item.other_id,
          },
        });
      } else if (item.goods_type === "live") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: item.other_id,
          },
        });
      } else if (item.goods_type === "book") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: item.other_id,
          },
        });
      } else if (item.goods_type === "learnPath") {
        this.$router.push({
          name: "learnPathDetail",
          query: {
            id: item.other_id,
          },
        });
      }
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.TuanGou.List(this.pagination).then((res) => {
        this.loading = false;
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .contanier {
    width: 1200px;
    min-height: 500px;
    margin: 0 auto;
    overflow: hidden;
    display: block;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    padding-top: 30px;
    .tg-body {
      width: 100%;
      display: grid;
      row-gap: 30px;
      column-gap: 48px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      overflow: hidden;
      white-space: nowrap;
      box-sizing: border-box;
      padding-bottom: 40px;
      .tg-item {
        position: relative;
        width: 264px;
        height: 307px;
        display: flex;
        cursor: pointer;
        border-radius: 8px;
        flex-direction: column;
        &:hover {
          box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
          .tg-course-thumb {
            .thumb-bar {
              transform: scale(1.1, 1.1);
            }
          }
        }
        .tg-course-thumb {
          width: 264px;
          height: 198px;
          border-radius: 8px 8px 0px 0px;
          background-color: #fff;
          overflow: hidden;
          .thumb-bar {
            width: 100%;
            height: 100%;
            transition: all 0.3s;
          }
        }
        .tg-type {
          position: absolute;
          width: 66px;
          height: 32px;
          background: linear-gradient(270deg, #0ae6af 0%, #04c877 100%);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          right: 10px;
          top: 156px;
          &.over {
            background: #999999;
          }
          &.start {
            background: linear-gradient(90deg, #fa1b1b 0%, #ff7946 100%);
          }
        }

        .tg-course-body {
          box-sizing: border-box;
          width: 100%;
          height: 109px;
          background-color: #fff;
          border-radius: 0px 0px 8px 8px;
          padding: 15px 10px 15px 10px;
          position: relative;

          .tg-course-title {
            width: 100%;
            height: 20px;
            float: left;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            line-height: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 15px;
          }

          .tg-course-info {
            width: 100%;
            float: left;
            display: flex;
            flex-direction: column;
            .tg-value {
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #ef4444;
              line-height: 14px;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              &.end {
                color: #666666;
              }
              &.active {
                color: #04c877;
                .line {
                  width: 1px;
                  height: 14px;
                  background: #d8d8d8;
                  border: 1px solid #979797;
                  margin-left: 10px;
                  margin-right: 10px;
                }
              }
            }
            .tg-course-charge {
              height: 20px;
              font-size: 20px;
              line-height: 20px;
              font-weight: 600;
              display: flex;
              align-items: center;
              .tg-text {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #999999;
                line-height: 14px;
                margin-right: 10px;
              }
              .charge-text {
                color: #ff5858;

                .unit {
                  font-size: 14px;
                }
              }

              .free-text {
                font-size: 14px;
                color: #04c877;
              }
              .original_charge {
                margin-left: 10px;
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                line-height: 14px;
                text-decoration: line-through;
              }
            }
          }
          .tg-progress {
            position: absolute;
            right: 10px;
            bottom: 15px;
            width: 137px;
            height: 48px;
            background: linear-gradient(90deg, #ff2276 0%, #ff897c 100%);
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            .label {
              width: 100%;
              height: 16px;
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              line-height: 16px;
              text-align: center;
              margin-top: 10px;
              margin-bottom: 6px;
            }
            .progress-text {
              width: 100%;
              height: 12px;
              font-size: 12px;
              font-weight: 400;
              color: #ffffff;
              line-height: 12px;
              box-sizing: border-box;
              text-align: center;
            }
          }
        }
      }
    }
  }
  #page {
    width: 1200px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
