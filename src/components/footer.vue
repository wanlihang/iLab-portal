<template>
  <div class="footer" :class="{ active: white }">
    <div class="footer-box overflow-hidden">
      <div v-if="status && list.length > 0" class="tit">友情链接</div>
      <div v-if="status && list.length > 0" class="links">
        <a
          v-for="item in list"
          :key="item.id"
          :href="item.url"
          target="_blank"
          >{{ item.name }}</a
        >
      </div>
      <div class="info1">
        wanlh.top © 2020 - 2023 {{ config.webname }}
        <a v-if="config.icp" :href="config.icp_link" target="_blank">
          •{{ config.icp }}</a
        >
        <a v-if="config.icp2" :href="config.icp2_link" target="_blank"
          >•{{ config.icp2 }}</a
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: ["status", "white"],
  data() {
    return {
      loading: false,
      list: [],
    };
  },
  computed: {
    ...mapState(["config"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.status) {
        this.$api.Home.FooterLink().then((res) => {
          this.list = res.data;
        });
      }
    },
  },
};
</script>
<style lang='less' scoped>
.footer {
  margin-top: 80px;
  width: 100%;
  background: #0f0a1e;
  &.active {
    margin-top: 0px;
  }
  .footer-box {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 10px 0px 20px 0px;
    box-sizing: border-box;
    .tit {
      width: 100%;
      height: 16px;
      font-size: 18px;
      font-weight: 400;
      color: #ffffff;
      line-height: 16px;
      margin-bottom: 40px;
    }
    .links {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      //margin-bottom: 50px;
      a {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(107, 114, 128);
        line-height: 14px;
        margin-right: 50px;
        margin-bottom: 30px;
      }
    }
    .info2 {
      width: 160px;
      //height: 18px;
      margin: 0 auto;
      cursor: pointer;
      a {
        width: 100%;
        height: 100%;
        img {
          width: 160px;
          height: 18px;
        }
      }
    }
    .info1 {
      width: 100%;
      text-align: center;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(107, 114, 128);
      line-height: 12px;
      margin-top: 10px;
    }
  }
}
</style>
