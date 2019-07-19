const Router = require('koa-router');
const jwt = require('koa-jwt');
const { secret } = require('../config');
const { find, update, findById, remove, create, checkAnswer, checkAnswerExist} = require('../controllers/answers');

const router = new Router({
    prefix: '/question/:questionId/answer'
});

const auth = jwt({secret});
// 查询答案列表
router.get('/', find);
// 通过答案ID查询
router.get('/:id', checkAnswerExist, findById);
// 创建答案
router.post('/', auth, create);
// 修改答案
router.put('/:id', auth, checkAnswerExist, checkAnswer, update);
// 删除答案
router.delete('/:id', auth, checkAnswerExist, checkAnswer, remove);

module.exports = router;