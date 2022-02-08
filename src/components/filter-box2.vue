<template>
  <div class="meedu-filter-box">
    <div class="category2-box" v-if="categories">
      <div class="box">
        <div class="label">分类：</div>
        <div class="item-box">
          <div
            class="item"
            :class="{ active: id1 === item.id }"
            @click="setCid(item.id)"
            v-for="item in categories"
            :key="item.id"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div
        class="box2"
        v-if="
          categories[cateIndex] && categories[cateIndex].children.length > 1
        "
      >
        <div class="label">标签：</div>
        <div class="item-box">
          <div
            class="item"
            :class="{ active: id2 === item2.id }"
            @click="setCid2(item2.id)"
            v-for="item2 in categories[cateIndex].children"
            :key="item2.id"
          >
            {{ item2.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["categories", "cid1", "cid2"],
  data() {
    return {
      id1: 0,
      id2: 0,
    };
  },
  computed: {
    cateIndex() {
      let index = 0;
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].id === parseInt(this.cid1)) {
          index = i;
        }
      }
      return index;
    },
  },
  mounted() {
    this.id1 = parseInt(this.cid1);
    this.id2 = parseInt(this.cid2);
  },
  watch: {
    id1() {
      this.$emit("change", this.id1, this.id2);
    },
    id2() {
      this.$emit("change", this.id1, this.id2);
    },
  },
  methods: {
    setCid(id) {
      this.id1 = id;
      this.id2 = 0;
      if (this.id1 === 0) {
        this.$router.push({
          path: this.$route.path,
        });
        return;
      }
      this.$router.push({
        path: this.$route.path,
        query: {
          cid1: this.id1,
          cid2: this.id2,
        },
      });
    },
    setCid2(id) {
      this.id2 = id;
      if (this.id1 === 0) {
        this.$router.push({
          path: this.$route.path,
        });
        return;
      }
      this.$router.push({
        path: this.$route.path,
        query: {
          cid1: this.id1,
          cid2: this.id2,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.meedu-filter-box {
  width: 100%;
  .category2-box {
    width: 1200px;
    height: auto;
    background: #ffffff;
    border-radius: 8px;
    margin: 0 auto;
    padding: 15px 30px 5px 30px;
    box-sizing: border-box;
    .box {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      .label {
        width: 42px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
        margin-right: 30px;
        margin-top: 10px;
      }
      .item-box {
        width: 1068px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: row;
        .item {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
          padding: 10px 15px;
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
    .box2 {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      .label {
        width: 42px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
        margin-right: 45px;
      }
      .item-box {
        width: 1053px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: row;
        .item {
          height: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 50px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
          cursor: pointer;
          margin-bottom: 10px;
          &.active {
            color: #3ca7fa;
          }
        }
      }
    }
  }
  .category1-box {
    width: 100%;
    height: 74px;
    .box {
      width: 1200px;
      height: 74px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      flex-direction: row;
      .item {
        width: 60px;
        height: 14px;
        text-align: left;
        color: #666666;
        margin-right: 30px;
        line-height: 14px;
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
