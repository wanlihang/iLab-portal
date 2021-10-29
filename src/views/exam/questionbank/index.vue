<template>
  <div class="content">
    <div class="nav">
      <a @click="$router.push({ name: 'Exam' })">在线考试</a> /
      <span> 试题库 </span>
    </div>
    <div class="banner">
      <template v-if="loading">
        <skeletonPaperInfo></skeletonPaperInfo>
      </template>
      <template v-else>
        <div class="contanier">
          <div class="category-box">
            <div class="title">1.选择试题分类(可多选)</div>
            <template v-if="list.length > 0">
              <div
                class="category-item"
                v-for="(item, index) in list"
                :key="index"
              >
                <div
                  class="oneClass"
                  :class="{ active: item.children.length === 0 }"
                >
                  <label>
                    <input
                      type="checkbox"
                      :checked="category_ids.indexOf(item.id) >= 0"
                      name="checkboxinput"
                      class="input-checkbox"
                    />{{ item.name }}
                    <div
                      class="show-box"
                      :class="{ act: category_ids.indexOf(item.id) >= 0 }"
                      @click="checkedOne(item)"
                    />
                  </label>
                </div>
                <div
                  class="twoClass"
                  v-if="item.children && item.children.length > 0"
                >
                  <div
                    class="category-child-item"
                    v-for="(child, index) in item.children"
                    :key="index"
                  >
                    <label>
                      <input
                        type="checkbox"
                        :checked="category_ids.indexOf(child.id) >= 0"
                        name="checkboxinput"
                        class="input-checkbox"
                      />{{ child.name }}
                      <div
                        class="show-box"
                        :class="{ act: category_ids.indexOf(child.id) >= 0 }"
                        @click="checkedChild(child.id)"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="type-box">
            <div class="title">2.选择试题题型(可多选)</div>
            <div class="types">
              <div
                class="type-item"
                v-for="(typeItem, index) in typeList"
                :key="index"
              >
                <label>
                  <input
                    type="checkbox"
                    :checked="types.indexOf(typeItem.id) >= 0"
                    name="checkboxinput"
                    class="input-checkbox"
                  />{{ typeItem.name }}
                  <div
                    class="show-box"
                    :class="{ act: types.indexOf(typeItem.id) >= 0 }"
                    @click="checkedTwo(typeItem.id)"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="btn-box">
          <div class="day-play" @click="run()">生成练习</div>
        </div>
      </template>
    </div>

    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../../components/footer.vue";
import SkeletonPaperInfo from "../../../components/skeleton/skeletonPaperInfo.vue";

