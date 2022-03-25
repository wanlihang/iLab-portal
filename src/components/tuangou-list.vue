<template>
  <div class="tg-comp" v-if="tg.goods">
    <div class="tg-content">
      <div class="sp-mask"></div>
      <div class="sp-transform"></div>
      <div class="tg-content-item">
        <div class="original-price">原价￥{{ tg.goods.original_charge }}</div>
        <div class="tip">若拼团失败退款将原路返回，请耐心等待</div>
      </div>
      <div class="tg-content-item">
        <div class="price">
          限时拼团价￥<strong>{{ tg.goods.charge }}</strong>
        </div>
        <div class="time">
          {{ tg.goods.people_num }}人团 距秒杀结束剩余<count-down
            :timestamp="tg.goods.ended_count_down"
          ></count-down>
        </div>
      </div>
    </div>
    <div class="tg-list" v-if="tg.items && tg.items.length > 0">
      <div class="item" v-for="item in tg.items" :key="item.id">
        <div class="left-box" v-if="item.create_user_id === 0">
          <img class="value" :src="item.create_user_avatar" />
          <img
            class="value"
            :src="it.avatar"
            v-for="(it, index) in item.users"
            :key="index"
          />
          <img
            class="value"
            v-for="it in tg.goods.people_num - 1 - item.users.length"
            :key="it + item.users.length + 1"
            src="../assets/img/commen/icon-member.png"
          />
        </div>
        <div class="left-box" v-else>
          <img
            class="value"
            :src="it.avatar"
            v-for="(it, index) in item.users"
            :key="index"
          />
          <img
            class="value"
            v-for="it in tg.goods.people_num - item.users.length"
            :key="it + item.users.length"
            src="../assets/img/commen/icon-member.png"
          />
        </div>
        <div class="right-box">
          <div class="date">
            差<span>{{ item.over_people_num }}</span
            >人拼成 剩余<count-down :timestamp="item.count_down"></count-down>
          </div>
          <template v-if="tg.join_item && tg.join_item.length !== 0">
            <div
              class="button"
              v-if="tg.join_item.id === item.id"
              @click="copy()"
            >
              拼团中，邀请好友参团
            </div>
            <div class="button no-join" v-else>加入拼团</div>
          </template>
          <template v-else>
            <div class="button" @click="goPay(item.id)">加入拼团</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import CountDown from "./count-down.vue";
export default {
  components: {
    CountDown,
  },
  props: ["tg"],
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
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
          goods_charge: this.tg.goods.charge,
          goods_label: "团购",
          goods_name: this.tg.goods.goods_title,
          goods_id: this.tg.goods.id,
          goods_thumb: this.tg.goods.goods_thumb,
          tg_gid: gid,
          course_id: this.tg.goods.other_id,
          course_type: this.tg.goods.goods_type,
        },
      });
    },
    copy() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      var input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
      this.$message.success("链接已复制，可分享邀请好友参团");
    },
  },
};
</script>

<style lang="less" scoped>
.tg-comp {
  width: 100%;
  height: auto;
  float: left;
  background: #ffffff;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0px 30px;
  .tg-content {
    width: 100%;
    height: 80px;
    background: linear-gradient(90deg, #ff2276 0%, #ff897c 100%);
    border-radius: 4px;
    color: #fff;
    box-sizing: border-box;
    padding: 15px 50px;
    position: relative;
    .sp-mask {
      width: 522px;
      height: 80px;
      border-radius: 4px 0px 0px 4px;
      background: rgb(#ffffff, 0.15);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
    }
    .sp-transform {
      width: 0;
      height: 0;
      border-bottom: 80px solid #ff4e79;
      border-left: 80px solid transparent;
      position: absolute;
      left: 442px;
      top: 0;
      z-index: 11;
    }
    .tg-content-item {
      width: 100%;
      float: left;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;

      &:last-child {
        margin-bottom: 0px;
      }

      .original-price {
        width: auto;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        text-decoration: line-through;
        opacity: 0.6;
      }
      .tip {
        width: auto;
        height: 14px;
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
        opacity: 0.6;
      }
      .price {
        width: auto;
        height: 30px;
        font-size: 14px;
        font-weight: 600;
        line-height: 30px;
        strong {
          font-size: 24px;
        }
      }
      .time {
        width: auto;
        height: 14px;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
  .tg-list {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    .item {
      width: 100%;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 0px;
      }
      .left-box {
        width: 654px;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .value {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 5px;
        }
        &:last-child {
          margin-right: 0px;
        }
      }
      .right-box {
        flex: 1;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .date {
          height: 48px;
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 48px;
          span {
            color: #ff4d4f;
          }
        }
        .button {
          background: #ff4d4f;
          border-radius: 4px;
          padding: 16px 20px;
          font-size: 16px;
          line-height: 16px;
          font-weight: 400;
          color: #ffffff;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
          &.no-join {
            background: #ccc;
          }
        }
      }
    }
  }
}
</style>
