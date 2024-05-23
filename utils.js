const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');

const generateJwtToken = (id, username, role) => {
    return jwt.sign(
        {id, username, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

const generateAccessCode = (length) => {
    return crypto.randomBytes(length).toString('hex');
};

module.exports = {generateJwtToken, generateAccessCode};