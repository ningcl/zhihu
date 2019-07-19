const commentModel = require('../models/comments');

class Comment {
    
    async find (ctx) {
        const {page, limit = 10, rootCommentId} = ctx.query;
        const perPage = Math.max(page* 1, 1);
        let comment = await commentModel.find({
            content: new RegExp(ctx.query.q),
            questionId: ctx.params.questionId,
            answerId: ctx.params.answerId,
            rootCommentId
        }).limit(limit).skip((perPage - 1) * limit).populate('commentator replayTo');
        ctx.body = comment;
    }

    async findById (ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const comment = await commentModel.findById(ctx.params.id).select(selectFields).populate('commentator');
        if (comment) {
            ctx.body = comment;
        } else {
            ctx.throw(404, '评论不存在');
        }
    }

    async create (ctx) {
        ctx.verifyParams({
            content: {type: 'string', required: true},
            rootCommentId: {type: 'string', required: false},
            replayTo: {type: 'string', required: false}
        });
        const { content } = ctx.request.body;
        const {questionId, answerId } = ctx.params;
        const comment = await new commentModel({content, commentator: ctx.state.user._id, questionId, answerId}).save();
        ctx.body = comment;
    }

    async update (ctx) {
        ctx.verifyParams({
            content: {type: 'string', required: false}
        });

        const { content } = ctx.request.body;
        await ctx.state.comment.update({ content });

        ctx.body = ctx.state.comment;
    }

    async remove (ctx) {
        const comment = await commentModel.findByIdAndRemove(ctx.params.id);
        if (comment) {
            ctx.status = 204;
        } else {
            ctx.throw(404,'评论不存在');
        }
    }

    // 检查评论是否存在
    async checkCommentExist (ctx, next) {
        let comment = await commentModel.findById(ctx.params.id).select('+commentator');
        if (!comment) {
            ctx.throw(404, '评论不存在');
        }
        if (ctx.params.questionId && comment.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此评论');
        }

        if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) {
            ctx.throw(404, '该答案下没有此评论');
        }
        ctx.state.comment = comment;
        await next();
    }

    // 检查评论人
    async checkCommentator (ctx, next) {
        const { comment } = ctx.state;
        if (comment.commentator.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
}

module.exports = new Comment();