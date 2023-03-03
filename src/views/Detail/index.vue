<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <!-- 加载效果 -->
    <van-loading size="24px" vertical color="#0094ff" v-if="Object.keys(artObj).length == 0">加载中...</van-loading>

    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{artObj.title}}</h1>

        <!-- 用户信息 -->
        <van-cell center :title="artObj.aut_name" :label="formatTime(artObj.pubdate)">
          <template #icon>
            <img :src="artObj.aut_photo" alt="" class="avatar">
          </template>
          <template #default>
            <div>
              <van-button type="info" size="mini" v-if="artObj.is_followed === true" @click="followedFn('已关注')">已关注
              </van-button>
              <van-button icon="plus" type="info" size="mini" plain v-else @click="followedFn('关注')">关注</van-button>
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="artObj.content"></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <div class="like-box">
          <!-- attitude 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞 -->
          <van-button icon="good-job" type="danger" size="small" v-if="artObj.attitude === 1"
            @click="likeArticle('已点赞')">
            已点赞</van-button>
          <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="likeArticle('点赞')">点赞
          </van-button>
        </div>
      </div>
      <!-- 评论区域 -->
      <CommentList />
    </div>

  </div>
</template>
  
<script>
import CommentList from './CommentList.vue'
import { timeAgo } from 'myh_hmtt'
import { detailAPI, followTheAuthorAPI, unFollowTheAuthorAPI, likeArticleAPI, unLikeArticleAPI } from '@/api'
export default {
  name: 'Detail',
  components: { CommentList },
  data() {
    return {
      artObj: {}
    }
  },
  async created() {
    let res = await detailAPI(this.$route.query.art_id)
    this.artObj = res.data.data
  },
  methods: {
    // 格式化时间的函数
    formatTime: timeAgo,
    // 点击关注或已关注按钮
    async followedFn(str) {
      if (str === '已关注') {
        // 点的是已关注 证明我要取关 调取关的接口，点完之后页面显示 关注 按钮
        this.artObj.is_followed = false
        await unFollowTheAuthorAPI(this.artObj.aut_id)
      } else {
        // 点的是关注 证明我要关注作者 调关注的接口，点完之后页面显示 已关注 按钮
        this.artObj.is_followed = true
        await followTheAuthorAPI(this.artObj.aut_id)
      }
    },
    // 对文章点赞或取消点赞
    async likeArticle(str) {
      if (str === '已点赞') {
        // 我点了已点赞按钮 证明我要取消点赞
        this.artObj.attitude = -1
        await unLikeArticleAPI(this.artObj.art_id)
      } else {
        this.artObj.attitude = 1
        await likeArticleAPI(this.artObj.art_id)
      }
    }
  },
}
</script>
  
  <style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
.van-loading {
  text-align: center;
  padding-top: 46px;
}
</style>