<template>
  <div>
    <div class="chapter-item" v-for="chapter in chapters" :key="chapter.id">
      <div class="chapter-name">{{ chapter.title }}</div>
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
        <div style="margin-left: 35px">
          <el-button type="primary" size="small" @click="openWebSSH">
            开启实验<i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </div>
        <el-dialog
            :title="title"
            :visible.sync="open"
            width="80%"
            center>
          <span slot="footer" class="dialog-footer">
          <Terminal></Terminal>
        </span>
        </el-dialog>
      </div>
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
              <duration :seconds="videoItem.duration"></duration>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Duration from "@/components/duration.vue";
import Terminal from './terminal'

export default {
  components: {
    Duration,
    Terminal
  },
  props: ["videos", "isBuy", "course", "buyVideos", "chapters"],
  data() {
    return {
      open: false,
      title: ""
    };
  },
  methods: {
    switchVideo(item) {
      this.$emit("switchVideo", item);
    },
    /** 打开实验环境按钮操作 */
    openWebSSH() {
      this.open = true;
      this.title = "命令行";
    },
  },
};
</script>

<style lang="less" scoped>
.video-item {
  width: 100%;
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  margin-top: 30px;
  cursor: pointer;

  &:first-child {
    margin-top: 0px;
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
    margin-top: 0px;
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
      margin-bottom: 0px;
    }

    &:last-child {
      margin-bottom: 0px;
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
