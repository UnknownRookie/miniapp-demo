const axios = require('axios');
const env = require('../config/env');
const HttpError = require('../utils/http-error');

async function code2Session(code) {
  const url = 'https://api.weixin.qq.com/sns/jscode2session';
  const response = await axios.get(url, {
    params: {
      appid: env.appId,
      secret: env.appSecret,
      js_code: code,
      grant_type: 'authorization_code'
    },
    timeout: 10000
  });

  const data = response.data;
  if (!data || data.errcode) {
    console.error('WeChat code2session failed:', data);
    throw new HttpError(401, data?.errmsg || 'WeChat login failed');
  }

  return data;
}

module.exports = {
  code2Session
};
