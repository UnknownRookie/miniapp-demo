const pool = require('../config/db');
const HttpError = require('../utils/http-error');
const { verifyAccessToken } = require('../utils/token');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new HttpError(401, 'Missing access token');
    }

    const payload = verifyAccessToken(token);

    const [rows] = await pool.query(
      `
        SELECT
          users.id,
          users.openid,
          users.nickname,
          users.avatar_url,
          users.role,
          users.status,
          user_sessions.jti,
          user_sessions.expires_at,
          user_sessions.revoked
        FROM user_sessions
        INNER JOIN users ON users.id = user_sessions.user_id
        WHERE user_sessions.jti = ?
        LIMIT 1
      `,
      [payload.jti]
    );

    const session = rows[0];
    if (!session) {
      throw new HttpError(401, 'Session not found');
    }

    if (session.revoked) {
      throw new HttpError(401, 'Session revoked');
    }

    if (session.status !== 'active') {
      throw new HttpError(403, 'User has no permission');
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
      throw new HttpError(401, 'Session expired');
    }

    req.auth = {
      userId: session.id,
      openid: session.openid,
      role: session.role,
      nickname: session.nickname,
      avatarUrl: session.avatar_url,
      jti: session.jti
    };

    next();
  } catch (error) {
    next(error);
  }
};
