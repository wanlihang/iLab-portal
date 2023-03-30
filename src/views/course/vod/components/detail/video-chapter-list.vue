<template>
  <div>
    <div class="chapter-item" v-for="(chapter, index) in chapters" :key="chapter.id">
      <div class="chapter-name">

        第 {{ index + 1 }} 章：{{ chapter.title }}

        <el-button type="primary" size="mini" @click="openLabEnv(chapter, index)" style="float: right">
          进入实验<i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </div>

      <div class="chapter-videos-box">
        <div
          class="video-item"
          @click="switchVideo(videoItem)"
          v-for="videoItem in videos[chapter.id]"
          :key="videoItem.id"
        >
          <img
            class="play-icon"
            v-if="
              isBuy ||
                course.is_free === 1 ||
                videoItem.charge === 0 ||
                (videoItem.charge > 0 && videoItem.free_seconds > 0) ||
                buyVideos.indexOf(videoItem.id) !== -1
            "
            src="@/assets/img/commen/icon-unlock.png"
          />
          <img
            class="play-icon"
            v-else
            src="@/assets/img/commen/icon-lock.png"
          />
          <div class="video-title">
            <div class="text">
              {{ videoItem.title }}
            </div>
            <div
              class="free"
              v-if="
                isBuy === false &&
                  course.is_free !== 1 &&
                  (videoItem.charge === 0 || videoItem.free_seconds > 0)
              "
            >
              试看
            </div>
          </div>
          <div class="video-info">
            <duration :seconds="videoItem.duration"></duration>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
    </div>
    <template v-if="videos[0] && videos[0].length > 0">
      <div class="chapter-item">
        <div class="chapter-name">无章节内容</div>
        <div class="chapter-videos-box">
          <div
            class="video-item"
            @click="switchVideo(videoItem)"
            v-for="videoItem in videos[0]"
            :key="videoItem.id"
          >
            <img
              class="play-icon"
              v-if="
                isBuy ||
                  course.is_free === 1 ||
                  videoItem.charge === 0 ||
                  (videoItem.charge > 0 && videoItem.free_seconds > 0) ||
                  buyVideos.indexOf(videoItem.id) !== -1
              "
              src="@/assets/img/commen/icon-unlock.png"
            />
            <img
              class="play-icon"
              v-else
              src="@/assets/img/commen/icon-lock.png"
            />
            <div class="video-title">
              <div class="text">
                {{ videoItem.title }}
              </div>
              <div
                class="free"
                v-if="
                  isBuy === false &&
                    course.is_free !== 1 &&
                    (videoItem.charge === 0 || videoItem.free_seconds > 0)
                "
              >
                试看
              </div>
            </div>
            <div class="video-info">
              <Duration :seconds="videoItem.duration"></Duration>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Duration from "@/components/duration.vue";
import {mapState} from "vuex";

export default {
  name: "videoChapterList",
  computed: {
    ...mapState(["isLogin", "user", "freshUnread", "config", "configFunc"]),
  },
  components: {
    Duration,
  },
  props: ["videos", "isBuy", "course", "buyVideos", "chapters"],
  data() {
    return {};
  },
  methods: {
    switchVideo(item) {
      this.$emit("switchVideo", item);
    },
    /** 打开实验环境按钮操作 */
    openLabEnv(chapter, index) {
      if (this.user == null) {
        alert("未登录")
        return
      }
      chapter.index = index
      chapter.chapter_id = chapter.id
      this.user.user_id = this.user.id
      const params = Object.assign({}, chapter, this.user);
      this.$api.iLab.getEnvPath(params)
        .then((res) => {
          console.log("getEnvPath", res);
          this.$router.push({
            name: "Lab",
            query: {
              lavEnv: res.data,
              chapter: chapter,
              course: this.course
            },
          });
        })
        .catch((e) => {
          this.$message.error("getEnvPath 失败:" + e);
        })
        .finally(() => {

        });
    },
  },
};
</script>

<style lang="less" scoped>
.video-item {
  //width: auto;
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  margin-top: 30px;
  cursor: pointer;

  &:first-child {
    margin-top: 0;
  }

  .play-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .video-title {
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 14px;
    margin-left: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .free {
      margin-left: 15px;
      width: 44px;
      height: 22px;
      background: #04c877;
      border-radius: 2px;
      color: #fff;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .video-duration {
    position: absolute;
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    top: 5px;
    right: 0;
  }
}

.chapter-item {
  width: 100%;
  height: auto;
  margin-top: 50px;

  &:first-child {
    margin-top: 0;
  }

  .chapter-name {
    width: 100%;
    height: 16px;
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 16px;
    margin-bottom: 30px;

    &:first-child {
      margin-bottom: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .chapter-videos-box {
    width: 100%;
    height: auto;

    .video-item {
      width: 100%;
      height: 24px;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
      cursor: pointer;
      margin-top: 30px;

      .play-icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
      }

      .video-title {
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 14px;
        margin-left: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .free {
          margin-left: 15px;
          width: 44px;
          height: 22px;
          background: #04c877;
          border-radius: 2px;
          color: #fff;
          font-size: 12px;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .video-info {
        position: absolute;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        top: 5px;
        right: 0;
      }
    }
  }
}
</style>
