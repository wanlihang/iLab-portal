<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="8"></nav-member>
      <div class="project-box">
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
        </div>
        <div class="project-content" v-if="currentTab === 1 && user">
          <div class="item-line">
            <div class="item-left">
              <div class="item-name">昵称</div>
              <div class="item-value" v-if="!editNickStatus">
                {{ user.nick_name }}
              </div>
              <div class="item-value" v-if="editNickStatus">
                <input
                  class="input"
                  type="text"
                  placeholder="昵称"
                  v-model="form.nick_name"
                />
              </div>
            </div>
            <div class="item-right">
              <div
                v-if="user.is_set_nickname === 0 && !editNickStatus"
                class="btn"
                @click="showEditNick()"
              >
                修改
              </div>
              <div
                v-if="user.is_set_nickname === 0 && editNickStatus"
                class="btn act"
                @click="saveEditNick()"
              >
                保存
              </div>
              <div v-if="user.is_set_nickname === 1" class="btn">已修改</div>
              <div class="tip" v-if="user.is_set_nickname === 0">
                （只可修改一次）
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-name">头像</div>
              <div class="item-avatar">
                <img class="avatar" :src="user.avatar" />
                <input
                  class="input-avatar"
                  type="file"
                  accept="image/*"
                  @change="uploadAvatar"
                />
              </div>
            </div>
            <div class="item-right">
              <div class="tip">（点击图片修改，图片大小不超过2M）</div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-name">手机号码</div>
              <div class="item-value">
                {{ user.mobile.substr(0, 3) + "****" + user.mobile.substr(7) }}
              </div>
            </div>
            <div class="item-right">
              <div class="btn" @click="goChangeMobile()">换绑手机号</div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-name">设置（修改）密码</div>
            </div>
            <div class="item-right">
              <div class="btn" @click="goChangePassword()">
                点击设置（修改）密码
              </div>
            </div>
          </div>
          <!-- <div class="item-line">
            <div class="item-left">
              <div class="item-name">绑定QQ</div>
              <div class="item-btn" @click="goBindQQ()">点击绑定</div>
            </div>
            <div class="item-right">
              <div class="tip">(可用于快捷登录)</div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-name">绑定微信</div>
              <div
                class="item-btn"
                v-if="bindWeixin === 0"
                @click="goBindWeixin()"
              >
                点击绑定
              </div>
              <div class="item-value" v-if="bindWeixin === 1">
                {{ user.mobile }}
              </div>
              <div
                class="item-btn"
                v-if="bindWeixin === 1"
                @click="goBindWeixin()"
              >
                重新绑定
              </div>
            </div>
            <div class="item-right">
              <div class="tip">(可用于快捷登录)</div>
            </div>
          </div> -->
        </div>
        <div class="project-content" v-if="currentTab === 2">
          <div class="item-line">
            <div class="item-left">
              <div class="item-tit">实名认证</div>
              <div class="item-value">
                <input
                  class="input"
                  type="text"
                  placeholder="请填写你的真实姓名"
                  v-model="realForm.real_name"
                  @input="inputFn"
                />
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-tit">性别</div>
              <div class="item-radio">
                <div class="boy">
                  <input
                    type="radio"
                    name="radios"
                    value="1"
                    v-model="realForm.gender"
                    @input="inputFn"
                  /><label>男</label>
                </div>

                <div class="girl">
                  <input
                    type="radio"
                    name="radios"
                    value="2"
                    v-model="realForm.gender"
                    @input="inputFn"
                  /><label>女</label>
                </div>
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-tit">生日</div>
              <div class="item-value">
                <date-picker
                  placeholder="选择生日"
                  v-model="realForm.birthday"
                  type="date"
                  valueType="format"
                ></date-picker>
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-tit">职业</div>
              <div class="item-value">
                <input
                  class="input"
                  v-model="realForm.profession"
                  placeholder="此处填写你的所处职业"
                  @input="inputFn"
                />
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-tit">住址</div>
              <div class="item-value">
                <input
                  class="input"
                  v-model="realForm.address"
                  placeholder="此处填写你的联系地址"
                  @input="inputFn"
                />
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-tit">毕业证照</div>
              <div class="item-thumb">
                <img class="icon" src="../../assets/img/commen/upload.png" />
                <ProImageUpload
                  :pic="realForm.diploma"
                  :position="1"
                  @change="getUrl"
                ></ProImageUpload>
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-tit">毕业院校</div>
              <div class="item-value">
                <input
                  class="input"
                  v-model="realForm.graduated_school"
                  placeholder="此处填写你的毕业院校"
                />
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-tit">身份证号</div>
              <div class="item-value">
                <input
                  class="input"
                  v-model="realForm.id_number"
                  @input="inputFn"
                  placeholder="此处填写你的身份证号码"
                />
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="item-left">
              <div class="item-sptit">身份证正面</div>
              <div class="item-thumb">
                <img class="icon" src="../../assets/img/commen/upload.png" />
                <ProImageUpload
                  :pic="realForm.id_frontend_thumb"
                  :position="2"
                  @change="getUrl"
                ></ProImageUpload>
              </div>
              <div class="item-sptit">身份证反面</div>
              <div class="item-thumb">
                <img class="icon" src="../../assets/img/commen/upload.png" />
                <ProImageUpload
                  :pic="realForm.id_backend_thumb"
                  :position="3"
                  @change="getUrl"
                ></ProImageUpload>
              </div>
              <div class="item-sptit">手持身份证</div>
              <div class="item-thumb">
                <img class="icon" src="../../assets/img/commen/upload.png" />
                <ProImageUpload
                  :pic="realForm.id_hand_thumb"
                  :position="4"
                  @change="getUrl"
                ></ProImageUpload>
              </div>
            </div>
          </div>
          <div class="btn-box">
            <div
              class="button-submit"
              :class="{ active: realFormFocus }"
              @click="sunmitRealForm"
            >
              保存
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import Utils from "@/js/utils";
import axios from "axios";
import config from "../../js/config";
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import NavMember from "../../components/navmember.vue";
import ProImageUpload from "../../components/profile-image-upload.vue";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/zh-cn";

