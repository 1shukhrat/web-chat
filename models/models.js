const {DataTypes} = require('sequelize');

const db = require( '../db' );

const Role = db.sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    }
});

const Constraint = db.sequelize.define('Constraint', {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    }
});

const User = db.sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowedNull: false,
        unique: true,
        validator : {
            notEmpty: true,
            length: [3, 20],
            isEnglish(v) {
                return /^[a-zA-Z0-9]+$/.test(v);
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowedNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowedNull: false,
        validator : {
            isAlpha: true,
            notEmpty: true,
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowedNull: false,
        validator : {
            isAlpha: true,
            notEmpty: true,
        }
    }
});

const Room = db.sequelize.define('Room', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    chat: {
        type: DataTypes.STRING,
        allowedNull: true,
    },
});

const Participant = db.sequelize.define('Participant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
});

const Invite = db.sequelize.define('Invite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowedNull: false,
        unique: true,
    }
});

User.belongsTo(Role);

Room.hasMany(Participant, {
    onDelete : 'cascade',
});

User.hasMany(Invite, {
    onDelete : 'cascade',
});

Room.hasMany(Invite, {
    onDelete : 'cascade',
});

User.hasMany(Room);

const ParticipantConstraint = db.sequelize.define('ParticipantConstraint', {});

Participant.belongsToMany(Constraint, {
    through: ParticipantConstraint,
    onDelete: 'cascade'
});

Constraint.belongsToMany(Participant, {
    through: ParticipantConstraint,
    onDelete: 'cascade'
});

const ChatSchema = new db.Mongoose.Schema({
    roomId: { type: String, required: true },
    messages: [{
        content: { type: String, required: true },
        date: { type: Date, default: Date.now },
        sender: { type: String, required: true },
        files: [String]
    }]
}, {versionKey: false});

db.sequelize.sync({force : true});

module.exports = {
   User,
   Role,
   Constraint,
   Room,
   Participant,
   Invite,
   Chat: db.Mongoose.model('Chat', ChatSchema)
};


















