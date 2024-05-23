const {generateJwtToken} = require('../utils');
const bcrypt = require('bcrypt');
const {User, Role} = require('../models/models');

class UserController {

    async createUser(req, res) {
        const role = Role.findByPk(req.body.role);
        if (role) {
            const newUser = await User.create({
                username: req.body.username,
                password: await bcrypt.hash(req.body.password,5),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role : req.body.role
            });
            res.status(201).json({
                message : 'Пользователь успешно создан',
                user : {
                    id : newUser.id,
                    username : newUser.username,
                    firstName : newUser.firstName,
                    lastName : newUser.lastName,
                    role : newUser.role
                },
                token: generateJwtToken(newUser.id, newUser.username, newUser.role)
            });
        } else {
            return res.status(400).json({message: 'Некорректная роль'});
        }        
    };

    async deleteUser(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        await user.destroy();
        return res.status(200).json({message: 'Пользователь успешно удален'});
    }

    async updateRole(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        const role = await Role.findByPk(req.body.role);
        if (role) {
            await user.update({role: req.body.role});
            return res.status(200).json({message: 'Роль пользователя успешно обновлена'});
        } else {
            return res.status(400).json({message: 'Некорректная роль'});
        }
    }

    async getAllUsers(req, res) {
        const users = await User.findAll({attributes : {exclude: ['password']}});
        return res.status(200).json(users);
    }

    async getUserById(req, res) {
        const user = await User.findByPk(req.params.id, {attributes : {exclude: ['password']}});
        if (!user) {
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        return res.status(200).json(user);
    }

    async login(req, res) {
        const user = await User.findOne({where: {username: req.body.username}});
        if (!user) {
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            return res.status(200).json({
                message: 'Вы успешно вошли',
                user: {
                    id: user.id,
                    username: user.username,
                    firstNmame: user.firstNmame,
                    lastNmame: user.lastNmame,
                    role: user.role
                },
                token: generateJwtToken(user.id, user.username, user.role)
            });
        } else {
            return res.status(401).json({message: 'Неверный пароль'});
        }
    }
}

module.exports = new UserController();