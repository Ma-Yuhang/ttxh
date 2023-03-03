<template>
  <div>
    <van-nav-bar title="今日头条" />
    <van-form @submit="onSubmit">
      <van-field required v-model="user.mobile" name="mobile" label="手机号" placeholder="请输入11位手机号"
        :rules="[{ required: true, message: '手机号格式不正确',pattern:/^1[3-9]\d{9}$/ }]" />
      <van-field required v-model="user.code" type="password" name="code" label="密码" placeholder="请输入6位密码"
        :rules="[{ required: true, message: '密码格式不正确',pattern:/^\d{6}$/ }]" />
      <div style="margin: 16px;">
        <van-button round block type="info" :loading="isLoading" :disabled="isLoading" native-type="submit"
          loading-text="登录中...">登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
// 引入消息通知
import Notify from '@/ui/Notify';
import { setToken } from '@/utils/token.js'
export default {
  name: 'Login',
  data() {
    return {
      user: {
        mobile: '19883315871', // 手机号
        code: '246810' // 验证码(246810)
      },
      // loading效果
      isLoading: false,
    };
  },
  methods: {
    async onSubmit(values) {
      this.isLoading = true
      try {
        let res = await loginAPI(values)
        // 向本地存储中持久化token
        setToken(res.data.data.token)
        localStorage.setItem('refresh_token', res.data.data.refresh_token)
        Notify({ type: 'success', message: '登录成功' });
        this.$router.replace({ path: this.$route.query.path || '/layout/home' })
      } catch (error) {
        Notify({ type: 'danger', message: '手机号或密码错误！' });
      }
      this.isLoading = false
    },
  },
}
</script>

