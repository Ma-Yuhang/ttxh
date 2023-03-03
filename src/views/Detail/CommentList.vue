<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list" :class="{'art-cmt-container-1':isShow,'art-cmt-container-2':!isShow}">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="comment in commentsList" :key="comment.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="comment.aut_photo" alt="" class="avatar">
              <span class="uname">{{comment.aut_name}}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="comment.is_liking === true"
                @click="likeComment(comment,'取消点赞')" />
              <van-icon name="like-o" size="16" color="gray" v-else @click="likeComment(comment)" />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{comment.content}}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{formatDate(comment.pubdate)}}</div>
        </div>
      </van-list>
    </div>
    <div>
      <!-- 底部添加评论区域 - 低的 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShow">
        <van-icon name="arrow-left" size="0.48rem" @click="beforeCommit" />
        <div class="ipt-cmt-div" @click="beforeCommit">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
            <van-icon name="comment-o" size="0.53333334rem" @click="clickComment" />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 高的 -->
      <div class="cmt-box van-hairline--top" v-else>
        <!--   -->
        <textarea placeholder="友善评论、理性发言、阳光心灵" @blur="onBlur" v-focus v-model.trim="content"></textarea>
        <van-button type="default" :disabled="!content" @click="publish">发布</van-button>
      </div>
    </div>
  </div>
</template>
  
<script>
import { timeAgo } from 'myh_hmtt'
import { commentsListAPI, likeCommentAPI, unLikeCommentAPI, publishCommentAPI } from '@/api'
export default {
  name: 'CommentList',
  data() {
    return {
      // 文章的id
      source: this.$route.query.art_id,
      // 不传默认第一页
      offset: null,
      // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      limit: 10,
      // 请求回来的评论列表
      commentsList: [],
      // 评论的总数
      totalCount: 0,
      isShow: true,
      // 评论的内容
      content: '',
      loading: false,
      finished: false
    }
  },
  created() {
    this.getCommentsList()
  },
  methods: {
    formatDate: timeAgo,
    // 请求评论列表的数据
    async getCommentsList() {
      let res = await commentsListAPI(this.source, this.offset, this.limit)
      this.commentsList = [...this.commentsList, ...res.data.data.results]
      if (this.commentsList.length === 0) {
        this.finished = true
        return
      }
      // 存储评论的总数
      this.totalCount = res.data.data.total_count
      this.offset = res.data.data.last_id
      if (res.data.data.last_id === null) {
        this.finished = true
      }
      this.loading = false
    },
    // 对评论点赞或取消点赞的方法
    async likeComment(comment, str) {
      if (str === '取消点赞') {
        // 我点了小红心 证明我要取消点赞 显示空心
        comment.is_liking = false
        await unLikeCommentAPI(comment.com_id)
      } else {
        comment.is_liking = true
        await likeCommentAPI(comment.com_id)
      }
    },
    // 点击评论 显示高的评论盒子
    beforeCommit() {
      this.isShow = false
    },
    // textarea失去焦点
    onBlur() {
      setTimeout(() => {
        this.isShow = true
      }, 0)
    },
    // 点击评论icon图标，将第一条评论显示在页面最上面
    clickComment() {
      // const h = document.querySelector('.article-container').scrollHeight
      // window.scrollTo(0, h)
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布评论
    async publish() {
      let res = await publishCommentAPI(this.source, this.content)
      this.commentsList.unshift(res.data.data.new_obj)
      // 清空文本域内容
      this.content = ''
      this.totalCount++
      // 显示矮的文本框
      this.isShow = true
      // 滚动到第一条评论
      this.clickComment()
    },
    // 加载更多
    async onLoad() {
      if (this.commentsList.length === 0) {
        this.loading = false
        return
      }
      this.getCommentsList()
    }
  },
}
</script>
  
<style scoped lang="less">
.cmt-list {
  padding: 20px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>