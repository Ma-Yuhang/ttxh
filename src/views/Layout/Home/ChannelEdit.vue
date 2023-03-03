<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="closePopup" />
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            点击{{isEdit ? '删除':'进入'}}频道
          </span>
        </span>
        <span @click="edit">{{isEdit ? '完成':'编辑'}}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" @click="myChannelsfn(userChannel)" v-for="userChannel in userChannelsList"
          :key="userChannel.id">
          <div class="channel-item van-hairline--surround">
            {{userChannel.name}}
            <!-- 删除的徽标 -->
            <van-badge v-show="isEdit && userChannel.id !== 0" color="transparent" class="cross-badge">
              <template #content>
                <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="0.32rem" />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" @click="addChannel(unCheckChannel)" v-for="unCheckChannel in unCheckChannelsList"
          :key="unCheckChannel.id">
          <div class="channel-item van-hairline--surround">{{unCheckChannel.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
  
<script>
export default {
  props: ['userChannelsList', 'unCheckChannelsList'],
  data() {
    return {
      isEdit: false
    }
  },
  methods: {
    // 点击编辑按钮
    edit() {
      this.isEdit = !this.isEdit
    },
    // 添加频道的方法(props中的值只允许接收，不能修改，所以要把添加的频道传给父组件，让父组件去修改)
    addChannel(channel) {
      // 只有处于编辑状态点击才能添加
      if (this.isEdit) {
        this.$emit('addChannel', channel)
      }
    },
    // 给我的频道里边的频道添加点击事件
    myChannelsfn(channel) {
      if (this.isEdit) {
        // 不能删除推荐频道
        if (channel.id !== 0) {
          this.$emit('removeMyChannel', channel)
        }
      } else {
        // 点击进入频道
        this.$emit('closeFn')
        this.$emit('enterChannel', channel.id)
      }
    },
    // 关闭弹出层
    closePopup() {
      this.$emit('closeFn')
      setTimeout(() => {
        this.isEdit = false
      }, 500);
    }
  },
}
</script>
  
  <style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>