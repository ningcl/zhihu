const topicModel = require('../models/topics');

class Topic {
    // 查询话题列表
    async find (ctx) {
        ctx.body = await topicModel.find();
    }

    // 通过话题id查询话题
    async findById (ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(f=> ' +' + f).join('');
        const topic = await topicModel.findById(ctx.params.id).select(selectFields);
        ctx.body = topic;
    }

    // 创建话题
    async create (ctx) {
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