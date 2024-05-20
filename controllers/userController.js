const generateToken = require('../utils');
const bcrypt = require('bcrypt');
const {User} = require('../models');

class UserController {

    async createUser(req, res) {
        const newUser = await User.create({
            username: req.body.username,
            password: bcrypt.hash(req.body.password,5),
            firstNmame: req.body.firstNmame,
            lastNmame: req.body.lastNmame,
            role : req.body.role
        });
        res.status(201).json({
            message : 'User created successfully',
            user : {
                id : newUser.id,
                username : newUser.username,
                firstNmame : newUser.firstNmame,
                lastNmame : newUser.lastNmame,
                role : newUser.role
            },
            token: generateToken(newUser.id, newUser.username, newUser.role)
        });
    }

    async deleteUser(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        await user.destroy();
        return res.status(200).json({message: 'User deleted successfully'});
    }

    async updateRole(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        await user.update({role: req.body.role});
        return res.status(200).json({message: 'User updated successfully'});
    }

    async getAllUsers(req, res) {
        const users = await User.findAll();
        return res.status(200).json(users);
    }

    async getUserById(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(user);
    }

    async login(req, res) {
        const user = await User.findOne({where: {username: req.body.username}});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        if (bcrypt.compare(req.body.password, user.password)) {
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    firstNmame: user.firstNmame,
                    lastNmame: user.lastNmame,
                    role: user.role
                },
                token: generateToken(user.id, user.username, user.role)
            });
        } else {
            return res.status(401).json({message: 'Login failed'});
        }
    }
}