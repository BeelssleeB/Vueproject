<template>
  <div>
    <div class="test">
      <el-input style="width: 350px;margin-right: 10px" placeholder="请输入消息" v-model="msg" clearable></el-input>
      <el-button type="primary" @click="initWebSocket">打开WebSocket连接</el-button>
      <el-button type="primary" @click="send">发送消息</el-button>
      <el-button type="info" @click="websock.close()">关闭WebSocket连接</el-button>
      <el-button type="info" @click="clear">清空</el-button>
    </div>
    <hr />
    <div v-html="infomation"></div>
  </div>
</template>

<script>
export default {
  name: "WebSocket",
  data() {
    return {
      websock: null,
      msg: "",
      infomation: ""
    };
  },
  created() {
    // 页面创建生命周期函数
    this.initWebSocket();
  },
  destroyed() {
    // 离开页面生命周期函数
    this.websocketclose();
  },
  methods: {
    initWebSocket() {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      if ("WebSocket" in window) {
        this.websock = new WebSocket("ws://localhost:8081/webSocket/1");
      } else {
        this.$message.error("当前浏览器不支持WebSocket");
        return false;
      }
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log("WebSocket连接成功");
      this.setMessageInnerHTML("WebSocket连接成功");
    },
    websocketonerror(e) {
      console.log("WebSocket连接发生错误");
      this.setMessageInnerHTML("WebSocket连接发生错误");
    },
    websocketonmessage(e) {
      this.setMessageInnerHTML(e.data);
    },
    websocketclose() {
      console.log("WebSocket连接关闭");
      this.setMessageInnerHTML("WebSocket连接关闭");
    },
    // 发送消息
    clear() {
      this.infomation = "";
    },
    send() {
      if (this.msg.length > 0) {
        var json = {
          cid: 1, //自己
          message: this.msg
        };
        this.websock.send(JSON.stringify(json));
      } else {
        this.$message({
          message: "请输入发送内容",
          type: "warning"
        });
        return false;
      }
    },
    // 将消息显示在网页上
    setMessageInnerHTML(innerHTML) {
      this.infomation += innerHTML + "<br/>";
    }
  }
};
</script>

<style scoped>
.test {
  margin-top: 10px;
}
</style>

