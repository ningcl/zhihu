const questionModel = require('../models/questions');

class Question {
    // 问题列表
    async find (ctx) {
        const {page, limit = 10} = ctx.query;
        const perPage = Math.max(page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const question = await questionModel.find({$or: [{title: q},{description: q}]}).limit(limit).skip((perPage -1) * limit);
        ctx.body = question;
    }

    // 通过问题ID查询问题
    async findById (ctx) {
        const { id } = ctx.params;
        const { fields = ''}= ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(f=> ' +' + f).join('');
        const question = await questionModel.findById(id).select(selectFields).populate('questioner');
        ctx.body = question;
    }

    // 创建一个问题
    async create (ctx) {
        // 参数校验
        ctx.verifyParams({
            title: {type: 'string', required: true},
            description: {type: 'string', required: false}
        });
        const { title, description } = ctx.request.body;
        const question = await new questionModel({title, description, questioner: ctx.state.user._id}).save();
        ctx.body = question;
    }

    // 更新一个问题
    async update (ctx) {
        // 参数校验
        ctx.verifyParams({
            title: {type: 'string', required: false},
            description: {type: 'string', required: false}
        });
        await ctx.state.question.update(ctx.request.body);

        ctx.body = ctx.state.question;
    }

    // 删除一个问题
    async remove (ctx) {
        const { id } = ctx.params;
        const question = await questionModel.findByIdAndRemove(id);
        if (question) {
            ctx.status = 204;
        } else {
            ctx.throw(404, '用户不存在');
        }
    }

    // 检查问题是否存在
    async checkQuestionExist (ctx, next) {
        let question = await questionModel.findById(ctx.params.id).select('+questioner');
        if (!question) {
            ctx.throw(404, '问题不存在');
        }
        ctx.state.question = question;
        await next();
    }

    // 检查是否是自己
    async checkQuestioner (ctx, next) {
        const { question } = ctx.state;
        if (question.questioner.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
}

module.exports = new Question();