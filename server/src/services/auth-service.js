const pool = require('../config/db');
const HttpError = require('../utils/http-error');
const { code2Session } = require('./wechat-auth-service');
const { generateJti, signAccessToken } = require('../utils/token');

function calculateExpiryDate(days = 7) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}

async function loginByWeChat({ code, profile = {} }) {
  const sessionData = await code2Session(code);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingUsers] = await connection.query(
      'SELECT id, openid, nickname, avatar_url, role, status FROM users WHERE openid = ? LIMIT 1',
      [sessionData.openid]
    );

    let user = existingUsers[0];
    const nickname = profile.nickname || user?.nickname || '微信用户';
    const avatarUrl = profile.avatarUrl || user?.avatar_url || '';

    if (!user) {
      const [insertResult] = await connection.query(
        'INSERT INTO users (openid, nickname, avatar_url, last_login_at) VALUES (?, ?, ?, NOW())',
        [sessionData.openid, nickname, avatarUrl]
      );

      user = {
        id: insertResult.insertId,
        openid: sessionData.openid,
        nickname,
        avatar_url: avatarUrl,
        role: 'user',
        status: 'active'
      };
    } else {
      await connection.query(
        'UPDATE users SET nickname = ?, avatar_url = ?, last_login_at = NOW() WHERE id = ?',
        [nickname, avatarUrl, user.id]
      );
      user.nickname = nickname;
      user.avatar_url = avatarUrl;
    }

    if (user.status !== 'active') {
      throw new HttpError(403, 'User is disabled');
    }

    const jti = generateJti();
    const expiresAt = calculateExpiryDate();
    const token = signAccessToken({
      sub: String(user.id),
      openid: user.openid,
      jti
    });

    await connection.query(
      'INSERT INTO user_sessions (user_id, jti, expires_at) VALUES (?, ?, ?)',
      [user.id, jti, expiresAt]
    );

    await connection.commit();

    return {
      token,
      expiresAt,
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatarUrl: user.avatar_url,
        role: user.role
      }
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function logoutByTokenJti(jti) {
  await pool.query('UPDATE user_sessions SET revoked = 1 WHERE jti = ?', [jti]);
}

module.exports = {
  loginByWeChat,
  logoutByTokenJti
};
