require('dotenv').config('.env');

const path = require('path');
const port = process.env.PORT || 8080;
const express = require('express');
const https = require('https'); // https ... createServer ... ..
const fs = require('fs');
const app = express();
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
      proxy.createProxyMiddleware('/common', {
        target: `${process.env.PROXY}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
            '^/api': '' // URL ^/api -> .. ..
        }
      })
  );
};

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', `${process.env.HOME_URL}`));
  res.send({proxy:`${process.env.PROXY}`});
});

try{
  //2021-01-11 풀무원 인증키 교체로 인한 소스 수정
  //복호화 및 인증서 암호 적용
  const serverOption = {
    key: fs.readFileSync(path.resolve(process.cwd(), `${process.env.SSL_KEY}`), 'utf-8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), `${process.env.SSL_CERT}`), 'utf-8').toString(),
    passphrase: 'uas5wx99'
  };
  
  https.createServer(serverOption, app).listen(port, function() {
    console.log("OnlineIFClient listening on port " + port);
  });
}catch(error){
  console.error('https 오류 발생!');
  console.warn(error);
}

