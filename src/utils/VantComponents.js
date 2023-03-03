// 统一管理vant组件库
import Vue from 'vue'
import {
    NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh,
    ActionSheet, Popup, Row, Col, Badge, Search, Divider, Tag, CellGroup, Image, Dialog, DatetimePicker,
    Loading, Lazyload
} from 'vant';

Vue.use(Lazyload, {
    error: './assets/logo2.png'
}); // 图片的懒加载
Vue.use(Loading); // 加载效果
Vue.use(DatetimePicker);
Vue.use(Dialog); // 弹出框
Vue.use(Tag) // 标签
Vue.use(Image) // 图片
Vue.use(CellGroup) // Cell 可以单独使用，也可以与 CellGroup 搭配使用，CellGroup 可以为 Cell 提供上下外边框。
Vue.use(Divider) // 分割线
Vue.use(Search); // 搜索框
Vue.use(Popup); // 弹出层
Vue.use(Badge); // 删除的徽标
Vue.use(Col); // Layout 提供了 van-row 和 van-col 两个组件来进行行列布局。
Vue.use(Row); // Layout 提供了 van-row 和 van-col 两个组件来进行行列布局。
Vue.use(ActionSheet); // 底部弹出动作面板
Vue.use(PullRefresh); // List 组件可以与 PullRefresh 组件结合使用，实现下拉刷新的效果
Vue.use(List); // 列表
Vue.use(Tab); // 标签页里的每一个
Vue.use(Tabs); // 标签页
Vue.use(Tabbar); // 底部标签栏
Vue.use(TabbarItem); // 标签栏里的每一个
Vue.use(Form); // 表单
Vue.use(Field); // 输入框
Vue.use(NavBar); // 导航栏
Vue.use(Button); // 按钮
Vue.use(Icon); // 字体图标
Vue.use(Cell); // 单元格