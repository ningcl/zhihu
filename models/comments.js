const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    // 评论内容
    content: {
        type: String,
        required: true
    },
    // 评论人ID
    commentator: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        ],
        select: false
    },
    // 问题ID
    questionId: {
        type: String,
        required: true
    },
    // 答案ID
    answerId: {
        type: String,
        required: true
    },
    // 根评论ID
    rootCommentId: {
        type: String
    },
    // 回复人
    replayTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true});

module.exports = model('Comment', commentSchema);