const Router = require('koa-router');
const {index, upload} = require('../controllers/home');
const router = new Router();

// 访问首页
router.get('/', index);
// 上传接口
router.post('/upload', upload);

module.exports = router;