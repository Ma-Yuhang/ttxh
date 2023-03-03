// 因为我将date.js和theFocus上传到npm了，然后npm i myh_hmtt
// 这里使用myh_hmtt包

// 自动获取焦点的插件
// const theFocus = {
//     install(Vue) {
//         Vue.directive('focus', {
//             // 指令所在标签被插入到真实DOM时才触发，如果标签用display：none隐藏才出现，是不会触发inserted的
//             inserted(el) {
//                 if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
//                     el.focus()
//                 } else {
//                     const theInput = el.querySelector('input')
//                     const theTextarea = el.querySelector('textares')
//                     if (theInput) theInput.focus()
//                     if (theTextarea) theTextarea.focus()
//                 }
//             },
//             // 指令所在标签更新时触发
//             update(el) {
//                 if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
//                     el.focus()
//                 } else {
//                     const theInput = el.querySelector('input')
//                     const theTextarea = el.querySelector('textares')
//                     if (theInput) theInput.focus()
//                     if (theTextarea) theTextarea.focus()
//                 }
//             },
//         })
//     }
// }

// export default theFocus