export default {
  components: {
    NavFooter,
    SkeletonPaperInfo,
  },
  data() {
    return {
      list: [],
      total: null,
      loading: false,
      category_ids: [],
      types: [],
      typeList: [
        { id: 1, name: "单选题" },
        { id: 2, name: "多选题" },
        { id: 3, name: "填空题" },
        { id: 4, name: "问答题" },
        { id: 5, name: "判断题" },
        { id: 6, name: "题帽题" },
      ],
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    checkedTwo(fruitId) {
      let idIndex = this.types.indexOf(fruitId);
      if (idIndex >= 0) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.types.splice(idIndex, 1);
      } else {
        // 选中该checkbox
        this.types.push(fruitId);
      }
    },
    checkedChild(fruitId) {
      let idIndex = this.category_ids.indexOf(fruitId);
      if (idIndex >= 0) {
        this.category_ids.splice(idIndex, 1);
      } else {
        this.category_ids.push(fruitId);
      }
    },
    checkedOne(item) {
      this.checkedChild(item.id);
      if (item.children && item.children.length > 0) {
        let box = item.children;
        for (var i = 0; i < box.length; i++) {
          let idIndex = this.category_ids.indexOf(box[i].id);
          if (idIndex >= 0) {
            this.category_ids.splice(idIndex, 1);
          } else {
            this.category_ids.push(box[i].id);
          }
        }
      }
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Exam.QuestionBank.Detail().then((res) => {
        this.loading = false;
        this.list = res.data;
      });
    },

    run() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (this.category_ids.length === 0) {
        this.$message.error("请选择试题分类");
        return;
      }
      if (this.types.length === 0) {
        this.$message.error("请选择试题题型");
        return;
      }
      this.$router.push({
        name: "ExamQuestionbankPlay",
        query: {
          category_ids: this.category_ids.join(","),
          types: this.types.join(","),
        },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.content {
  width: 100%;
  .nav {
    width: 1200px;
    margin: 0 auto;
    height: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    color: #999999;
    line-height: 14px;
    margin-top: 30px;
    margin-bottom: 30px;
    a {
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
      margin-right: 6px;
      &:not(:first-of-type) {
        margin-left: 6px;
      }
    }
    span {
      height: 14px;
      margin-left: 6px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
    }
  }
  .banner {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    height: auto;
    background: linear-gradient(90deg, #ff4c72 0%, #ff9996 100%);
    box-shadow: 0px 4px 8px 0px rgba(102, 102, 102, 0.1);
    border-radius: 8px;
    padding: 50px;
    box-sizing: border-box;
    flex-direction: column;
    .tit {
      width: 100%;
      height: 28px;
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 28px;
      text-align: center;
      margin-bottom: 50px;
    }
    .btn-box {
      width: 100%;
      display: flex;
      flex-direction: row;
      .day-play {
        width: 150px;
        height: 56px;
        background: #ffffff;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 400;

        color: #ff4e73;
        margin-right: 50px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    .contanier {
      width: 100%;
      min-height: 500px;
      .type-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        .title {
          width: 100%;
          height: 18px;
          font-size: 18px;
          font-weight: 500;
          color: #ffffff;
          line-height: 18px;
          margin-bottom: 30px;
        }
        .types {
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .type-item {
            height: 18px;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 30px;
            margin-bottom: 50px;
            label {
              position: relative;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #ffffff;
              line-height: 14px;
              display: flex;
              flex-direction: row;
              align-items: center;

              .input-checkbox {
                width: 14px;
                height: 14px;
                border-radius: 2px;
                margin-right: 10px;
                cursor: pointer;
              }
              .show-box {
                position: absolute;
                top: 0;
                left: 0;
                width: 14px;
                height: 14px;
                border-radius: 2px;
                border: 1px solid #fff;
                background: #ff4c72;
                cursor: pointer;
                &.act {
                  background: #fff;
                }
              }
            }
          }
        }
      }
      .category-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        .title {
          width: 100%;
          height: 18px;
          font-size: 18px;
          font-weight: 500;
          color: #ffffff;
          line-height: 18px;
          margin-bottom: 30px;
        }

        .category-item {
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 40px;
          .oneClass {
            width: 100%;
            height: 18px;
            display: flex;
            flex-direction: row;
            align-items: center;
            &.active {
              margin-bottom: 10px;
            }

            label {
              position: relative;
              height: 18px;
              font-size: 18px;
              font-weight: 600;
              color: #ffffff;
              line-height: 18px;
              display: flex;
              flex-direction: row;
              align-items: center;

              .input-checkbox {
                width: 18px;
                height: 18px;
                border-radius: 2px;
                margin-right: 10px;
                cursor: pointer;
              }
              .show-box {
                position: absolute;
                top: 0;
                left: 0;
                width: 18px;
                height: 18px;
                border-radius: 2px;
                border: 1px solid #fff;
                background: #ff4c72;
                cursor: pointer;
                &.act {
                  background: #fff;
                }
              }
            }
          }
          .twoClass {
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-top: 20px;
            .category-child-item {
              height: 14px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-right: 30px;
              margin-bottom: 10px;

              label {
                position: relative;
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                color: #ffffff;
                line-height: 14px;
                display: flex;
                flex-direction: row;
                align-items: center;

                .input-checkbox {
                  width: 14px;
                  height: 14px;
                  border-radius: 2px;
                  margin-right: 10px;
                  cursor: pointer;
                }
                .show-box {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 14px;
                  height: 14px;
                  border-radius: 2px;
                  border: 1px solid #fff;
                  background: #ff4c72;
                  cursor: pointer;
                  &.act {
                    background: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>