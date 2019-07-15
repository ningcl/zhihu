const Koa = require('koa');
const path = require('path');
const koaBody = require('koa-body');
const routers = require('./routes');
const mongoose = require('mongoose');
const parameter = require('koa-parameter');
const static = require('koa-static');

// 获取mongoose链接地址
const { mongoURI } = require('./config.js');
// 用mongoose连接数据库
mongoose.connect(mongoURI, { useNewUrlParser: true }, () => console.log('数据库链接成功'));
// 监听错误处理
mongoose.connection.on('error', console.error);

// 实例化Koa
const app = new Koa();

// 加载静态资源中间件，public目录下的资源可以直接被访问
app.use(static(path.join(__dirname, 'public')));

// 加载koabody中间件
app.use(koaBody({
    // 是否支持文件上传
    multipart: true,
    formidable: {
        // 是否保持源文件后缀
        keepExtensions: true,
        // 文件上传的目录
        uploadDir: path.join(__dirname, './public/uploads')
    }
}));

// 加载参数校验中间件
app.use(parameter(app));

// 注册所有的路由
routers(app);

// 监听3000端口
app.listen(3000, ()=> console.log('程序启动了'));