<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
    </div>
    <!-- 文章列表 -->
    <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
      <ArticleItem v-for="item in list" :key="item.art_id" :article="item" :isShow="false"></ArticleItem>
    </van-list>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem'
import { searchResultAPI } from '@/api'
export default {
  name: 'SearchResult',
  components: { ArticleItem },
  data() {
    return {
      kw: this.$route.params.kw,
      page: 1, // 当前页码
      per_page: 10, // 一页展示多少条数据
      // 文章列表的数据
      list: [],
      // 是否处于加载
      loading: false,
      // 所有数据是否加载完了
      finished: false
    }
  },
  async created() {
    // 发请求
    this.getList()
  },
  methods: {
    // 请求文章数据的方法
    async getList() {
      let res = await searchResultAPI(this.page, this.per_page, this.kw)
      if (res.data.data.results.length === 0) {
        this.finished = true
        return
      }
      this.list = [...this.list, ...res.data.data.results]
      this.loading = false
    },
    onLoad() {
      if (this.list.length > 0) {
        this.page++
        this.getList()
      } else {
        this.loading = false
      }

    }
  },
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>