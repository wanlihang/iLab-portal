<template>
  <div class="content">
    <div class="box">
      <nav-member :cid="5" :news="newStatus"></nav-member>
      <div class="project-box">
        <template v-if="list">
          <div
            class="history-item"
            v-for="(item, index1) in list"
            :key="index1"
          >
            <div
              class="name"
              :class="{ tran: !configkey[index1] }"
              @click="showDrop(index1)"
            >
              <div class="text">{{ index1 }}</div>
            </div>
            <div class="history-courses-box" v-if="!configkey[index1]">
              <div
                class="history-course-item"
                v-for="(item2, index2) in item"
                :key="index2"
                @click="
                  goDetail({ type: item2.other_type, id: item2.other_id })
                "
              >
                <div class="at">{{ item2.hour }}</div>
                <div class="course-title">{{ item2.title }}</div>
              </div>
            </div>
          </div>
        </template>
        <none v-else></none>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import NavMember from "../../components/navmember.vue";
import None from "../../components/none.vue";

export default {
  components: {
    NavFooter,
    NavMember,
    None,
  },
  data() {
    return {
      newStatus: false,
      list: null,
      configkey: [],
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
    showDrop(index) {
      this.$set(this.configkey, index, !this.configkey[index]);
    },
    goDetail(item) {
      if (item.type === "vod") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: item.id,
          },
        });
      } else if (item.type === "live") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: item.id,
          },
        });
      } else if (item.type === "book") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: item.id,
          },
        });
      } else if (item.type === "topic") {
        this.$router.push({
          name: "topicDetail",
          query: {
            id: item.id,
          },
        });
      } else if (item.type === "video") {
        this.$router.push({
          name: "coursesVideo",
          query: {
            id: item.id,
          },
        });
      }
    },
    getData() {
      this.$api.TemplateOne.History.Records().then((res) => {
        this.list = res.data;
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
      box-sizing: border-box;
      .history-item {
        width: 999px;
        height: auto;
        background: #ffffff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 20px 30px;
        margin-bottom: 10px;
        .name {
          width: 100%;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
          cursor: pointer;
          &:hover {
            color: #3ca7fa;
          }
          &.tran {
            font-weight: 600;
            color: #3ca7fa;
          }
        }
        .history-courses-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding-top: 30px;
          .history-course-item {
            width: 100%;
            display: flex;
            flex-direction: row;
            margin-bottom: 20px;
            cursor: pointer;
            &:hover .at {
              color: #3ca7fa;
            }
            &:hover .course-title {
              color: #3ca7fa;
            }
            .at {
              width: 38px;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 14px;
              margin-right: 30px;
            }
            .course-title {
              width: 901px;
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