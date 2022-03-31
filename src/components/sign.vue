<template>
  <div class="backTop" @click="goSign" v-if="signStatus">
    <img src="../assets/img/commen/icon-sign-n.png" />
    <span>签到</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      signStatus: false,
    };
  },
  mounted() {
    this.getSignStatus();
  },
  methods: {
    getSignStatus() {
      if (!this.$route.meta.sign) {
        return;
      }
      this.$api.Sign.User()
        .then((res) => {
          let is_submit = res.data.is_submit;
          if (is_submit === 0) {
            this.signStatus = true;
          } else {
            this.signStatus = false;
          }
        })
        .catch((e) => {
          console.log(e.message);
        });
    },
    goSign() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Sign.SignIn()
        .then((res) => {
          this.loading = false;
          this.$message.success("签到成功，积分+" + res.data.reward);
          this.signStatus = false;
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.backTop {
  position: fixed;
  right: 20px;
  bottom: 250px;
  z-index: 300;
  cursor: pointer;
  width: 70px;
  height: 70px;
  background: #ffffff;
  box-shadow: 0px 4px 16px 0px rgba(15, 10, 30, 0.05);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity: 0.8;
  }
  img {
    display: block;
    width: 30px;
    height: 30px;
  }
  span {
    display: block;
    width: auto;
    height: 12px;
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    line-height: 12px;
    margin-top: 3px;
  }
}
</style>
