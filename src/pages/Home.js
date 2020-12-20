import React, { Component } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import {CommonService} from '../service/CommonService';
import {LoginService} from '../service/LoginService';
import {Button} from 'primereact/components/button/Button';
import 'primeflex/primeflex.css';
import "../resources/css/Home.css";

export class HomeComponent extends Component {
    constructor(props) {
        super(props);        
        this.launchClock();
        this.state = {
            currentTime : new Date().toLocaleString(),
            name : null
        };

        this.commonService = new CommonService();
        this.loginService = new LoginService();
        
        this.success = [];
        this.fail = [];

        this.basicData = {
            labels: [],
            datasets: [
                {
                    label: '성공',
                    backgroundColor: '#0E44F1',
                    data: []
                },
                {
                    label: '실패',
                    backgroundColor: '#F61404',
                    data: []
                }
            ]
        };
    }

    componentDidMount(){
        const userSession = window.sessionStorage.getItem('userToken');
        if(userSession != null){
            this.loginService.getSession().then(data => {
                this.setState({name : data.name});
                if(data.role == "A"){
                    this.commonService.getMainInfo().then(data => {  
                        this.basicData.labels = data.data;          
                        data.data2.forEach((item,idx)=>{
                            this.basicData.datasets[0].data.push(item.SUCCESS);
                        }); 
                        console.log();
                        data.data3.forEach((item,idx)=>{
                            this.basicData.datasets[1].data.push(item.FAIL);
                        }); 
                    });
                }else{
                    let sys = {system : data.system_id};

                    this.commonService.getMainSysInfo(sys).then(data => {  
                        this.basicData.labels = data.data;          
                        data.data2.forEach((item,idx)=>{
                            this.basicData.datasets[0].data.push(item.SUCCESS);
                        }); 
                        data.data3.forEach((item,idx)=>{
                            this.basicData.datasets[1].data.push(item.FAIL);
                        }); 
                    }); 
                }

                document.getElementById("main").style.display = "none";     
                setTimeout(() => {
                    document.getElementById("mainBtn").style.display = "block";
                }, 1500);                 
            });                             
        }else{
            this.loginService.getProxySession();            
            document.getElementById("main").style.display = "block";           
            document.querySelector(".container").style.display = "block"; 
        } 
    }

    launchClock() { 
        setInterval(() => { 
            this.setState({ currentTime: new Date().toLocaleString() }); 
        }, 1000); 
    }

    onClick() {        
        let d = new Date();
        document.getElementById("main").style.display = "block";     
        document.getElementById("mainBtn").style.display = "none";     
        document.querySelector(".container").style.display = "block";           
        document.getElementById("success").innerHTML = this.basicData.datasets[0].data[6] + ' 회';    
        document.getElementById("fail").innerHTML = this.basicData.datasets[1].data[6] + ' 회'; 
    }

    render() {
        return (
            <div>
                <Card className="mainChart">
                    <h1 className="mainTitle">중계 시스템 I/F DashBoard</h1>
                    <div className="content">
                        <Chart className="chart" id="main" type="bar" data={this.basicData}/>
                        <div className="container">
                            <h2 id="today">접속 시스템 : {this.state.name}</h2>
                            <h2 id="today">{this.state.currentTime}</h2>
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
                <div style={{textAlign: '-webkit-center', heigth : '100px'}}>
                    <Button id="mainBtn" label="7일간의 기록 확인" 
                    onClick={() => this.onClick()} className="p-button-success" />
                </div>
            </div>
        )
    }
}
