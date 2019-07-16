 const path = require('path');
class Home {
    index (ctx) {
        ctx.body = '这是主页';
    }
    // 图片上传接口
    upload (ctx) {
        // 获取上传图片对象
        const file = ctx.request.files.file;
        // 获取图片名和后缀名
        const basename = path.basename(file.path);
        ctx.body = {
            path: `${ctx.origin}/uploads/${basename}`
        }
    }
}

module.exports = new Home();