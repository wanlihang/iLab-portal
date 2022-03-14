<template>
  <div class="content page-main-body-box">
    <filter-box
      v-show="!navLoading"
      :categories1="scenes"
      :categories2="categories"
      :cid1="pagination.scene"
      :cid2="pagination.cid"
      @change="filterChange"
    ></filter-box>
    <CreateQuestion
      v-if="createQestion"
      @cancel="closeQuestion"
      @success="createSuccess"
      :status="true"
    ></CreateQuestion>

    <template v-if="navLoading">
      <skeletonNav></skeletonNav>
      <skeletonNav2></skeletonNav2>
    </template>
    <div class="contanier">
      <div class="qa-box">
        <template v-if="loading">
          <div style="margin-top: 10px">
            <skeletonWendaList></skeletonWendaList>
          </div>
        </template>
        <template v-else-if="list.length > 0">
          <div class="qa-item" v-for="item in list" :key="item.id">
            <qa-item
              :cid="item.id"
              :title="item.title"
              :answer-count="item.answer_count"
              :view-times="item.view_times"
              :vote-count="item.vote_count"
              :status-text="item.status_text"
              :status="item.status"
              :credit1="item.credit1"
            ></qa-item>
          </div>
        </template>
        <none v-else></none>
        <div id="page" v-show="list.length > 0 && total > pagination.size">
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

      <div class="right-contanier">
        <div class="create-button" @click="goCreatePage">我要提问</div>
        <p class="tips">
          该内容后台可自定义 本站禁止发布以下内容，违者报警并提交相关IP等信息
        </p>
        <p class="tips">(一)反对宪法所确定的基本原则的</p>
        <p class="tips">
          (二)危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的
        </p>
        <p class="tips">
          (三)损害国家荣誉和利益的 (四)煽动民族仇恨、民族歧视，破坏民族团结的
        </p>
        <p class="tips">(五)破坏国家宗教政策，宣扬邪教和封建迷信的</p>
        <p class="tips">(六)散布谣言，扰乱社会秩序，破坏社会稳定的</p>
        <p class="tips">
          (七)散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的
        </p>
        <p class="tips">(八)侮辱或者诽谤他人，侵害他人合法权益的</p>
        <p class="tips">(九)含有法律、行政法规禁止的其他内容的。</p>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import None from "../../components/none.vue";
import FilterBox from "../../components/filter-box.vue";
import QaItem from "../../components/qa-item.vue";
import NavFooter from "../../components/footer.vue";
import PageBox from "../../components/page.vue";
import CreateQuestion from "../../components/create-question.vue";
import SkeletonWendaList from "../../components/skeleton/skeletonWendaList.vue";
import SkeletonNav from "../../components/skeleton/skeletonNav.vue";
import SkeletonNav2 from "../../components/skeleton/skeletonNav2.vue";
export default {
  components: {
    FilterBox,
    NavFooter,
    None,
    PageBox,
    QaItem,
    CreateQuestion,
    SkeletonWendaList,
    SkeletonNav,
    SkeletonNav2,
  },
  data() {
    return {
      pageName: "wenda-list",
      list: [],
      total: null,
      createQestion: false,
      pagination: {
        page: 1,
        size: 10,
        scene: "default",
        cid: 0,
      },
      scenes: [
        {
          id: "default",
          name: "综合",
        },
        {
          id: "solved",
          name: "已解决",
        },
        {
          id: "unsolved",
          name: "未解决",
        },
        {
          id: "last_answer",
          name: "最新回答",
        },
      ],
      categories: [],
      filterShowStatus: false,
      loading: false,
      navLoading: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.navLoading = true;
    this.getData();
  },
  activated() {
    this.changefilter();
    this.$utils.scrollTopSet(this.pageName);
  },
  beforeRouteLeave(to, from, next) {
    this.$utils.scrollTopRecord(this.pageName);
    next();
  },
  methods: {
    ...mapMutations([
      "showLoginDialog",
      "changeDialogType",
      "changeUserCredit",
    ]),
    changefilter() {
      let cid = this.pagination.cid;
      let scene = this.pagination.scene;
      if (cid === 0) {
        this.$router.push({
          path: this.$route.path,
          query: {
            scene: scene,
          },
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            scene: scene,
            category_id: cid,
          },
        });
      }
    },
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },
    filterChange(scene, cid) {
      this.pagination.scene = scene;
      if (cid === 0) {
        this.$router.push({
          path: this.$route.path,
          query: {
            scene: scene,
          },
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {
            scene: scene,
            category_id: cid,
          },
        });
      }
      this.resetData();
      this.getData();
    },
    resetData() {
      this.list = [];
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
      window.scrollTo(0, 0);
    },
    createSuccess(id, credit1) {
      this.createQestion = false;
      let credit = parseInt(this.user.credit1) - parseInt(credit1);
      this.changeUserCredit(credit);
      setTimeout(() => {
        this.$router.push({
          name: "wendaDetail",
          query: {
            id: id,
          },
        });
      }, 600);
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.pagination.scene = this.$route.query.scene || "default";
      this.pagination.cid = this.$route.query.category_id || 0;
      this.$api.Wenda.List(this.pagination).then((res) => {
        this.loading = false;
        this.navLoading = false;
        if (this.categories.length === 0) {
          this.categories = res.data.categories;
        }
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    goCreatePage() {
      if (!this.isLogin) {
        this.goLogin();
      } else {
        this.createQestion = true;
      }
    },
    closeQuestion() {
      this.createQestion = false;
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  .contanier {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
    display: block;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    .qa-box {
      width: 769px;
      display: flex;
      flex-direction: column;
      margin-right: 30px;
      #page {
        width: 769px;
        margin: 0 auto;
        margin-top: 50px;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
    }
    .right-contanier {
      width: 400px;
      height: 458px;
      background: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-sizing: border-box;
      .create-button {
        width: 100%;
        height: 56px;
        background: #3ca7fa;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        margin-bottom: 30px;
        &:hover {
          opacity: 0.8;
        }
      }
      .tips {
        width: 100%;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 24px;
      }
    }
  }
}
</style>
