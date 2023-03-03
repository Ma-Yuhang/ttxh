// 引入二次封装的axios
import request from '../utils/request'

// 登录页面登录的接口(携带手机号和密码)
export const loginAPI = (data) => {
    return request({ url: '/v1_0/authorizations', method: 'post', data })
}

// 获取用户的频道列表(若没登录则返回默认的频道)
export const getUserChannelsAPI = () => {
    return request({
        url: '/v1_0/user/channels',
        method: 'get',
    })
}

// 获取文章列表(query参数写在params中)
export const getAllArticleListAPI = ({ channel_id, timestamp }) => {
    return request({
        url: '/v1_0/articles',
        method: 'get',
        params: {
            channel_id,
            timestamp
        }
    })
}

// 反馈对文章不感兴趣的接口
export const dislikeArticleAPI = (id) => {
    return request({
        url: '/v1_0/article/dislikes',
        method: 'post',
        data: {
            target: id
        },
    })
}

// 举报文章的接口
export const reportArticleAPI = (id, type) => {
    return request({
        url: '/v1_0/article/reports',
        method: 'post',
        data: {
            target: id,
            type: type,
            remark: '说明'
        },
    })
}

// 获取全部的频道列表
export const getAllChannelsAPI = () => {
    return request({ url: '/v1_0/channels', method: 'get' })
}

// 更新频道的列表
export const updateChannelsAPI = (channels) => {
    return request({ url: '/v1_0/user/channels', method: 'put', data: channels })
}

// 删除用户指定的频道
export const removeChannelsAPI = (id) => {
    return request({ url: `/v1_0/user/channels/${id}`, method: 'delete' })
}

// 搜索的联想菜单(接口有问题，3分钟才返回结果)
export const suggestListAPI = (keywords) => {
    return request({ url: `/v1_0/suggestion`, method: 'get', params: { q: keywords } })
}

// 获取搜索结果的接口(接口有问题，3分钟才返回结果)
export const searchResultAPI = (page = 1, per_page = 10, q) => {
    return request({ url: `/v1_0/search`, method: 'get', params: { page, per_page, q } })
}

// 获取文章详情页的接口
export const detailAPI = (art_id) => {
    return request({ url: `/v1_0/articles/${art_id}`, method: 'get' })
}

// 关注作者的接口
export const followTheAuthorAPI = (target) => {
    return request({ url: `/v1_0/user/followings`, method: 'post', data: { target } })
}

// 取消关注作者的接口
export const unFollowTheAuthorAPI = (target) => {
    return request({ url: `/v1_0/user/followings/${target}`, method: 'delete' })
}

// 点赞文章的接口
export const likeArticleAPI = (target) => {
    return request({ url: `/v1_0/article/likings`, method: 'post', data: { target } })
}

// 取消点赞的接口
export const unLikeArticleAPI = (target) => {
    return request({ url: `/v1_0/article/likings/${target}`, method: 'delete' })
}

// 获取文章评论的数据
export const commentsListAPI = (source, offset = null, limit = 10) => {
    return request({
        url: `/v1_0/comments`,
        method: 'get',
        params: {
            type: 'a',
            source,
            offset,
            limit
        }
    })
}

// 对评论进行点赞的接口
export const likeCommentAPI = (target) => {
    return request({ url: '/v1_0/comment/likings', method: 'post', data: { target } })
}

// 对评论取消点赞点赞的接口
export const unLikeCommentAPI = (target) => {
    return request({ url: `/v1_0/comment/likings/${target}`, method: 'delete' })
}

// 对文章进行评论的接口
export const publishCommentAPI = (target, content) => {
    return request({ url: `/v1_0/comments`, method: 'post', data: { target, content } })
}

// 获取用户的信息(默认get请求可以不写)
export const getUserInfoAPI = () => {
    return request({ url: '/v1_0/user' })
}

// 获取用户的个人资料(编辑页面使用)
export const getProfileAPI = () => {
    return request({ url: '/v1_0/user/profile' })
}

// 上传用户图片的接口
export const updatePhotoAPI = (formData) => {
    return request({ url: '/v1_0/user/photo', method: 'patch', data: formData })
}

// 更新用户的资料的接口
export const updateUserInfoAPI = (data) => {
    return request({ url: '/v1_0/user/profile', method: 'patch', data })
}

// 刷新token
export const updateTokenAPI = () => {
    return request({
        url: '/v1_0/authorizations',
        method: 'put',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
        }
    })
}