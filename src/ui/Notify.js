// 这个是封装的弹出框的ui
// 作用：Notify弹出框和Toast轻提示来回方便的切换
// import { Notify } from 'vant'
// export default Notify


import { Toast } from 'vant'
export default ({ type, message }) => {
    if (type === 'danger') {
        type = 'fail'
    }
    Toast({
        type,
        message
    })
}