import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { CommonService } from '../service/CommonService';
import { LoginService } from '../service/LoginService';

import 'primeflex/primeflex.css';
import '../resources/css/Home.css';

const Home = () => {
    let date = new Date().toLocaleString();

    const [currentTime, setCurrentTime] = useState(date);
    const [name, setName] = useState(null);
    const [basicData, setBasicData] = useState({
        labels: [],
        datasets: [
            {
                label: '성공',
                backgroundColor: '#0E44F1',
                data: [],
            },
            {
                label: '실패',
                backgroundColor: '#F61404',
                data: [],
            },
        ],
    });

    const commonService = new CommonService();
    const loginService = new LoginService();

    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);

        const userSession = window.sessionStorage.getItem('userToken');
        if (userSession != null) {
            loginService.getSession().then(data => {
                setName(data.name);
                if (data.role === 'A') {
                    commonService.getMainInfo().then(data => {
                        basicData.labels = data.data;
                        data.data2.forEach((item, idx) => {
                            basicData.datasets[0].data.push(item.SUCCESS);
                        });

                        data.data3.forEach((item, idx) => {
                            basicData.datasets[1].data.push(item.FAIL);
                        });

                        document.getElementById('success').innerHTML =
                            basicData.datasets[0].data[6] + ' 회';
                        document.getElementById('fail').innerHTML =
                            basicData.datasets[1].data[6] + ' 회';
                    });
                } else {
                    let sys = { system: data.system_id };

                    commonService.getMainSysInfo(sys).then(data => {
                        basicData.labels = data.data;
                        data.data2.forEach((item, idx) => {
                            basicData.datasets[0].data.push(item.SUCCESS);
                        });
                        data.data3.forEach((item, idx) => {
                            basicData.datasets[1].data.push(item.FAIL);
                        });
                    });
                }

                setTimeout(() => {
                    document.getElementById('main').style.display = 'block';
                    document.querySelector('.container').style.display =
                        'block';
                }, 2000);
            });
        } else {
            document.getElementById('main').style.display = 'block';
            document.querySelector('.container').style.display = 'block';
            loginService.getProxySession();
        }
    }, []);

    return (
        <>
            <Card className="mainChart">
                <h1 className="mainTitle">중계 시스템 I/F DashBoard</h1>
                <div className="content">
                    <Chart
                        className="chart"
                        id="main"
                        type="bar"
                        data={basicData}
                    />
                    <div className="container">
                        <h2 id="today">접속 시스템 : {name}</h2>
                        <h2 id="today">{currentTime}</h2>
                        <div className="box">
                            <h2>I/F 성공</h2>
                            <h1 id="success"></h1>
                        </div>
                        <div className="box">
                            <h2>I/F 실패</h2>
                            <h1 id="fail"></h1>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default Home;
