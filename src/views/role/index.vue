<template>
  <div class="content">
    <div class="box">
      <div class="title">
        <img src="../../assets/img/commen/icon-VIP.png" />
        <span>请选择会员套餐</span>
      </div>
      <div class="role-item-box">
        <div class="role-item" v-for="item in list" :key="item.id">
          <div class="name">{{ item.name }}</div>
          <div class="price">
            <span class="small">￥</span>{{ item.charge
            }}<span class="small">/{{ item.expire_days }}天</span>
          </div>
          <div class="desc">
            <p v-for="(descItem, index) in item.desc_rows" :key="index">
              {{ descItem }}
            </p>
          </div>
          <div
            class="button"
            @click="parRoles(item.id, item.name, item.charge)"
          >
            购买
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
export default {
  components: {
    NavFooter,
  },
  data() {
    return {
      loading: false,
      list: [],
    };
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  mounted() {
    this.getRoles();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    getRoles() {
      this.$api.Role.List().then((res) => {
        this.list = res.data;
      });
    },
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    parRoles(id, name, charge) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "role",
          goods_charge: charge,
          goods_label: "VIP会员",
          goods_name: name,
          goods_id: id,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .box {
    width: 1200px;
    margin: 0 auto;
    min-height: 650px;
    box-sizing: border-box;
    background-color: #fff;
    padding-top: 55px;
    padding-bottom: 50px;
    .title {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
      }
      span {
        margin-top: 5px;
        height: 30px;
        font-size: 30px;
        font-weight: 500;
        color: #333333;
        line-height: 30px;
      }
    }
    .role-item-box {
      width: 100%;
      padding-top: 50px;
      padding-bottom: 50px;
      box-sizing: border-box;
      display: grid;
      gap: 50px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      .role-item {
        position: relative;
        width: 366px;
        height: auto;
        background: linear-gradient(
          135deg,
          #fff4e4 0%,
          #fff4e4 0%,
          #fece86 100%
        );
        border-radius: 16px;
        padding: 30px;
        box-sizing: border-box;
        &:hover {
          box-shadow: 0px 10px 30px 0px rgba(51, 46, 24, 0.2);
        }
        .name {
          width: 100%;
          height: 24px;
          font-size: 24px;
          font-weight: bold;
          color: #572f1d;
          line-height: 36px;
          letter-spacing: 1px;
          margin-bottom: 30px;
        }
        .price {
          width: 100%;
          height: 48px;
          font-size: 48px;
          font-weight: 600;
          color: #572f1d;
          line-height: 48px;
          margin-bottom: 30px;
          .small {
            font-size: 20px;
          }
        }
        .desc {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: auto;
          min-height: 162px;
          p {
            display: block;
            width: 100%;
            float: left;
            height: auto;
            font-size: 16px;
            font-weight: 500;
            color: #572f1d;
            line-height: 24px;
            margin-bottom: 30px;
          }
        }
        .button {
          width: 306px;
          height: 50px;
          background: #e1a500;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 500;
          color: #ffffff;
          line-height: 20px;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
