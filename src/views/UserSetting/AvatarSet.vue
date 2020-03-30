<template>
  <el-upload
    class="avatar-uploader"
    action="/user/useravatar"
    with-credentials
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
  </el-upload>
</template>

<script>
export default {
  name: "avatar",
  data() {
    return {
      user: null,
      imageUrl: ""
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.initUser();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    initUser() {
      this.getRequest("/user/getuserinfo").then(resp => {
        if (resp.user) {
          this.user = resp.user;
          this.$store.commit("login", resp.user);
        }
      });
    }
  }
};
</script>

<style scoped>
.avatar-uploader {
  margin: 30px 15px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #363636;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon:hover {
  border-color: #2685e4;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>