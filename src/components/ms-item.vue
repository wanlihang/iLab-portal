<template>
  <div class="ms-item-comp" @click="goDetail">
    <div class="ms-course-thumb">
      <div class="thumb-bar">
        <template v-if="goodsThumb">
          <thumb-bar
            v-if="goodsType === 'book'"
            :value="goodsThumb"
            :border="8"
            :width="148.5"
            :height="198"
          ></thumb-bar>
          <thumb-bar
            v-else
            :value="goodsThumb"
            :width="264"
            :height="198"
          ></thumb-bar>
        </template>
      </div>
    </div>
    <div class="ms-type over" v-if="is_over">已售罄</div>
    <div class="ms-type start" v-else-if="is_start">秒杀中</div>
    <div class="ms-type" v-else>未开始</div>
    <div class="ms-course-body">
      <div class="ms-course-title">
        {{ goodsTitle }}
      </div>

      <div class="ms-course-info">
        <div class="ms-time start" v-if="is_start">
          距结束剩余{{ remainingTime.day }}天{{ remainingTime.hr }}时{{
            remainingTime.min
          }}分{{ remainingTime.sec }}秒
        </div>
        <div class="ms-time" v-else>
          距开始剩余{{ remainingTime.day }}天{{ remainingTime.hr }}时{{
            remainingTime.min
          }}分{{ remainingTime.sec }}秒
        </div>
        <div class="ms-course-charge">
          <span class="ms-text">秒杀价:</span>
          <span class="charge-text">
            <span class="unit">￥</span>{{ charge }} </span
          ><span class="original_charge">￥{{ originalCharge }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: [
    "cid",
    "started_at",
    "is_start",
    "is_over",
    "goodsTitle",
    "goodsType",
    "goodsThumb",
    "charge",
    "originalCharge",
    "num",
    "end_at",
    "overNum",
  ],
  data() {
    return {
      remainingTime: {
        all: 0,
        day: 0,
        hr: 0,
        min: 0,
        sec: 0,
      },
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    if (this.is_start) {
      this.remainingTime.all = this.end_at;
    } else {
      this.remainingTime.all = this.started_at;
    }
    this.countdown();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    countdown() {
      const end = Date.parse(this.remainingTime.all);
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
          that.countdown();
        }, 1000);
      }
    },
    goDetail() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "msDetail",
        query: {
          id: this.cid,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.ms-item-comp {
  width: 100%;
  height: 308px;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  border-radius: 8px;
  position: relative;
  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
    .ms-course-thumb {
      .thumb-bar {
        transform: scale(1.1, 1.1);
      }
    }
  }
  .ms-course-thumb {
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
  .ms-type {
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
  .ms-course-body {
    box-sizing: border-box;
    width: 100%;
    height: 110px;
    background-color: #fff;
    border-radius: 0px 0px 8px 8px;
    padding: 15px 10px 15px 10px;
    position: relative;

    .ms-course-title {
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

    .ms-course-info {
      width: 100%;
      float: left;
      display: flex;
      flex-direction: column;

      .ms-time {
        width: 100%;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #04c877;
        line-height: 14px;
        margin-bottom: 15px;
        &.start {
          color: #ef4444;
        }
      }

      .ms-course-charge {
        width: 100%;
        height: 20px;
        font-size: 20px;
        line-height: 20px;
        font-weight: 600;
        display: flex;
        align-items: center;
        .ms-text {
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
    .ms-progress {
      position: absolute;
      right: 10px;
      bottom: 15px;
      width: 137px;
      height: 48px;
      background: linear-gradient(90deg, #fa1b1b 0%, #ff7946 100%);
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
        margin-bottom: 8px;
      }
      .progress-text {
        width: 100%;
        height: 12px;
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        line-height: 12px;
        padding: 0px 8px 0px 5px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-direction: row;
        .progress-text-pure {
          margin-left: 2px;
        }
        .progress-render {
          width: 100px;
          height: 7px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 4px;
          position: relative;
          .nowprogress {
            position: absolute;
            top: 0;
            left: 0;
            height: 7px;
            background-color: #fff;
            border-radius: 4px;
            z-index: 10;
          }
        }
      }
    }
  }
}
</style>
