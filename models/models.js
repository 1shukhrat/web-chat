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

User.belongsTo(Role, {foreignKey: 'role'});

Room.hasMany(Participant, {
    foreignKey: 'room_id',
    onDelete : 'cascade',
});

User.hasMany(Participant, {
    foreignKey: 'user_id',
    onDelete : 'cascade',
});
Participant.belongsTo(User, {foreignKey: 'user_id'});

Invite.belongsTo(User, {foreignKey: 'user_id'});
User.hasMany(Invite, {
    foreignKey: 'user_id',
    onDelete : 'cascade',
});

Room.hasMany(Invite, {
    foreignKey: 'room_id',
    onDelete : 'cascade',
});
Invite.belongsTo(Room, {foreignKey: 'room_id'});

Room.belongsTo(User, {foreignKey: 'user_id'});

User.hasMany(Room, {
    foreignKey: 'user_id', 
    onDelete : 'cascade'
});

const ParticipantConstraint = db.sequelize.define('ParticipantConstraint', {});

Participant.belongsToMany(Constraint, {
    through: ParticipantConstraint,
    onDelete: 'cascade',
    foreignKey: 'participant_id',
    otherKey: 'constraint'
});

Constraint.belongsToMany(Participant, {
    through: ParticipantConstraint,
    onDelete: 'cascade',
    foreignKey: 'constraint',
    otherKey: 'participant_id'
});

const RoomConstraint = db.sequelize.define('RoomConstraint', {});

Room.belongsToMany(Constraint, {
    through: RoomConstraint,
    onDelete: 'cascade',
    foreignKey: 'room_id',
    otherKey: 'constraint'
});

Constraint.belongsToMany(Room, {
    through: RoomConstraint,
    onDelete: 'cascade',
    foreignKey: 'constraint',
    otherKey: 'room_id'
});

const ChatSchema = new db.Mongoose.Schema({
    roomId: { type: String, required: true },
    messages: [{
        content: { type: String, required: true },
        date: { type: Date, default: Date.now },
        sender: { type: String, required: true }
    }]
}, {versionKey: false});

db.sequelize.sync({
    force: false
});

module.exports = {
   User,
   Role,
   Constraint,
   Room,
   Participant,
   Invite,
   Chat: db.Mongoose.model('Chat', ChatSchema)
};


















