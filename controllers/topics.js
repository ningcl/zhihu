const topicModel = require('../models/topics');
const userModel = require('../models/users');

class Topic {
    // 查询话题列表
    async find (ctx) {
        // 当前页数
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        // 每页显示条数
        const { limit = 10 } = ctx.query;
        const perPage = Math.max(limit * 1, 1);
        // 实现模糊查询、分页查询
        ctx.body = await topicModel.find({name: new RegExp(ctx.query.q)}).limit(perPage).skip(page * perPage);
    }

    // 通过话题id查询话题
    async findById (ctx) {
        // 获取查询参数
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(f=> ' +' + f).join('');
        // 通过select显示隐藏的字段
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
        const {name, avatar_url, introduction} = ctx.request.body;
        const topic = await new topicModel({name, avatar_url, introduction}).save();
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

        const {name, avatar_url, introduction} = ctx.request.body;
        const topic = await topicModel.findByIdAndUpdate(ctx.params.id, {name, avatar_url, introduction});
        ctx.body = topic;
    }

    // 粉丝列表
    async listFollowers (ctx) {
        const users = await userModel.find({followingTopic: ctx.params.id});
        ctx.body = users;
    }

    // 根据话题ID判断话题是否存在
    async checkTopicExist (ctx, next) {
        const user = await topicModel.findById(ctx.params.id);
        if (!user) {
            ctx.throw(404, '话题不存在');
        } else {
            await next();
        }
    }
}

module.exports = new Topic();