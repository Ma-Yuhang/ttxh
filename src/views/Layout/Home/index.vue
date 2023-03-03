<template>
  <div>
    <van-nav-bar title="头条新闻" fixed>
      <template v-slot:left>
        <div class="logoo">
          <img src="@/assets/logo2.png" alt="" style="height:0.5333rem">
        </div>
      </template>
      <template #right>
        <van-icon name="search" size="0.48rem" @click="moveSearchPage" />
      </template>
    </van-nav-bar>
    <!-- @change="channelChangeFn"  -->
    <van-tabs v-model="channelId" animated sticky offset-top="1.22667rem" @change="channelChangeFn">
      <van-tab :title="channel.name" :name="channel.id" v-for="channel in userChannelsList" :key="channel.id">
        <!-- 将文章列表数据传给子组件ArticleList -->
        <ArticleList :channelId="channelId" />
      </van-tab>
    </van-tabs>
    <!-- 编辑频道图标 -->
    <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="plus" />
    <!-- 频道弹出层 -->
    <van-popup v-model="show" class="channel_popup" get-container="body">
      <ChannelEdit :userChannelsList="userChannelsList" :unCheckChannelsList="unCheckChannelsList"
        @addChannel="addChannel" @removeMyChannel="removeMyChannel" @closeFn="closeFn" @enterChannel="enterChannel" />
    </van-popup>
  </div>
</template>

<script>
import ChannelEdit from './ChannelEdit'
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelsAPI, removeChannelsAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
export default {
  name: 'Home',
  components: { ArticleList, ChannelEdit },
  data() {
    return {
      // 展示tab(跟id关联)
      channelId: 0,
      // 用户选择的频道列表
      userChannelsList: [],
      // 所有的频道列表
      allChannelsList: [],
      channelScrollTObj: {}, // 保存每个频道的滚动位置
      // 弹出层的展示
      show: false,
      timer: null
    };
  },
  async created() {
    // 请求用户频道的方法
    try {
      let res = await getUserChannelsAPI()
      this.userChannelsList = res.data.data.channels
    } catch (error) {
      alert(error.message)
    }
    // 请求所有的频道列表
    let res = await getAllChannelsAPI()
    this.allChannelsList = res.data.data.channels
  },
  methods: {
    channelChangeFn() {
      // tab切换后, 设置滚动条位置
      // tab切换时, 这个组件内部, 会把切走的容器height设置为0, 滚动条因为没有高度回到了顶部
      // 切回来的一瞬间, 没有高度, 滚动事件从底下上来也被触发了, 所以才把数据里设置为0
      // 切换来的一瞬间, 高度为0, 你设置滚动位置也无用
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollTObj[this.channelId]
        // document.body.scrollTop = this.channelScrollTObj[this.channelId]
      })
    },
    // 点击小+号，展示弹出层
    plus() {
      this.show = true
    },
    // 添加频道
    async addChannel(channel) {
      this.userChannelsList.push(channel)
      let newArr = this.userChannelsList.filter(item => item.id !== 0)
      let newArr2 = newArr.map((item, index) => {
        // 一层结构为深拷贝
        const obj = { ...item }
        delete obj.name
        obj.seq = index
        return obj
      })
      await updateChannelsAPI({ channels: newArr2 })
    },
    // 删除我的频道里的频道的方法
    async removeMyChannel(channel) {
      let index = this.userChannelsList.findIndex(item => item.id === channel.id)
      this.userChannelsList.splice(index, 1)
      await removeChannelsAPI(channel.id)
    },
    // 关闭弹出层
    closeFn() {
      this.show = false
      // this.$refs.edit.isEdit = true
    },
    // 不处于编辑状态 进入频道
    enterChannel(id) {
      this.channelId = id
    },
    // 点击放大镜按钮 跳转到search路由
    moveSearchPage() {
      this.$router.push('/search')
    },
    // 保存滚动条位置的方法
    scrollFn() {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 保存路由切换时的滚动位置
        this.$route.meta.scrollT = document.documentElement.scrollTop
        // 保存tab栏切换时的滚动位置(此时并没切换路由)
        // 这时候切换tab栏时，tab的id在不断变化
        this.channelScrollTObj[this.channelId] = document.documentElement.scrollTop
      }, 200);
    }
  },
  computed: {
    // 计算出除了用户选择的剩余频道
    unCheckChannelsList() {
      const { userChannelsList, allChannelsList } = this
      return allChannelsList.filter(bigObj => {
        let index = userChannelsList.findIndex(smallObj => {
          return bigObj.id === smallObj.id
        })
        // 找到了的不要
        if (index > -1) {
          return false
        } else {
          // 没找到的返回
          return true
        }
      })
    }
  },
  activated() {
    window.addEventListener('scroll', this.scrollFn)
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated() {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped lang="less">
.logoo {
  width: 30px;
  height: 20px;
  overflow: hidden;
}
.van-tabs {
  margin-top: 46px;
}
// 设置 tabs 容器的样式
// 深度选择器
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.channel_popup {
  width: 100vw;
  height: 100vh;
}
</style>