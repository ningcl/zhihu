const Router = require('koa-router');
// const jwt = require('jsonwebtoken');
// 解析token
const jwt = require('koa-jwt');
const {
    find,
    findById,
    create,
    update,
    remove,
    login,
    checkOwner,
    listFollowing,
    follow,
    unfollow,
    Listfollowers,
    checkUserExist,
    followTopic,
    unFollowTopic,
    listFollowingTopic,
    listQuestions
} = require('../controllers/users');

const { checkTopicExist } = require('../controllers/topics');
const { secret } = require('../config');
// 定义路由前缀
const router = new Router({
    prefix: '/users'
});

/* const auth = async (ctx, next) => {
    console.log(ctx.request.header)
    const { authorization = '' } = ctx.request.header;
    const token = authorization.replace('Bearer ', '');
    try {
        const user = jwt.verify(token, secret);
        ctx.state.user = user;
    } catch (err) {
        ctx.throw(401, err.message);
    }
    await next();
} */

// 校验token是否失效
const auth = jwt({ secret });
// 查询用户列表
router.get('/', find);
// 注册用户
router.post('/', create);
// 根据用户id查询用户信息
router.get('/:id', findById);
// 修改用户信息
router.put('/:id', auth, checkOwner, update);
// 删除用户
router.delete('/:id', auth, checkOwner, remove);
// 登录
router.post('/login', login);
// 获取关注人列表
router.get('/:id/following', listFollowing);
// 关注某人
router.put('/following/:id', auth, checkUserExist, follow);
// 取消关注
router.delete('/following/:id', auth, checkUserExist, unfollow);
// 获取粉丝列表
router.get('/:id/followers', Listfollowers);
// 获取关注话题列表
router.get('/:id/followingTopic', listFollowingTopic);
// 关注话题
router.put('/followingTopic/:id', auth, checkTopicExist, followTopic);
// 取消关注话题
router.delete('/unFollowingTopic/:id', auth, checkTopicExist, unFollowTopic);
// 用户的问题列表
router.get('/:id/questions', listQuestions);

module.exports = router;