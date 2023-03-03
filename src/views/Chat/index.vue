<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(obj,index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="obj.name === 'xs'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{obj.msg}}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{obj.msg}}</div>
          <van-image fit="cover" round :src="photo" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field placeholder="说点什么..." v-model="word">
        <template #button>
          <span style="font-size:12px;color:#999" @click="sendFn">发送</span>
        </template>
      </van-field>
    </div>
  </div>
</template>
  
<script>
import { io } from 'socket.io-client'
import { getToken } from '../../utils/token';
export default {
  name: 'Chat',
  data() {
    return {
      // 用户的头像
      photo: '',
      word: '', // 输入框的内容
      // 所有的聊天消息
      list: [
        // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
        // { name: 'xs', msg: 'hi，你好！我是小思' },
        // { name: 'me', msg: '我是编程小王子' },
      ]
    }
  },
  created() {
    this.photo = this.$store.state.photo
    // 注意：io是建立连接，跟axios（ajax）没关系
    this.socket = io('ws://geek.itheima.net', {
      query: {
        token: getToken()
      },
      transports: ['websocket']
    })
    // 测试连接是否建立
    this.socket.on('connect', () => {
      // 如果连接建立 就打招呼
      this.list.push({
        name: 'xs',
        msg: `hi，你好！我是小思`
      })
    })
    this.socket.on('message', (obj) => {
      // obj是后台返回的对象
      this.list.push({
        name: 'xs',
        msg: obj.msg
      })
    })
  },
  methods: {
    // 发送消息
    sendFn() {
      if (this.word.trim().length == 0) return
      this.socket.emit('message', {
        msg: this.word,
        timestamp: Date.now()
      })
      this.list.push({
        name: 'me',
        msg: this.word
      })
      this.word = ''
    }
  },
  watch: {
    // 监听list数组的变化
    list() {
      this.$nextTick(() => {
        // 让最后一个div缓慢的滚动到屏幕中
        let lastDiv = document.querySelector('.chat-list>div:last-child')
        lastDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
    }
  },
  beforeDestroy() {
    this.socket.close()
    this.socket = null
  }
}
</script>
  
<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>