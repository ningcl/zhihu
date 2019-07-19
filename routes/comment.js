const Router = require('koa-router');
const jwt = require('koa-jwt');
const { secret } = require('../config');
const { find, update, findById, remove, create, checkCommentator, checkCommentExist} = require('../controllers/comments');

const router = new Router({
    prefix: '/question/:questionId/answer/:answerId/comment'
});

const auth = jwt({secret});
// 查询评论列表
router.get('/', find);
// 通过评论ID查询
router.get('/:id', checkCommentExist, findById);
// 创建评论
router.post('/', auth, create);
// 修改评论
router.put('/:id', auth, checkCommentExist, checkCommentator, update);
// 删除评论
router.delete('/:id', auth, checkCommentExist, checkCommentator, remove);

module.exports = router;