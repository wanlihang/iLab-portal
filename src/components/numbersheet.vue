<template>
  <div class="box">
    <div class="number-box" v-if="qidArr.length < 1000">
      <div
        class="num"
        :class="{
          active: index + 1 === activeNum || configkey[index],
          practice: type === 'practice',
          wrongbook: type === 'wrongbook',
          collection: type === 'collection',
        }"
        v-for="(item, index) in qidArr"
        :key="index"
        @click="goDetail(index + 1)"
      >
        {{ index + 1 }}
      </div>
    </div>
    <div class="number-box2" v-else>
      <div
        class="num"
        :class="{
          active: index + 1 === activeNum || configkey[index],
          practice: type === 'practice',
          wrongbook: type === 'wrongbook',
          collection: type === 'collection',
        }"
        v-for="(item, index) in qidArr"
        :key="index"
        @click="goDetail(index + 1)"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["activeNum", "qidArr", "type", "configkey"],
  data() {
    return {};
  },
  methods: {
    goDetail(qid) {
      this.$emit("change", qid);
    },
  },
};
</script>
<style lang="less" scoped>
.box {
  width: 100%;
  .number-box {
    width: 100%;
    padding: 50px 30px;
    box-sizing: border-box;
    display: grid;
    grid-row-gap: 23px;
    grid-column-gap: 30px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    .practice {
      border: 1px solid #e1a500;
      color: #e1a500;
      &.active {
        background-color: #e1a500;
        color: #ffffff;
      }
    }
    .collection {
      border: 1px solid #9355de;
      color: #9355de;
      &.active {
        background-color: #9355de;
        color: #ffffff;
      }
    }
    .wrongbook {
      border: 1px solid #ff5068;
      color: #ff5068;
      &.active {
        background-color: #ff5068;
        color: #ffffff;
      }
    }
    .num {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .number-box2 {
    width: 100%;
    padding: 50px 30px;
    box-sizing: border-box;
    display: grid;
    gap: 23px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    .practice {
      border: 1px solid #e1a500;
      color: #e1a500;
      &.active {
        background-color: #e1a500;
        color: #ffffff;
      }
    }
    .collection {
      border: 1px solid #9355de;
      color: #9355de;
      &.active {
        background-color: #9355de;
        color: #ffffff;
      }
    }
    .wrongbook {
      border: 1px solid #ff5068;
      color: #ff5068;
      &.active {
        background-color: #ff5068;
        color: #ffffff;
      }
    }
    .num {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
