<template>
  <div class="meedu-filter-box">
    <div class="category2-box" v-if="categories">
      <div class="category2">
        <div class="box">
          <div class="label">分类：</div>
          <div class="item-box">
            <div class="item" :class="{ active: id1 === 0 }" @click="setCid(0)">
              全部
            </div>
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
            categories[cateIndex] &&
            categories[cateIndex].children &&
            categories[cateIndex].children.length > 0
          "
        >
          <div class="label">细分：</div>
          <div class="item-box">
            <div
              class="item"
              :class="{ active: id2 === 0 }"
              @click="setCid2(0)"
            >
              全部
            </div>
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
    <div class="category1-box" v-if="scenes && scenes.length > 0">
      <div class="box">
        <div
          class="item"
          :class="{ active: sceneId === item.id }"
          @click="setScene(item.id)"
          v-for="(item, index) in scenes"
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
  props: ["categories", "cid", "child", "scenes", "scene"],
  data() {
    return {
      id1: 0,
      id2: 0,
      sceneId: "",
    };
  },
  computed: {
    cateIndex() {
      let index = null;
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].id === this.id1) {
          index = i;
        }
      }
      return index;
    },
  },
  mounted() {
    this.sceneId = this.scene;
    this.id1 = parseInt(this.cid);
    this.id2 = parseInt(this.child);
  },
  watch: {
    id1() {
      this.$emit("change", this.id1, this.id2, this.sceneId);
    },
    id2() {
      this.$emit("change", this.id1, this.id2, this.sceneId);
    },
    sceneId() {
      this.$emit("change", this.id1, this.id2, this.sceneId);
    },
  },
  methods: {
    setScene(scene) {
      this.sceneId = scene;
      if (this.id1 === 0) {
        this.$router.push({
          path: this.$route.path,
          query: {
            scene: scene,
          },
        });
        return;
      }
      this.$router.push({
        path: this.$route.path,
        query: {
          cid: this.id1,
          child: this.id2,
          scene: scene,
        },
      });
    },
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
          cid: this.id1,
          child: this.id2,
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
          cid: this.id1,
          child: this.id2,
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
    width: 100%;
    height: auto;
    background: #ffffff;
    .category2 {
      width: 1200px;
      height: auto;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 15px 30px 5px 0px;
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
          margin-right: 15px;
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
        margin-top: 25px;
        .label {
          width: 42px;
          height: 24px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 24px;
          margin-right: 20px;
        }
        .item-box {
          width: 1053px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          flex-direction: row;
          margin-bottom: 5px;
          .item {
            padding: 4px 9px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 30px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 14px;
            border: 1px solid #fff;
            cursor: pointer;
            margin-bottom: 10px;
            &.active {
              color: #3ca7fa;
              border-radius: 13px;
              border: 1px solid #3ca7fa;
            }
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
