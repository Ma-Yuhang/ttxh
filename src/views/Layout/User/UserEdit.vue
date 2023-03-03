<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="profileObj.photo" @click="clickImg" />
          <!-- file 选择框 -->
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="profileObj.name" @click="updateName" />
      <van-cell title="生日" is-link :value="profileObj.birthday" @click="updateBirthday" />
    </van-cell-group>

    <van-dialog v-model="showName" title="修改名称" show-cancel-button :before-close="beforeNameClose">
      <input type="text" v-focus v-model="name" placeholder="名字长度最多11位哦~">
    </van-dialog>
    <van-action-sheet v-model="showBirthday">
      <van-datetime-picker v-model="birthday" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate"
        @cancel="showBirthday = false" @confirm="dateConfirm" />
    </van-action-sheet>
  </div>
</template>
  
<script>
import { formatDate } from 'myh_hmtt'
import { getProfileAPI, updatePhotoAPI, updateUserInfoAPI } from '@/api'
import Notify from '@/ui/Notify';
export default {
  name: 'UserEdit',
  data() {
    return {
      // 个人资料(头像，名称，生日)
      profileObj: {},
      // 控制名称弹出框
      showName: false,
      // 控制生日弹出框
      showBirthday: false,
      name: '',
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      birthday: null
    }
  },
  async created() {
    let res = await getProfileAPI()
    this.profileObj = res.data.data

  },
  methods: {
    // 点击图片
    clickImg() {
      // 相当于点击了选择文件
      this.$refs.iptFile.click()
    },
    // 当文件发生改变时触发
    async onFileChange(e) {
      // 如果用户没选择图片
      if (!e.target.files[0]) return
      // e.target.files[0]就是那个你选择的图片
      const fd = new FormData()
      fd.append('photo', e.target.files[0])
      let res = await updatePhotoAPI(fd)
      this.profileObj.photo = res.data.data.photo
      this.$store.commit('SET_PHOTO', res.data.data.photo)
    },
    // 点击修改名称触发
    updateName() {
      this.showName = true
      this.name = this.profileObj.name
    },
    // 名称弹出框关闭之前的回调
    async beforeNameClose(action, done) {
      if (action === 'confirm') {
        // 点击的是确定
        let reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,11}$/
        if (reg.test(this.name)) {
          // 如果通过了校验
          await updateUserInfoAPI({ name: this.name })
          this.profileObj.name = this.name
          done()
        } else {
          Notify({ type: 'warning', message: '请输入1-11位中英数字名称' })
          done(false)
        }
      } else {
        done()
      }
    },
    // 点击修改生日触发
    updateBirthday() {
      this.showBirthday = true
      this.birthday = new Date(this.profileObj.birthday)
    },
    // 生日确定更改的回调
    async dateConfirm() {
      await updateUserInfoAPI({ birthday: formatDate(this.birthday) })
      this.profileObj.birthday = formatDate(this.birthday)
      this.showBirthday = false
    }
  }
}
</script>
  
<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/.van-dialog__content {
  text-align: center;
  input {
    border: none;
    outline: none;
    text-align: center;
    padding: 20px 0;
  }
}
</style>