// 请求域名
axios.defaults.baseURL = config.url;
axios.defaults.timeout = 10000;

// 请求拦截器(附带上token)
axios.interceptors.request.use(
  (config) => {
    const token = Utils.getToken();
    token && (config.headers.Authorization = "Bearer " + token);
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);
export default {
  components: {
    NavFooter,
    NavMember,
    ProImageUpload,
    DatePicker,
  },
  data() {
    return {
      list: [],
      oldBirthday: null,
      realFormFocus: false,
      editNickStatus: false,
      currentTab: 1,
      loading: false,
      form: {
        nick_name: null,
      },
      realForm: {
        real_name: null,
        gender: null,
        birthday: null,
        address: null,
        profession: null,
        graduated_school: null,
        diploma: null,
        id_number: null,
        id_frontend_thumb: null,
        id_backend_thumb: null,
        id_hand_thumb: null,
      },
      tabs: [
        {
          name: "基本信息",
          id: 1,
        },
        {
          name: "实名认证",
          id: 2,
        },
      ],
    };
  },
  watch: {
    "realForm.birthday": {
      handler: function () {
        if (this.realForm.birthday === this.oldBirthday) {
          return;
        }
        this.realFormFocus = true;
      },
    },
  },
  computed: {
    ...mapState(["isLogin", "user", "bindWeixin"]),
  },
  mounted() {
    if (this.user) {
      this.form.nick_name = this.user.nick_name;
    }
    this.getData();
  },
  methods: {
    ...mapMutations([
      "loginHandle",
      "showLoginDialog",
      "changeDialogType",
      "saveDialogMobile",
    ]),
    inputFn() {
      this.realFormFocus = true;
    },
    showEditNick() {
      this.editNickStatus = true;
    },
    resetData() {
      this.editNickStatus = false;
      this.realFormFocus = false;
      this.list = [];
    },
    resetUserDetail() {
      this.editNickStatus = false;
      this.realFormFocus = false;
      this.list = [];
      this.$api.User.Detail()
        .then((res) => {
          this.loginHandle(res.data);
        })
        .catch((e) => {
          if (e.code === 401) {
            Utils.clearToken();
            this.$router.replace({
              name: "index",
            });
          } else {
            this.$message.error(e.message);
          }
        });
    },
    tabChange(key) {
      this.currentTab = key;
    },
    goChangeMobile() {
      this.saveDialogMobile(this.user.mobile);
      this.changeDialogType(6);
      this.showLoginDialog();
    },
    goBindQQ() {
      window.location.href = "https://all.meedu.tech/member/socialite/qq/bind";
    },
    goBindWeixin() {
      this.changeDialogType(7);
      this.showLoginDialog();
    },
    goChangePassword() {
      this.changeDialogType(10);
      this.showLoginDialog();
    },
    getData() {
      this.$api.Member.Profile().then((res) => {
        if (res.data) {
          this.realForm.real_name = res.data.real_name;
          this.realForm.gender = res.data.gender;
          this.realForm.birthday = res.data.birthday;
          this.realForm.address = res.data.address;
          this.realForm.profession = res.data.profession;
          this.realForm.graduated_school = res.data.graduated_school;
          this.realForm.diploma = res.data.diploma;
          this.realForm.id_number = res.data.id_number;
          this.realForm.id_frontend_thumb = res.data.id_frontend_thumb;
          this.realForm.id_backend_thumb = res.data.id_backend_thumb;
          this.realForm.id_hand_thumb = res.data.id_hand_thumb;
          this.oldBirthday = res.data.birthday;
        } else {
          this.oldBirthday = null;
        }
      });
    },

    uploadAvatar(e) {
      let files = e.target.files;
      if (!files[0].type.match(/.jpg|.png|.jpeg/i)) {
        this.$message.error("图片格式错误,请上传png/jpg/jpeg格式的图片");
        return;
      }
      if (files[0].size > 2048000) {
        this.$message.error("图片大小不超过2M");
        return;
      }
      let formData = new FormData();
      formData.append("file", files[0]);
      axios
        .post("/api/v2/member/detail/avatar", formData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("上传头像成功");
            this.resetUserDetail();
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch((e) => {
          this.$message.error("上传图片出现错误");
        });
    },
    saveEditNick() {
      if (this.loading) {
        return;
      }
      if (!this.form.nick_name) {
        this.$message.error("请输入昵称");
        return;
      }
      this.loading = true;
      this.$api.Member.NicknameChange({ nick_name: this.form.nick_name })
        .then((res) => {
          this.loading = false;
          this.$message.success("修改成功");
          this.resetUserDetail();
          this.getData();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    getUrl(key, url) {
      this.realFormFocus = true;
      if (key === 1) {
        this.realForm.diploma = url;
      }
      if (key === 2) {
        this.realForm.id_frontend_thumb = url;
      }
      if (key === 3) {
        this.realForm.id_backend_thumb = url;
      }
      if (key === 4) {
        this.realForm.id_hand_thumb = url;
      }
    },
    sunmitRealForm() {
      if (this.loading) {
        return;
      }
      if (!this.realFormFocus) {
        return;
      }
      this.loading = true;
      this.$api.Member.ProfileSave(this.realForm)
        .then((res) => {
          this.loading = false;
          this.$message.success("保存成功");
          this.resetUserDetail();
          this.getData();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
  },
};
</script>
    <style lang='less' scoped>
.content {
  width: 100%;
  .box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    .project-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 15px 30px 50px 30px;
      .tabs {
        width: 100%;
        height: 34px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        padding: 0px;
        margin-bottom: 30px;
        .item-tab {
          width: 56px;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
          margin-right: 50px;
          cursor: pointer;
          position: relative;
          text-align: center;
          &.active {
            font-weight: 600;
            color: #3ca7fa;
          }
          .actline {
            width: 56px;
            height: 4px;
            background: #3ca7fa;
            position: absolute;
            left: 0px;
            top: 29px;
          }
        }
      }
      .project-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        .btn-box {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          flex-direction: row;
          .button-submit {
            width: 104px;
            height: 40px;
            margin-left: 90px;
            background: #cccccc;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            &:hover {
              opacity: 0.8;
            }
            &.active {
              background: #3ca7fa;
            }
          }
        }
        .item-line {
          width: 100%;
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;
          &:not(:last-of-type) {
            margin-bottom: 50px;
          }
          .item-left {
            display: flex;
            flex-direction: row;
            align-items: center;
            .item-name {
              width: 116px;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 14px;
              margin-right: 4px;
            }
            .item-tit {
              width: 56px;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 14px;
              margin-right: 34px;
            }
            .item-sptit {
              width: 70px;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 14px;
              margin-right: 20px;
            }
            .item-radio {
              display: flex;
              height: 20px;
              flex-direction: row;
              align-items: center;
              .boy {
                display: flex;
                height: 20px;
                flex-direction: row;
                align-items: center;
                input {
                  width: 14px;
                  height: 14px;
                  margin-right: 10px;
                }
                label {
                  font-size: 14px;
                  font-weight: 400;
                  color: #333333;
                  line-height: 14px;
                  margin-right: 30px;
                }
              }
              .girl {
                display: flex;
                height: 20px;
                flex-direction: row;
                align-items: center;
                input {
                  width: 14px;
                  height: 14px;
                  margin-right: 10px;
                }
                label {
                  font-size: 14px;
                  font-weight: 400;
                  color: #333333;
                  line-height: 14px;
                }
              }
            }
            .item-btn {
              width: 56px;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #3ca7fa;
              line-height: 14px;
              cursor: pointer;
            }
            .item-avatar {
              width: 48px;
              height: 48px;
              border-radius: 24px;
              overflow: hidden;
              position: relative;
              .avatar {
                width: 48px;
                height: 48px;
                border-radius: 24px;
              }
              .input-avatar {
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                width: 48px;
                height: 48px;
                border-radius: 24px;
              }
            }
            .item-thumb {
              width: 160px;
              height: 90px;
              background: #f4fafe;
              cursor: pointer;
              margin-right: 50px;
              position: relative;
              .icon {
                position: absolute;
                width: 30px;
                height: 30px;
                top: 30px;
                left: 65px;
              }
              img {
                width: 100%;
                height: 100%;
                cursor: pointer;
              }
            }
            .item-value {
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 14px;
              .input {
                width: 224px;
                height: 36px;
                background: #ffffff;
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                padding-left: 15px;
              }
            }
          }
          .item-right {
            display: flex;
            flex-direction: row;
            align-items: center;
            .btn {
              cursor: pointer;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              line-height: 14px;
              &.act {
                color: #3ca7fa;
              }
            }
            .tip {
              margin-left: 10px;
              height: 12px;
              font-size: 12px;
              font-weight: 400;
              color: #999999;
              line-height: 12px;
            }
          }
        }
      }
    }
  }
}
</style>