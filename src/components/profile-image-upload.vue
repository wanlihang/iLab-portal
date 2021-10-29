<template>
  <div class="img-box">
    <img :src="thumb" />
    <input id="file_input" type="file" accept="image/*" @change="uploadImage" />
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
  props: ["position", "pic"],
  data() {
    return {
      key: null,
      thumb: null,
    };
  },
  mounted() {
    this.thumb = this.pic;
    this.key = this.position;
  },
  methods: {
    uploadImage(e) {
      let files = e.target.files;
      if (!files[0].type.match(/.jpg|.png|.jpeg/i)) {
        this.$message.error("图片格式错误,请上传png/jpg/jpeg格式的图片");
        return;
      }
      let formData = new FormData();
      formData.append("file", files[0]);
      axios
        .post("/api/v2/upload/image", formData)
        .then((res) => {
          if (res.data.code === 0) {
            let url = res.data.data.url;
            this.thumb = url;
            this.$emit("change", this.key, url);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch((e) => {
          this.$message.error("上传图片出现错误");
        });
    },
  },
};
</script>
<style lang="less" scoped>
.img-box {
  width: 100%;
  height: 100%;
  position: relative;
  img {
    width: auto;
    height: 100%;
    z-index: 15;
    margin: 0 auto;
  }
  #file_input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}
</style>