import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { CommonService } from '../service/CommonService';
import { LoginService } from '../service/LoginService';
import styled from 'styled-components';

import 'primeflex/primeflex.css';
import '../resources/css/Home.scss';

const Box = styled.div`
    box-shadow: 0 3px 3px #999 inset, 0 -3px 3px #444 inset;
    border: 2px solid lightgray;
    border-radius: 10px;
    display: block;
    width: 70%;
    height: 140px;
    margin: 5px auto;
    h1 {
        &.success {
            color: blue;
        }

        &.fail {
            color: red;
        }
    }
`;
const Container = styled.div`
    flex: 1;
    margin: 0px 15px 15px 15px;
    width: 30%;
    text-align: center;
    display: none;
    overflow: auto;
`;

const Loading = styled.div`
    flex: 1;
    margin: 40px 15px 15px 15px;
    width: 30%;
    text-align: center;
    overflow: auto;
`;

const LoadingText = styled.div`
    font-size: 30px;
    margin: 15px;
    text-align: center;
`;

const Content = styled.div`
    display: flex;
`;

const Home = () => {
    let date = new Date().toLocaleString();

    const [visible, setVisible] = useState(false);
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
        // visible 값이 true -> false 가 되는 것을 감지
        if (visible) {
            document.getElementById('main').style.display = 'block';
            document.querySelector('.container').style.display = 'block';
            document.querySelector('.loading').style.display = 'none';
        }
        return () => {
            
        };
    }, [visible]); 

    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);

        const userSession = window.sessionStorage.getItem('userToken');
        if (userSession != null) {
            loginService.getSession().then(data => {
                let userInfo = data.data.user;
                setName(userInfo.systemNm);
                if (userInfo.role === 'ADMIN') {
                    commonService.getMainInfo().then(data => {
                        basicData.labels = data.data;
                        data.data2.forEach((item, idx) => {
                            basicData.datasets[0].data.push(item.SUCCESS);
                        });

                        data.data3.forEach((item, idx) => {
                            basicData.datasets[1].data.push(item.FAIL);
                        });

                        document.querySelector('.success').innerHTML =
                            basicData.datasets[0].data[6] + ' 회';
                        document.querySelector('.fail').innerHTML =
                            basicData.datasets[1].data[6] + ' 회';
                    });
                } else {
                    let sys = { system: userInfo.systemId };

                    commonService.getMainSysInfo(sys).then(data => {
                        basicData.labels = data.data;
                        data.data2.forEach((item, idx) => {
                            basicData.datasets[0].data.push(item.SUCCESS);
                        });
                        data.data3.forEach((item, idx) => {
                            basicData.datasets[1].data.push(item.FAIL);
                        });

                        document.querySelector('.success').innerHTML =
                            basicData.datasets[0].data[6] + ' 회';
                        document.querySelector('.fail').innerHTML =
                            basicData.datasets[1].data[6] + ' 회';
                    });
                }
                setTimeout(() => {
                    setVisible(true);
                }, 4000);
                
            });
        } else {
            document.getElementById('main').style.display = 'block';
            document.querySelector('.container').style.display = 'block';            
            document.querySelector('.loading').style.display = 'none';
            loginService.getProxySession();
        }
    }, []);      

    return (
        <>
            <Card className="mainChart">
                <h1 style={{ fontWeight: 600 }}>중계 시스템 I/F DashBoard</h1>
                <Content>
                    <Loading className="loading">
                        <img id="loading-image" src="/showcase/resources/images/Spinner-3.gif" alt="Loading..." />
                        <LoadingText>Now Loading...</LoadingText>
                    </Loading>                    
                    <Chart
                        className="chart"
                        id="main"
                        type="bar"
                        data={basicData}
                    />
                    <Container className="container">
                        <Card
                            style={{
                                background: 'beige',
                                marginBottom: '30px',
                            }}
                        >
                            <h2>접속 시스템 : {name}</h2>
                            <h2>{currentTime}</h2>
                        </Card>
                        <Box>
                            <h2>I/F 성공</h2>
                            <h1 className="success"></h1>
                        </Box>
                        <Box>
                            <h2>I/F 실패</h2>
                            <h1 className="fail"></h1>
                        </Box>
                    </Container>
                </Content>
            </Card>
        </>
    );
};

export default Home;
