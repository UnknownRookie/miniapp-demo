const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  res.json({
    code: 0,
    message: 'ok',
    data: {
      id: req.auth.userId,
      openid: req.auth.openid,
      nickname: req.auth.nickname,
      avatarUrl: req.auth.avatarUrl,
      role: req.auth.role
    }
  });
});

module.exports = router;
