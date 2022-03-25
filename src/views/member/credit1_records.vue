<template>
  <div class="content">
    <div class="mask" v-if="openmask">
      <div class="popup borderbox">
        <div class="tabs">
          <div class="item-tab">确认信息</div>
          <img
            class="btn-close"
            @click="cancel()"
            src="../../assets/img/commen/icon-close.png"
          />
        </div>
        <div class="text">确认要兑换吗？</div>
        <div class="button">
          <div class="confirm" style="cursor: pointer" @click="submitHandle()">
            确定
          </div>
          <div class="cancel" style="cursor: pointer" @click="cancel()">
            取消
          </div>
        </div>
      </div>
    </div>
    <edit-address
      :status="dialogStatus"
      @hideDialog="hideDialog"
    ></edit-address>
    <div class="box">
      <nav-member :cid="16"></nav-member>
      <div class="right-box">
        <div class="exchange-box">
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
          <div class="exchange-content" v-if="user">
            <div class="tit">我的积分：</div>
            <div class="credit">{{ user.credit1 }}积分</div>
          </div>
        </div>
        <div class="goods-box" v-if="!goodStatus && currentTab === 1">
          <template v-if="list.length > 0">
            <div class="goods-list">
              <div
                class="goods-item"
                v-for="(item, index) in list"
                :key="index"
                @click="showDetail(item)"
              >
                <div
                  class="item-thumb"
                  :style="{ 'background-image': 'url(' + item.thumb + ')' }"
                ></div>
                <div class="item-body">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-info">
                    <div class="item-value">{{ item.charge }}积分</div>
                    <div class="item-type">
                      <span class="type">{{
                        statusType(item.is_v, item.v_type)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
          <div id="page" v-show="total > pagination.size && list.length > 0">
            <page-box
              :key="pagination.page"
              :page="pagination.page"
              :totals="total"
              @current-change="changepage"
              :pageSize="pagination.size"
              :tab="false"
            ></page-box>
          </div>
        </div>
        <div class="rules" v-if="!goodStatus && currentTab === 2">
          <div class="project-box">
            <div class="btn-title">积分明细</div>
            <template v-if="creditList.length > 0">
              <div
                class="project-item"
                v-for="(item, index) in creditList"
                :key="index"
              >
                <div class="title">{{ item.remark }}</div>
                <div class="value">
                  <span v-if="item.sum > 0">+{{ item.sum }}</span>
                  <span v-else>{{ item.sum }}</span>
                </div>
                <div class="info">
                  <span>{{ item.created_at | changeTime }}</span>
                </div>
              </div>
            </template>
            <none type="white" v-else></none>
            <div
              id="page"
              v-show="total > pagination2.page_size && creditList.length > 0"
            >
              <page-box
                :key="pagination2.page"
                :page="pagination2.page"
                :totals="total"
                @current-change="changepage"
                :pageSize="pagination2.page_size"
                :tab="false"
              ></page-box>
            </div>
          </div>
          <div class="rules-content" v-if="config">
            <div class="btn-title">积分获取</div>
            <div class="rules-item" v-if="config.credit1_reward.register !== 0">
              <p>• 注册登录 +{{ config.credit1_reward.register }} 积分</p>
            </div>
            <div
              class="rules-item"
              v-if="config.credit1_reward.watched_video !== 0"
            >
              <p>• 看完视频 +{{ config.credit1_reward.watched_video }} 积分</p>
            </div>
            <div
              class="rules-item"
              v-if="config.credit1_reward.watched_vod_course !== 0"
            >
              <p>
                • 看完课程 +{{ config.credit1_reward.watched_vod_course }} 积分
              </p>
            </div>
            <div
              class="rules-item"
              v-if="config.credit1_reward.paid_order !== 0"
            >
              <p>
                • 下单成功 +金额*{{
                  parseInt(config.credit1_reward.paid_order / 100)
                }}% 积分
              </p>
            </div>
            <div class="rules-item" v-if="config.credit1_reward.invite !== 0">
              <p>• 邀请好友注册 +{{ config.credit1_reward.invite }} 积分</p>
            </div>
            <div class="rules-item">
              <p>• 可以回答积分悬赏问题获取积分</p>
            </div>
          </div>
        </div>
        <div class="orders-box" v-if="!goodStatus && currentTab === 3">
          <template v-if="orderList.length > 0">
            <div class="item" v-for="item in orderList" :key="item.id">
              <div class="top">
                <div class="id">兑换流水号：{{ item.id }}</div>
                <div class="button">
                  <template v-if="item.goods_is_v === 0">
                    <div class="orderId" v-if="item.is_send === 1">
                      运单号：{{ item.express_number }}
                    </div>
                    <div
                      class="showDetail"
                      v-if="item.is_send === 1"
                      @click="copy(item.express_number)"
                    >
                      复制
                    </div>
                    <div class="orderId" v-else-if="item.is_send === 0">
                      发货中
                    </div>
                  </template>
                  <template v-else-if="item.goods_is_v === 1">
                    <div class="orderId" v-if="item.is_send === 1">
                      已发放成功
                    </div>
                    <div
                      class="showDetail"
                      v-if="item.is_send === 1"
                      @click="goDetail(item.goods_v_type, item.goods_v_id)"
                    >
                      立即查看
                    </div>
                    <div class="orderId" v-else-if="item.is_send === 0">
                      发货中
                    </div>
                  </template>
                </div>
              </div>
              <div class="body">
                <div
                  class="left"
                  :style="{
                    'background-image': 'url(' + item.goods_thumb + ')',
                  }"
                ></div>
                <div class="right">
                  <div class="title">
                    {{ item.goods_title }}
                  </div>
                  <div class="info">
                    <div class="date">
                      {{ item.created_at | changeTime }}
                    </div>
                    <div class="value">{{ item.total_charge }}积分</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
          <div
            id="page"
            v-show="total > pagination.size && orderList.length > 0"
          >
            <page-box
              :key="pagination.page"
              :page="pagination.page"
              :totals="total"
              @current-change="changepage"
              :pageSize="pagination.size"
              :tab="false"
            ></page-box>
          </div>
        </div>
        <div class="goodsDetail-box" v-if="goodStatus && goods">
          <div class="btn-title" @click="backGoodsList()">
            <img class="back" src="../../assets/img/back@2x.png" />
            <span>更多商品</span>
          </div>
          <div class="body">
            <div
              class="goods-thumb"
              :style="{ 'background-image': 'url(' + goods.thumb + ')' }"
            ></div>
            <div class="right">
              <div class="goods-title">{{ goods.title }}</div>
              <div class="goods-content">
                <div class="goods-value">{{ goods.charge }}积分</div>
                <div class="goods-type">
                  <template v-if="is_v === 0">
                    <span>商品类型:发实物</span>
                  </template>
                  <template v-else-if="is_v === 1">
                    <span
                      v-if="
                        goods.v_type === 'vod' ||
                        goods.v_type === 'live' ||
                        goods.v_type === 'book'
                      "
                      >商品类型:换课程</span
                    >
                    <span v-else-if="goods.v_type === 'vip'"
                      >商品类型:换会员</span
                    >
                  </template>
                </div>
              </div>
              <div class="goods-info">
                <div class="goods-button" @click="exchange()">立即兑换</div>
                <template v-if="is_v === 0">
                  <div class="address-bar">
                    <div class="address-item">
                      <div class="address-name">收货人信息</div>
                      <div class="address-button" @click="changeAddress">
                        编辑地址
                      </div>
                    </div>
                    <div class="address-value">
                      {{ address }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="name">
              <i></i>
              商品介绍
            </div>
            <div class="desc" v-html="goods.desc"></div>
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
import NavMember from "../../components/navmember.vue";
import PageBox from "../../components/page.vue";
import None from "../../components/none.vue";
import EditAddress from "../../components/editAddress.vue";

export default {
  components: {
    NavFooter,
    NavMember,
    PageBox,
    None,
    EditAddress,
  },
  data() {
    return {
      list: [],
      creditList: [],
      orderList: [],
      goods: [],
      total: null,
      pagination: {
        page: 1,
        size: 10,
      },
      pagination2: {
        page: 1,
        page_size: 10,
      },
      currentTab: 1,
      is_v: null,
      id: null,
      loading: false,
      goodStatus: false,
      openmask: false,
      dialogStatus: false,
      tabs: [
        {
          name: "积分商城",
          id: 1,
        },
        {
          name: "明细规则",
          id: 2,
        },
        {
          name: "积分订单",
          id: 3,
        },
      ],
      address_id: null,
      address: null,
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "config", "addressForm"]),
  },
  mounted() {
    this.getMall();
  },
  methods: {
    ...mapMutations([
      "showLoginDialog",
      "changeDialogType",
      "setNewAddress",
      "loginHandle",
    ]),
    statusType(is_v, type) {
      if (is_v === 0) {
        return "发实物";
      } else if (is_v === 1) {
        if (type === "vod" || type === "live" || type === "book") {
          return "换课程";
        } else if (type === "vip") {
          return "换会员";
        }
      }
    },
    tabChange(key) {
      this.backGoodsList();
      this.currentTab = key;
      if (this.currentTab === 1) {
        this.resetData();
        this.getMall();
      } else if (this.currentTab === 2) {
        this.resetData();
        this.getData();
      } else if (this.currentTab === 3) {
        this.resetData();
        this.getOrders();
      }
    },
    resetData() {
      this.total = null;
      this.pagination.size = 10;
      this.pagination.page = 1;
      this.pagination2.page_size = 10;
      this.pagination2.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination2.page_size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.pagination2.page = item.currentPage;
      if (this.currentTab === 1) {
        this.getMall();
      } else if (this.currentTab === 2) {
        this.getData();
      } else if (this.currentTab === 3) {
        this.getOrders();
      }
    },
    getMall() {
      this.$api.CreditMall.List(this.pagination).then((res) => {
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    getData() {
      this.$api.Member.Credit1Records(this.pagination2).then((res) => {
        this.creditList = res.data.data;
        this.total = res.data.total;
      });
    },
    getOrders() {
      this.$api.CreditMall.Orders(this.pagination).then((res) => {
        this.orderList = res.data.data;
        this.total = res.data.total;
      });
    },
    copy(url) {
      var input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
      this.$message.success("复制成功");
    },
    backGoodsList() {
      this.id = null;
      this.is_v = null;
      this.goods = [];
      this.goodStatus = false;
    },
    showDetail(item) {
      this.id = item.id;
      this.is_v = item.is_v;
      this.$api.CreditMall.Detail(this.id).then((res) => {
        this.goods = res.data.data;
        this.goodStatus = true;
        if (this.is_v === 0) {
          this.getAddress();
        }
      });
    },
    getAddress() {
      this.$api.CreditMall.Address().then((res) => {
        let address = res.data;
        if (
          this.addressForm &&
          this.addressForm.name &&
          this.addressForm.mobile &&
          this.addressForm.province &&
          this.addressForm.city &&
          this.addressForm.area &&
          this.addressForm.street
        ) {
          this.address =
            this.addressForm.name +
            " " +
            this.addressForm.mobile +
            " " +
            this.addressForm.province +
            " " +
            this.addressForm.city +
            " " +
            this.addressForm.area +
            " " +
            this.addressForm.street;
          this.address_id = null;
        } else if (
          address[0] &&
          address[0].name !== "" &&
          address[0].mobile !== "" &&
          address[0].province !== "" &&
          address[0].city !== "" &&
          address[0].area !== "" &&
          address[0].street != ""
        ) {
          this.address =
            address[0].name +
            " " +
            address[0].mobile +
            " " +
            address[0].province +
            " " +
            address[0].city +
            " " +
            address[0].area +
            " " +
            address[0].street;
          this.address_id = address[0].id;
          this.setNewAddress(address[0]);
        } else {
          this.address_id = null;
          this.address = "请输入地址";
        }
      });
    },
    exchange() {
      if (this.user.credit1 < this.goods.charge) {
        this.$message.error("积分余额不足");
        return;
      }
      if (this.is_v === 0 && this.address === "请输入地址") {
        this.$message.error("请填写地址");
        return;
      }
      this.openmask = true;
    },
    cancel() {
      this.openmask = false;
    },
    hideDialog() {
      this.dialogStatus = false;
      this.getAddress();
    },
    resetUserDetail() {
      this.$api.User.Detail()
        .then((res) => {
          this.loginHandle(res.data);
        })
        .catch((e) => {
          if (e.code === 401) {
            this.$utils.clearToken();
            this.$router.replace({
              name: "index",
            });
          } else {
            this.$message.error(e.message);
          }
        });
    },
    submitHandle() {
      if (this.is_v === 0) {
        let form = {
          address_id: this.address_id,
          name: this.addressForm.name,
          mobile: this.addressForm.mobile,
          province: this.addressForm.province,
          city: this.addressForm.city,
          area: this.addressForm.area,
          street: this.addressForm.street,
        };
        this.$api.CreditMall.Exchange(this.id, form)
          .then((data) => {
            this.$message.success("兑换成功");
            this.resetUserDetail();
            this.cancel();
            setTimeout(() => {
              this.tabChange(3);
            }, 500);
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      } else if (this.is_v === 1) {
        this.$api.CreditMall.Exchange(this.id, {})
          .then((data) => {
            this.$message.success("兑换成功");
            this.resetUserDetail();
            this.cancel();
            setTimeout(() => {
              this.tabChange(3);
            }, 500);
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      }
    },
    changeAddress() {
      this.dialogStatus = true;
    },
    goDetail(type, id) {
      if (type === "vip") {
        this.$router.push({ name: "Member" });
      } else if (type === "vod") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: id,
          },
        });
      } else if (type === "live") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: id,
          },
        });
      } else if (type === "book") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: id,
          },
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    .popup {
      width: 400px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      animation: scaleBig 0.3s;
      .tabs {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        position: relative;
        padding: 23px 23px 0px 30px;
        overflow: hidden;
        .item-tab {
          width: 72px;
          height: 18px;
          font-size: 18px;
          font-weight: 500;
          color: #333333;
          line-height: 18px;
          margin-top: 7px;
        }
        .btn-close {
          width: 19px;
          height: 19px;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
            animation: rotate360 1s;
          }
        }
      }
      .text {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
      }
      .button {
        width: 100%;
        height: 74px;
        background: #ffffff;
        box-shadow: 0px -1px 5px 0px rgba(0, 0, 0, 0.1);
        border-radius: 0px 0px 8px 8px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: center;
        .cancel {
          width: 88px;
          height: 44px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          cursor: pointer;
          margin-right: 60px;
          &:hover {
            opacity: 0.8;
          }
        }
        .confirm {
          width: 88px;
          height: 44px;
          background: #3ca7fa;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    .right-box {
      margin-left: 30px;
      width: 999px;
      height: auto;
      box-sizing: border-box;
      .exchange-box {
        width: 999px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        margin-bottom: 10px;
        padding: 30px;
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
        .exchange-content {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          .tit {
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            margin-right: 0px;
          }
          .credit {
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            color: #ff4d4f;
          }
        }
      }
      .orders-box {
        width: 999px;
        height: auto;
        display: flex;
        flex-direction: column;
        .item {
          width: 100%;
          height: 154px;
          background: #ffffff;
          border-radius: 8px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 20px 30px;
          .top {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            .id {
              height: 14px;
              font-size: 12px;
              font-weight: 400;
              color: #999999;
              line-height: 14px;
            }
            .button {
              height: auto;
              display: flex;
              flex-direction: row;
              align-items: center;
              .orderId {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                line-height: 14px;
              }
              .showDetail {
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #3ca7fa;
                line-height: 14px;
                margin-left: 30px;
                cursor: pointer;
                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }
          .body {
            width: 100%;
            height: 80px;
            display: flex;
            flex-direction: row;
            box-sizing: border-box;
            .left {
              width: 80px;
              height: 80px;
              margin-right: 30px;
              background-repeat: no-repeat;
              background-size: contain;
              background-position: center center;
            }
            .right {
              flex: 1;
              display: flex;
              flex-direction: column;
              .title {
                width: 829px;
                height: 20px;
                font-size: 15px;
                font-weight: 500;
                color: #333333;
                line-height: 20px;
                margin-top: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .info {
                width: 100%;
                height: 12px;
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 38px;
                .date {
                  font-size: 12px;
                  font-weight: 400;
                  color: #333333;
                  margin-right: 30px;
                }
                .value {
                  font-size: 12px;
                  font-weight: 400;
                  color: #333333;
                }
              }
            }
          }
        }
        #page {
          width: 100%;
          margin-top: 30px;
          display: flex;
          justify-content: center;
        }
      }
      .goods-box {
        width: 999px;
        height: auto;
        float: left;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;
        .goods-list {
          width: 100%;
          height: auto;
          display: grid;
          gap: 26px;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          overflow: hidden;
          .goods-item {
            width: 100%;
            height: 261px;
            border-radius: 6px;
            border: 1px solid #e5e5e5;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
            .item-thumb {
              width: 100%;
              height: 168px;
              background-repeat: no-repeat;
              background-size: contain;
              background-position: center center;
            }
            .item-body {
              width: 100%;
              height: 93px;
              display: flex;
              flex-direction: column;
              box-sizing: border-box;
              padding: 10px;
              .item-title {
                width: 100%;
                height: 40px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-size: 15px;
                font-weight: 500;
                color: #171923;
                line-height: 20rpx;
              }
              .item-info {
                width: 100%;
                height: 20px;
                margin-top: 12px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                .item-value {
                  display: inline-block;
                  width: auto;
                  height: 14px;
                  font-size: 14px;
                  font-weight: 600;
                  color: #ff5068;
                  line-height: 14px;
                }
                .item-type {
                  display: inline-block;
                  width: auto;
                  height: auto;
                  background: #ff5068;
                  border-radius: 2px;
                  padding: 4px;
                  font-size: 12px;
                  font-weight: 400;
                  color: #ffffff;
                  line-height: 12px;
                }
              }
            }
          }
        }
        #page {
          width: 100%;
          margin-top: 30px;
          display: flex;
          justify-content: center;
        }
      }
      .goodsDetail-box {
        width: 999px;
        height: auto;
        display: flex;
        flex-direction: column;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 30px;
        .btn-title {
          width: 100px;
          height: 24px;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 30px;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
          .back {
            width: 24px;
            height: 24px;
            margin-right: 10px;
          }
          span {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
          }
        }
        .body {
          width: 100%;
          height: 200px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .goods-thumb {
            width: 200px;
            height: 200px;
            margin-right: 30px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center center;
          }
          .right {
            flex: 1;
            height: 200px;
            display: flex;
            flex-direction: column;
            .goods-title {
              width: 709px;
              height: 30px;
              font-size: 20px;
              font-weight: 500;
              color: #333333;
              line-height: 30px;
              margin-top: 15px;
              margin-bottom: 30px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .goods-content {
              width: 100%;
              height: 20px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-bottom: 30px;
              .goods-value {
                height: 20px;
                font-size: 20px;
                font-weight: 600;
                color: #ff4d4f;
                line-height: 20px;
                margin-right: 30px;
              }
              .goods-type {
                height: 20px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                line-height: 20px;
              }
            }
            .goods-info {
              width: 100%;
              height: auto;
              float: left;
              display: flex;
              flex-direction: row;
              align-items: center;
              .goods-button {
                width: 104px;
                height: 56px;
                background: linear-gradient(90deg, #fbc74b 0%, #fcdc54 100%);
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-weight: 500;
                color: #613400;
                margin-right: 30px;
                cursor: pointer;
                &:hover {
                  opacity: 0.8;
                }
              }
              .address-bar {
                flex: 1;
                min-height: 56px;
                float: left;
                display: flex;
                flex-direction: column;
                .address-item {
                  width: 100%;
                  height: auto;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  margin-top: 5px;
                  margin-bottom: 18px;
                  .address-name {
                    height: 14px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #333333;
                    line-height: 14px;
                    margin-right: 15px;
                  }
                  .address-button {
                    height: 14px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #ff5068;
                    line-height: 14px;
                    cursor: pointer;
                    &:hover {
                      opacity: 0.8;
                    }
                  }
                }
                .address-value {
                  width: 100%;
                  height: auto;
                  float: left;
                  font-size: 14px;
                  font-weight: 400;
                  color: #666666;
                  line-height: 18px;
                }
              }
            }
          }
        }
        .bottom {
          width: 100%;
          float: left;
          height: auto;
          margin-top: 50px;
          display: flex;
          flex-direction: column;
          .name {
            width: 100%;
            height: 14px;
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 30px;
            i {
              width: 4px;
              height: 14px;
              background: linear-gradient(90deg, #fbc74b 0%, #fcdc54 100%);
              border-radius: 2px;
              margin-right: 5px;
            }
          }
          .desc {
            width: 100%;
            float: left;
            height: auto;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 24px;
          }
        }
      }
      .rules {
        display: flex;
        flex-direction: row;
        width: 999px;
        height: auto;

        .project-box {
          display: flex;
          flex-direction: column;
          width: 644px;
          height: auto;
          background: #ffffff;
          border-radius: 8px;
          box-sizing: border-box;
          padding: 30px;
          margin-right: 10px;
          .btn-title {
            width: 80px;
            height: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 16px;
          }
          .project-item {
            width: 100%;
            height: 14px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-top: 30px;
            .title {
              width: 300px;
              height: 14px;
              font-size: 14px;
              font-weight: 500;
              color: #333333;
              line-height: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .value {
              margin-left: 30px;
              width: 100px;
              height: 14px;
              font-size: 14px;
              font-weight: 600;
              line-height: 14px;
              color: #ff5068;
            }
            .info {
              flex: 1;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 14px;
              text-align: right;
            }
          }
          #page {
            width: 100%;
            margin-top: 30px;
            display: flex;
            justify-content: center;
          }
        }
        .rules-content {
          display: flex;
          flex-direction: column;
          width: 345px;
          height: auto;
          background: #ffffff;
          border-radius: 8px;
          box-sizing: border-box;
          padding: 30px;
          .btn-title {
            width: 80px;
            height: 16px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            line-height: 16px;
            margin-bottom: 15px;
          }
          .rules-item {
            width: 100%;
            margin-top: 15px;
            height: auto;
            p {
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
