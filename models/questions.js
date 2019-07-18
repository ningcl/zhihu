const {Schema, model} = require('mongoose');
// 创建问题模型
const questionModel = new Schema({
    // 标题
    title: {
        type: String,
        required: true
    },
    // 描述
    description: {
        type: String
    },
    // 提问者
    questioner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        select: false,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
});

module.exports = model('Question', questionModel);