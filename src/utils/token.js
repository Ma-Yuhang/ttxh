// 此文件封装3个方法来操作token

const key = 'geek-itheima'

// 设置token
export const setToken = (token) => {
    localStorage.setItem(key, token)
}
// 获取token
export const getToken = () => {
    return localStorage.getItem(key)
}
// 删除Token
export const removeToken = () => {
    localStorage.removeItem(key)
}