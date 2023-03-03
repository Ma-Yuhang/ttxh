// 1.开发环境，生产环境 是两套不同的环境
// 开发环境需要console语句
// 生产环境不需要console语句
// 让一套代码在两个环境中生效
// nodejs打包时执行main.js代码时，node内全局内置变量process(固定)
// console.log(process.env);
// 2.服务器根目录下，可以新建环境变量配置文件(文件名固定)
// 脚手架环境webpack内置配好的文件名(可以修改但是要改配置)
//.env.development
//.env.production

// 3.环境变量文件中 定义变量名NODE_ENV(固定)、BASE_URL(固定)、自定义变量名要以VUE_APP_开头(规定)
//.env.development  .env.production  两个配置文件中key名必须一致

// 4.npm run serve 启动项目，.env.development内置变量挂载到process.env属性上
//   npm run build 打包项目，.env.production内置变量挂载到process.env属性上

// 如果是生产环境，不需要console
if (process.env.NODE_ENV === 'production') {
    console.log = function () { }
    console.warn = function () { }
    console.dir = function () { }
    console.error = function () { }
}