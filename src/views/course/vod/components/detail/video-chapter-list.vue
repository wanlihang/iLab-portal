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
          <el-button type="primary" size="small" @click="openWebEditor">
            开启云端编程环境<i class="el-icon-upload el-icon--right"></i>
          </el-button>
          <el-button type="primary" size="small" @click="openWebRemoteDesktop">
            开启远程桌面环境<i class="el-icon-upload el-icon--right"></i>
          </el-button>
          <el-button type="primary" size="small" @click="openWebTerminal">
            开启远程命令行环境<i class="el-icon-upload el-icon--right"></i>
          </el-button>
          <el-button type="primary" size="small" @click="openWebJuypter">
            开启云端交互式环境<i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </div>
        <el-dialog
            :title="title"
            :visible.sync="open"
            width="80%"
            @close="handleClose">
          <Editor v-if="editorModel"></Editor>
          <RemoteDesktop v-if="remoteDesktopModel"></RemoteDesktop>
          <Terminal v-if="terminalModel"></Terminal>
          <Jupyter v-if="jupyterModel"></Jupyter>
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
import Editor from './editor'
import RemoteDesktop from './remoteDesktop'
import Terminal from './terminal'
import Jupyter from './jupyter'

export default {
  components: {
    Duration,
    Editor,
    RemoteDesktop,
    Terminal,
    Jupyter
  },
  props: ["videos", "isBuy", "course", "buyVideos", "chapters"],
  data() {
    return {
      open: false,
      title: "",
      editorModel: false,
      remoteDesktopModel: false,
      terminalModel: false,
      jupyterModel: false,
    };
  },
  methods: {
    switchVideo(item) {
      this.$emit("switchVideo", item);
    },
    /** 打开云端编程环境按钮操作 */
    openWebEditor() {
      this.open = true;
      this.editorModel = true;
      this.title = "云端编程环境";
    },
    /** 打开远程桌面环境按钮操作 */
    openWebRemoteDesktop() {
      this.open = true;
      this.remoteDesktopModel = true;
      this.title = "远程桌面环境";
    },
    /** 打开远程命令行环境按钮操作 */
    openWebTerminal() {
      this.open = true;
      this.terminalModel = true;
      this.title = "远程命令行环境";
    },
    /** 打开远程交互式环境按钮操作 */
    openWebJuypter() {
      this.open = true;
      this.jupyterModel = true;
      this.title = "云端交互式环境";
    },
    handleClose() {
      this.editorModel = false;
      this.remoteDesktopModel = false;
      this.terminalModel = false;
      this.jupyterModel = false;
      this.title = "";
    }
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
