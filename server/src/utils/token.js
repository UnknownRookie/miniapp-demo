const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function generateJti() {
  return crypto.randomBytes(16).toString('hex');
}

function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.tokenExpiresIn
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = {
  generateJti,
  signAccessToken,
  verifyAccessToken
};
