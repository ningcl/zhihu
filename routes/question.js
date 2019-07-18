const Router = require('koa-router');
const jwt = require('koa-jwt');
const { secret } = require('../config');
const { find, update, findById, remove, create, checkQuestionExist, checkQuestioner} = require('../controllers/question');

const router = new Router({
    prefix: '/question'
});

const auth = jwt({secret});
// 查询问题列表
router.get('/', find);
// 通过问题ID查询
router.get('/:id', checkQuestionExist, findById);
// 创建问题
router.post('/', auth, create);
// 修改问题
router.put('/:id', auth, checkQuestionExist, checkQuestioner, update);
// 删除问题
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, remove);

module.exports = router;