<template>
  <div class="mask" v-if="status">
    <div class="dialog-login-box" v-if="dialogStatus === 1">
      <div class="tabs">
        <div
          class="item-tab"
          v-for="(item, index) in tabs"
          :key="index"
          :class="{ active: currentTab === item.id }"
          @click="tabChange(item.id)"
          :is-scroll="false"
        >
          {{ item.name }}
          <div class="actline" v-if="currentTab === item.id"></div>
        </div>
        <a class="linkTab" @click="changeRegister()">新用户注册>></a>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box" v-if="currentTab === 1">
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
        <div class="flex items-center">
          <div class="flex-1 flex items-start"></div>
          <div class="flex-shrink-0 text-right">
            <a
              class="text-gray-normal text-sm hover:text-blue-600"
              @click="changeForget()"
              >忘记密码</a
            >
          </div>
        </div>
        <div
          class="others"
          :class="{
            active:
              config.socialites.qq !== 1 && config.socialites.wechat_scan !== 1,
          }"
        >
          <div
            class="tit"
            v-if="
              config.socialites.qq === 1 || config.socialites.wechat_scan === 1
            "
          >
            第三方快捷登录
          </div>
          <div class="tab-icon">
            <img
              v-if="config.socialites.qq === 1"
              @click="changeQQ()"
              class="btn-others"
              src="../assets/img/commen/icon-qq.png"
            />
            <img
              v-if="config.socialites.wechat_scan === 1"
              @click="changeWeixin()"
              class="btn-others"
              src="../assets/img/commen/icon-weixin.png"
            />
          </div>
        </div>
      </div>
      <div class="box" v-if="currentTab === 2">
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机号"
            autocomplete="off"
            v-model="messageForm.mobile"
            class="input"
            required
          />
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入图形验证码"
            autocomplete="off"
            v-model="messageForm.captcha"
            class="input-short"
            required
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required
            @keyup.enter="messageFormValidate"
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms()">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>
        <div class="btn-box">
          <button type="submit" class="submit" @click="messageFormValidate">
            立即登录
          </button>
        </div>
        <div
          class="others"
          :class="{
            active:
              config.socialites.qq !== 1 && config.socialites.wechat_scan !== 1,
          }"
        >
          <div
            class="tit"
            v-if="
              config.socialites.qq === 1 || config.socialites.wechat_scan === 1
            "
          >
            第三方快捷登录
          </div>
          <div class="tab-icon">
            <img
              v-if="config.socialites.qq === 1"
              @click="changeQQ()"
              class="btn-others"
              src="../assets/img/commen/icon-qq.png"
            />
            <img
              v-if="config.socialites.wechat_scan === 1"
              @click="changeWeixin()"
              class="btn-others"
              src="../assets/img/commen/icon-weixin.png"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-login-box" v-if="dialogStatus === 2">
      <div class="tabs">
        <div class="item-tab active">用户注册</div>
        <a class="linkTab" @click="changeLogin()">已有账号，立即登录>></a>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box">
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机号"
            autocomplete="off"
            v-model="messageForm.mobile"
            class="input"
            required
          />
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入图形验证码"
            autocomplete="off"
            v-model="messageForm.captcha"
            class="input-short"
            required
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms()">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>
        <div class="input-item">
          <input
            type="password"
            placeholder="请设置账号密码"
            autocomplete="off"
            v-model="messageForm.password"
            class="input"
            required
            @keyup.enter="registerFormValidate"
          />
        </div>
        <div class="mb-50 flex items-center">
          <div class="flex-1 flex items-start">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                v-model="messageForm.agree_protocol"
                class="focus:ring-indigo-500 h-20 w-20 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-10 text-sm">
              <label for="remember" class="text-gray-normal"
                >同意<a
                  class="text-blue"
                  :href="config.user_protocol"
                  target="_blank"
                  >《用户协议》</a
                >和<a
                  class="text-blue"
                  :href="config.user_private_protocol"
                  target="_blank"
                  >《隐私政策》</a
                ></label
              >
            </div>
          </div>
        </div>
        <div class="btn-box" style="margin-bottom: 0px !important">
          <button type="submit" class="submit" @click="registerFormValidate">
            立即注册
          </button>
        </div>
      </div>
    </div>
    <div class="dialog-login-box" v-if="dialogStatus === 3">
      <div class="tabs">
        <div class="item-tab active">忘记密码</div>
        <a class="linkTab" @click="changeLogin()">返回登录>></a>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box">
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机号"
            autocomplete="off"
            v-model="messageForm.mobile"
            class="input"
            required
          />
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入图形验证码"
            autocomplete="off"
            v-model="messageForm.captcha"
            class="input-short"
            required
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms()">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>
        <div class="input-item">
          <input
            type="password"
            placeholder="请设置账号密码"
            autocomplete="off"
            v-model="messageForm.password"
            class="input"
            required
          />
        </div>
        <div class="btn-box" style="margin-bottom: 0px !important">
          <button
            type="submit"
            class="submit"
            @keyup.enter="editValidate"
            @click="editValidate"
          >
            重置密码
          </button>
        </div>
      </div>
    </div>
    <div class="dialog-login-box" v-if="dialogStatus === 5">
      <div class="tabs">
        <div class="item-tab active">微信扫码登录</div>
        <a class="linkTab" @click="changeLogin()">其他方式登录>></a>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box">
        <img class="qrode" :src="qrode" />
      </div>
    </div>
    <div
      style="height: 480px"
      class="dialog-login-box"
      v-if="dialogStatus === 6"
    >
      <div class="tabs">
        <div class="item-tab active">验证原手机号</div>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box">
        <div class="box-mobile">
          <span
            >原手机号码验证：<strong>{{ mobile }}</strong></span
          >
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入图形验证码"
            autocomplete="off"
            v-model="messageForm.captcha"
            class="input-short"
            required
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms()">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>
        <div class="btn-box" style="margin-bottom: 0px !important">
          <button type="submit" class="submit" @click="mobileValidate()">
            确定
          </button>
        </div>
      </div>
    </div>
    <div
      style="height: 480px"
      class="dialog-login-box"
      v-if="dialogStatus === 8"
    >
      <div class="tabs">
        <div class="item-tab active">绑定新手机号</div>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box">
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入新手机号码"
            autocomplete="off"
            v-model="messageForm.mobile"
            class="input"
            required
          />
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入图形验证码"
            autocomplete="off"
            v-model="messageForm.captcha"
            class="input-short"
            required
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms()">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>

        <div class="btn-box" style="margin-bottom: 0px !important">
          <button type="submit" class="submit" @click="changeMobileValidate()">
            立即绑定
          </button>
        </div>
      </div>
    </div>
    <div class="dialog-login-box" v-if="dialogStatus === 7">
      <div class="tabs">
        <div class="item-tab active">绑定微信</div>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box">
        <img class="qrode" :src="qrode" />
      </div>
    </div>
    <div
      style="height: 440px"
      class="dialog-login-box"
      v-if="dialogStatus === 9"
    >
      <div class="tabs">
        <div class="item-tab active">绑定新手机号</div>
        <a v-if="notCancel" class="linkTab2" @click="goLogout">退出登录>></a>
        <img
          v-if="!notCancel"
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box">
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入新手机号码"
            autocomplete="off"
            v-model="messageForm.mobile"
            class="input"
            required
          />
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入图形验证码"
            autocomplete="off"
            v-model="messageForm.captcha"
            class="input-short"
            required
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms()">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>

        <div class="btn-box" style="margin-bottom: 0px !important">
          <button type="submit" class="submit" @click="NewMobileValidate()">
            立即绑定
          </button>
        </div>
      </div>
    </div>
    <div class="dialog-login-box" v-if="dialogStatus === 10">
      <div class="tabs">
        <div class="item-tab active">设置（修改）密码</div>
        <img
          class="btn-close"
          @click="cancel()"
          src="../assets/img/commen/icon-close.png"
        />
      </div>
      <div class="box">
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入绑定手机号"
            autocomplete="off"
            v-model="messageForm.mobile"
            class="input"
            required
          />
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入图形验证码"
            autocomplete="off"
            v-model="messageForm.captcha"
            class="input-short"
            required
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-item">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms()">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>
        <div class="input-item">
          <input
            type="password"
            placeholder="请设置账号密码"
            autocomplete="off"
            v-model="messageForm.password"
            class="input"
            required
            @keyup.enter="editValidate"
          />
        </div>
        <div class="btn-box" style="margin-bottom: 0px !important">
          <button type="submit" class="submit" @click="editValidate">
            重置密码
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Utils from "@/js/utils";
import { mapState, mapMutations } from "vuex";
import urlencode from "urlencode";
export default {
  props: ["dialogType", "status", "mobile", "notCancel"],
  data() {
    return {
      timer: null,
      interval: null,
      loading: false,
      code: null,
      newMobile: null,
      dialogStatus: 0,
      qrode: null,
      currentTab: 1,
      captcha: {
        key: null,
        img: null,
      },
      tabs: [
        {
          name: "密码登录",
          id: 1,
        },
        {
          name: "短信登录",
          id: 2,
        },
      ],
      passwordForm: {
        mobile: null,
        password: null,
      },
      messageForm: {
        mobile: null,
        sms: null,
        captcha: null,
        password: null,
        agree_protocol: null,
      },
      sms: {
        loading: false,
        max: 120,
        current: 0,
      },
      scene: null,
    };
  },
  watch: {
    dialogType() {
      this.dialogStatus = this.dialogType;
      if (this.dialogStatus !== 0 && this.dialogStatus !== 5) {
        this.getCaptcha();
      }
      if (this.dialogStatus === 7) {
        this.getBindQrode();
      }
    },
    mobile() {
      this.messageForm.mobile = this.mobile;
    },
  },
  computed: {
    ...mapState(["config"]),
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.interval);
  },
  methods: {
    ...mapMutations([
      "loginHandle",
      "hideLoginDialog",
      "saveDialogMobile",
      "showLoginDialog",
      "bindSuccess",
      "logout",
    ]),
    goLogout() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Auth.Logout()
        .then((res) => {
          this.loading = false;
          this.logout();
          this.resetDialog();
          this.hideLoginDialog();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error("网络错误");
        });
    },
    resetDialog() {
      this.currentTab = 1;
      this.messageForm.mobile = null;
      this.messageForm.sms = null;
      this.messageForm.captcha = null;
      this.messageForm.password = null;
      this.messageForm.agree_protocol = null;
      this.passwordForm.mobile = null;
      this.passwordForm.password = null;
    },
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
    getQrode() {
      this.$api.Member.WechatLogin().then((res) => {
        this.qrode = res.data.image;
        this.code = res.data.code;
        this.timer = setInterval(this.checkWechatLogin, 1000);
      });
    },
    checkWechatLogin() {
      this.$api.Member.CheckWechatLogin({ code: this.code }).then((res) => {
        if (res.data.status === 1 && res.data.token) {
          let token = res.data.token;
          this.$utils.saveToken(token);
          this.$api.User.Detail()
            .then((res) => {
              this.loginHandle(res.data);
              this.resetDialog();
              this.hideLoginDialog();
              this.redirectHandler();
            })
            .catch((e) => {
              this.$message.error(e.message);
            });
        }
      });
    },
    getBindQrode() {
      this.$api.Member.WechatBind().then((res) => {
        this.qrode = res.data.image;
        this.code = res.data.code;
        this.timer = setInterval(this.checkWechatBind, 3000);
      });
    },
    checkWechatBind() {
      this.$api.Member.Detail().then((res) => {
        if (res.data.is_bind_wechat === 1) {
          this.$message.success("绑定成功");
          this.resetDialog();
          this.hideLoginDialog();
          this.bindSuccess();
        }
      });
    },
    sendSms() {
      if (this.sms.loading) {
        // 冷却中
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.$utils.isPoneAvailable(this.messageForm.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      if (!this.messageForm.captcha) {
        this.$message.error("请输入图形验证码");
        return;
      }
      if (this.dialogStatus === 1) {
        this.scene = "login";
      }
      if (this.dialogStatus === 2) {
        this.scene = "register";
      }
      if (this.dialogStatus === 3) {
        this.scene = "password_reset";
      }
      if (this.dialogStatus === 6) {
        this.scene = "mobile_bind";
      }
      if (this.dialogStatus === 8) {
        this.scene = "mobile_bind";
      }
      if (this.dialogStatus === 9) {
        this.scene = "mobile_bind";
      }
      if (this.dialogStatus === 10) {
        this.scene = "password_reset";
      }
      this.$api.Other.SendSms({
        mobile: this.messageForm.mobile,
        image_key: this.captcha.key,
        image_captcha: this.messageForm.captcha,
        scene: this.scene,
      })
        .then(() => {
          // 发送成功
          this.$message.success("发送成功");
          this.sms.loading = this;
          this.sms.current = this.sms.max;
          this.interval = setInterval(() => {
            if (this.sms.current <= 1) {
              this.sms.loading = false;
              clearInterval(this.interval);
            } else {
              this.sms.current--;
            }
          }, 1000);
        })
        .catch((e) => {
          this.getCaptcha();
          this.$message.error(e.message);
        });
    },
    formValidate() {
      if (this.dialogStatus === 1 && this.currentTab === 1) {
        this.passwordFormValidate();
      }
      if (this.dialogStatus === 1 && this.currentTab === 2) {
        this.messageFormValidate();
      }
      if (this.dialogStatus === 2) {
        this.registerFormValidate();
      }
      if (this.dialogStatus === 3) {
        this.editValidate();
      }
      if (this.dialogStatus === 6) {
        this.mobileValidate();
      }
      if (this.dialogStatus === 8) {
        this.changeMobileValidate();
      }
      if (this.dialogStatus === 9) {
        this.NewMobileValidate();
      }
      if (this.dialogStatus === 10) {
        this.editValidate();
      }
    },
    tabChange(key) {
      this.currentTab = key;
    },
    changeRegister() {
      this.dialogStatus = 2;
      this.resetDialog();
      this.$emit("changeType", 2);
    },
    changeLogin() {
      clearInterval(this.timer);
      this.dialogStatus = 1;
      this.resetDialog();
      this.$emit("changeType", 1);
    },
    changeForget() {
      this.dialogStatus = 3;
      this.resetDialog();
      this.$emit("changeType", 3);
    },
    changeQQ() {
      let successRedirectUrl = window.document.location.href;
      if (this.$route.name === "login") {
        let appUrl = this.$utils.getAppUrl();
        if (this.$route.query.redirect) {
          successRedirectUrl = appUrl + this.$route.query.redirect;
        } else {
          successRedirectUrl = appUrl;
        }
      }
      window.location.href =
        this.config.url +
        "/api/v2/login/socialite/qq?success_redirect=" +
        urlencode(successRedirectUrl) +
        "&failed_redirect=" +
        urlencode(this.$utils.getAppUrl() + "/error");
    },
    changeWeixin() {
      this.dialogStatus = 5;
      this.resetDialog();
      this.getQrode();
      this.$emit("changeType", 5);
    },
    cancel() {
      clearInterval(this.timer);
      this.resetDialog();
      this.$emit("hideLoginDialog");
    },
    redirectHandler() {
      if (this.$route.name === "login") {
        if (this.$route.query.redirect) {
          this.$router.replace({
            path: this.$route.query.redirect,
          });
        } else {
          this.$router.replace({
            name: "index",
          });
        }
      } else {
        location.reload();
      }
    },
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
              this.resetDialog();
              this.hideLoginDialog();
              this.redirectHandler();
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
    messageFormValidate() {
      if (this.loading) {
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.$utils.isPoneAvailable(this.messageForm.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      this.loading = true;
      this.$api.Auth.SmsLogin({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
        msv: this.$utils.getMsv(),
      })
        .then((resp) => {
          this.loading = false;
          let token = resp.data.token;
          this.$utils.saveToken(token);
          this.$api.User.Detail()
            .then((res) => {
              this.loginHandle(res.data);
              this.resetDialog();
              this.hideLoginDialog();
              this.redirectHandler();
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
    registerFormValidate() {
      if (this.loading) {
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.$utils.isPoneAvailable(this.messageForm.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.messageForm.password) {
        this.$message.error("请设置账号密码");
        return;
      }
      if (this.messageForm.agree_protocol !== true) {
        this.$message.error("请同意《用户协议》和《隐私政策》");
        return;
      }
      this.loading = true;
      this.$api.Auth.SmsRegister({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
        password: this.messageForm.password,
        msv: this.$utils.getMsv(),
      })
        .then((resp) => {
          this.loading = false;
          this.$message.success("注册成功");
          this.resetDialog();
          this.dialogStatus = 1;
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    editValidate() {
      if (this.loading) {
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.$utils.isPoneAvailable(this.messageForm.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.messageForm.password) {
        this.$message.error("请设置账号密码");
        return;
      }
      this.loading = true;
      this.$api.Auth.PasswordForget({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
        password: this.messageForm.password,
      })
        .then((resp) => {
          this.loading = false;
          this.$message.success("修改完成");
          this.resetDialog();
          this.hideLoginDialog();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    changeMobileValidate() {
      if (this.loading) {
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请填写新的绑定手机号码");
        return;
      }
      if (!this.$utils.isPoneAvailable(this.messageForm.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      this.loading = true;
      this.$api.Member.MobileChange({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
        sign: this.messageForm.sign,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success("绑定成功");
          this.resetDialog();
          this.hideLoginDialog();
          this.bindSuccess();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    NewMobileValidate() {
      if (this.loading) {
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请填写新的绑定手机号码");
        return;
      }
      if (!this.$utils.isPoneAvailable(this.messageForm.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      this.loading = true;
      this.$api.Member.NewMobile({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success("绑定成功");
          this.resetDialog();
          this.hideLoginDialog();
          this.bindSuccess();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    mobileValidate() {
      if (this.loading) {
        return;
      }
      if (!this.$utils.isPoneAvailable(this.messageForm.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      this.loading = true;
      this.$api.Member.MobileVerify({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success("验证成功");
          this.saveDialogMobile(null);
          this.resetDialog();
          this.getCaptcha();
          this.sms.loading = false;
          this.sms.current = 0;
          this.dialogStatus = 8;
          this.messageForm.sign = res.data.sign;
        })
        .catch((e) => {
          this.loading = false;
          this.changeMobile = false;
          this.$message.error(e.message);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.mask {
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  .dialog-login-box {
    width: 500px;
    max-height: 620px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 30px;
    animation: scaleBig 0.3s;

    .tabs {
      width: 100%;
      height: 44px;
      display: flex;
      flex-direction: row;
      position: relative;

      .linkTab {
        position: absolute;
        top: 5px;
        right: 54px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #3ca7fa;
        line-height: 14px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
      .linkTab2 {
        position: absolute;
        top: 5px;
        right: 0px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #3ca7fa;
        line-height: 14px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }

      .btn-close {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 6px;
        top: 2px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
          animation: rotate360 1s;
        }
      }
      .item-tab {
        width: auto;
        height: 20px;
        font-size: 20px;
        font-weight: 500;
        color: #666666;
        line-height: 20px;
        margin-right: 50px;
        cursor: pointer;
        position: relative;
        &.active {
          color: #333333;
        }
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
    .box {
      width: 100%;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      .qrode {
        width: 300px;
        height: 300px;
        margin: 0 auto;
        margin-bottom: 30px;
      }
      .box-mobile {
        width: 100%;
        height: 24px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 50px;
        span {
          height: 18px;
          font-size: 18px;
          font-weight: 600;
          color: #333333;
          line-height: 18px;
          strong {
            height: 24px;
            font-size: 24px;
            line-height: 24px;
          }
        }
      }
      .input-item {
        width: 100%;
        margin-bottom: 30px;
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
        .input-short {
          width: 310px;
          height: 54px;
          background: #f4fafe;
          border-radius: 4px;
          border: 1px solid #e5e5e5;
          padding-left: 20px;
          margin-right: 20px;
          outline: none;
        }
        .captcha {
          width: 110px;
          height: 39px;
          cursor: pointer;
          img {
            width: 110px;
            height: 39px;
          }
        }
        .buttons {
          margin-left: 20px;
          .send-sms-button {
            width: 90px;
            height: 18px;
            font-size: 18px;
            font-weight: 400;
            color: #3ca7fa;
            line-height: 18px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
      .btn-box {
        width: 100%;
        margin-bottom: 30px;
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
        .logout {
          width: 100%;
          height: 54px;
          background: #fff;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
          outline: none;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .others {
        width: 100%;
        margin-top: 50px;
        &.active {
          margin-top: 0px;
        }
        .tit {
          width: 100%;
          text-align: center;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
          margin-bottom: 30px;
        }
        .tab-icon {
          width: 100%;
          display: flex;
          justify-content: center;
          .btn-others {
            margin-right: 64px;
            width: 48px;
            height: 48px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
            &:last-child {
              margin-right: 0px;
            }
          }
        }
      }
    }
  }
}
</style>
