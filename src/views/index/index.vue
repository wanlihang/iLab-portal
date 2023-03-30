<template>
  <div class="page-main-body-box">
    <div class="contanier">
      <template v-if="loading">
        <skeletonBanner></skeletonBanner>
      </template>
      <template v-else>
        <div
          class="banner"
          @mouseover="enter"
          @mouseleave="leave"
          v-show="sliders && sliders.length > 0"
        >
          <swiper ref="mySwiper" :options="swiperOptions">
            <swiper-slide v-for="item in sliders" :key="item.sort">
              <img :src="item.thumb" :name="item.url" />
            </swiper-slide>

            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div v-if="notice" class="tips w-full lg:mx-auto">
          <a
            @click="
              $router.push({
                name: 'announcement',
                query: { id: notice.id },
              })
            "
            class="block px-6 py-3 rounded-bl rounded-br annon"
          >
            公告：{{ notice.title }}
          </a>
        </div>
      </template>

      <template v-if="!loading2">
        <div class="box" v-for="block in blocks" :key="block.id">
          <index-vod-v1
            v-if="block.sign === 'pc-vod-v1'"
            :name="block.config_render.title"
            :items="block.config_render.items"
          ></index-vod-v1>
          <index-live-v1
            v-else-if="block.sign === 'pc-live-v1'"
            :name="block.config_render.title"
            :items="block.config_render.items"
          ></index-live-v1>
          <index-learnpath-v1
            v-else-if="block.sign === 'pc-learnPath-v1'"
            :name="block.config_render.title"
            :items="block.config_render.items"
          ></index-learnpath-v1>
          <index-topic-v1
            v-else-if="block.sign === 'pc-topic-v1'"
            :name="block.config_render.title"
            :items="block.config_render.items"
          ></index-topic-v1>
          <index-book-v1
            v-else-if="block.sign === 'pc-book-v1'"
            :name="block.config_render.title"
            :items="block.config_render.items"
          ></index-book-v1>
          <index-ms-v1
            v-else-if="block.sign === 'pc-ms-v1'"
            :name="block.config_render.title"
            :items="block.config_render.items"
          ></index-ms-v1>

          <index-tg-v1
            v-else-if="block.sign === 'pc-tg-v1'"
            :name="block.config_render.title"
            :items="block.config_render.items"
          ></index-tg-v1>
          <div class="code-box" v-else-if="block.sign === 'code'">
            <div v-html="block.config_render.html"></div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="box">
          <skeletonHome></skeletonHome>
        </div>
      </template>
    </div>
    <nav-footer :status="true"></nav-footer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import IndexVodV1 from "./components/vod-v1.vue";
import IndexLiveV1 from "./components/live-v1.vue";
import IndexLearnpathV1 from "./components/learnpath-v1.vue";
import IndexTopicV1 from "./components/topic-v1.vue";
import IndexBookV1 from "./components/book-v1.vue";
import IndexMsV1 from "./components/ms-v1.vue";
import IndexTgV1 from "./components/tg-v1.vue";
import NavFooter from "../../components/footer.vue";
import SkeletonHome from "../../components/skeleton/skeletonHome.vue";
import SkeletonBanner from "../../components/skeleton/skeletonBanner.vue";
var vm = null;
export default {
  components: {
    Swiper,
    SwiperSlide,
    IndexVodV1,
    IndexLiveV1,
    IndexLearnpathV1,
    IndexTopicV1,
    IndexBookV1,
    IndexMsV1,
    IndexTgV1,
    NavFooter,
    SkeletonHome,
    SkeletonBanner,
  },
  data() {
    return {
      pageName: "index",
      loading: false,
      loading2: false,
      notice: null,
      sliders: [],
      blocks: [],
      swiperOptions: {
        direction: "horizontal",
        loop: true,
        autoplay: {
          stopOnLastSlide: false,
          disableOnInteraction: false,
          delay: 3000,
        },
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
        effect: "slide",
        on: {
          click: function (e) {
            let url = e.target.name;
            if (url) {
              if (
                url.match("https:") ||
                url.match("http:") ||
                url.match("www")
              ) {
                window.location.href = url;
              } else {
                vm.$router.push({ path: url });
              }
            }
          },
        },
      },
    };
  },
  created() {
    vm = this;
  },
  computed: {
    ...mapState(["isLogin", "user"]),
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  mounted() {
    if (this.swiper.length > 1) {
      this.swiperOptions.loop = true;
    } else {
      this.swiperOptions.loop = false;
    }
    this.getSliders();
    this.getPageBlocks();
    this.getNotice();
  },
  activated() {
    this.$utils.scrollTopSet(this.pageName);
  },
  beforeRouteLeave(to, from, next) {
    this.$utils.scrollTopRecord(this.pageName);
    next();
  },
  methods: {
    enter() {
      this.$refs.mySwiper.$swiper.autoplay.stop();
    },
    leave() {
      this.$refs.mySwiper.$swiper.autoplay.start();
    },
    getSliders() {
      this.loading = true;
      this.$api.ViewBlock.Sliders({ platform: "PC" }).then((res) => {
        this.sliders = res.data;
        this.loading = false;
      });
    },
    getPageBlocks() {
      this.loading2 = true;
      this.$api.ViewBlock.PageBlocks({
        platform: "pc",
        page_name: "pc-page-index",
      }).then((res) => {
        this.blocks = res.data;
        this.loading2 = false;
      });
    },
    getNotice() {
      this.$api.Home.Announcement().then((res) => {
        this.notice = res.data;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.contanier {
  width: 1200px;
  min-height: 500px;
  margin: 0 auto;
  .tips {
    border-radius: 0px 0px 16px 16px;
    overflow: hidden;
  }
  .banner {
    width: 100%;
    height: 400px;
    margin-top: 30px;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    .swiper-container {
      width: 100%;
      height: 100%;
      .swiper-slide {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          cursor: pointer;
        }
      }
    }
  }
  .box {
    width: 100%;
    box-sizing: border-box;
    padding-top: 0px;
    .code-box {
      width: 100%;
      overflow: hidden;
    }
  }
}
</style>
