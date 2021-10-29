<template>
  <div>
    <div class="btn-upload-image">
      <img src="../assets/img/commen/upload.png" />
      <input
        class="input-upload"
        type="file"
        accept="image/*"
        @change="uploadImage"
      />
    </div>

    <div
      class="img-item"
      v-for="(imgItem, index) in thumbs"
      :key="index"
      @click="del(index)"
    >
      <img :src="imgItem" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../js/config";
import Utils from "@/js/utils";
// 请求域名
axios.defaults.baseURL = config.url;
axios.defaults.timeout = 10000;

// 请求拦截器(附带上token)
axios.interceptors.request.use(
  (config) => {
    const token = Utils.getToken();
    token && (config.headers.Authorization = "Bearer " + token);
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);
export default {
  props: ["images"],
  data() {
    return {
      uploadImgLoading: false,
      thumbs: [],
    };
  },
  mounted() {
    if (this.images) {
      this.thumbs = this.images;
    }
  },
  methods: {
    emitUpdate() {
      this.$emit("update", this.thumbs);
    },
    del(index) {
      this.thumbs.splice(index, 1);
      this.emitUpdate();
    },
    uploadImage(e) {
      let files = e.target.files;
      if (this.uploadImgLoading) {
        return;
      }

      if (this.thumbs.length >= 6) {
        this.$u.toast("最多上传6张图片");
        return;
      }
      if (!files[0].type.match(/.jpg|.png|.jpeg/i)) {
        this.$message.error("图片格式错误,请上传png/jpg/jpeg格式的图片");
        return;
      }
      let formData = new FormData();
      formData.append("file", files[0]);
      this.uploadImgLoading = true;
      axios
        .post("/addons/Wenda/api/v1/upload/image", formData)
        .then((res) => {
          this.uploadImgLoading = false;
          if (res.data.code === 0) {
            this.$message.success("上传成功");
            this.thumbs.push(res.data.data.url);
            this.emitUpdate();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(() => {
          this.uploadImgLoading = false;
          this.$message.error("上传出现错误");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.btn-upload-image {
  width: 160px;
  height: 90px;
  background: #f4fafe;
  float: left;
  box-sizing: border-box;
  margin-right: 30px;
  position: relative;
  img {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 30px;
    left: 65px;
  }
  .input-upload {
    width: 160px;
    height: 90px;
    background: #f4fafe;
    opacity: 0;
    cursor: pointer;
  }
}

.img-item {
  width: 160px;
  height: 90px;
  float: left;
  margin-right: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  img {
    width: auto;
    height: 90px;
  }
}
</style>