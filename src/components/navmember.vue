<template>
  <div class="nav-box">
    <div class="spItem" :class="{ active: id === 0 }" @click="goMember()">
      用户中心
    </div>
    <template v-for="(item, index) in menus">
      <div class="item" v-if="item.status" :key="index">
        <span class="title">{{ item.name }}</span>
        <div class="children">
          <template v-if="item.childrens.length > 0">
            <template v-for="children in item.childrens">
              <div
                class="item-children"
                @click="setScene(children.path)"
                :class="{ active: id === children.id }"
                v-if="children.status"
                :key="children.id"
              >
                {{ children.name }}
                <div class="point" v-if="newStatus && children.id === 7"></div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["cid"],
  data() {
    return {
      id: 0,
      newStatus: false,
    };
  },
  computed: {
    ...mapState(["configFunc"]),
    menus() {
      let menus = [
        {
          name: "学习",
          status: true,
          childrens: [
            {
              name: "实验课程",
              id: 1,
              path: "MemberCourses",
              status: true,
            },
            {
              name: "直播课程",
              id: 2,
              path: "MemberLive",
              status: this.configFunc["live"],
            },
            {
              name: "电子书",
              id: 3,
              path: "MemberBooks",
              status: this.configFunc["book"],
            },
            {
              name: "图文",
              id: 4,
              path: "MemberTopic",
              status: this.configFunc["topic"],
            },
            {
              name: "我的班课",
              id: 17,
              path: "MemberK12",
              status: this.configFunc["ke"],
            },
          ],
        },
        {
          name: "用户",
          status: true,
          childrens: [
            {
              name: "所有订单",
              id: 6,
              path: "MemberOrders",
              status: true,
            },
            {
              name: "我的消息",
              id: 7,
              path: "MemberMessages",
              status: true,
            },
            {
              name: "我的资料",
              id: 8,
              path: "MemberProfile",
              status: true,
            },
            {
              name: "我的秒杀",
              id: 19,
              path: "MemberMiaosha",
              status: this.configFunc["miaosha"],
            },
          ],
        },
        {
          name: "试题",
          status: this.configFunc["paper"],
          childrens: [
            {
              name: "我的考试",
              id: 9,
              path: "MemberPaper",
              status: this.configFunc["paper"],
            },
            {
              name: "我的练习",
              id: 10,
              path: "MemberPractice",
              status: this.configFunc["practice"],
            },
            {
              name: "我的模考",
              id: 11,
              path: "MembermMckpaper",
              status: this.configFunc["mockPaper"],
            },
            {
              name: "我的错题本",
              id: 12,
              path: "ExamWrongBook",
              status: this.configFunc["wrongBook"],
            },
          ],
        },
        {
          name: "其他",
          status: true,
          childrens: [
            {
              name: "我的问答",
              id: 13,
              path: "MemberQuestions",
              status: this.configFunc["wenda"],
            },
            {
              name: "邀请推广",
              id: 14,
              path: "MemberShare",
              status: !this.configFunc["share"],
            },
            {
              name: "兑换课程",
              id: 15,
              path: "MemberCodeExchanger",
              status: this.configFunc["codeExchanger"],
            },
            {
              name: "积分商城",
              id: 16,
              path: "MemberCredit1Records",
              status: this.configFunc["credit1Mall"],
            },
            {
              name: "我的积分",
              id: 18,
              path: "MemberCredit1Free",
              status: !this.configFunc["credit1Mall"],
            },
          ],
        },
      ];

      return menus;
    },
  },
  mounted() {
    this.id = parseInt(this.cid);
    this.getUnread();
  },
  watch: {
    id() {
      this.$emit("change", this.id);
    },
  },
  methods: {
    getUnread() {
      this.$api.Member.UnReadNum().then((res) => {
        let num = res.data;
        if (num === 0) {
          this.newStatus = false;
        } else {
          this.newStatus = true;
        }
      });
    },
    goMember() {
      this.$router.push({
        name: "Member",
      });
    },
    setScene(val) {
      this.$router.push({
        name: val,
      });
    },
  },
};
</script>
<style lang="less">
.nav-box {
  width: 171px;
  height: auto;
  background: #ffffff;
  border-radius: 8px;
  padding: 10px 20px 10px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .spItem {
    width: 131px;
    height: 44px;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 14px;
    margin-bottom: 10px;
    &.active {
      background: #f1f2f6;
      border-radius: 4px;
      color: #3ca7fa;
    }
    &:hover {
      background: #f1f2f6;
      border-radius: 4px;
      color: #3ca7fa;
    }
  }
  .item {
    width: 100%;
    box-sizing: border-box;
    padding-top: 14px;
    padding-bottom: 10px;
    border-top: 1px solid #e5e5e5;
    &:last-child {
      padding-bottom: 0px;
    }
    .title {
      width: 100%;
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
    }
    .children {
      width: 100%;
      .item-children {
        width: 131px;
        height: 44px;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        line-height: 14px;
        &.active {
          background: #f1f2f6;
          border-radius: 4px;
          color: #3ca7fa;
        }
        &:hover {
          background: #f1f2f6;
          border-radius: 4px;
          color: #3ca7fa;
        }
        .point {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #ff5068;
          border-radius: 50%;
          top: 18px;
          left: 12px;
        }
      }
    }
  }
}
</style>
