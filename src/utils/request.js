// 进行二次封装axios
import axios from 'axios'
import router from '@/router'
import Notify from '@/ui/Notify'
import { getToken, removeToken, setToken } from '@/utils/token.js'
import { updateTokenAPI } from '@/api'
const request = axios.create({
    baseURL: 'http://geek.itheima.net/',
    timeout: 180000
})

// 请求拦截器
request.interceptors.request.use(config => {
    // 请求之前做一些事
    // 携带token
    if (getToken() && config.headers.Authorization === undefined) {
        config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
}, err => {
    return Promise.reject(err)
})


// 响应拦截器
request.interceptors.response.use(response => {
    // 响应之前做一些事
    return response
}, async err => {
    // 当状态码为4xx或5xx时进入
    if (err.response && err.response.status === 401) {
        // 代表用户身份过期
        // 不能用this.$router(这里的this是undefined)

        // 方式一：token过期 提示用户重新登录
        // Notify({ type: 'warning', message: '身份已过期，需重新登录' })
        // removeToken() // 先清空token 才能让全局路由守卫放我去login页
        // router.replace('/login')

        // 方式二：token过期 自动更新token
        let res = await updateTokenAPI()
        // 更新新的token
        setToken(res.data.data.token)
        err.config.headers.Authorization = `Bearer ${res.data.data.token}`
        return request(err.config)
    } else if (err.response && err.response.status === 500 && err.response.data.message == 'refresh_token失效') {
        Notify({ type: 'warning', message: '身份已过期，需重新登录' })
        localStorage.clear()
        router.replace('/login')
    }
    // if (err.response && err.response.data.message === 'token超时或者未传token') {
    //     // 方式一：token过期 提示用户重新登录
    //     Notify({ type: 'warning', message: '身份已过期，需重新登录' })
    //     removeToken() // 先清空token 才能让全局路由守卫放我去login页
    //     router.replace(`/login?path=${router.currentRoute.fullPath}`)
    // }
    return Promise.reject(err)
})



// export default request
export default ({ url, method = 'get', params = {}, data = {}, headers = {} }) => {
    return request({
        url,
        method,
        params,
        data,
        headers
    })
}