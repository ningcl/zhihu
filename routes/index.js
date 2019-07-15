const fs = require('fs');
// 自动导入路由文件
module.exports = (app) => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file !== 'index.js') {
            const router = require(`./${file}`);
            app.use(router.routes()).use(router.allowedMethods());
        }
    })
}
