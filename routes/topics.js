const Router = require('koa-router');
// 解析token
const jwt = require('koa-jwt');
const {
    find,
    findById,
    create,
    update
} = require('../controllers/topics');
const { secret } = require('../config');
// 校验token是否失效
const auth = jwt({ secret });

// 定义路由前缀
const router = new Router({
    prefix: '/topic'
});

// 查询话题列表
router.get('/', find);
// 新增话题
router.post('/', auth, create);
// 根据话题id查询话题信息
router.get('/:id', findById);
// 修改话题信息
router.put('/:id', auth, update);

module.exports = router;