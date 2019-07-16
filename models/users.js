const {Schema, model} = require('mongoose');

//建立Schame
const userSchame = new Schema({
    // 用户名
    name: {
        type: String,
        required: true
    },
    // 密码
    password: {
        type: String,
        required: true,
        // 查询过程中，是否显示字段
        select: false
    },
    // 头像
    avatar_url: {
        type: String
    },
    // 性别
    gender: {
        type: String,
        default: 'male',
        // 枚举类型
        enum: ['male', 'female']
    },
    // 一句话介绍
    headline: {
        type: String
    },
    // 居住地
    locations: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Topic'
        }],
        select: false
    },
    // 行业
    business: {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
        select: false
    },
    // 职业经历
    employments: {
        type: [{
            company: {
                type: Schema.Types.ObjectId,
                ref: 'Topic'
            },
            job: {
                type: Schema.Types.ObjectId,
                ref: 'Topic'
            }
        }],
        select: false
    },
    // 教育经历
    educations: {
        type: [{
            school: {
                type: Schema.Types.ObjectId,
                ref: 'Topic'
            },
            major: {
                type: Schema.Types.ObjectId,
                ref: 'Topic'
            },
            diploma: {
                type: Number,
                enum: [1, 2, 3, 4, 5]
            },
            entrance_year: {
                type: Number
            },
            graduation_year: {
                type: Number
            }
        }],
        select: false
    },
    following: {
        type: [{
            // 关联用户表id
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        select: false
    },
    __v: {
        type: Number,
        select: false
    },
});

// 创建用户模型
const userModel = model('User', userSchame);

module.exports = userModel;