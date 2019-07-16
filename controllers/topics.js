const topicModel = require('../models/topics');

class Topic {
    // 查询话题列表
    async find (ctx) {
        // 当前页数
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        // 每页显示条数
        const { limit = 10 } = ctx.query;
        const perPage = Math.max(limit * 1, 1);
        ctx.body = await topicModel.find({name: new RegExp(ctx.query.q)}).limit(perPage).skip(page * perPage);
    }

    // 通过话题id查询话题
    async findById (ctx) {
        // 获取查询参数
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(f=> ' +' + f).join('');
        const topic = await topicModel.findById(ctx.params.id).select(selectFields);
        ctx.body = topic;
    }

    // 创建话题
    async create (ctx) {
        // 参数校验
        ctx.verifyParams({
            name: {type: 'string', required: true},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        });

        const topic = await new topicModel(ctx.request.body).save();
        ctx.body = topic;
    }

    // 更新话题
    async update (ctx) {
        // 参数校验
        ctx.verifyParams({
            name: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        });

        const topic = await topicModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = topic;
    }
}

module.exports = new Topic();