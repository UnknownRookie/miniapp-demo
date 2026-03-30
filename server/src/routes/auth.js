const express = require('express');
const asyncHandler = require('../utils/async-handler');
const HttpError = require('../utils/http-error');
const authMiddleware = require('../middleware/auth');
const { loginByWeChat, logoutByTokenJti } = require('../services/auth-service');

const router = express.Router();

router.post(
  '/wx-login',
  asyncHandler(async (req, res) => {
    const { code, profile } = req.body || {};

    if (!code) {
      throw new HttpError(400, 'Missing login code');
    }

    const result = await loginByWeChat({ code, profile });
    console.log('Login result:', result);
    res.json({
      code: 0,
      message: 'ok',
      data: result
    });
  })
);

router.post(
  '/logout',
  authMiddleware,
  asyncHandler(async (req, res) => {
    await logoutByTokenJti(req.auth.jti);
    res.json({
      code: 0,
      message: 'ok'
    });
  })
);

module.exports = router;
