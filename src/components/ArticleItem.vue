<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{article.title}}</span>
          <!-- 单图 -->
          <img v-if="article.cover.type === 1" class="thumb" v-lazy="article.cover.images[0]" alt="">
        </div>
        <!-- 多图位置 -->
        <div class="thumb-box" v-if="article.cover.type > 1">
          <img v-for="(imgUrl,index) in article.cover.images" :key="index" class="thumb" v-lazy="imgUrl">
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{article.aut_name}}</span>
            <span>{{article.comm_count}}评论</span>
            <span>{{formatTime(article.pubdate)}}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show=true" v-if="isShow" />

        </div>
      </template>
    </van-cell>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" get-container="body"
      :cancel-text="bottomText" @cancel="onCancel" @closed="onClosed" />
  </div>
</template>
  
<script>
import { timeAgo } from 'myh_hmtt'
import { firstActions, secondActions } from '@/api/report.js'
export default {
  name: '',
  props: {
    article: Object,
    isShow: {
      type: Boolean,
      default: true // 默认为true
    }
  },
  data() {
    return {
      show: false,
      actions: firstActions,
      // 底部按钮的文字
      bottomText: '取消',
    }
  },
  methods: {
    // 格式化时间的函数
    formatTime: timeAgo,
    // 点击选项时触发
    onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起

      if (item.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (item.name === '不感兴趣') {
        this.$emit('dislikeArticle', this.article.art_id)
        this.show = false
      } else {
        console.log(item.name);
        this.$emit('reportArticle', this.article.art_id, item.value)
        this.show = false
      }
    },
    // 点击取消(返回)按钮时触发
    onCancel() {
      if (this.bottomText == '返回') {
        this.show = true
        this.actions = firstActions
        this.bottomText = '取消'
      }

    },
    // 当遮罩层关闭后且动画结束后触发(只要是关闭了遮罩层都会触发)
    onClosed() {
      // 触发方式：1.点击遮罩层触发 2.点击某个选项触发 3.点击取消按钮触发
      this.actions = firstActions
      this.bottomText = '取消'
    }
  },
}
</script>
  
  <style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>