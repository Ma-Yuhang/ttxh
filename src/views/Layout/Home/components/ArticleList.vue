<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功">
      <van-list v-model="loading" offset="50" :finished="finished" finished-text="没有更多了" @load="onLoad"
        :immediate-check="false">
        <ArticleItem v-for="article in list" :key="article.art_id" :article="article" @dislikeArticle="dislikeArticle"
          @reportArticle="reportArticle" @click.native="toDatailPage(article)">
        </ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Notify from '@/ui/Notify'
import ArticleItem from '../../../../components/ArticleItem.vue';
import { getAllArticleListAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: ['channelId'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      // 请求更多数据的时间戳
      theDate: new Date().getTime(),
      // 下拉刷新
      isLoading: false
    }
  },
  created() {
    // 第一次请求数据
    this.getList()

  },
  methods: {
    // 请求列表数据的方法(第一次和下拉加载)
    async getList() {
      let res = await getAllArticleListAPI({ channel_id: this.channelId, timestamp: this.theDate })
      // 合并数据
      this.list = [...this.list, ...res.data.data.results]

      // 更新时间戳
      this.theDate = res.data.data.pre_timestamp
      // 当页数据加载完成
      this.loading = false
      // 判断如果数据全部请求完毕后 finished = true代表加载完成
      // 当没有时间戳的时候代表没有数据了
      if (res.data.data.pre_timestamp === null) {
        // 全部数据加载完成
        this.finished = true
      }
    },
    // 下拉加载更多
    onLoad() {
      // :immediate-check="false" 监听滚动事件的代码还在
      // 在首页中第一个频道一上来确实不会执行onLoad事件，但是如果滚动第一个频道页面后，这时切换到其他频道，会自动滚动到页面顶部
      // 这时:immediate-check="false"无效 滚动事件还是会触发 所以在首页切换的时候 if添加必须加
      if (this.list.length === 0) {
        this.loading = false // 第一次上面还是判定触底(触发onLoad方法时loading自动改true)
        // 如果不改回来, 下次触底就不在执行onLoad方法
        return // 如果页面没有数据, 没有高度, 让本次onLoad逻辑代码不往下执行
      }
      this.getList()
    },
    // 上拉刷新
    onRefresh() {
      // 清空数据
      this.list = []
      this.theDate = new Date().getTime()
      this.getList()
      this.isLoading = false
    },
    // 收到子组件传过来的不感兴趣的文章id
    async dislikeArticle(id) {
      await dislikeArticleAPI(id)
      Notify({ type: 'success', message: '反馈成功' });
    },
    // 举报文章的方法
    async reportArticle(id, type) {
      await reportArticleAPI(id, type)
      Notify({ type: 'success', message: '举报成功' });
    },
    // 去详情页
    toDatailPage(article) {
      this.$router.push(`/detail?art_id=${article.art_id}`)
    }
  }
}
</script>

<style>
</style>