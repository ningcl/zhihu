const fs = require('fs');
// 自动导入路由文件
module.exports = (app) => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file !== 'index.js') {
            const router = require(`./${file}`);
            // 自动注册路由
            app.use(router.routes()).use(router.allowedMethods());
        }
    })
}
