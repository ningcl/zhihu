const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');
const { secret } = require('../config.js');

class Users {
    // 查询用户列表
    async find(ctx) {
        ctx.body = await UserModel.find();
    }

    // 查询单个用户
    async findById(ctx) {
        const { fields='' } = ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(f=> ' +' + f).join('');
        const user = await UserModel.findById(ctx.params.id).select(selectFields);
        if (user) {
            ctx.body = user;
        } else {
            ctx.throw(404, '用户不存在');
        }
    }

    // 新增用户
    async create(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            }
        });
        const { name } = ctx.request.body;
        // 根据用户名查询用户
        const repeatUser = await UserModel.findOne({name: name});
        if (repeatUser) {
            ctx.throw(409, '用户已经被占用');
        }
        const user = await new UserModel(ctx.request.body).save();
        ctx.body = user;
    }

    // 更新用户信息
    async update(ctx) {
        // 参数校验
        ctx.verifyParams({
            name: {type: 'string', required: false},
            password: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            gender: {type: 'string', required: false},
            headline: {type: 'string', required: false},
            locations: {type: 'array', itemType:'string',required: false},
            business: {type: 'string', required: false},
            employments: {type: 'array', itemType: 'object', required: false},
            educations: {type: 'array', itemType: 'object', required: false}
        });

        const user = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (user) {
            ctx.body = user;
        } else {
            ctx.throw(404, '用户不存在');
        }
    }

    // 删除用户
    async remove(ctx) {
        const user = await UserModel.findByIdAndRemove(ctx.params.id);
        if (user) {
            ctx.status = 204;
        } else {
            ctx.throw(404, '用户不存在');
        }
    }

    // 登录
    async login(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            }
        });
        const user = await UserModel.findOne(ctx.request.body);
        if (!user) {
            ctx.throw(401, '用户名或密码不正常');
        }
        const {name, _id} = user;
        const token = jwt.sign({_id, name}, secret, {expiresIn: '1d'});
        ctx.body = {
            token
        };
    }

    // 获取粉丝列表
    async listFollowing (ctx) {
        const user = await UserModel.findById(ctx.params.id).select('+following').populate('following');

        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user.following;
    }

    // 关注某人
    async follow (ctx) {
        // 关注某人一定会有登录态，从state中获取自己用户id,并查询自己关注列表
        const me = await UserModel.findById(ctx.state.user._id).select('+following');
        // 判断关注列表中是否已经存在
        if (!me.following.map(id=> id.toString()).includes(ctx.params.id)) {
            me.following.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }

    // 取消关注
    async unfollow (ctx) {
        // 关注某人一定会有登录态，从state中获取自己用户id,并查询自己关注列表
        const me = await UserModel.findById(ctx.state.user._id).select('+following');
        const index = me.following.map(id=> id.toString()).indexOf(ctx.params.id);
        // 判断关注列表中是否已经存在
        if (index > -1) {
            me.following.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }

    // 粉丝列表
    async Listfollowers (ctx) {
        const users = await UserModel.find({following: ctx.params.id});
        ctx.body = users;
    }

    // 授权，查看是不是自己
    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
    // 判断用户是否存在
    async checkUserExist (ctx, next) {
        const user = await UserModel.findById(ctx.params.id);
        if (!user) {
            ctx.throw(404, '用户不存在');
        } else {
            await next();
        }
    }
}

module.exports = new Users();