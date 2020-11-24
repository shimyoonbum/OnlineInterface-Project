const {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH();

ssh.connect({
    host: '121.254.255.103',
    username: 'root',
    port: '22',
    password : '12#$qwER'
}).then(function(){
    ssh.execCommand('cd /usr/local/OnlineIFClient && ./OnlineIFClient.sh stop && ./OnlineIFClient.sh start', { }).then(function(result) {
        console.log('결과: ' + result.stdout);
        console.log('에러: ' + result.stderr);
        ssh.dispose();//커넥션 종료
    });
});

