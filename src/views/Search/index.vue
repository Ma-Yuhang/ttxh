<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
      <!-- 搜索组件 v-focus是自定义全局指令，用来自动获取焦点 -->
      <van-search v-focus placeholder="请输入搜索关键词" v-model.trim="kw" @input="inputFn" background="#007BFF" shape="round"
        @search="searchFn" />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <!-- v-html显示文本内容，并且带标签样式 -->
      <div class="sugg-item" v-for="(suggest,index) in suggestList" :key="index" v-html="lightFn(suggest)"
        @click="suggestClickFn(suggest)">
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clear" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" @click="historyClickFn(item)" v-for="(item,index) in history"
          :key="index">{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api'
export default {
  data() {
    return {
      kw: '', // 搜索关键字
      timer: null,
      suggestList: [],
      history: [...new Set(JSON.parse(localStorage.getItem('his')))] || [] // 搜索历史
    }
  },
  methods: {
    // 搜索框内容发生改变
    async inputFn() {
      if (this.timer) clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          let res = await suggestListAPI(this.kw)
          this.suggestList = res.data.data.options
        }, 300);
      }
    },
    // 关键字高亮显示
    lightFn(suggest) {
      if (!suggest) return
      // 如果要使用变量作为正则匹配的条件，不能使用语法糖写法
      const reg = new RegExp(this.kw, 'ig') // i表示忽略大小写 g全局匹配 
      // 替换后的变量不能用this.kw
      // 例如搜索框输入java，联想回来JAVA，Java,都会被替换成java 这不是我们想要的
      // 我们想要的是：输入java，能匹配到Java，JAVA等,然后变红，而且值还要是匹配到的Java，JAVA
      return suggest.replace(reg, (match) => {
        // match是匹配到的原字符串的那个值，用人家原来的，我们只不过是加个红色
        return `<span style="color:red;">${match}</span>`
      })
    },
    // 确定搜索时的方法
    searchFn() {
      if (this.kw.trim()) {
        this.history.push(this.kw)
        setTimeout(() => {
          this.$router.push(`/search/${this.kw}`)
        }, 0);
      }
    },
    // 建议列表的点击事件
    suggestClickFn(suggest) {
      this.history.push(suggest)
      this.$router.push(`/search/${suggest}`)
    },
    // 历史搜索的点击事件
    historyClickFn(item) {
      this.$router.push(`/search/${item}`)
    },
    clear() {
      this.history = []
    }
  },
  watch: {
    history() {
      localStorage.setItem('his', JSON.stringify(this.history))
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>