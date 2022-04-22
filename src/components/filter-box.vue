<template>
  <div class="meedu-filter-box">
    <div class="category2-box" v-if="categories2">
      <div class="box">
        <div class="first-item">分类：</div>
        <div class="item-box">
          <div class="item" :class="{ active: id2 === 0 }" @click="setCid(0)">
            全部
          </div>
          <div
            class="item"
            :class="{ active: id2 === item.id }"
            @click="setCid(item.id)"
            v-for="item in categories2"
            :key="item.id"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="category1-box" v-if="categories1">
      <div class="box">
        <div
          class="item"
          :class="{ active: id1 === item.id }"
          @click="setScene(item.id)"
          v-for="(item, index) in categories1"
          :key="index"
        >
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["categories1", "categories2", "cid1", "cid2"],
  data() {
    return {
      id1: 0,
      id2: 0,
    };
  },
  mounted() {
    this.id1 = this.cid1;
    this.id2 = parseInt(this.cid2);
  },
  watch: {
    id2() {
      this.$emit("change", this.id1, this.id2);
    },
    id1() {
      this.$emit("change", this.id1, this.id2);
    },
  },
  methods: {
    setScene(scene) {
      this.id1 = scene;
    },
    setCid(id) {
      this.id2 = id;
    },
  },
};
</script>

<style lang="less" scoped>
.meedu-filter-box {
  width: 100%;
  .category2-box {
    width: 100%;
    height: auto;
    background: #ffffff;
    padding: 15px 0px 5px 0px;
    box-sizing: border-box;
    .box {
      width: 1200px;
      height: auto;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      .first-item {
        width: 42px;
        height: 14px;
        margin: 10px 15px 0px 0px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }
      .item-box {
        width: 1068px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: row;
        .item {
          width: auto;
          height: 34px;
          padding: 10px 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
          cursor: pointer;
          margin-bottom: 10px;
          &.active {
            background-color: rgba(160, 175, 187, 0.15);
            border-radius: 4px;
            color: #3ca7fa;
          }
        }
      }
    }
  }
  .category1-box {
    width: 100%;
    height: 74px;
    padding: 30px 0px 20px 0px;
    box-sizing: border-box;
    .box {
      width: 1200px;
      height: 74px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      .item {
        width: 60px;
        height: 14px;
        text-align: left;
        color: #666666;
        margin-right: 30px;
        line-height: 14px;
        margin-bottom: 10px;
        &.active {
          color: #3ca7fa;
        }
        &:not(:last-of-type) {
          border-right: 1px solid #cccccc;
        }
        span {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          line-height: 14px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
