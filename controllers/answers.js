const answerModel = require('../models/answers');

class Answer {
    // 答案列表
    async find (ctx) {
        const {page, limit = 10} = ctx.query;
        const perPage = Math.max(page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const answer = await answerModel.find({content: q, questionId: ctx.params.questionId}).limit(limit).skip((perPage -1) * limit);
        ctx.body = answer;
    }

    // 通过答案ID查询答案
    async findById (ctx) {
        const { id } = ctx.params;
        const { fields = ''}= ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(f=> ' +' + f).join('');
        const answer = await answerModel.findById(id).select(selectFields).populate('answerer');
        ctx.body = answer;
    }

    // 创建一个答案
    async create (ctx) {
        // 参数校验
        ctx.verifyParams({
            content: {type: 'string', required: true}
        });
        const { content } = ctx.request.body;
        const answer = await new answerModel({content, answerer: ctx.state.user._id, questionId: ctx.params.questionId}).save();
        ctx.body = answer;
    }

    // 更新一个答案
    async update (ctx) {
        // 参数校验
        ctx.verifyParams({
            content: {type: 'string', required: false}
        });
        const { content } = ctx.request.body;
        await ctx.state.answer.update({content, questionId: ctx.params.questionId});

        ctx.body = ctx.state.answer;
    }

    // 删除一个问题
    async remove (ctx) {
        const { id } = ctx.params;
        const answer = await answerModel.findByIdAndRemove(id);
        if (answer) {
            ctx.status = 204;
        } else {
            ctx.throw(404, '用户不存在');
        }
    }

    // 检查答案是否存在
    async checkAnswerExist (ctx, next) {
        let answer = await answerModel.findById(ctx.params.id).select('+answerer');
        if (!answer) {
            ctx.throw(404, '答案不存在');
        }
        // 判断答案是不是在指定问题下
        if (answer.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此答案');
        }
        ctx.state.answer = answer;
        await next();
    }

    // 检查是否是自己
    async checkAnswer (ctx, next) {
        const { answer } = ctx.state;
        if (answer.answerer.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
}

module.exports = new Answer();