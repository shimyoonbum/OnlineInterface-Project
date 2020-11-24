// Ensure environment variables are read.
require('dotenv').config('.env');

const path = require('path');
const port = process.env.PORT || 8080;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const express = require('express');
const https = require('https'); // https ... createServer ... ..
const fs = require('fs');
const app = express();
const proxy = require('http-proxy-middleware');

// global.PROXY = `${process.env.PROXY}`;

// commonProxy.proxy = `${process.env.PROXY}`;
// console.log("commonProxy.proxy=" + commonProxy.proxy);

// const HttpsProxyAgent = require('https-proxy-agent');
// const axiosDefaultConfig = {
//     baseURL: 'https://localhost:8080',
//     proxy: true,
//     httpsAgent: new HttpsProxyAgent('https://localhost:8083')
// };
// const axios = require ('axios').create(axiosDefaultConfig);

// app.use( (req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", req.headers.origin);
// 	res.header("Access-Control-Allow-Credentials", "true");
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
// 	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
// 	if (req.method === 'OPTIONS') {
// 		res.status(200).end();
// 	} else {
// 		next();
// 	}
// });

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

// app.use(
//   '/common',
//   proxy.createProxyMiddleware({
//     target: 'https://localhost:8083',
//     changeOrigin: true,
//     secure: false,
//     pathRewrite: {
//         '^/api': '' // URL ^/api -> .. ..
//     }
//   })
// );

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', `${process.env.HOME_URL}`));
  res.send({proxy:`${process.env.PROXY}`});
});

const serverOption = {
  key: fs.readFileSync(`${process.env.SSL_KEY}`),
  cert: fs.readFileSync(`${process.env.SSL_CERT}`)
};

https.createServer(serverOption, app).listen(port, function() {
  console.log("OnlineIFClient listening on port " + port);
});

//app.listen(port, () => console.log(`OnlineIFClient listening on port ${port}!`));

