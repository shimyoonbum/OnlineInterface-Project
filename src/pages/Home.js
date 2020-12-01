import React, { Component } from 'react';
import { Chart } from 'primereact/chart';
import {CommonService} from '../service/CommonService';
import {LoginService} from '../service/LoginService';
import {Button} from 'primereact/components/button/Button';
import 'primeflex/primeflex.css';
import "../Home.css";

export class HomeComponent extends Component {
    constructor(props) {
        super(props);        
        
        this.state = {
            count1 : null,
            count2 : null  
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
                if(data.role == "A"){
                    this.commonService.getMainInfo().then(data => {  
                        this.basicData.labels = data.data;          
                        data.data2.forEach((item,idx)=>{
                            this.basicData.datasets[0].data.push(item.SUCCESS);
                        }); 
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
            // this.setState({
            //     count1: data,                
            //     count2: data
            // })                               
        }else{
            this.loginService.getProxySession();            
            document.getElementById("main").style.display = "block";           
            document.querySelector(".container").style.display = "block"; 
        } 
    }

    onClick() {
        document.getElementById("main").style.display = "block";     
        document.getElementById("mainBtn").style.display = "none";           
        document.querySelector(".container").style.display = "block";   
        document.getElementById("success").innerHTML = "4";    
        document.getElementById("fail").innerHTML = "4"; 
    }

    render() {
        return (
            <div>
                <div className="mainChart">
                    <h1 className="mainTitle">중계 시스템 I/F DashBoard</h1>
                        <div className="content">
                            <Chart className="chart" id="main" type="bar" data={this.basicData}/>
                            <div className="container">
                                <h2>2020-12-01</h2>
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
                    </div>
                <div style={{textAlign: '-webkit-center'}}>
                    <Button id="mainBtn" label="7일간의 기록 확인" 
                    onClick={() => this.onClick()} className="p-button-success" />
                </div>
            </div>
        )
        // return (
            // <div className="home">
            //     <div className="introduction">
            //         <h1>The Most Complete UI Framework</h1>
            //         <h2>for REACT</h2>

            //         <Link to="/setup" className="link-button">Get Started</Link>
            //     </div>
            //     <div className="features">
            //         <h3>Why PrimeReact?</h3>
            //         <p className="features-tagline">Congratulations! <span role="img" aria-label="celebrate">🎉</span> Your quest to find the UI library for React is complete.</p>

            //         <p className="features-description">PrimeReact is a collection of rich UI components for React. All widgets are open source and free to use under MIT License. PrimeReact is developed by PrimeTek Informatics,
            //             a vendor with years of expertise in developing open source UI solutions. For project news and updates, please <a href="https://twitter.com/primereact" className="layout-content-link">follow us on twitter</a> and <a href="https://www.primefaces.org/category/primereact/" className="layout-content-link">visit our blog</a>.</p>

            //     </div>
            // </div>        
        // );
    }
}
