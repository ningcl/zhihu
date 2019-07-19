const { Schema, model } = require('mongoose');
// 创建答案模型
const answerModel = new Schema({
    // 标题
    content: {
        type: String,
        required: true
    },
    // 问题ID
    questionId: {
        type: String,
        required: true
    },
    // 回答者
    answerer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        select: false,
        required: true
    },
    // 投票数
    voteCount: {
        type:Number,
        default: 0
    },
    __v: {
        type: Number,
        select: false
    }
});

module.exports = model('Answer', answerModel);