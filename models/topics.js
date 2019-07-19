const {Schema, model} = require('mongoose');

//建立话题Schame
const topicSchame = new Schema({
    // 话题名称
    name: {
        type: String,
        required: true
    },
    // 话题图片链接
    avatar_url: {
        type: String       
    },
    // 话题介绍
    introduction: {
        type: String,
        select: false
    },
    __v:{
        type: Number,
        select: false
    },
}, { timestamps: true});

// 创建话题模型
const topicModel = model('Topic', topicSchame);

module.exports = topicModel;