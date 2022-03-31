<template>
  <div class="content">
    <div class="box">
      <div class="left">
        <img class="banner" src="../../assets/img/commen/login-banner.png" />
      </div>
      <div class="right">
        <div class="tabs">
          <div class="item-tab">
            密码登录
            <div class="actline"></div>
          </div>
        </div>
        <div class="login-box">
          <div class="input-item">
            <input
              type="text"
              placeholder="请输入手机号"
              autocomplete="off"
              v-model="passwordForm.mobile"
              class="input"
              required
            />
          </div>
          <div class="input-item">
            <input
              type="password"
              placeholder="请输入密码"
              autocomplete="off"
              v-model="passwordForm.password"
              class="input"
              required
              @keyup.enter="passwordFormValidate"
            />
          </div>
          <div class="btn-box">
            <button type="submit" class="submit" @click="passwordFormValidate">
              立即登录
            </button>
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
      passwordForm: {
        mobile: null,
        password: null,
      },
    };
  },
  computed: {
    ...mapState(["isLogin", "config"]),
  },
  mounted() {},
  methods: {
    ...mapMutations(["loginHandle"]),
    passwordFormValidate() {
      if (this.loading) {
        return;
      }
      if (!this.passwordForm.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.$utils.isPoneAvailable(this.passwordForm.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      if (!this.passwordForm.password) {
        this.$message.error("请输入密码");
        return;
      }
      this.loading = true;
      this.$api.Auth.PasswordLogin(this.passwordForm)
        .then((resp) => {
          this.loading = false;
          let token = resp.data.token;
          this.$utils.saveToken(token);
          this.$api.User.Detail()
            .then((res) => {
              this.loginHandle(res.data);
              if (this.$route.query.redirect) {
                this.$router.replace({
                  path: this.$route.query.redirect,
                });
              } else {
                this.$router.replace({
                  name: "index",
                });
              }
            })
            .catch((e) => {
              this.$message.error(e.message);
            });
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
.content {
  width: 100%;
  .box {
    width: 900px;
    height: 466px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    margin-top: 80px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    .left {
      width: 400px;
      height: 466px;
      background: #3ca7fa;
      display: flex;
      align-items: center;
      justify-content: Center;
      .banner {
        display: block;
        width: 314px;
        height: 249px;
      }
    }
    .right {
      width: 500px;
      height: 466px;
      background: #fff;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 30px;
      .tabs {
        width: 100%;
        height: 44px;
        display: flex;
        flex-direction: row;
        position: relative;
        .item-tab {
          width: auto;
          height: 20px;
          font-size: 20px;
          font-weight: 500;
          color: #333333;
          line-height: 20px;
          margin-right: 50px;
          position: relative;
          .actline {
            width: 80px;
            height: 4px;
            background: #3ca7fa;
            position: absolute;
            left: 0px;
            top: 40px;
          }
        }
      }
      .login-box {
        width: 100%;
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        .input-item {
          width: 100%;
          margin-bottom: 50px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .input {
            width: 100%;
            height: 54px;
            background: #f4fafe;
            border-radius: 4px;
            border: 1px solid #e5e5e5;
            padding-left: 20px;
            outline: none;
          }
        }
        .btn-box {
          width: 100%;
          .submit {
            width: 100%;
            height: 54px;
            background: #3ca7fa;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            outline: none;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
}
</style>
